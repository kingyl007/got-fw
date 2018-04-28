function(view, data, actionIndex, rowIndex, event) {
	var selectedData = got.removeNoUseData(view.getGrid().datagrid("getData").rows[rowIndex]);
	if (rowIndex == null) {
		// rowIndex = view.getGrid().datagrid("getSelected");
	}
	if (rowIndex < 0) {
		$.messager.alert("提示", "请选择要处理的数据", "info");
		return;
	}
	view.getGrid().datagrid("clearSelections");	
	
	var newData = data = view.getForm().serializeObject();
	var postData = view.buildFormDataObject(view, viewName);
	postData["fwParam.oldData"] = got.removeNoUseData(selectedData);
	postData["fwParam.newData"] = newData;
	postData["fwParam.workFlowOperate"] = "12";
	showLoading();
	got.ajax({
		cache : true,
		type : "POST",
		url : "recallWorkFlow",
		dataType : "json",
		data : postData,
		async : true,
		error : function(res, ts, e) {
			hideLoading();
			$.messager.alert('提示', "撤回错误:" + ts, 'error');
		},
		success : function(result) {
			hideLoading();
			if (result.success) {
				if (result.errorMsg && result.errorMsg != '') {
					$.messager.alert('提示', "撤回成功:" + result.errorMsg, 'info');
				} else {
					$.remind('提示', '撤回成功', "info", 1600);
				}
				view.queryGridData();
			} else {
				if (result.validResultMap) {
					$.remind('错误', '输入错误:' + result.errorMsg, "error", 3000);
				} else {
					$.messager.alert('提示', "撤回错误:" + result.errorMsg, 'error');
				}
			}
		}
	});
}