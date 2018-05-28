<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ page trimDirectiveWhitespaces="true"%>
<%@page import="cn.got.platform.core.model.layout.*"%>
<%@page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>

<!DOCTYPE html>
<html lang="zh">
<head>
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
		
		passwordFromCookie : false,
	};
	
	
	$(function() {
		var cookieUser = got.getCookie('${view.coord.project}_login_userid');
		var cookiePassword = got.getCookie('${view.coord.project}_login_password');
		$(${pageId}.getId('USER_ACCOUNT')).textbox('setValue', cookieUser);
		$(${pageId}.getId('PASSWORD')).textbox('setValue', cookiePassword);
		if (cookieUser != null && cookiePassword != null) {
			$(${pageId}.getId('remember_password')).attr('checked', true);
			${pageId}.passwordFromCookie = true;
		}
		var length = $("input").length;
		$("input").each(function(index, ctl) {
			if ($(ctl).attr("ui")) {
				// $(ctl).textbox("button").attr("disabled",true); 
				$(ctl).textbox("textbox").bind("keyup", function(event) {
					if (event.keyCode == 13) {
						// keyup事件是直接在easyui中的textbox组件中激发，此时值还没有反馈到easyui组件中，（或许是easyui的bug，校验可以通过，但值无法通过提交到后台）
						$(ctl).textbox("setValue", $(ctl).textbox("textbox").val());
						${pageId}.doLogin(${pageId});
					}
					${pageId}.passwordFromCookie = false;
				});
			}
		});
		
		<c:if test="${not empty view.onInit}">
		if (${pageId}['${view.onInit}']) {
		  ${pageId}['${view.onInit}'](${pageId}, $(${pageId}.getId("form")).serialize());
		}
		</c:if>
		<c:if test="${not empty loginResult && !loginResult}">
			$.messager.alert('提示', "${not empty loginMsg?loginMsg:'用户名或密码错误'}", 'error');
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
		<table width="95%" height="600">
			<tr>
				<td align="center">
					<div id="${pageId}_inputPanel">
						${project.props['project.name'] }
						<table id="${pageId}_formTable">
							<c:forEach var="col" items="${view.columns}" varStatus="status">
								<c:set var="visible" value="true" />
								<c:set var="icon" value="" />
								<c:set var="coltype" value="type='text'" />
								<c:set var="val" value="" />
								<c:choose>
								<c:when test="${col.field=='CUSTOMER_ID'&&project.props['login.useCustomerId']!='true'}">
										<c:set var="visible" value="false" />
									</c:when>
									<c:when test="${col.field=='CUSTOMER_ID'}">
										<c:set var="visible" value="true" />
										<c:set var="val" value="${CUSTOMER_ID }" />
									</c:when>
									<c:when test="${col.field=='USER_ACCOUNT'}">
										<c:set var="icon" value="iconCls:'icon-man'," />
										<c:set var="val" value="${USER_ACCOUNT }" />
									</c:when>
									<c:when test="${col.field=='PASSWORD' }">
										<c:set var="icon" value="iconCls:'icon-lock'," />
										<c:set var="coltype" value="type='password'" />
									</c:when>
								</c:choose>
								<c:if test="${visible =='true'}">
									<tr class="trEdit">
									<td class="tdEdit" nowrap>
										<c:if test="${ col.label!=null}">
											${col.label }:
										</c:if> 
										<c:if test="${col.label==null}">
											${col.field }:
										</c:if>
									</td>
									<td>
										<input ${coltype } id="${pageId }_${col.id }" value="${val }"
											name="${col.field }" style="width: 200px; height: 30px" class="easyui-textbox"
											data-options="novalidate:true,validateOnCreate:false,validateOnBlur:true,delay:0,${icon }required:${col.required },validType:[<c:if test="${not empty col.size && col.size > 0}">'length[0,${col.size}]'</c:if>], readonly:${!col.editable }" ui="easyui-textbox"/>
									</td>
									</tr>
								</c:if>
							</c:forEach>
								<tr><td>&nbsp;</td><td></td></tr>
								<tr><td></td><td align="right"><input id="${pageId }_remember_password" type="checkbox" name="remember_password" value="1"/> <label for="${pageId }_remember_password">记住密码</label></td></tr>
								<tr><td>&nbsp;</td><td></td></tr>
							<tr>
								<td></td>
							<td id="${pageId}_buttonArea" colspan="2" align="center">
<c:forEach var="act" items="${view.actions}" varStatus="status">
										<a class="easyui-linkbutton" id="${pageId }_action_${act.id}"
											iconCls="${act.icon }"
											data-options="plain:false,size:'large'"
											onclick="javascript:${pageId}.${act.click }(${pageId}, null, '${act.id }', null, event)">${act.label }</a>
</c:forEach>
							</td>
							</tr>
							<tr><td>&nbsp;</td></tr>
							<tr>
								<td></td>
								<td colspan="2" align="center"><a href="#" title="" style="text-decoration: none;">版本:<%=cn.got.platform.fw.jfinal.core.GotConst.getVersion() %></a></td>
							</tr>
						</table>
					</div>
					<table>
					</table>
				</td>
			</tr>
		</table>
	</form>
</body>
</html>
