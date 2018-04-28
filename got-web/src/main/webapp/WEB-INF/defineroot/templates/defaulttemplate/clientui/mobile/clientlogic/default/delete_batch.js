function(view, data, actionIndex, rowIndex, event) {
	var rows = view.getGrid().datagrid("getChecked");
	if (rows == null || rows.length < 1) {
		error("请选择要删除的数据！");
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
			got.ajax({
				cache : true,
				type : "POST",
				url : "deleteData",
				data : postData,
				async : false,
				error : function(res, ts, e) {
					$.messager.alert('提示', "删除错误:" + ts, 'error');
				},
				success : function(result) {
					if (!result.success) {
						$.messager.alert('提示', "删除错误:" + result.errorMsg, 'error');
					} else {
						$.remind('提示', '删除成功', "info", 1600);
						view.queryGridData();
					}
				}
			});
		}
	});
}