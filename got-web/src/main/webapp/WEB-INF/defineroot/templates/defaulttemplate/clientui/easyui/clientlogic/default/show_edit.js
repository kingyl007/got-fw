function(view, data, actionIndex, rowIndex, event) {
	var dialogName = actionIndex;
	var viewName = "edit";
	var selectedData = got.removeNoUseData(view.getGrid().datagrid("getData").rows[rowIndex]);
	var getDataFunction = function(view, data, actionIndex, rowIndex, successCallback) {
		var postData = view.buildFormDataObject(view, viewName);
		postData["fwParam.selectedData"] = selectedData;
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
		$.messager.alert("提示", "请选择要编辑的数据", "info");
		return;
	}
	view.getGrid().datagrid("clearSelections");
	if (view.dialogs[dialogName]) {
		getDataFunction(view, data, actionIndex, rowIndex, function() {
			$(view.getId(dialogName)).dialog("open");
		});
		return;
	}
	var postData = view.buildFormDataObject(view, viewName);
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
			// console.info(view.actionArg[actionIndex]['icon']);
			// load data and show dialog
			getDataFunction(view, data, actionIndex, rowIndex, function() {

				$(view.getId(dialogName)).dialog({
					width : width,
					height : height,
					title : view.dialogs[dialogName].title,
					modal : true,
					iconCls : view.actionArg[actionIndex] ? view.actionArg[actionIndex]['icon'] : '',
					buttons : [ {
						text : '保存',
						iconCls : 'icon-save',
						handler : function() {
							// TODO
							// get new data
							// combine old data and new data
							view.dialogs[dialogName].validErrorMap = {};
							if (!got.doValidate(view.dialogs[dialogName], true) || !view.dialogs[dialogName].validate()) {
								return;
							}
							// submit
							var newData = data = view.dialogs[dialogName].getForm().serializeObject();
							if (view.dialogs[dialogName].getOtherToSaveData) {
								if (!view.dialogs[dialogName].getOtherToSaveData(newData)) {
									return;
								}
							}
							var postData = view.dialogs[dialogName].buildFormDataObject(view.dialogs[dialogName], viewName);
							postData["fwParam.oldData"] = view.dialogs[dialogName].data;
							postData["fwParam.newData"] = newData;
							showLoading('.window');
							got.ajax({
								cache : true,
								type : "POST",
								url : "saveEditData",
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
										$(view.getId(dialogName)).dialog("close");
										if (result.errorMsg && result.errorMsg != '') {
											$.messager.alert('提示', "保存成功:" + result.errorMsg, 'info');
										} else {
											$.remind('提示', '保存成功', "info", 1600);
										}
										view.queryGridData();
									} else {
										if (result.validResultMap) {
											view.dialogs[dialogName].validErrorMap = result.validResultMap;
											got.doValidate(view.dialogs[dialogName], true);
											$.remind('错误', '输入错误:' + result.errorMsg, "error", 3000);
										} else {
											$.messager.alert('提示', "保存错误:" + result.errorMsg, 'error');
										}
									}
								}
							});
						}
					}, {
						text : '关闭',
						// iconCls : 'icon-back',
						handler : function() {
							// TODO check if modified and prompt
							$(view.getId(dialogName)).dialog("close");
						}
					}, ],
				});
			}); // getDataFunction
		}, // success
	}); // ajax
}