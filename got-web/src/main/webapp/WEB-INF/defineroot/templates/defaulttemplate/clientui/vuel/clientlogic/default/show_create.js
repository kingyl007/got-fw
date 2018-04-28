function(vue, data, actionIndex, rowIndex, event) {
	var view = this;
	var dialogView = null;
	// 加载画面
	// 加载数据
	/*
	this.$confirm('确认关闭？')
  .then(function() {
    done();
  }).catch(function() {
  	console.info('do cancel');
  });
  */
	var localCoord = got.removeNoUseData(view.fwCoord);
	localCoord.view = 'create';
	var localParam = got.removeNoUseData(view.fwParam);
	localParam["openerId"] = view.id;
	localParam["openerFunction"] = view.fwCoord['function'];
	localParam["openerView"] = view.fwCoord['view'];
	localParam["openerActionId"] = actionIndex;
	localParam["openerSelectedData"] = data;
	localParam['showAsDialog'] = "1";
	var dialogId = view.id + "_" + actionIndex;
	var loadDataProc = function(vueObj, successProc) {
		view.loading = true;
		vueObj.fwParam['selectedData'] = data;
		vueObj.fwParam.newData = {};
		vueObj.$http.post('getCreateData',{fwCoord:vueObj.fwCoord, fwPage:vueObj.fwPage, fwParam:vueObj.fwParam},{emulateJSON: true}).then(function(res){
			view.loading = false;
			vueObj.fwParam.oldData = res.data;
			vueObj.fwParam.newData = got.removeNoUseData(res.data);
			successProc();
		},function(){
				console.log('failed');
		});
	};
	if (view.dialogs[actionIndex] && view.dialogs[actionIndex].vue) {
		dialogView = view.dialogs[actionIndex].vue;
		loadDataProc(dialogView, function() {
			dialogView.showDialog = true;
		});
	} else {
		view.loading = true;
		view.$http.post('getDialog',{fwCoord:localCoord, fwPage:view.fwPage, fwParam:localParam},{emulateJSON: true}).then(function(res){
			var dialogContext = '<el-dialog id="' + dialogId + '" :title="title" :visible.sync="showDialog" :width="width">';
			dialogContext += res.data;
			dialogContext += '<span slot="footer" class="dialog-footer">';
			dialogContext += '<el-button type="primary" @click="confirmDialog" :loading="loading">确定</el-button>';
			dialogContext += '<el-button @click="showDialog = false">取消</el-button>';
			dialogContext += '</span>';
			dialogContext += '</el-dialog>';
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
	          	dialogView.loading = true;
	          	dialogView.$http.post('saveCreateData',{fwCoord:dialogView.fwCoord, fwPage:dialogView.fwPage, fwParam:dialogView.fwParam},{emulateJSON: true}).then(function(res){
	          	dialogView.loading = false;
	          		console.info(res);
	          		if (res.data.success) {
	          			dialogView.showDialog = false;
		          		dialogView.tableData = res.data.data;
		          		dialogView.fwPage = res.data.page;
		          		dialogView.$message({
		          			type: 'success',
		          			showClose: true,
		                title: '提示',
		                message: '保存成功',
		              });
		          		view.loadData();
	          		} else {
	          			if (res.data.validResultMap) {
	          				$.each(res.data.validResultMap, function(k) {
	          					var rules = dialogView.rules[k];
	          					$.each(rules, function(index, rule) {
	          						if (rule.hasOwnProperty('msg')) {
	          							rule['msg'] = res.data.validResultMap[k];
	          							return false;
	          						}
	          					});
	          				});
	          				dialogView.$refs['form'].validate();
	          			}
		          		dialogView.$message({
		          			type: 'error',
		          			showClose: true,
		                title: '提示',
		                message: '保存错误:' + res.data.errorMsg,
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