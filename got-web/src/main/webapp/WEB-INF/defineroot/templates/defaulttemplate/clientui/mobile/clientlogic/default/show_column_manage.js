function(view, data, actionIndex, rowIndex, event) {
	var dialogName = actionIndex;
	var viewName = "columnManage";
	// var selectedData =
	// got.removeNoUseData(view.getGrid().datagrid("getData").rows[rowIndex]);
	var getDataFunction = function(view, data, actionIndex, rowIndex, successCallback) {
		var columns = view.getGrid().datagrid("options")['columns'];
		view.dialogs[dialogName].setColumns(columns);
		if (successCallback) {
			successCallback();
		}
	};

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
	// postData["fwParam.openerSelectedData"] = selectedData;
	postData['fwParam.showAsDialog'] = "1";
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
			var width = view.dialogs[dialogName].width;
			var height = view.dialogs[dialogName].height;
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
							if (!got.doValidate(view.dialogs[dialogName], true) || !view.dialogs[dialogName].validate()) {
								return;
							}
							// submit
							// var newData = data =
							// view.dialogs[dialogName].getForm().serializeObject();
							var postData = view.dialogs[dialogName].buildFormDataObject(view.dialogs[dialogName], viewName);
							// postData["fwParam.oldData"] = view.dialogs[dialogName].data;
							var newSelectedCols = $(view.dialogs[dialogName].getId("toDatagrid")).datagrid("getRows");
							var toBackCols = [];
							var arrCols = [];
							$.each(newSelectedCols, function(i, col) {
								toBackCols.push({
									ID : col['ID'],
									WIDTH : col['WIDTH']
								});
								arrCols.push(col['ID']);
							});
							postData["fwParam.newListData"] = toBackCols;
							postData["fwParam.newData"] = {
								arr : arrCols
							};
							got.ajax({
								cache : true,
								type : "POST",
								url : "saveColumnManageData",
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
										var oldColumns = view.getGrid().datagrid("options")['columns'][0];
										var newColumns = [];
										var columnMap = {};
										$.each(oldColumns, function(i, col) {
											if (col['id'] != '_FW_ACTIONS') {
												col["hidden"] = true;
											}
											columnMap[col['field']] = col;
										});
										if (columnMap['ck']) {
											columnMap['ck'].hidden = false;
											newColumns.push(columnMap['ck']);
											columnMap['ck'] = null;
										}
										$.each(newSelectedCols, function(i, col) {
											if (columnMap[col['ID']]) {
												columnMap[col['ID']]['hidden'] = false;
												newColumns.push(columnMap[col['ID']]);
												columnMap[col['ID']] = null;
											}
										});
										$.each(oldColumns, function(i, col) {
											if (columnMap[col['field']] != null) {
												newColumns.push(col);
											}
										});
										if (columnMap['_FW_ACTIONS']) {
											// columnMap['_FW_ACTIONS'].hidden = false;
											// newColumns.push(columnMap['_FW_ACTIONS']);
										}
										var gridData = view.getGrid().datagrid('getData');
										view.getGrid().datagrid({
											columns : [ newColumns ],
											data : gridData
										});
										$.each(view.getGrid().datagrid("getRows"), function(i, row) {
											if (row["_FW_LINKBUTTONS"]) {
												$.each(row["_FW_LINKBUTTONS"], function(j, lb) {
													$(lb).linkbutton();
												});
											}
											if (row["_FW_MENUBUTTONS"]) {
												$.each(row["_FW_MENUBUTTONS"], function(j, mb) {
													$("#" + mb).menubutton();
												});
											}
										});
										$(view.getId(dialogName)).dialog("close");
										$.remind('提示', '保存成功', "info", 1600);
									}
								}
							});
						}
					}, {
						text : '关闭',
//						iconCls : 'icon-close',
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