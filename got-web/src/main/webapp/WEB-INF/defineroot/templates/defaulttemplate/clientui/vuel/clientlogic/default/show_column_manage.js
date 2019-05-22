function(vue, data, actionIndex, rowIndex, event) {
	var view = this;
	var dialogView = null;

	var localCoord = got.removeNoUseData(view.fwCoord);
	localCoord.view = 'columnManage';
	var localParam = got.removeNoUseData(view.fwParam);
	localParam["openerId"] = view.id;
	localParam["openerFunction"] = view.fwCoord['function'];
	localParam["openerView"] = view.fwCoord['view'];
	localParam["openerActionId"] = actionIndex;
	localParam["openerSelectedData"] = data;
	localParam['showAsDialog'] = "1";
	var dialogId = view.id + "_" + actionIndex;
	var loadDataProc = function(vueObj, successProc) {
		var columns = view.columns;
		vueObj.columns = columns;
		var selectedColumns = [];
		var unSelectedColumns = [];
		$.each(columns, function(index, col) {
			col.key = col.id;
			if (col.key == '_FW_ACTIONS') {
				col.disabled = true;
			}
			if (col.visible) {
				selectedColumns.push(col);
			} else {
				unSelectedColumns.push(col);
			}
		});
		vueObj.selectedColumns = selectedColumns;
		vueObj.unSelectedColumns = unSelectedColumns;
		if (successProc) {
			successProc();
		}
	};

	if (view.dialogs[actionIndex] && view.dialogs[actionIndex].vue) {
		dialogView = view.dialogs[actionIndex].vue;
		loadDataProc(dialogView, function() {
			dialogView.showDialog = true;
		});
	} else {
		view.loading = true;
		view.$http.post('getDialog',{fwCoord:localCoord, fwPage:view.fwPage, fwParam:localParam},{emulateJSON: true}).then(function(res){
			var dialogContext = got.addDialogStr(dialogId, res.data);
			try {
				$(dialogContext).appendTo($("#" + view.id + "_dialogs"));
				var vueOpt = view.dialogs[actionIndex].opt;
				vueOpt.el = '#' + dialogId;
				vueOpt['methods']['confirmDialog'] = function() {
					$.each(dialogView.rules, function(key) {
						$.each(dialogView.rules[key], function(index, rule) {
							if (rule.hasOwnProperty('msg')) {
								rule['msg'] = null;
								return false;
							}
						});
					});
					dialogView.$refs['form'].validate(function(valid) {
						if (valid) {
							var toBackCols = [];
							var arrCols = [];
							$.each(dialogView.selectedColumns, function(i, col) {
								toBackCols.push({
									ID : col.id,
									WIDTH : col.width
								});
								arrCols.push(col.id);
							});
							dialogView.fwParam.newListData = toBackCols;
							dialogView.fwParam.newData = {
									arr : arrCols
								};
							dialogView.loading = true;
							console.info(dialogView.fwParam.newListData);
							dialogView.$http.post('saveColumnManageData',{fwCoord : dialogView.fwCoord, fwPage : dialogView.fwPage, fwParam : dialogView.fwParam},{emulateJSON: true}).then(function(res){
								dialogView.loading = false;
								if (res.data == null || res.data == "") {
									dialogView.showDialog = false;
									// TODO update main grid columns
									var list = [];
									$.each(dialogView.selectedColumns, function(i, col) {
										col.visible = true;
										list.push(col);
									});
									$.each(dialogView.unSelectedColumns, function(i, col) {
										col.visible = false;
										list.push(col);
									});
									view.columns = list;
									dialogView.$message({
										title: '提示',
										showClose: true,
										message: '保存成功',
										type: 'success'
									});
								} else {
									dialogView.$message({
										type: 'error',
										showClose: true,
										title: '提示',
										message: '保存错误:' + res.data,
									});
								}
							},function(){
								dialogView.loading = false;
								dialogView.$message({
									type: 'error',
									showClose: true,
									title: '提示',
									message: '保存错误',
								});
							});
						} else {
							return false;
						}
					});
				};
				var vue = new Vue(vueOpt);
				view.dialogs[actionIndex].vue = vue;
				got.vues[vue.id] = vue;
				dialogView = vue;
				// load data
				view.loading = false;
				loadDataProc(view.dialogs[actionIndex].vue, function() {
					vue.showDialog = true;
				});
			// var Component = Vue.extend({template:res.data});
			// new Component().$mount('#' + this.id +"_" + actionIndex);
			} catch (e) {
				view.$message({
					type: 'error',
					showClose: true,
          title: '提示',
          message: '画面加载错误',
        });
				view.loading = false;
			}
		},function(){
				console.log('failed');
				view.loading = false;
		});
	}
}