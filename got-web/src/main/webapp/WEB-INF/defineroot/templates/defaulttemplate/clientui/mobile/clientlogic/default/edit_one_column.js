function(view, data, actionIndex, rowIndex, event) {
	var dialogName = actionIndex;
	var viewName = "edit";
	if (rowIndex == null) {
		// rowIndex = view.getGrid().datagrid("getSelected");
	}
	if (rowIndex < 0) {
		$.messager.alert("提示", "请选择要编辑的数据", "info");
		return;
	}
	var selectedData = got.removeNoUseData(view.getGrid().datagrid("getData").rows[rowIndex]);
	view.getGrid().datagrid("clearSelections");
	// submit
	var newData = {};
	$.each(selectedData, function(k) {
		newData[k] = selectedData[k];
	});
	if (view.actionArg[actionIndex]) {
		var args = view.actionArg[actionIndex];
		if (args['showByColumn']) {
			newData[args['showByColumn']] = args['setValue'];
		}
	}
	var postData = view.buildFormDataObject(view, viewName);
	postData["fwParam.oldData"] = selectedData;
	postData["fwParam.newData"] = newData;
	got.ajax({
		cache : true,
		type : "POST",
		url : "saveEditData",
		dataType : "json",
		data : postData,
		async : true,
		error : function(res, ts, e) {
			$.messager.alert('提示', view.actionArg[actionIndex].label + "错误:" + ts, 'error');
		},
		success : function(result) {
			if (result.validResultMap) {
				view.validErrorMap = result.validResultMap;
				got.doValidate(view, true);
				$.remind('错误', '输入错误:' + result.errorMsg, "error", 3000);
			} else if (result.errorMsg) {
				$.messager.alert('提示', view.actionArg[actionIndex].label + "错误:" + result.errorMsg, 'error');
			} else {
				$(view.getId(dialogName)).dialog("close");
				$.remind('提示', view.actionArg[actionIndex].label + '成功', "info", 1600);
				view.queryGridData();
			}
		}
	});
}