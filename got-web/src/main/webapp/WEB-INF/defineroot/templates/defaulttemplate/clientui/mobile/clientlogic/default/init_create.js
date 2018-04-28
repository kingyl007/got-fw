function(view, data, actionIndex, rowIndex, event) {
	if (view.isInDialog) {
		console.info('in dialog, do nothing');
	} else {
		console.info('alone');
		var postData = view.buildFormDataObject(view, null);
		got.ajax({
			cache : true,
			type : "POST",
			url : "getCreateData",
			dataType : "json",
			data : postData,
			async : true,
			error : function(res, ts, e) {
				$.messager.alert('提示', '数据加载错误。', 'error');
			},
			success : function(returnData) {
				if (returnData == null) {
					$.messager.alert('提示', '数据加载错误。', 'error');
					return;
				}

				view.setValueIniting(true);
				var targetId = view.id;
				$("[ui]").each(function(i, col) {
					if (col.id.indexOf(targetId) == 0) {
						got.setFormValue($(col), {}, 'EMPTY');
					} else {
						console.info(col);
					}
				});
				for ( var k in returnData) {
					var fe = $(view.getId(k));
					got.setFormValue(fe, returnData, k);
				}
				if (view.setOtherData) {
					view.setOtherData(returnData);
				}
				view.setValueIniting(false);

// if (successCallback) {
// successCallback();
// }
				// $(view.getId(dialogName)).scrollTop(0);
			}
		});
	
	}
}