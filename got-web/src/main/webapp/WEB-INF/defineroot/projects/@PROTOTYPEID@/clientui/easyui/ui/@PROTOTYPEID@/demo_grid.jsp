<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@page import="cn.got.platform.core.model.layout.*"%>
<%@page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html>
<html lang="zh">
<head>
<title>@PROTOTYPEID@${not empty view.title?view.title:function.title}</title>
<%
	// TODO filter in list action, construct button group
	FwView view = (FwView) request.getAttribute("view");
	if (view != null) {
		Map<String, FwGroup> groupMap = new HashMap<String, FwGroup>();
		List<FwGroup> actionGroups = view.getActionGroups();
		if (actionGroups != null) {
			for (FwGroup fg : actionGroups) {
				groupMap.put(fg.getId(), fg);
			}
		}
		Map<String, FwGroup> otherGroupMap = new HashMap<String, FwGroup>();
		List<Object> finalActions = new ArrayList<Object>();
		List<FwAction> actions = view.getActions();
		FwGroup group = null;
		if (actions != null) {
			for (FwAction act : actions) {
				if (act.getVisible()) {
					if (act.getGroup() != null
							&& !"".equals(act.getGroup())) {
						group = groupMap.get(act.getGroup());
						if (group != null) {
							group.addChild(act);
							if (!finalActions.contains(group)) {
								finalActions.add(group);
							}
						} else {
							group = otherGroupMap.get(act.getGroup());
							if (group == null) {
								group = new FwGroup();
								group.setId(act.getGroup());
								otherGroupMap
										.put(act.getGroup(), group);
							}
							group.addChild(act);
						}
					} else {
						finalActions.add(act);
					}
				}
			}
			
			for (int i = 0; i < finalActions.size(); ++i) {
				if (finalActions.get(i) instanceof FwGroup) {
					group = (FwGroup)(finalActions.get(i));
					if (group.getChildren().size() == 1) {
						finalActions.remove(i);
						finalActions.add(i, group.getChildren().get(0));
					}
				}
			}
		}
		request.setAttribute("displayActions", finalActions);
		request.setAttribute("otherActions", otherGroupMap);
	}
	String str = ((String)request.getAttribute("openerSelectedData"));
	if (str != null) {
	  str = str.replaceAll("<", "&lt;");
	  request.setAttribute("openerSelectedData", str);
	}
	if (!"1".equals(request.getAttribute("showAsDialog"))) {
%>
<jsp:include page="../header.jsp"></jsp:include>
<%
	}
%>
<script type="text/javascript">
	var ${pageId}={
<jsp:include page="../default_view_object.jsp" />
		queryGridData: function() {
  		<c:if test="${not empty view.onQuery}">
			if (this['${view.onQuery}']) {
				this['${view.onQuery}'](this, $(this.getId("form")).serialize());
			}
			</c:if>
		},
		
		getGrid: function() {
		  return $(${pageId}.getId("datagrid"));
		},
		
		getPagination: function() {
		  return $(${pageId}.getId("pagination"));
		},
		
		onClickCell : function(rowIndex, field, value) {
			var view = ${pageId};
			console.info("click:" + rowIndex +"," + field +" ," + value);
			<c:forEach var="col" items="${view.columns}" varStatus="cs">
				<c:if test="${not empty col.onClick}">
					if (field == '${col.id}') {
						view['${col.onClick}'](view, value, '${col.id}', rowIndex);
					}
				</c:if>
			</c:forEach>
		},
		onDblClickCell : function(rowIndex, field, value) {
			var view = ${pageId};
			console.info("dbclick:" + rowIndex +"," + field +" ," + value);
			<c:forEach var="col" items="${view.columns}" varStatus="cs">
				<c:if test="${not empty col.onDblClick}">
					if (field == '${col.id}') {
						view['${col.onDblClick}'](view, value, '${col.id}', rowIndex);
					}
				</c:if>
			</c:forEach>
		},
	}
	
	$(function() {
		<c:if test="${not empty openerId}">
			${openerId}.dialogs['${fwParam.openerActionId}'] = ${pageId};
			${pageId}.opener = ${openerId}; 
		</c:if>
		var opColWidth = 0;
		if (${pageId}.otherActions && ${pageId}.otherActions.inList) {
		  opColWidth = ${pageId}.otherActions.inList.length *60;
		}
		$(${pageId}.getId("datagrid")).datagrid(
			{
		        fitColumns : false,
		        striped : true,
		        rownumbers : true,
		        autoRowHeight : false,
				title : "${view.title }",
				sortName : $(${pageId}.getId("sortName")).val(),
				sortOrder : $(${pageId}.getId("sortOrder")).val(),
				onClickCell : ${pageId}.onClickCell,
				onDblClickCell : ${pageId}.onDblClickCell,
				columns : [[ 
	            { field: 'ck', checkbox: true }
<c:if test="${view.columns != null }">
<c:forEach var="instance" items="${view.columns}" varStatus="status">
<c:if test="${instance.toView || instance.pk}" >
	,{ field: '${instance.id}', title: '${instance.label}'
	, width: ${(not empty instance.width && instance.width > 0)?instance.width:'150'}
	, sortable: true,resizable : true, toUser: ${instance.toUser}
	, hidden:${!instance.visible}
		<c:choose>
			<c:when test="${not empty instance.onFormat}">
				, formatter: ${pageId}.${instance.onFormat}
			</c:when>
			<c:when test="${not empty instance.dictionary}">
				, formatter: function(val,data,index){var str = ${pageId}.dictMap['${instance.dictionary}'][val]; if (str == null || str == '') {str = val;} return got.xssFilter(str);}
			</c:when>
			<c:when test="${not empty instance.showColumn}">
				, formatter: function(val,data,index){var str = ''; $.each('${instance.showColumn}'.split(','), function(i, s) {str += ((data[s]?data[s]:'') +' ');});return got.xssFilter(str);}
			</c:when>
			<c:when test="${instance.id == '_FW_ACTIONS'}">
				, sortable:false
			</c:when>
			<c:otherwise>
				, formatter: function(val,data,index){return got.xssFilter(val);}
			</c:otherwise>
		</c:choose>
	}
</c:if>
</c:forEach>
</c:if>
				           ]],
				onSortColumn : function(sort, order) {
					$(${pageId}.getId("sortName")).val(sort);
					$(${pageId}.getId("sortOrder")).val(order);
					${pageId}.queryGridData();
				},
			});
		$(${pageId}.getId("pagination")).pagination({
			total : parseInt($(${pageId}.getId("totalRow")).val()),
			pageSize : parseInt($(${pageId}.getId("pageSize")).val()),
			pageNumber : parseInt($(${pageId}.getId("pageNumber")).val()),
			showPageList : true,
			showRefresh : true,
			onSelectPage : function(pageNumber, pageSize) {
				$(${pageId}.getId("pageNumber")).val(pageNumber);
				$(${pageId}.getId("pageSize")).val(pageSize);
				${pageId}.queryGridData();
			},
			onChangePageSize : function(pageSize) {
			  $(${pageId}.getId("pageSize")).val(pageSize);
			}
		});
		$(${pageId}.getId("buttonArea")).toggle();
		<c:if test="${not empty openerId}">
			${pageId}.opener = ${openerId};
		</c:if>
		<c:if test="${(not empty openerId) && (not empty fwParam.openerActionId)}">
			${openerId}.dialogs['${fwParam.openerActionId}'] = ${pageId};
		</c:if>		
		$(${pageId}.getId("datagrid")).datagrid("columnMoving");
		
		<c:if test="${not empty view.onInit}">
		if (${pageId}['${view.onInit}']) {
		  ${pageId}['${view.onInit}'](${pageId}, $(${pageId}.getId("form")).serialize());
		}
		</c:if>

		${pageId}.queryGridData();
		$.parser.parse(${pageId}.getId("buttonArea"));
	});
</script>
</head>
<body id="${pageId}_body">
	<form id="${pageId}_form" name="form" action="list" method="post">
		<input type="hidden" id="${pageId}_project" name="fwCoord.project" value="${view.coord.project }" />
		<input type="hidden" id="${pageId}_function" name="fwCoord.function" value="${view.coord.function }" />
		<input type="hidden" id="${pageId}_view" name="fwCoord.view" value="${view.coord.view }" />
		<input type="hidden" id="${pageId}_lang" name="fwCoord.lang" value="${view.coord.lang }" />
		<input type="hidden" id="${pageId}_ui" name="fwCoord.ui" value="${view.coord.ui }" />
		
		<input type="hidden" id="${pageId}_totalRow" name="fwPage.totalRow" value="100" /> 
		<input type="hidden" id="${pageId}_pageSize" name="fwPage.pageSize" value="10" /> 
		<input type="hidden" id="${pageId}_pageNumber" name="fwPage.pageNumber" value="1" />
	
		<input type="hidden" id="${pageId}_sortName" name="fwParam.sortName" value="${fwParam.sortName }" />
		<input type="hidden" id="${pageId}_sortOrder" name="fwParam.sortOrder" value="${fwParam.sortOrder }" />
		<input type="hidden" id="${pageId}_treeConnectColumn" name="fwParam.treeConnectColumn" value="${not empty view.argument?view.argument.map['treeConnectColumn']:'' }" /> 

		<input type="hidden" id="${pageId}_openerFunction" name="fwParam.openerFunction" value="${fwParam.openerFunction }" />
		<input type="hidden" id="${pageId}_openerView" name="fwParam.openerView" value="${fwParam.openerView }" />
		<input type="hidden" id="${pageId}_openerActionId" name="fwParam.openerActionId" value="${fwParam.openerActionId }" />
		
		<input type="hidden" id="${pageId}_selectedId" name="fwParam.selectedId" value="${fwParam.selectedId }" />
		<div>
			<table style="margin: 10px">
				<tr>
					<td id="${pageId}_buttonArea" style="display:none">
<jsp:include page="../grid_button_area.jsp" />
					</td>
				</tr>
			</table>
			<table id="${pageId}_datagrid" width="100%">
				<tbody id="${pageId}_dataArea" width="100%">
				</tbody>
			</table>
			<div id="${pageId}_pagination" class="easyui-pagination"
				style="background: #efefef; border: 1px solid #ccc;"
				data-options="showPageList:false,showRefresh:false"></div>
		</div>
	</form>
</body>
<div id="${pageId}_dialogs" style="display: none"></div>
</html>