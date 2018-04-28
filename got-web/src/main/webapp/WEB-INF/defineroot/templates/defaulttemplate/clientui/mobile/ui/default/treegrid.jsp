<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@page import="cn.got.platform.core.model.layout.*"%>
<%@page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>

<!DOCTYPE html>
<html lang="zh">
<head>
<title>${view.title }</title>
<%
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
	if (!"1".equals(request.getAttribute("showAsDialog"))) {
%>
<jsp:include page="../header.jsp"></jsp:include>
<%
  }
%>
<script type="text/javascript">
	var ${pageId}=cxfw2.initDefineObject('${pageId}', ${pageDefine});
	
	$(function() {

	  	var define = ${pageId};
		var pageColumns = new Array();
		/*
		pageColumns.push({
			field : 'ck',
			checkbox : true
		});
		*/
		if (define.pd.columnList) {
		  var columns = define.pd.columnList;
		  var tbcol = null;
			pageColumns.push(cxfw2.buildGridColumn(define, {field:"id", label:"id",visible:false}));
			pageColumns.push(cxfw2.buildGridColumn(define, {field:"text", label:" "}));
			for (var i = 0; i < columns.length; ++i) {
				pageColumns.push(cxfw2.buildGridColumn(define, columns[i]));
			}
			pageColumns.push({
				field : 'actions',
				title : fwres.operate,
				width : 150,
				height : 30,
				sortable : false,
			});
		}
		$(define.geteid("treegrid")).treegrid(
			{
			  	url: 'getEasyuiTreeData',
			  	queryParams:  cxfw2.buildDefinePostObject(define, false),
			  	idField : 'id',
			  	treeField : 'text',
			  	singleSelect : false,
		        fitColumns : true,
		        striped : true,
		        rownumbers : true,
				title : define.pd.title,
				sortName : $(define.geteid("sortName")).val(),
				sortOrder : $(define.geteid("sortOrder")).val(),
				columns : [ pageColumns ],
				/*
				onSortColumn : function(sort, order) {
					$(define.geteid("sortName")).val(sort);
					$(define.geteid("sortOrder")).val(order);
					define.loadData();
				},
				*/
			});
		/*
		$(define.geteid("pagination")).pagination({
			total : parseInt($(define.geteid("total")).val()),
			pageSize : parseInt($(define.geteid("pageSize")).val()),
			pageNumber : parseInt($(define.geteid("pageNumber")).val()),
			showPageList : true,
			showRefresh : true,
			onSelectPage : function(pageNumber, pageSize) {
				$(define.geteid("pageNumber")).val(pageNumber);
				$(define.geteid("pageSize")).val(pageSize);
				define.loadData();
			},
			onChangePageSize : function(pageSize) {
			  $(define.geteid("pageSize")).val(pageSize);
			}
		});
		*/		
		<c:if test="${not empty view.onInit}">
		if (${pageId}['${view.onInit}']) {
		  ${pageId}['${view.onInit}'](${pageId}, $(${pageId}.getId("form")).serialize());
		}
		</c:if>

		cxfw2.buildAllButtons(define, "buttonArea");
		if (!define.isDialog) {
			define.loadData();
		}
	});
</script>
</head>
<body id="${pageId}_body">
	<form id="${pageId}_form" name="form" action="list" method="post">
		<input type="hidden" id="${pageId}_sortName" name="sortName" value="" /> 
		<input type="hidden" id="${pageId}_sortOrder" name="sortOrder" value="" />
		<input type="hidden" id="${pageId}_total" name="total" value="100" /> 
		<input type="hidden" id="${pageId}_pageSize" name="pageSize" value="10" />
		<input type="hidden" id="${pageId}_pageNumber" name="pageNumber" value="1" />
		<div>
			<table style="margin: 10px">
				<tr>
					<td id="${pageId}_buttonArea"></td>
				</tr>
			</table>
			<table id="${pageId}_treegrid">
				<tbody id="${pageId}_dataArea">
				</tbody>
			</table>
		</div>
	</form>
</body>
<div id="${pageId}_dialogs" style="display : none"></div>
</html>
