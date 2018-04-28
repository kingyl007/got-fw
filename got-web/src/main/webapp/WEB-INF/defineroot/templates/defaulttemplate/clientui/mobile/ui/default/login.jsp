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
<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>${view.title} - ${project.props['project.name'] }</title>
<%
	if (!"1".equals(request.getAttribute("showAsDialog"))) {
%>
<jsp:include page="../header.jsp"></jsp:include>
<%
  }
%>

<script type="text/javascript">
	var ${pageId}={
	    <jsp:include page="../default_view_object.jsp" />
		validate : function() {
			return true;
		},
		
	};
	
	$(function() {
		var length = $("input").length;
		$("input").each(function(index, ctl) {
			if ($(ctl).attr("ui")) {
				// $(ctl).textbox("button").attr("disabled",true); 
				$(ctl).textbox("textbox").bind("keyup", function(event) {
					if (event.keyCode == 13) {
						// keyup事件是直接在easyui中的textbox组件中激发，此时值还没有反馈到easyui组件中，（或许是easyui的bug，校验可以通过，但值无法通过提交到后台）
						// $(ctl).textbox("setValue", $(ctl).textbox("textbox").val());
						${pageId}.doLogin(${pageId});
					}
				});
			}
		});
		
		<c:if test="${not empty view.onInit}">
		if (${pageId}['${view.onInit}']) {
		  ${pageId}['${view.onInit}'](${pageId}, $(${pageId}.getId("form")).serialize());
		}
		</c:if>
	});
</script>
</head>

<body>
	<form id="${pageId}_form" name="loginForm" method="post" action="login">
		<input type="hidden" id="${pageId}_project" name="fwCoord.project" value="${view.coord.project }" /> 
		<input type="hidden" id="${pageId}_function" name="fwCoord.function" value="${view.coord.function }" /> 
		<input type="hidden" id="${pageId}_view" name="fwCoord.view" value="${view.coord.view }" />
		<input type="hidden" id="${pageId}_lang" name="fwCoord.lang" value="${view.coord.lang }" /> 
		<input type="hidden" id="${pageId}_ui" name="fwCoord.ui" value="${view.coord.ui }" />
    <div class="easyui-navpanel">
        <header>
            <div class="m-toolbar">
                <span class="m-title">${project.props['project.name'] }</span>
            </div>
        </header>
        <div style="margin:20px auto;width:100px;height:100px;border-radius:100px;overflow:hidden">
            <img src="${project.props['project.login.logo'] }" style="margin:0;width:100%;height:100%;">
        </div>
        <div style="padding:0 20px">
        
			<c:forEach var="col" items="${view.columns}" varStatus="status">
				<c:set var="visible" value="true"/>
				<c:set var="icon" value=""/>
				<c:set var="coltype" value="easyui-textbox"/>
				<c:set var="val" value="" />
				<c:choose>
				<c:when test="${col.field=='CUSTOMER_ID'&&project.props['login.useCustomerId']!='true'}">
					<c:set var="visible" value="false"/>
				</c:when>
				<c:when test="${col.field=='CUSTOMER_ID'}">
					<c:set var="visible" value="true"/>
					<c:set var="val" value="${CUSTOMER_ID }" />
				</c:when>
				<c:when test="${col.field=='USER_ACCOUNT'}">
					<c:set var="icon" value="iconCls:'icon-man'," />
					<c:set var="val" value="${USER_ACCOUNT }" />
				</c:when>
				<c:when test="${col.field=='PASSWORD' }">
					<c:set var="icon" value="iconCls:'icon-lock'," />
					<c:set var="coltype" value="easyui-passwordbox" />
				</c:when>
				</c:choose>
				<c:if test="${visible =='true'}">
					<div style="text-align:center;margin-bottom:10px">
						<input id="${pageId }_${col.id }" value="${val }"
							name="${col.field }"  style="width:90%;height:38px" class="${coltype }"
							data-options="prompt:'${not empty col.label?col.label:col.field }',tipPosition:'right', novalidate:true,validateOnCreate:false,validateOnBlur:true,delay:0,${icon }required:${col.required },validType:[<c:if test="${not empty col.size && col.size > 0}">'length[0,${col.size}]'</c:if>], readonly:${!col.editable }" ui="${coltype }"/>
					</div>
				</c:if>
			</c:forEach>

			<c:forEach var="act" items="${view.actions}" varStatus="status">
			    <div style="text-align:center;margin-top:30px">
					<a class="easyui-linkbutton"  id="${pageId }_action_${act.id}" 
					iconCls="${act.icon }"  style="width:90%;height:40px"
					data-options="plain:false,size:'large'" href="javascript:${pageId}.${act.click }(${pageId}, null, '${act.id }', null, event)"
					><span style="font-size:16px">${act.label }</span></a>
			    </div>
			</c:forEach>
			<font color="red" id="loginErrorMsg" size="2">${(not empty loginResult && !loginResult)?'用户名或密码错误':'' }</font>
        </div>
    </div>
    </form>
</body>  
</html>
