<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@page import="cn.got.platform.core.model.layout.*"%>
<%@page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<base target="_self" />
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/ui/easyui/easyui1.5.1/themes/${project.props['project.skin'] }/easyui.css" />
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/ui/easyui/easyui1.5.1/themes/color.css" />
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/ui/easyui/easyui1.5.1/themes/mobile.css" />
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/ui/easyui/easyui1.5.1/themes/icon.css" />
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/ui/easyui/admin.css" />
<!--  -->
<link rel="stylesheet" href="${pageContext.request.contextPath}/ui/common/css/font-awesome.min.css" />

<script type="text/javascript" src="${pageContext.request.contextPath}/ui/common/jquery/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/ui/common/jquery/jquery-migrate-1.2.1.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/ui/easyui/easyui1.5.1/jquery.easyui.min.js"></script>
<!-- 加了这个登录画面不能正常显示 
<script type="text/javascript" src="${pageContext.request.contextPath}/ui/easyui/easyui1.5.1/jquery.easyui.mobile.js"></script>
 -->
<!-- 
<script type="text/javascript" src="${pageContext.request.contextPath}/ui/easyui/easyui1.5.1/extension/datagrid-dnd.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/ui/easyui/easyui1.5.1/extension/jquery.edatagrid.js"></script>
 -->
<script type="text/javascript" src="${pageContext.request.contextPath}/ui/easyui/admin.js"></script>

<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/ui/easyui/cxfw2/icon.css" />
<script type="text/javascript" src="${pageContext.request.contextPath}/ui/easyui/cxfw2/cxfw2.js"></script>

<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/ui/easyui/got/icon.css" />
<script type="text/javascript" src="${pageContext.request.contextPath}/ui/easyui/got/got.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/ui/easyui/cxfw2/dgtooltip.js"></script>

<!--  activemq json -->
  <script type="text/javascript" src="${pageContext.request.contextPath}/ui/common/amq/json_amq_jquery_adapter.js"></script>
  <script type="text/javascript" src="${pageContext.request.contextPath}/ui/common/amq/json_amq.js"></script>
<!-- json -->
  <script type="text/javascript" src="${pageContext.request.contextPath}/ui/common/json/json2.js"></script>

<script type="text/javascript" src="${pageContext.request.contextPath}/ui/easyui/got/lang/${lang}.js"></script>
<c:forEach var="js" items="${view.uiMap[lang].dataMap }">
<script type="text/javascript" src="${pageContext.request.contextPath}${js.value }"></script>
</c:forEach>
