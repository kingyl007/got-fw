function(view, data, actionIndex, rowIndex, event) {
	var buttonLabel = view.actionArg[actionIndex].label;
	var dialogName = actionIndex;
	var viewName = "detail";
	var selectedData = got.removeNoUseData(view.getGrid().datagrid("getData").rows[rowIndex]);
	var getDetailButtons = function(view, selectedData, dialogName, viewName) {
		var dialogButtons = [];
		// check record status and add buttons for work flow process
		if (selectedData['_FW_WF_CURRENT_USER_STATUS'] == '10') { // TO_CHECK

			dialogButtons.push( {
				text : '通过',
				iconCls : 'icon-ok',
				handler : function() {
					// TODO
					// get new data
					// combine old data and new data
//					view.dialogs[dialogName].validErrorMap = {};
//					if (!got.doValidate(view.dialogs[dialogName], true) || !view.dialogs[dialogName].validate()) {
//						return;
//					}
					// submit
					var newData = data = view.dialogs[dialogName].getForm().serializeObject();
					if (view.dialogs[dialogName].getOtherToSaveData) {
						if (!view.dialogs[dialogName].getOtherToSaveData(newData)) {
							return;
						}
					}
					var postData = view.dialogs[dialogName].buildFormDataObject(view.dialogs[dialogName], viewName);
					postData["fwParam.oldData"] = got.removeNoUseData(view.dialogs[dialogName].data);
					postData["fwParam.newData"] = newData;
					postData["fwParam.workFlowOperate"] = "11";
					showLoading('.window');
					got.ajax({
						cache : true,
						type : "POST",
						url : "checkWorkFlow",
						dataType : "json",
						data : postData,
						async : true,
						error : function(res, ts, e) {
							hideLoading('.window');
							$.messager.alert('提示', "审批错误:" + ts, 'error');
						},
						success : function(result) {
							hideLoading('.window');
							if (result.success) {
								$(view.getId(dialogName)).dialog("close");
								if (result.errorMsg && result.errorMsg != '') {
									$.messager.alert('提示', "审批成功:" + result.errorMsg, 'info');
								} else {
									$.remind('提示', '审批成功', "info", 1600);
								}
								view.queryGridData();
							} else {
								if (result.validResultMap) {
									view.dialogs[dialogName].validErrorMap = result.validResultMap;
									got.doValidate(view.dialogs[dialogName], true);
									$.remind('错误', '输入错误:' + result.errorMsg, "error", 3000);
								} else {
									$.messager.alert('提示', "审批错误:" + result.errorMsg, 'error');
								}
							}
						}
					});
				}
			});

			dialogButtons.push( {
				text : '驳回',
				iconCls : 'icon-cancel',
				handler : function() {
					// TODO
					// get new data
					// combine old data and new data
//					view.dialogs[dialogName].validErrorMap = {};
//					if (!got.doValidate(view.dialogs[dialogName], true) || !view.dialogs[dialogName].validate()) {
//						return;
//					}
					// submit
					var dialog = view.dialogs[dialogName];
					var newData = data = view.dialogs[dialogName].getForm().serializeObject();
					if (view.dialogs[dialogName].getOtherToSaveData) {
						if (!view.dialogs[dialogName].getOtherToSaveData(newData)) {
							return;
						}
					}
					if ($(dialog.getId('workFlowComment')).textbox('getValue') == null || $(dialog.getId('workFlowComment')).textbox('getValue') == '') {
						$.remind('错误', '输入错误:驳回必须输入审核意见', "error", 3000);
						return;
					}
					var postData = view.dialogs[dialogName].buildFormDataObject(view.dialogs[dialogName], viewName);
					postData["fwParam.oldData"] = got.removeNoUseData(view.dialogs[dialogName].data);
					postData["fwParam.newData"] = newData;
					postData["fwParam.workFlowOperate"] = "12";
					showLoading('.window');
					got.ajax({
						cache : true,
						type : "POST",
						url : "checkWorkFlow",
						dataType : "json",
						data : postData,
						async : true,
						error : function(res, ts, e) {
							hideLoading('.window');
							$.messager.alert('提示', "驳回错误:" + ts, 'error');
						},
						success : function(result) {
							hideLoading('.window');
							if (result.success) {
								$(view.getId(dialogName)).dialog("close");
								if (result.errorMsg && result.errorMsg != '') {
									$.messager.alert('提示', "驳回成功:" + result.errorMsg, 'info');
								} else {
									$.remind('提示', '驳回成功', "info", 1600);
								}
								view.queryGridData();
							} else {
								if (result.validResultMap) {
									view.dialogs[dialogName].validErrorMap = result.validResultMap;
									got.doValidate(view.dialogs[dialogName], true);
									$.remind('错误', '输入错误:' + result.errorMsg, "error", 3000);
								} else {
									$.messager.alert('提示', "驳回错误:" + result.errorMsg, 'error');
								}
							}
						}
					});
				}
			});
		} else if (selectedData['_FW_WF_CURRENT_USER_STATUS'] == '20') { // checked
			/*
			dialogButtons.push( {
				text : '撤回',
				iconCls : 'icon-undo',
				handler : function() {
					// TODO
					// get new data
					// combine old data and new data
//					view.dialogs[dialogName].validErrorMap = {};
//					if (!got.doValidate(view.dialogs[dialogName], true) || !view.dialogs[dialogName].validate()) {
//						return;
//					}
					// submit
					var newData = data = view.dialogs[dialogName].getForm().serializeObject();
					if (view.dialogs[dialogName].getOtherToSaveData) {
						if (!view.dialogs[dialogName].getOtherToSaveData(newData)) {
							return;
						}
					}
					var postData = view.dialogs[dialogName].buildFormDataObject(view.dialogs[dialogName], viewName);
					postData["fwParam.oldData"] = got.removeNoUseData(view.dialogs[dialogName].data);
					postData["fwParam.newData"] = newData;
					postData["fwParam.workFlowOperate"] = "12";
					showLoading('.window');
					got.ajax({
						cache : true,
						type : "POST",
						url : "recallWorkFlow",
						dataType : "json",
						data : postData,
						async : true,
						error : function(res, ts, e) {
							hideLoading('.window');
							$.messager.alert('提示', "撤回错误:" + ts, 'error');
						},
						success : function(result) {
							hideLoading('.window');
							if (result.success) {
								$(view.getId(dialogName)).dialog("close");
								if (result.errorMsg && result.errorMsg != '') {
									$.messager.alert('提示', "撤回成功:" + result.errorMsg, 'info');
								} else {
									$.remind('提示', '撤回成功', "info", 1600);
								}
								view.queryGridData();
							} else {
								if (result.validResultMap) {
									view.dialogs[dialogName].validErrorMap = result.validResultMap;
									got.doValidate(view.dialogs[dialogName], true);
									$.remind('错误', '输入错误:' + result.errorMsg, "error", 3000);
								} else {
									$.messager.alert('提示', "撤回错误:" + result.errorMsg, 'error');
								}
							}
						}
					});
				}
			});
			*/
		} else if (selectedData['_FW_WF_CURRENT_USER_STATUS'] == '0') { // to submit
			dialogButtons.push( {
				text : '提交',
				iconCls : 'icon-ok',
				handler : function() {
					// TODO
					// get new data
					// combine old data and new data
//					view.dialogs[dialogName].validErrorMap = {};
//					if (!got.doValidate(view.dialogs[dialogName], true) || !view.dialogs[dialogName].validate()) {
//						return;
//					}
					// submit
					var newData = data = view.dialogs[dialogName].getForm().serializeObject();
					if (view.dialogs[dialogName].getOtherToSaveData) {
						if (!view.dialogs[dialogName].getOtherToSaveData(newData)) {
							return;
						}
					}
					var postData = view.dialogs[dialogName].buildFormDataObject(view.dialogs[dialogName], viewName);
					postData["fwParam.oldData"] = got.removeNoUseData(view.dialogs[dialogName].data);
					postData["fwParam.newData"] = newData;
					postData["fwParam.workFlowOperate"] = "12";
					console.info(postData);
					showLoading('.window');
					got.ajax({
						cache : true,
						type : "POST",
						url : "startWorkFlow",
						dataType : "json",
						data : postData,
						async : true,
						error : function(res, ts, e) {
							hideLoading('.window');
							$.messager.alert('提示', "提交错误:" + ts, 'error');
						},
						success : function(result) {
							hideLoading('.window');
							if (result.success) {
								$(view.getId(dialogName)).dialog("close");
								if (result.errorMsg && result.errorMsg != '') {
									$.messager.alert('提示', "提交成功:" + result.errorMsg, 'info');
								} else {
									$.remind('提示', '提交成功', "info", 1600);
								}
								view.queryGridData();
							} else {
								if (result.validResultMap) {
									view.dialogs[dialogName].validErrorMap = result.validResultMap;
									got.doValidate(view.dialogs[dialogName], true);
									$.remind('错误', '输入错误:' + result.errorMsg, "error", 3000);
								} else {
									$.messager.alert('提示', "提交错误:" + result.errorMsg, 'error');
								}
							}
						}
					});
				}
			});
			
		}
		dialogButtons.push({
			text : '关闭',
			// iconCls : 'icon-back',
			handler : function() {
				// TODO check if modified and prompt
				$(view.getId(dialogName)).dialog("close");
			}
		});
		return dialogButtons;
	};
	var getDataFunction = function(view, data, actionIndex, rowIndex, successCallback) {
		var postData = view.buildFormDataObject(view, viewName);
		var realSelectData = {};
		var pkFields = selectedData['PK_FIELDS'].split(',');
		$.each(pkFields, function(i, s) {
			realSelectData[s] = selectedData['PK_' + (i+1)];
		});
		postData["fwParam.selectedData"] = realSelectData;
		postData['fwCoord.function'] = selectedData['FUNCTION_ID'];
		postData['fwCoord.view'] = selectedData['VIEW_ID'];
		showLoading();
		got.ajax({
			cache : true,
			type : "POST",
			url : "getEditData",
			dataType : "json",
			data : postData,
			async : true,
			error : function(res, ts, e) {
				hideLoading();
				$.messager.alert('提示', '数据加载错误。', 'error');
			},
			success : function(returnData) {
				hideLoading();
				if (returnData == null) {
					$.messager.alert('提示', '数据加载错误。', 'error');
					return;
				}
				view.dialogs[dialogName].data = returnData;
				view.dialogs[dialogName].setValueIniting(true);
				for ( var k in returnData) {
					var fe = $(view.dialogs[dialogName].getId(k));
					got.setFormValue(fe, returnData, k);
					if (view.dialogs[dialogName].setDivValue) {
						view.dialogs[dialogName].setDivValue($(view.dialogs[dialogName].getId(k+'_DIV')), returnData, k);
					}
				}
				if (view.dialogs[dialogName].setOtherData) {
					view.dialogs[dialogName].setOtherData(returnData);
				}
				view.dialogs[dialogName].setValueIniting(false);
				// $(view.dialogs[dialogName].getId("form")).form("validate");
				if (successCallback) {
					successCallback();
				}
				$(view.getId(dialogName)).scrollTop(0);
			}
		});
	};

	if (rowIndex == null) {
		// rowIndex = view.getGrid().datagrid("getSelected");
	}
	if (rowIndex < 0) {
		$.messager.alert("提示", "请选择要查看的数据", "info");
		return;
	}
	view.getGrid().datagrid("clearSelections");
	if (view.dialogs[dialogName]) {
		getDataFunction(view, data, actionIndex, rowIndex, function() {
			$(view.getId(dialogName)).dialog({buttons:getDetailButtons(view, view.dialogs[dialogName].data, dialogName)});
			$(view.getId(dialogName)).dialog("open");
		});
		return;
	}
	var postData = view.buildFormDataObject(view, viewName);
	postData['fwCoord.function'] = selectedData['FUNCTION_ID'];
	postData['fwCoord.view'] = selectedData['VIEW_ID'];
	postData["fwParam.openerId"] = view.id;
	postData["fwParam.openerFunction"] = $(view.getId("function")).val();
	postData["fwParam.openerView"] = $(view.getId("view")).val();
	postData["fwParam.openerActionId"] = actionIndex;
	postData["fwParam.openerSelectedData"] = selectedData;
	postData['fwParam.showAsDialog'] = "1";
	showLoading();
	got.ajax({
		cache : true,
		type : "POST",
		url : "getDialog",
		dataType : "html",
		data : postData,
		async : true,
		error : function(res, ts, e) {
			hideLoading();
			alert("打开错误:" + ts);
		},
		success : function(returnData) {
			hideLoading();
			if (returnData == null) {
				$.messager.alert('提示', '打开错误');
				return;
			}
			var content = '<div id="' + view.id + "_" + dialogName + '">' + returnData + '</div>';
			$(content).appendTo($(view.getId("dialogs")));
			var width = 800;
			try {
				width = view.dialogs[dialogName].width;
			} catch (error) {
				
			}
			var height = 600;
			try {
				height = view.dialogs[dialogName].height;
			} catch (error) {
				
			}
//			if (!view.useWorkFlow) {
//				height = height / 2;
//			}
			// console.info(view.actionArg[actionIndex]['icon']);
			// load data and show dialog
			getDataFunction(view, data, actionIndex, rowIndex, function() {
				$(view.getId(dialogName)).dialog({
					width : width,
					height : height,
					title : buttonLabel,
					modal : true,
					iconCls : view.actionArg[actionIndex] ? view.actionArg[actionIndex]['icon'] : '',
					buttons : getDetailButtons(view, view.dialogs[dialogName].data, dialogName, viewName),
				});
			}); // getDataFunction
		}, // success
	}); // ajax
}