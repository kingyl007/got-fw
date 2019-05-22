function(vue, data, actionIndex, rowIndex, event) {
	var view = this;
	var dialogView = null;

	var localCoord = got.removeNoUseData(view.fwCoord);
	localCoord.view = 'import';
	var localParam = got.removeNoUseData(view.fwParam);
	localParam["openerId"] = view.id;
	localParam["openerFunction"] = view.fwCoord['function'];
	localParam["openerView"] = view.fwCoord['view'];
	localParam["openerActionId"] = actionIndex;
	localParam["openerSelectedData"] = data;
	localParam['showAsDialog'] = "1";
	var dialogId = view.id + "_" + actionIndex;
	var loadDataProc = function(vueObj, successProc) {
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
			var dialogContent = '<el-dialog id="' + dialogId + '" :title="title" :visible.sync="showDialog" :width="width">';
			dialogContent += res.data;
			var tail = "";
			tail += '<span slot="footer" class="dialog-footer">';
			// tail += '<el-button type="primary" @click="confirmDialog" :loading="loading">确定</el-button>';
			tail += '<el-button @click="showDialog = false">关闭</el-button>';
			tail += '</span>';
			tail += '</el-dialog>';
			dialogContent = dialogContent.replace('<div class="TAIL_HERE" />', tail);
			try {
				$(dialogContent).appendTo($("#" + view.id + "_dialogs"));
				var vueOpt = view.dialogs[actionIndex].opt;
				vueOpt.el = '#' + dialogId;
				vueOpt['methods']['confirmDialog'] = function() {
					this.showDialog = false;
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