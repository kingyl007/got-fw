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
	got.ajax({
		cache : true,
		type : "POST",
		url : "getDialog",
		dataType : "html",
		data : postData,
		async : false,
		error : function(res, ts, e) {
			alert("打开错误:" + ts);
		},
		success : function(returnData) {
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
			// load data and show dialog
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
						if (!got.doValidate(view.dialogs[dialogName], true) || !view.dialogs[dialogName].validate()) {
							return;
						}
						// submit
						var newData = {};
						$('input:checkbox').each(function(c) {
							if (this.id && this.id.indexOf(view.dialogs[dialogName].id) == 0) {
								if (this.name.indexOf("actions.") == 0 || this.name.indexOf("columns.") == 0 || this.name.indexOf("datalevel.") == 0) {
									return true;
								}
								if (newData[this.name] == null) {
									newData[this.name] = {};
								}
								if (this.id.indexOf('_datalevel_') >= 0) {
									if (this.checked) {
										if (newData[this.name]['DATA_LEVEL']) {
											newData[this.name]['DATA_LEVEL'] = newData[this.name]['DATA_LEVEL'] + "," + this.value;
										} else {
											newData[this.name]['DATA_LEVEL'] = this.value;
										}
									}
								} else {
									newData[this.name]['HAVE_RIGHT'] = (this.checked ? '1' : '0');
								}
							}
						});
						// console.info($(newData));
						var postData = view.dialogs[dialogName].buildFormDataObject(view.dialogs[dialogName], viewName);
						postData["fwParam.newData"] = $(view.dialogs[dialogName].getId("formMain")).serializeObject();
						postData["fwParam.oldListData"] = [ view.dialogs[dialogName].data ];
						postData["fwParam.newListData"] = [ newData ];
						got.ajax({
							cache : true,
							type : "POST",
							url : "saveSelectData",
							dataType : "text",
							data : postData,
							async : false,
							error : function(res, ts, e) {
								$.messager.alert('提示', "更新错误:" + ts, 'error');
							},
							success : function(errorMsg) {
								if (errorMsg) {
									$.messager.alert('提示', "更新错误:" + errorMsg, 'error');
								} else {
									$(view.getId(dialogName)).dialog("close");
									$.remind('提示', '保存成功', "info", 1600);
									view.queryGridData();
								}
								// return errorMsg;
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
		}, // success
	}); // ajax
}