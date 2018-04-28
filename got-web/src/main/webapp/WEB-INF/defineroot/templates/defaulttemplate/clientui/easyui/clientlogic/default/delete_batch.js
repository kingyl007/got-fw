function(view, data, actionIndex, rowIndex, event) {
	var rows = view.getGrid().datagrid("getChecked");
	if (rows == null || rows.length < 1) {
		$.messager.alert('提示', "请选择要删除的数据！", 'info');
		return false;
	}
	var cols = view.getGrid().datagrid("options").columns[0];
	var firstCol = "";
	for ( var i = 0; i < cols.length; ++i) {
		if (cols[i].title && cols[i].field && !cols[i].hidden) {
			firstCol = cols[i];
			break;
		}
	}
	var colStr = "";

	confirm("提醒", "确定要删除选中的" + rows.length + "条数据吗？\r\n" + colStr, function(result) {
		if (result) {
			// submit
			// var newData = data = $(view.getId("form")).serializeObject();
			// console.info($(newData));
			var postData = view.buildFormDataObject(view, null);
			postData["fwParam.newListData"] = got.removeNoUseData(rows);
			showLoading();
			got.ajax({
				cache : true,
				type : "POST",
				url : "deleteData",
				data : postData,
				async : true,
				error : function(res, ts, e) {
					hideLoading();
					error("删除错误:" + ts);
				},
				success : function(result) {
					hideLoading();
					if (!result.success) {
						error("删除错误:" + result.errorMsg);
					} else {
						$.remind('提示', '删除成功', "info", 1600);
						view.queryGridData();
					}
				}
			});
		}
	});
}