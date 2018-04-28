<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@page import="cn.got.platform.core.model.layout.*"%>
<%@page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
  <!-- Bootstrap 3.3.6 -->
  <link rel="stylesheet" href="${pageContext.request.contextPath}/ui/common/adminlte2.3.11/bootstrap/css/bootstrap.min.css" />
  <!-- Font Awesome -->
<link rel="stylesheet" href="${pageContext.request.contextPath}/ui/common/css/font-awesome.min.css" />
  <!-- Ionicons -->
  <link rel="stylesheet" href="${pageContext.request.contextPath}/ui/common/adminlte2.3.11/css/ionicons.min.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="${pageContext.request.contextPath}/ui/common/adminlte2.3.11/dist/css/AdminLTE.min.css">
  <!-- AdminLTE Skins. Choose a skin from the css/skins
       folder instead of downloading all of them to reduce the load. -->
  <link rel="stylesheet" href="${pageContext.request.contextPath}/ui/common/adminlte2.3.11/dist/css/skins/_all-skins.min.css">
  <!-- iCheck -->
  <link rel="stylesheet" href="${pageContext.request.contextPath}/ui/common/adminlte2.3.11/plugins/iCheck/flat/blue.css">
  <!-- Morris chart -->
  <link rel="stylesheet" href="${pageContext.request.contextPath}/ui/common/adminlte2.3.11/plugins/morris/morris.css">
  <!-- jvectormap -->
  <link rel="stylesheet" href="${pageContext.request.contextPath}/ui/common/adminlte2.3.11/plugins/jvectormap/jquery-jvectormap-1.2.2.css">
  <!-- Date Picker -->
  <link rel="stylesheet" href="${pageContext.request.contextPath}/ui/common/adminlte2.3.11/plugins/datepicker/datepicker3.css">
  <!-- Daterange picker -->
  <link rel="stylesheet" href="${pageContext.request.contextPath}/ui/common/adminlte2.3.11/plugins/daterangepicker/daterangepicker.css">
  <!-- bootstrap wysihtml5 - text editor -->
  <link rel="stylesheet" href="${pageContext.request.contextPath}/ui/common/adminlte2.3.11/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.min.css">

  <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  <!--[if lt IE 9]>
  <script src="${pageContext.request.contextPath}/ui/common/html5shiv.min.js"></script>
  <script src="${pageContext.request.contextPath}/ui/common/respond.min.js"></script>
  <![endif]-->

<!-- jQuery 2.2.3 -->
<script src="${pageContext.request.contextPath}/ui/common/adminlte2.3.11/plugins/jQuery/jquery-2.2.3.min.js"></script>

<script src="${pageContext.request.contextPath}/ui/common/toastr/toastr.min.js"></script>
<link rel="stylesheet" href="${pageContext.request.contextPath}/ui/common/toastr/toastr.min.css">

<script src="${pageContext.request.contextPath}/ui/common/bootstrap/bootstrap-tab.js"></script>

<script type="text/javascript" src="${pageContext.request.contextPath}/ui/easyui/cxfw2/cxfw2.js"></script>

<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/ui/easyui/got/icon.css" />
<script type="text/javascript" src="${pageContext.request.contextPath}/ui/easyui/got/got.js"></script>

<!--  activemq json -->
  <script type="text/javascript" src="${pageContext.request.contextPath}/ui/common/amq/json_amq_jquery_adapter.js"></script>
  <script type="text/javascript" src="${pageContext.request.contextPath}/ui/common/amq/json_amq.js"></script>
  
<!-- json -->
  <script type="text/javascript" src="${pageContext.request.contextPath}/ui/common/json/json2.js"></script>
  

<script type="text/javascript" src="${pageContext.request.contextPath}/ui/easyui/got/lang/${lang}.js"></script>

<c:forEach var="js" items="${view.uiMap[lang].dataMap }">
<script type="text/javascript" src="${pageContext.request.contextPath}${js.value }"></script>
</c:forEach>