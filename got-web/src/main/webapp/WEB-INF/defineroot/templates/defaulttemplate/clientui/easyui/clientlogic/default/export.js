function(view, data, actionIndex, rowIndex, event) {
	var dialogName = actionIndex;
	var viewName = "export";
	var exportProc = function(dataRange, fileType, columns) {

		if ($(view.getId('export_frame')).attr('type') == 'gotdynamic') {

		} else {
			var content = "<iframe id='" + view.id + "_export_frame" + "' type='gotdynamic' style='display: none;'></iframe>";
			$(content).appendTo($(view.getId("dialogs")));
		}
		formData = view.getForm().serializeObject();
		content = "<form id='" + view.id + "_export_form' method='post' action='export'>";
		$.each(formData, function(k) {
			content = content + "<input type='hidden' name='"+k+"' value='" + formData[k] + "'>";
		});
		/*
		content = content + "<input type='hidden' name='fwCoord.project' value='" + $(view.getId('project')).val() + "'>";
		content = content + "<input type='hidden' name='fwCoord.function' value='" + $(view.getId('function')).val() + "'>";
		content = content + "<input type='hidden' name='fwCoord.view' value='" + $(view.getId('view')).val() + "'>";
		content = content + "<input type='hidden' name='fwCoord.lang' value='" + $(view.getId('lang')).val() + "'>";
		content = content + "<input type='hidden' name='fwCoord.ui' value='" + $(view.getId('ui')).val() + "'>";

		content = content + "<input type='hidden' name='fwPage.pageSize' value='" + $(view.getId('pageSize')).val() + "'>";
		content = content + "<input type='hidden' name='fwPage.pageNumber' value='" + $(view.getId('pageNumber')).val() + "'>";

		content = content + "<input type='hidden' name='fwParam.sortName' value='" + $(view.getId('sortName')).val() + "'>";
		content = content + "<input type='hidden' name='fwParam.sortOrder' value='" + $(view.getId('sortOrder')).val() + "'>";
		content = content + "<input type='hidden' name='fwParam.queryValue' value='" + ($(view.getId('queryValue')).val()?$(view.getId('queryValue')).val():'') + "'>";
		
		content = content + "<input type='hidden' name='fwParam.openerId' value='" + $(view.getId('project')).val() + "'>";
		content = content + "<input type='hidden' name='fwParam.openerFunction' value='" + $(view.getId('function')).val() + "'>";
		content = content + "<input type='hidden' name='fwParam.openerView' value='" + $(view.getId('view')).val() + "'>";
		content = content + "<input type='hidden' name='fwParam.openerActionId' value='" + actionIndex + "'>";
		*/
		content = content + "<input type='hidden' name='fwParam.newData[DATA_RANGE]' value='" + dataRange + "'>";
		content = content + "<input type='hidden' name='fwParam.newData[FILE_TYPE]' value='" + fileType + "'>";
		if (view.exportFileName) {
			content = content + "<input type='hidden' name='fwParam.newData[FILE_NAME]' value='" + view.exportFileName + "'>";
		}
		
		if (view.actionArg[actionIndex] && view.actionArg[actionIndex]['doClientExport']) {
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
				content = content + "<input type='hidden' name='fwParam.newData[COLUMNS]' value='" + col['ID'] + "'>";
			});
		}
		content = content + "</form>";
		// */
		$(view.getId("export_frame")).empty();
		$(content).appendTo($(view.getId("export_frame")));
		$(view.getId("export_form")).submit();
	};
	if (event && event.ctrlKey) {
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
							text : '导出',
							iconCls : view.actionArg[actionIndex] ? view.actionArg[actionIndex]['icon'] : '',
							handler : function() {
								$(view.getId(dialogName)).dialog("close");
								var exportPageRange = '0';
								var exportFileType = 'xls';
								$("input[group='exportPageRange']").each(function() {
									if ($(this).attr('checked')) {
										exportPageRange = $(this).val();
									}
								});

								$("input[group='exportFileType']").each(function() {
									if ($(this).attr('checked')) {
										exportFileType = $(this).val();
									}
								});

								exportProc(exportPageRange, exportFileType, $(view.dialogs[dialogName].getId("toDatagrid")).datagrid("getRows"));
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
	} else { // if ctrlKey
		exportProc("0", "xls", null);
	}
}