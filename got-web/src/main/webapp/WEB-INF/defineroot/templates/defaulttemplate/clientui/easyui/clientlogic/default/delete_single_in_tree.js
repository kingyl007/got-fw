function(view, data, actionIndex, rowIndex, event) {
	var selectedId = $(view.getId("treeSelectedId")).val();
	if (!selectedId) {
		$.messager.alert('提示', '请先选择要删除的节点', 'info');
		return;
	}
	var node = view.getTree().tree("getSelected");
	var selectedData = got.removeNoUseData(node);
	delete selectedData['children'];
	delete selectedData['target'];
	confirm("提醒", "确定要删除选中的数据吗？\r\n" + node.text, function(result) {
		if (result) {
			// submit
			var newData = data = $(view.getId("treeForm")).serializeObject();
			// console.info($(newData));
			var postData = view.buildTreeFormDataObject(view, null);
			postData["fwParam.newListData"] = [ selectedData ];
			showLoading();
			got.ajax({
				cache : true,
				type : "POST",
				url : "deleteData",
				dataType : "json",
				data : postData,
				async : true,
				error : function(res, ts, e) {
					hideLoading();
					$.messager.alert('提示', "删除错误:" + ts, 'error');
				},
				success : function(result) {
					hideLoading();
					if (!result.success) {
						$.messager.alert('提示', "删除错误:" + result.errorMsg, 'error');
					} else {
						$.remind('提示', '删除成功', "info", 1600);
						view.getTree().tree("remove", node.target);
						// view.queryGridData();
					}
				}
			});
		}
	});
}