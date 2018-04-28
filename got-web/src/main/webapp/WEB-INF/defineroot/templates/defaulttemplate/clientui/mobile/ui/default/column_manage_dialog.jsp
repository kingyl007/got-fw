<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@page import="cn.got.platform.core.model.layout.*"%>
<%@page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html>
<html lang="zh">
<head>
<title>${view.title }</title>
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
	if (!"1".equals(request.getAttribute("showAsDialog"))) {
%>
<jsp:include page="../header.jsp"></jsp:include>
<%
	}
%>
<script type="text/javascript">
	var ${pageId}={
	    <jsp:include page="../default_view_object.jsp" />
		initColumns : [],
		validate : function() {
			return true;
		},
		queryGridData: function() {
	  		<c:if test="${not empty view.onQuery}">
			if (this['${view.onQuery}']) {
				this['${view.onQuery}'](this, $(this.getId("form")).serialize());
			}
			</c:if>
		},
		setColumns : function(columnsArr) {
		  console.info(this);
		    var fromRows = [];
		    var toRows = [];
		  if (columnsArr.length > 0) {
		    var columns = columnsArr[0];
		    this.initColumns = columns; 
		    $.each(columns, function(i,col) {
		      if (col.field && (col.field != 'ck' /*&& col.field != '_FW_ACTIONS'*/)) {
			      if (col.hidden) {
			        if (col.toUser) {
			        	fromRows.push({"ID":col.field,"TITLE":col.title,"WIDTH":col.width});
			        }
			      } else {
			        toRows.push({"ID":col.field,"TITLE":col.title,"WIDTH":col.width})
			      }
		      }
		    });
		  } else {
		    this.initColumns = [];
		  }
		    $(${pageId}.getId("fromDatagrid")).datagrid("loadData", fromRows);
		    $(${pageId}.getId("toDatagrid")).datagrid("loadData", toRows);
			$(${pageId}.getId("toDatagrid")).datagrid("enableDnd");
		},
		moveRowsTo : function(fromgd, togd) {
		  var selectedRows = fromgd.datagrid("getSelections");
		  if (selectedRows.length > 0) {
		    var targetRow = togd.datagrid("getSelected");
		    var targetIndex;
		    if (targetRow != null) {
		      targetIndex = togd.datagrid("getRowIndex", targetRow);
		    } else {
		      targetIndex = togd.datagrid("getRows").length;
		    }
		    for (var i = 0; i <selectedRows.length; ++i) {
		      togd.datagrid("insertRow",{index:targetIndex++,row:selectedRows[i]});
		      fromgd.datagrid("deleteRow", fromgd.datagrid("getRowIndex", selectedRows[i]));
		    }
		    togd.datagrid("scrollTo", targetIndex-1);
			$(${pageId}.getId("toDatagrid")).datagrid("enableDnd");
		  }
		},
		removeFromSelected: function(view) {
		  
		},
	}
	
	$(function() {
		<c:if test="${not empty openerId}">
			${openerId}.dialogs['${fwParam.openerActionId}'] = ${pageId};
			${pageId}.opener = ${openerId}; 
		</c:if>
		$(${pageId}.getId("fromDatagrid")).datagrid(
			{
		        fitColumns : true,
		        striped : true,
		        rownumbers : true,
		        ctrlSelect : true,
				title : "待选列",
				columns : [[ 
	{ field: 'ID', title: 'ID', width: 150, sortable: false,resizable : true, hidden:true}
	,{ field: 'TITLE', title: '列名', width: 150, sortable: false,resizable : true, hidden:false}
	,{ field: 'WIDTH', title: '列宽', width: 150, sortable: false,resizable : true, hidden:true}
				           ]],
			});
		
		$(${pageId}.getId("toDatagrid")).datagrid(
				{
			        fitColumns : true,
			        striped : true,
			        rownumbers : true,
			        ctrlSelect : true,
					title : "已选列",
					columns : [[ 
		{ field: 'ID', title: '列名', width: 150, sortable: false,resizable : true, hidden:true}
		,{ field: 'TITLE', title: '列名', width: 150, sortable: false,resizable : true, hidden:false}
		,{ field: 'WIDTH', title: '列宽', width: 150, sortable: false,resizable : true, hidden:true,
	      editor:{  
	        type:'numberbox',  
	        options:{  
	            valueField:'WIDTH',  
	            textField:'WIDTH',  
	        }  
	      }
		}
					           ]],
				});
		
		<c:if test="${not empty view.onInit}">
		if (${pageId}['${view.onInit}']) {
		  ${pageId}['${view.onInit}'](${pageId}, $(${pageId}.getId("form")).serialize());
		}
		</c:if>
		
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
	
		<input type="hidden" id="${pageId}_sortName" name="fwParam.sortName" value="" />
		<input type="hidden" id="${pageId}_sortOrder" name="fwParam.sortOrder" value="" /> 		
		
		<input type="hidden" id="${pageId}_openerFunction" name="fwParam.openerFunction" value="${fwParam.openerFunction }" />
		<input type="hidden" id="${pageId}_openerView" name="fwParam.openerView" value="${fwParam.openerView }" />
		<input type="hidden" id="${pageId}_openerActionId" name="fwParam.openerActionId" value="${fwParam.openerActionId }" />
		
		<div>
			<table style="margin: 10px">
				<tr>
					<td id="${pageId}_buttonArea" style="display:none">
<jsp:include page="../grid_button_area.jsp" />
					</td>
				</tr>
			</table>
			<table width="99%">
				<tr>
				<td width="50%" valign="top">
					<table id="${pageId}_fromDatagrid" width="100%" style="height: ${not empty view.height?(view.height - 110):290}px;">
						<tbody id="${pageId}_fromDataArea">
<c:if test="${view.columns != null }">
<c:forEach var="instance" items="${view.columns}" varStatus="status">
<c:if test="${instance.toView && !instance.visible}" >
<tr>
<td>
	${instance.label }
</td>
</tr>
</c:if>
</c:forEach>
</c:if>
						</tbody>
					</table>
				</td>
				<td nowrap="nowrap" valign="middle">
					&nbsp;<input type="button" value="&nbsp;-->&nbsp;" onclick="${pageId}.moveRowsTo($(${pageId}.getId('fromDatagrid')),$(${pageId}.getId('toDatagrid')))"/>&nbsp;<br>
					<br>
					&nbsp;<input type="button" value="&nbsp;<--&nbsp;"  onclick="${pageId}.moveRowsTo($(${pageId}.getId('toDatagrid')),$(${pageId}.getId('fromDatagrid')))"/>&nbsp;
				</td>
				<td width="50%" valign="top">
					<table id="${pageId}_toDatagrid" width="100%" style="height: ${not empty view.height?(view.height - 110):290}px;">
						<tbody id="${pageId}_toDataArea">
<c:if test="${view.columns != null }">
<c:forEach var="instance" items="${view.columns}" varStatus="status">
<c:if test="${instance.toView && instance.visible}" >
<tr>
<td>
	${instance.label }
</td>
<td>
	${instance.width }
</td>
</tr>
</c:if>
</c:forEach>
</c:if>
						</tbody>
					</table>
				</td>
				</tr>
			</table>
			<!-- 
			<div id="${pageId}_pagination" class="easyui-pagination"
				style="background: #efefef; border: 1px solid #ccc;"
				data-options="showPageList:false,showRefresh:false"></div>
			 -->
		</div>
	</form>
</body>
<div id="${pageId}_dialogs" style="display: none"></div>

</html>