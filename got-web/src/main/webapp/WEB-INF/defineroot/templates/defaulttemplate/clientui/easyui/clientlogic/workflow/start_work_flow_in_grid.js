function(view, data, actionIndex, rowIndex, event) {
	var selectedData = got.removeNoUseData(view.getGrid().datagrid("getData").rows[rowIndex]);
	if (rowIndex == null) {
		// rowIndex = view.getGrid().datagrid("getSelected");
	}
	if (rowIndex < 0) {
		$.messager.alert("提示", "请选择要处理的数据", "info");
		return;
	}

	confirm("提醒", "确定要提交选中的数据吗？", function(result) {
		if (result) {
			view.getGrid().datagrid("clearSelections");	
			
			var postData = view.buildFormDataObject(view, "detail");
			postData["fwParam.oldData"] = got.removeNoUseData(selectedData);
			postData["fwParam.newData"] = got.removeNoUseData(selectedData);
			postData["fwParam.workFlowOperate"] = "12";
			showLoading();
			got.ajax({
				cache : true,
				type : "POST",
				url : "startWorkFlow",
				dataType : "json",
				data : postData,
				async : true,
				error : function(res, ts, e) {
					hideLoading();
					$.messager.alert('提示', "提交错误:" + ts, 'error');
				},
				success : function(result) {
					hideLoading();
					if (result.success) {
						if (result.errorMsg && result.errorMsg != '') {
							$.messager.alert('提示', "提交成功:" + result.errorMsg, 'info');
						} else {
							$.remind('提示', '提交成功', "info", 1600);
						}
						view.queryGridData();
					} else {
						if (result.validResultMap) {
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