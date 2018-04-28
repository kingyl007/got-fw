function(view, data, actionIndex, rowIndex, event) {
	var dialogName = actionIndex;
	var viewName = "import";

	var getDataFunction = function(view, data, actionIndex, rowIndex, successCallback) {
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
						text : '导入',
						iconCls : view.actionArg[actionIndex] ? view.actionArg[actionIndex]['icon'] : '',
						handler : function() {

							if ($("#uploadfile").val() == "") {
								alert("请选择要导入的文件");
								return;
							}
							/*
							 * $("#loading") .ajaxStart(function(){ $(this).show(); })
							 * .ajaxComplete(function(){ $(this).hide(); });
							 */
							var postData = view.dialogs[dialogName].buildFormDataObject(view.dialogs[dialogName], "create");
							$.messager.progress();
							$.messager.progress('bar').progressbar({text:'导入中，请稍候...'}); 
							$.ajaxFileUpload({
								url : 'importData?fwCoord.project='+$(view.getId('project')).val(),
								secureuri : false,
								fileElementId : view.dialogs[dialogName].id + "_importFile",
								dataType : 'json',
								data : postData,
								error : function(res, ts, e) {
									$.messager.progress('close'); 
									$.messager.alert('提示', "导入错误 :" + ts, 'error');
								},
								success : function(result, status) {
									$.messager.progress('close');
									if (result.success) {
										// $(view.getId(dialogName)).dialog("close");
										if (result.errorMsg && result.errorMsg != '') {
											$.messager.alert('提示', "导入成功:" + result.errorMsg, 'info');
										} else {
											$.remind('提示', '导入成功', "info", 1600);
										}
										view.queryGridData();
									} else {
										if (result.validResultMap) {
											view.dialogs[dialogName].validErrorMap = result.validResultMap;
											got.doValidate(view.dialogs[dialogName], true);
											$.remind('错误', '导入错误:' + result.errorMsg, "error", 3000);
										} else {
											$.messager.alert('提示', "导入错误:" + result.errorMsg, 'error');
										}
									}
								}
							});
						}
					}, {
						text : '关闭',
						// iconCls : 'icon-back',
						handler : function() {
							$(view.getId(dialogName)).dialog("close");
						}
					}, ],
				});
			}); // getDataFunction
		}, // success
	}); // ajax
}