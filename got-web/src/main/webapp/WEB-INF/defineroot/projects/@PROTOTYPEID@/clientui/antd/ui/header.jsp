<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@page import="cn.got.platform.core.model.layout.*"%>
<%@page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<base target="_self" />
<link rel="stylesheet" type="text/css" href="${ctx}/ui/easyui/easyui1.4/themes/${project.props['project.skin'] }/easyui.css" />
<link rel="stylesheet" type="text/css" href="${ctx}/ui/easyui/easyui1.4/themes/color.css" />
<link rel="stylesheet" type="text/css" href="${ctx}/ui/easyui/easyui1.4/themes/icon.css" />
<link rel="stylesheet" type="text/css" href="${ctx}/ui/easyui/admin.css" />
<!--  -->
<link rel="stylesheet" href="${ctx}/ui/common/css/font-awesome.min.css" />

<script type="text/javascript" src="${ctx}/ui/common/jquery/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="${ctx}/ui/common/jquery/jquery-migrate-1.2.1.min.js"></script>
<script type="text/javascript" src="${ctx}/ui/easyui/easyui1.4/jquery.easyui.min.js"></script>
<script type="text/javascript" src="${ctx}/ui/easyui/easyui1.4/extension/datagrid-dnd.js"></script>
<script type="text/javascript" src="${ctx}/ui/easyui/easyui1.4/extension/jquery.edatagrid.js"></script>
<script type="text/javascript" src="${ctx}/ui/easyui/admin.js"></script>

<link rel="stylesheet" type="text/css" href="${ctx}/ui/easyui/cxfw2/icon.css" />
<script type="text/javascript" src="${ctx}/ui/easyui/cxfw2/cxfw2.js"></script>

<link rel="stylesheet" type="text/css" href="${ctx}/ui/easyui/got/icon.css" />
<script type="text/javascript" src="${ctx}/ui/easyui/got/got.js"></script>
<script type="text/javascript" src="${ctx}/ui/easyui/cxfw2/dgtooltip.js"></script>

<script class="include" type="text/javascript" src="${ctx}/ui/common/ajax-file-uploader/ajaxfileupload.js"></script>

<!--  activemq json -->
  <script type="text/javascript" src="${ctx}/ui/common/amq/json_amq_jquery_adapter.js"></script>
  <script type="text/javascript" src="${ctx}/ui/common/amq/json_amq.js"></script>

<!-- json -->
  <script type="text/javascript" src="${ctx}/ui/common/json/json2.js"></script>
  
  <link rel="stylesheet" href="${ctx}/ui/lib/colorpicker/css/colorpicker.css" type="text/css" />
  <link rel="stylesheet" href="${ctx}/ui/lib/colorpicker/css/layout.css"  media="screen" type="text/css" />
  <script type="text/javascript" src="${ctx}/ui/lib/colorpicker/js/colorpicker.js"></script>
  <script type="text/javascript" src="${ctx}/ui/lib/colorpicker/js/eye.js"></script>
  <script type="text/javascript" src="${ctx}/ui/lib/colorpicker/js/utils.js"></script>

  <script type="text/javascript" charset="utf-8" src="${ctx}/ui/lib/ueditor1433/ueditor.config.js"></script>
  <script type="text/javascript" charset="utf-8" src="${ctx}/ui/lib/ueditor1433/ueditor.all.min.js"> </script>
  <!--建议手动加在语言，避免在ie下有时因为加载语言失败导致编辑器加载失败-->
  <!--这里加载的语言文件会覆盖你在配置项目里添加的语言类型，比如你在配置项目里配置的是英文，这里加载的中文，那最后就是中文-->
  <script type="text/javascript" charset="utf-8" src="${ctx}/ui/lib/ueditor1433/lang/zh-cn/zh-cn.js"></script>

<script type="text/javascript" src="${ctx}/ui/easyui/got/lang/${lang}.js"></script>
<c:forEach var="js" items="${view.uiMap[lang].dataMap }">
<script type="text/javascript" src="${ctx}${js.value }"></script>
</c:forEach>



