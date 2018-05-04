<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@page import="cn.got.platform.core.model.layout.*"%>
<%@page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
  <!-- Ionicons -->
  <link rel="stylesheet" href="${ctx}/ui/lib/adminlte2.3.11/css/ionicons.min.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="${ctx}/ui/lib/adminlte2.3.11/dist/css/AdminLTE.min.css">
  <!-- AdminLTE Skins. Choose a skin from the css/skins
       folder instead of downloading all of them to reduce the load. -->
  <link rel="stylesheet" href="${ctx}/ui/lib/adminlte2.3.11/dist/css/skins/_all-skins.min.css">
  <!-- iCheck -->
  <link rel="stylesheet" href="${ctx}/ui/lib/adminlte2.3.11/plugins/iCheck/flat/blue.css">
  <!-- Morris chart -->
  <link rel="stylesheet" href="${ctx}/ui/lib/adminlte2.3.11/plugins/morris/morris.css">
  <!-- jvectormap -->
  <link rel="stylesheet" href="${ctx}/ui/lib/adminlte2.3.11/plugins/jvectormap/jquery-jvectormap-1.2.2.css">
  <!-- Date Picker -->
  <link rel="stylesheet" href="${ctx}/ui/lib/adminlte2.3.11/plugins/datepicker/datepicker3.css">
  <!-- Daterange picker -->
  <link rel="stylesheet" href="${ctx}/ui/lib/adminlte2.3.11/plugins/daterangepicker/daterangepicker.css">
  <!-- bootstrap wysihtml5 - text editor -->
  <link rel="stylesheet" href="${ctx}/ui/lib/adminlte2.3.11/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.min.css">

<!-- jQuery 2.2.3 -->
<script src="${ctx}/ui/lib/adminlte2.3.11/plugins/jQuery/jquery-2.2.3.min.js"></script>

  <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  <!--[if lt IE 9]>
  <script src="${ctx}/ui/lib/html5shiv.min.js"></script>
  <script src="${ctx}/ui/lib/respond.min.js"></script>
  <![endif]-->

<!-- jQuery UI 1.11.4 -->
<script src="${ctx}/ui/lib/adminlte2.3.11/plugins/jQueryUI/jquery-ui.min.js"></script>

  <!-- Font Awesome -->
<link rel="stylesheet" href="${ctx}/ui/lib/font-awesome/font-awesome.min.css" />

  <!-- Bootstrap 3.3.6 -->
<link rel="stylesheet" href="${ctx}/ui/lib/adminlte2.3.11/bootstrap/css/bootstrap.min.css" />

<script src="${ctx}/ui/lib/bootstrap/bootstrap-tab.js"></script>


<!-- Resolve conflict in jQuery UI tooltip with Bootstrap tooltip -->
<script>
	if ($.widget && $.widget.bridge) {
  		$.widget.bridge('uibutton', $.ui.button);
	}
	var eve = {on:function() {}};
	var rangy = {};
</script>

<!-- Morris.js charts -->
<script src="${ctx}/ui/lib/adminlte2.3.11/plugins/morris/raphael-min.js"></script>
<script src="${ctx}/ui/lib/adminlte2.3.11/plugins/morris/morris.min.js"></script>
<!-- Sparkline -->
<script src="${ctx}/ui/lib/adminlte2.3.11/plugins/sparkline/jquery.sparkline.min.js"></script>
<!-- jvectormap -->
<script src="${ctx}/ui/lib/adminlte2.3.11/plugins/jvectormap/jquery-jvectormap-1.2.2.min.js"></script>
<script src="${ctx}/ui/lib/adminlte2.3.11/plugins/jvectormap/jquery-jvectormap-world-mill-en.js"></script>
<!-- jQuery Knob Chart -->
<script src="${ctx}/ui/lib/adminlte2.3.11/plugins/knob/jquery.knob.js"></script>
<!-- daterangepicker -->
<script src="${ctx}/ui/lib/adminlte2.3.11/plugins/daterangepicker/moment.min.js"></script>
<script src="${ctx}/ui/lib/adminlte2.3.11/plugins/daterangepicker/daterangepicker.js"></script>
<!-- datepicker -->
<script src="${ctx}/ui/lib/adminlte2.3.11/plugins/datepicker/bootstrap-datepicker.js"></script>
<!-- Bootstrap WYSIHTML5 -->
<script src="${ctx}/ui/lib/adminlte2.3.11/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min.js"></script>
<!-- Slimscroll -->
<script src="${ctx}/ui/lib/adminlte2.3.11/plugins/slimScroll/jquery.slimscroll.min.js"></script>
<!-- FastClick -->
<script src="${ctx}/ui/lib/adminlte2.3.11/plugins/fastclick/fastclick.js"></script>
<!-- AdminLTE App -->
<script src="${ctx}/ui/lib/adminlte2.3.11/dist/js/app.min.js"></script>

<script src="${ctx}/ui/lib/toastr/toastr.min.js"></script>
<link rel="stylesheet" href="${ctx}/ui/lib/toastr/toastr.min.css">

<link rel="stylesheet" type="text/css" href="${ctx}/ui/easyui/got/icon.css" />
<script type="text/javascript" src="${ctx}/ui/easyui/got/got.js"></script>

<!--  activemq json -->
  <script type="text/javascript" src="${ctx}/ui/lib/amq/json_amq_jquery_adapter.js"></script>
  <script type="text/javascript" src="${ctx}/ui/lib/amq/json_amq.js"></script>
  
<!-- json -->
  <script type="text/javascript" src="${ctx}/ui/lib/json/json2.js"></script>
  

<script type="text/javascript" src="${ctx}/ui/easyui/got/lang/${lang}.js"></script>

<c:forEach var="js" items="${view.uiMap[lang].dataMap }">
<script type="text/javascript" src="${ctx}${js.value }"></script>
</c:forEach>=