function(view, data, actionIndex, rowIndex, event) {
	// TODO
	// get new data
	// combine old data and new data
	view.validErrorMap = {};
	if (!got.doValidate(view, true) || !view.validate()) {
		return;
	}
	// submit
	var newData = data = view.getForm().serializeObject();
	if (view.getOtherToSaveData) {
		if (!view.getOtherToSaveData(newData)) {
			return;
		}
	}
	var postData = view.buildFormDataObject(view, null);
	postData["fwParam.oldData"] = view.data;
	postData["fwParam.newData"] = newData;
	showLoading();
	got.ajax({
		cache : true,
		type : "POST",
		url : "saveEditData",
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
//				$(view.getId(dialogName)).dialog("close");
				view.data = newData;
				if (result.errorMsg && result.errorMsg != '') {
					$.messager.alert('提示', "保存成功:" + result.errorMsg, 'info');
				} else {
					$.remind('提示', '保存成功', "info", 1600);
				}
//				view.queryGridData();
			} else {
				if (result.validResultMap) {
					view.validErrorMap = result.validResultMap;
					got.doValidate(view, true);
					$.remind('错误', '输入错误:' + result.errorMsg, "error", 3000);
				} else {
					$.messager.alert('提示', "保存错误:" + result.errorMsg, 'error');
				}
			}
		}
	});
}