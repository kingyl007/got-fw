<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@page import="cn.got.platform.core.model.layout.*"%>
<%@page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %> 
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<c:redirect url="${ctx}/ui/antd/clientui/fw/${view.coord.view }/${view.coord.view }.html?fwCoord.view=${view.coord.view }&fwCoord.project=${view.coord.project }&fwCoord.function=${view.coord.function }&fwCoord.ui=antd&fwCoord.lang=${view.coord.lang }" />
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
	<head>
		<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
		<meta charset="UTF-8">
		<title>${view.title} - ${project.props['project.name'] }</title>
	</head>
</html>