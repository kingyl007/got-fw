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
<script class="include" type="text/javascript" src="${pageContext.request.contextPath}/ui/common/ajax-file-uploader/ajaxfileupload.js"></script>
<script type="text/javascript">
	var ${pageId}={
	    <jsp:include page="../default_view_object.jsp" />
		initColumns : [],
			
		queryGridData: function() {
	  		<c:if test="${not empty view.onQuery}">
			if (this['${view.onQuery}']) {
				this['${view.onQuery}'](this, $(this.getId("form")).serialize());
			}
			</c:if>
		},
	}
	
	$(function() {
		<c:if test="${not empty openerId}">
			${openerId}.dialogs['${fwParam.openerActionId}'] = ${pageId};
			${pageId}.opener = ${openerId}; 
		</c:if>
		/*
		$(${pageId}.getId('importFile')).filebox({    
		    buttonText: '选择文件', 
		    buttonAlign: 'right' 
		});
		*/
		<c:if test="${not empty view.onInit}">
		if (${pageId}['${view.onInit}']) {
		  ${pageId}['${view.onInit}'](${pageId}, $(${pageId}.getId("form")).serialize());
		}
		</c:if>
		
	});
</script>
</head>
<body id="${pageId}_body">
	<form id="${pageId}_form" name="form" action="import" method="post">
		<input type="hidden" id="${pageId}_project" name="fwCoord.project" value="${view.coord.project }" />
		<input type="hidden" id="${pageId}_function" name="fwCoord.function" value="${view.coord.function }" />
		<input type="hidden" id="${pageId}_view" name="fwCoord.view" value="create" />
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
			<table style="display: none;">
				<tr>
					<td id="${pageId}_buttonArea" style="display:none">
<jsp:include page="../grid_button_area.jsp" />
					</td>
				</tr>
			</table>
			<table width="99%" cellpadding="0" cellspacing="5">
				<tr>
				<td colspan="3">
					上传文件:(<a target="_blank" href="getImportTemplate?fwCoord.function=${view.coord.function }&fwCoord.view=create&fwCoord.project=${view.coord.project }&fwCoord.lang=${view.coord.lang }&fwCoord.ui=${view.coord.ui }">模板下载</a>)
				</td>
				</tr>
				<tr><td>&nbsp;</td></tr>
				<tr><td colspan="3" align="center"><input id="${pageId}_importFile" name="importFile" type="file" style="width:300px">
				</td></tr>
			</table>
		</div>
	</form>
</body>
<div id="${pageId}_dialogs" style="display: none"></div>

</html>
