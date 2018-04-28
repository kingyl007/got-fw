function(view, data, actionId, rowIndex, event) {

	var postData = view.buildFormDataObject(view, null);
	postData["fwParam.openerSelectedData"] = view.openerSelectedData;
	showLoading();
	got.ajax({
		cache : true,
		type : "POST",
		url : "getSelectData",
		dataType : "json",
		data : postData,
		async : true,
		error : function(res, ts, e) {
			hideLoading();
			alert("检索错误:" + ts);
		},
		success : function(returnData) {
			hideLoading();
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
			var shownBtnCount = 0;
			var normalBtns = [];
			var moreBtns = [];
			var restBtns = [];
			var currentBtns = normalBtns;
			var opts;
			for ( var i = 0; i < list.length; i++) {
				if (view.otherActions && view.otherActions.inList) {
					shownBtnCount = 0;
					normalBtns = [];
					moreBtns = [];
					restBtns = [];
					currentBtns = normalBtns;
					var actionsInList = view.otherActions.inList;
					var realShowButtonCount = 0;
					for ( var j = 0; j < actionsInList.length; ++j) {
						var act = actionsInList[j];
						var arg = view.actionArg[act.id];
						if (arg != null
								&& arg['showByColumn'] != null
								&& ((!got.isEmpty(list[i][arg['showByColumn']]) && list[i][arg['showByColumn']] != arg['showValue']) || (got.isEmpty(list[i][arg['showByColumn']]) && arg['showByEmpty'] != '1'))) {
							continue;
						}
						++realShowButtonCount;
					}
					for ( var j = 0; j < actionsInList.length; ++j) {
						var act = actionsInList[j];
						var arg = view.actionArg[act.id];
						if (arg != null
								&& arg['showByColumn'] != null
								&& ((!got.isEmpty(list[i][arg['showByColumn']]) && list[i][arg['showByColumn']] != arg['showValue']) || (got.isEmpty(list[i][arg['showByColumn']]) && arg['showByEmpty'] != '1'))) {
							continue;
						}
						++shownBtnCount;
						if (shownBtnCount == maxButtons && realShowButtonCount > maxButtons) {
							$('#' + view.id + '_moreaction_' + i + '_mm').remove();
							$(".menu-shadow").each(function() {
								$(this).remove();
							});
							moreBtns.push('<a href="javascript:void(0)" id="' + view.id + "_moreaction_" + i
									+ '" class="easyui-menubutton" data-options="menu:\'#' + view.id + '_moreaction_' + i + '_mm\'">更多</a>');
							moreBtns.push('<div id="' + view.id + '_moreaction_' + i + '_mm" style="width:150px;">');
							menuButtons.push(view.id + "_moreaction_" + i);
							currentBtns = restBtns;
						}
						if (shownBtnCount >= maxButtons && realShowButtonCount > maxButtons) {
							restBtns.push('<div id="' + view.id + "_action_" + act.id + '_' + i + '" ');
						} else {
							normalBtns.push('<a class="easyui-linkbutton" id="' + view.id + "_action_" + act.id + '_' + i + '" ');
							listButtons.push("#" + view.id + "_action_" + act.id + "_" + i);
						}
						currentBtns.push('data-options="iconCls:\'' + act.icon + '\', disabled:' + (!act.enable) + ', plain:true" ');
						if (act.click && act.click != '') {
							currentBtns.push('onclick="javascript:' + view.id + '.' + act.click + '(' + view.id + ', null, \'' + act.id + '\', ' + i + ')"');
						}
						currentBtns.push('>' + act.label);
						if (shownBtnCount >= maxButtons && realShowButtonCount > maxButtons) {
							restBtns.push('</div>');
						} else {
							currentBtns.push('</a>');
						}
					}

					opts = normalBtns.join('');

					if (shownBtnCount > maxButtons) {
						opts += moreBtns.join('') + restBtns.join('') + "</div>";
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