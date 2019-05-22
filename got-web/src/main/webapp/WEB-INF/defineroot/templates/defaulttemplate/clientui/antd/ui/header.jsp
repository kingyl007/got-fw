<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@page import="cn.got.platform.core.model.layout.*"%>
<%@page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<base target="_self" />

<script src="${ctx}/ui/vuel/js/jquery-3.1.1.min.js"></script>
<script src="${ctx}/ui/vuel/js/json2.js"></script>

<script src="${ctx}/ui/antd/react/react.development.js"></script>  
<script src="${ctx}/ui/antd/react/react-dom.development.js"></script>
<script src="${ctx}/ui/antd/react/browser.min.js"></script>  

<script src="${ctx}/ui/antd/antd2.13.14/antd.js"></script>
<link rel="stylesheet" href="${ctx}/ui/antd/antd2.13.14/antd.css">


<link rel="stylesheet" href="${ctx}/ui/common/css/font-awesome.min.css" />

<script type="text/javascript" src="${ctx}/ui/antd/got/got.js"></script>

<!-- 
<script type="text/javascript" src="${ctx}/ui/antd/got/lang/${lang}.js"></script>
 -->
<c:forEach var="js" items="${view.uiMap[lang].dataMap }">
<script type="text/javascript" src="${ctx}${js.value }"></script>
</c:forEach>
