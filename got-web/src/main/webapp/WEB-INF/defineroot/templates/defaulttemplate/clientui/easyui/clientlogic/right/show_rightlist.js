function(view, data, actionIndex, rowIndex, event) {
	var dialogName = actionIndex;
	var viewName = "rightList";
	if (rowIndex == null) {
		// rowIndex = view.getGrid().datagrid("getSelected");
	}
	if (rowIndex < 0) {
		$.messager.alert("提示", "请选择要编辑的数据", "info");
		return;
	}
	view.getGrid().datagrid("clearSelections");
	if (view.dialogs[dialogName]) {
		// delete dom
		$("#" + view.id + "_" + dialogName).remove();
	}
	var postData = view.buildFormDataObject(view, viewName);

	postData["fwParam.openerId"] = view.id;
	postData["fwParam.openerFunction"] = $(view.getId("function")).val();
	postData["fwParam.openerView"] = $(view.getId("view")).val();
	postData["fwParam.openerActionId"] = actionIndex;
	postData['fwParam.showAsDialog'] = "1";

	postData['fwCoord.function'] = 'rights';
	postData["fwParam.openerSelectedData"] = got.removeNoUseData(view.getGrid().datagrid("getData").rows[rowIndex]);
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
			var dialogButtons = [];
			if (view.actionArg[actionIndex]['canSave'] != 'false') {
				dialogButtons.push({
					text : '保存',
					iconCls : 'icon-save',
					handler : function() {
						// TODO
						// get new data
						// combine old data and new data
						if (!got.doValidate(view.dialogs[dialogName], true) || !view.dialogs[dialogName].validate()) {
							return;
						}
						// submit
						// console.info($(newData));
						var postData = view.dialogs[dialogName].buildFormDataObject(view.dialogs[dialogName], viewName);
						postData["fwParam.newData"] = $(view.dialogs[dialogName].getId("dataForm")).serializeObject();
						postData["fwParam.oldListData"] = [ view.dialogs[dialogName].getOldSelectedData() ];
						postData["fwParam.newListData"] = [ view.dialogs[dialogName].getNewSelectedData() ];
						showLoading('.window');
						got.ajax({
							cache : true,
							type : "POST",
							url : "saveSelectData",
							dataType : "json",
							data : postData,
							async : true,
							error : function(res, ts, e) {
								hideLoading('.window');
								$.messager.alert('提示', "更新错误:" + ts, 'error');
							},
							success : function(result) {
								hideLoading('.window');
								if (result.success) {
									view.queryGridData();
									$(view.getId(dialogName)).dialog("close");
									if (!result.errorMsg) {
										$.remind('提示', '保存成功', "info", 1600);
									} else {
										$.remind('提示', result.errorMsg, "info", 5000);
									}
								} else {
									if (result.errorMsg) {
										$.messager.alert('提示', result.errorMsg, 'error');
									} else {
										$.messager.alert('提示', "更新错误", 'error');
									}
								}
							}
						});
					}
				});
			}
			dialogButtons.push( {
					text : '关闭',
					// iconCls : 'icon-back',
					handler : function() {
						// TODO check if modified and prompt
						$(view.getId(dialogName)).dialog("close");
					}
				});
			// load data and show dialog
			$(view.getId(dialogName)).dialog({
				width : width,
				height : height,
				title : view.dialogs[dialogName].title,
				modal : true,
				iconCls : view.actionArg[actionIndex] ? view.actionArg[actionIndex]['icon'] : '',
				buttons : dialogButtons,
			});
		}, // success
	}); // ajax
}