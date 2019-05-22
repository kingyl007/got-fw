function(vue, data, actionIndex, rowIndex, event) {
	var view = this;
	var dialogView = null;

	var localCoord = got.removeNoUseData(view.fwCoord);
	localCoord.view = 'export';
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
		$.each(columns, function(index, col) {
			col.key = col.id;
			if (col.key == '_FW_ACTIONS') {
				col.disabled = true;
			}
			if (col.visible) {
				selectedColumns.push(col.key);
			}
		});
		vueObj.selectedColumns = selectedColumns;
		if (successProc) {
			successProc();
		}
	};

	var exportFrameId = view.id + "_export_frame";
	var exportProc = function(dataRange, fileType, columns) {
		
		if ($('#' + exportFrameId).attr('type') == 'gotdynamic') {

		} else {
			var content = "<iframe id='" + exportFrameId + "' type='gotdynamic' style='display: none;'></iframe>";
			$(content).appendTo($("#" + view.id + "_dialogs"));
		}
		formData = view.fwCoord;
		content = "<form id='" + view.id + "_export_form' method='post' action='export'>";
		$.each(formData, function(k) {
			content = content + "<input type='hidden' name='fwCoord."+k+"' value='" + formData[k] + "'>";
		});
		content = content + "<input type='hidden' name='fwParam.newData[DATA_RANGE]' value='" + dataRange + "'>";
		content = content + "<input type='hidden' name='fwParam.newData[FILE_TYPE]' value='" + fileType + "'>";
		if (view.exportFileName) {
			content = content + "<input type='hidden' name='fwParam.newData[FILE_NAME]' value='" + view.exportFileName + "'>";
		}
		if (view.actions.actionArg[actionIndex] && view.actions.actionArg[actionIndex]['doClientExport']) {
			 var rows = view.getGrid().datagrid("getRows");
			 if (rows == null || rows.length < 1) {
				 $.messager.alert('提示', '没有要导出的数据');
					return;
			 } else {
				 var formatterMap = {};
				 var formattedValue = null;
				 var toExportArr = [];
				 var toExportObj = null;
				 $.each(rows, function(i, row) {
					 toExportObj = {};
					 toExportArr.push(toExportObj);
					 $.each(row, function(key) {
						 if (rows[i][key]) {
							 if (formatterMap[key]) {
							 } else {
								 var fmt = null;
								 if (view.getGrid().datagrid('getColumnOption',key)) {
									 fmt = view.getGrid().datagrid('getColumnOption',key)['formatter'];
								 }
								 if (fmt) {
									 formatterMap[key] = fmt;
								 } else {
									 formatterMap[key] = function(value,row,index) {return value;};
								 }
							 }
							 formattedValue = new String(formatterMap[key](rows[i][key],rows[i],i));
							 if (formattedValue.indexOf("<")>=0) {
								 formattedValue = new String(rows[i][key]);
							 }
							 formattedValue = formattedValue.split("'").join("\'");
							 toExportObj[key] = formattedValue;
							 //content = content + "<input type='hidden' name='fwParam.newListData[" + i + "][" + key + "]' value='" + formattedValue + "'>";
						 }
					 });
				 });
				 var jsonStr = JSON.stringify(toExportArr);
				 content = content + "<input type='hidden' name='clientToExportData' value='" + jsonStr + "'>";
			 }
		}
		
		if (columns) {
			$.each(columns, function(i, col) {
				content = content + "<input type='hidden' name='fwParam.newData[COLUMNS]' value='" + col + "'>";
			});
		}
		content = content + "</form>";
		// */
		$('#' + exportFrameId).empty();
		console.info(exportFrameId);
		console.info(content);
		$(content).appendTo($('#' + exportFrameId));
		$('#' + view.id + '_export_form').submit();
	};
	if (event && event.ctrlKey) {
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
						this.showDialog = false;
						exportProc(this.fwParam.pageRange, this.fwParam.exportType, this.selectedColumns);
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
	} else { // if ctrlKey
		exportProc("0", "xls", null);
	}
}