function(view, data, actionId, rowIndex, event) {

	var postData = view.buildFormDataObject(view, null);
	postData["fwParam.openerSelectedData"] = view.openerSelectedData;

	got.ajax({
		cache : true,
		type : "POST",
		url : "getSelectData",
		dataType : "json",
		data : postData,
		async : false,
		error : function(res, ts, e) {
			alert("检索错误:" + ts);
		},
		success : function(returnData) {
			if (returnData == null) {
				alert('检索错误');
				return;
			}
			view.data = returnData;
			var list = returnData.data;// realResult.list;
			var opts = '';
			var listButtons = [];
			var menuButtons = [];
			var maxButtons = 5;
			for ( var i = 0; i < list.length; i++) {
				if (view.otherActions && view.otherActions.inList) {
					opts = "";
					var actionsInList = view.otherActions.inList;
					for ( var j = 0; j < actionsInList.length; ++j) {
						var act = actionsInList[j];
						opts = opts + '<a class="easyui-linkbutton" id="' + view.id + "_action_" + act.id + '_' + i + '" ';
						opts = opts + 'data-options="iconCls:\'' + act.icon + '\', disabled:' + (!act.enable) + ', plain:true" ';
						if (act.click && act.click != '') {
							opts = opts + 'onclick="javascript:' + view.id + '.' + act.click + '(' + view.id + ', null, \'' + act.id + '\', ' + i + ')"';
						}
						opts = opts + '>' + act.label + '</a>';
						listButtons.push("#" + view.id + "_action_" + act.id + "_" + i);
					}
				}

				list[i]["_FW_ACTIONS"] = opts;
				list[i]["_FW_LINKBUTTONS"] = listButtons;
				list[i]["_FW_MENUBUTTONS"] = menuButtons;
			}

			view.getGrid().datagrid({
				data : list
			});
			for ( var i = 0; i < listButtons.length; ++i) {
				$(listButtons[i]).linkbutton();
			}
			for ( var i = 0; i < menuButtons.length; ++i) {
				$("#" + menuButtons[i]).menubutton();
			}

			for ( var i = 0; i < list.length; ++i) {
				if (list[i]["FW_SELECTED"]) {
					view.getGrid().datagrid("selectRow", i);
				}
			}
			var pg = returnData.page;
			$(view.getId("totalRow")).val(pg.totalRow);
			$(view.getId("pageSize")).val(pg.pageSize);
			$(view.getId("pageNumber")).val(pg.pageNumber);
			view.getPagination().pagination({
				total : pg.totalRow,
				pageSize : pg.pageSize,
				pageNumber : pg.pageNumber
			});

			$("tr[class='datagrid-header-row'] td[field='" + $(view.getId("sortName")).val() + "'] div").addClass(
					"datagrid-sort-" + $(view.getId("sortOrder")).val());
			view.getGrid().datagrid('doCellTip', {
				onlyShowInterrupt : true,
				position : 'bottom'
			});
		}
	});
}