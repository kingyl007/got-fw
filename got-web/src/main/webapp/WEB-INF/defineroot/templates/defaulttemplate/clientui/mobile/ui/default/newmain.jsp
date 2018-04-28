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
	if (!"1".equals(request.getAttribute("isDialog"))) {
%>
<jsp:include page="../header.jsp"></jsp:include>
<%
	}
%>
<script type="text/javascript">

var ${pageId}={
    <jsp:include page="../default_view_object.jsp" />
		
		queryGridData: function() {
		},
}
	
    $(window).resize(function(){  
        var height1 = $(window).height() - 20;  
        $(${pageId}.getId("layout")).attr("style","width:100%;height:"+height1+"px");  
        $(${pageId}.getId("layout")).layout("resize",{  
            width:"100%",  
            height:height1+"px"  
        });  
    });
	
	$(function() {
	       var height1 = $(window).height() - 20;  
	        $(${pageId}.getId("layout")).attr("style","width:100%;height:"+height1+"px");  
	        $(${pageId}.getId("layout")).layout("resize",{  
	            width:"100%",  
	            height:height1+"px"  
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
    <div id="${pageId }_layout" class="easyui-layout"  style="width:100%; height:680px; margin-left:0px; border:0">  
        <!-- 北方 -->  
        <div data-options="region:'north'" style="height: 40px;background-color:#95B8E7;">  
            <span style="margin-left:0.5%;">  
                <font size="3" style="line-height: 2.0em;" color="white" >  
                    <b>${project.props['project.name'] }</b>  
                </font>  
            </span>  
              
            <span style="float:right;margin-top:10px;margin-right:20px;">  
                <font size="3" color="white">欢迎 :Admin</font>      
                <a href="/loginOut.do" > <font size="3" color="red">退出</font> </a>  
            </span>  
        </div>  
          
        <!-- 西方 -->  
        <div data-options="region:'west',split:true" title="功能" style="width: 200px;">  
            <div class="easyui-accordion"  data-options="fit:true,border:false">  
<c:if test="${displayActions != null }">
	<c:forEach var="act" items="${displayActions}" varStatus="status">
		<c:if test="${act.tag=='group' }">
			<div id="${pageId }_action_${act.id}" title="${act.title }" data-options="iconCls:'${act.icon }'" style="overflow:auto;padding:10px;">
				<c:forEach var="subAct" items="${act.children}" varStatus="subStatus">
					<a class="easyui-linkbutton" id="${pageId }_action_${subAct.id}" 
					iconCls="${subAct.icon }" 
					data-options="plain:true" style="width:100%;"
					href="javascript:${pageId}.${subAct.click }(${pageId}, null, '${subAct.id }', null)">${subAct.label }</a><br>
				</c:forEach>
			</div>
		</c:if>
	</c:forEach>
</c:if>						
                  
            </div>  
        </div>  
        <!-- 中间 -->  
        <div data-options="region:'center',title:'',iconCls:'icon-ok'">  
            <div id="tTabs" class="easyui-tabs" data-options="fit:true,border:false,plain:true">  
                <div title="首页"  
                    data-options="closable:false"  
                    style="overflow: auto; padding: 20px;">  
                </div>  
            </div>  
        </div>  
        <!-- 南方 -->  
        <div data-options="region:'south',split:true" style="height:30px;background-color:#95B8E7;">  
            <div style="" align="center">  
                <font size="" color="white">${project.props['project.copyright'] }</font>  
            </div>  
        </div>  
    </div>  
</body>
<div id="${pageId}_dialogs" style="display: none"></div>

</html>