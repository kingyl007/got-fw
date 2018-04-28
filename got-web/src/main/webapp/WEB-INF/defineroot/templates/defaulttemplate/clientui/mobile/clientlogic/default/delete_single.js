function(view, data, actionIndex, rowIndex, event) {
	var rows = got.removeNoUseData(view.getGrid().datagrid("getRows")[rowIndex]);
	if (rows == null) {
		error("请选择要删除的数据！");
		return false;
	}
	view.getGrid().datagrid("clearSelections");
	var cols = view.getGrid().datagrid("options").columns[0];
	var colStr = "";
	for ( var i = 0; i < cols.length; ++i) {
		if (cols[i].title && cols[i].field && !cols[i].hidden && rows[cols[i].field]) {
			colStr = colStr + cols[i].title + ":" + (cols[i].formatter ? cols[i].formatter(rows[cols[i].field], rows, rowIndex) : rows[cols[i].field])
					+ "\r\n";
		}
	}
	confirm("提醒", "确定要删除选中的数据吗？\r\n" + colStr, function(result) {
		if (result) {
			// submit
			var newData = data = $(view.getId("form")).serializeObject();
			// console.info($(newData));
			var postData = view.buildFormDataObject(view, null);
			postData["fwParam.newListData"] = [ rows ];
			got.ajax({
				cache : true,
				type : "POST",
				url : "deleteData",
				dataType : "json",
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