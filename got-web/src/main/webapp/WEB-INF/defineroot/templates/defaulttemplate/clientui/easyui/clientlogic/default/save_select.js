function(view, data, actionIndex, rowIndex, event) {
	// TODO
	// get old selected data
	// get new selected data
	// submit
	// var newData = data =
	// view.dialogs[dialogName].getForm().serializeObject();
	var postData = view.buildFormDataObject(view, null);
	var oldListData = [];
	var list = view.data.data;
	for (var i = 0; i < list.length; ++i) {
		if (list[i]["FW_SELECTED"]) {
			oldListData.push(got.removeNoUseData(list[i]));
		}
	}
	var newListData = [];
	list = $(view.getId("datagrid")).datagrid("getSelections");
	for (var i = 0; i < list.length; ++i) {
		newListData.push(got.removeNoUseData(list[i]));
	}
	postData["fwParam.oldListData"] = oldListData;
	postData["fwParam.newListData"] = newListData;
	showLoading();
	got.ajax({
		cache : true,
		type : "POST",
		url : "saveSelectData",
		dataType : "json",
		data : postData,
		async : true,
		error : function(res, ts, e) {
			hideLoading();
			$.messager.alert('提示', "更新错误:" + ts, 'error');
		},
		success : function(result) {
			hideLoading();
			if (result.success) {
				view.queryGridData();
				if (!result.errorMsg) {
					$.remind('提示', '保存成功', "info", 1600);
				} else {
					$.remind('提示', result.errorMsg, "info", 5000);
				}
			} else {
				if (result.errorMsg) {
					$.messager.alert('提示', result.errorMsg, 'error');
				} else {
					$.messager.alert('提示', "更新错误", 'error');
				}
			}
			// return errorMsg;
		}
	});
}