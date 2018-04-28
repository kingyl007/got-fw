<base target="_self" />
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<meta name="description" content="overview &amp; stats" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!-- bootstrap & fontawesome -->
<link rel="stylesheet" href="${ctx}/ui/common/bootstrap/css/bootstrap.min.css" />
<link rel="stylesheet" href="${ctx}/ui/common/css/font-awesome.min.css" />

<!-- page specific plugin styles -->

<!-- text fonts -->

<!-- ace styles -->
<link rel="stylesheet" href="${ctx}/ui/common/ace/css/ace.min.css" id="main-ace-style" />

<!--[if lte IE 9]>
            <link rel="stylesheet" href="${ctx}/ui/easyui/css/ace-part2.min.css" />
        <![endif]-->
<link rel="stylesheet" href="${ctx}/ui/common/ace/css/ace-skins.min.css" />
<link rel="stylesheet" href="${ctx}/ui/common/ace/css/ace-rtl.min.css" />

<!--[if lte IE 9]>
          <link rel="stylesheet" href="${ctx}/ui/common/ace/css/ace-ie.min.css" />
        <![endif]-->

<!-- inline styles related to this page -->

<!-- ace settings handler -->
<script src="${ctx}/ui/common/ace/js/ace-extra.min.js"></script>

<!-- HTML5shiv and Respond.js for IE8 to support HTML5 elements and media queries -->

<!--[if lte IE 8]>
        <script src="${ctx}/ui/common/js/html5shiv.min.js"></script>
        <script src="${ctx}/ui/common/js/respond.min.js"></script>
       <![endif]-->
<!-- basic scripts -->

<!--[if !IE]> -->
<script type="text/javascript">
            window.jQuery || document.write("<script src='${ctx}/ui/common/jquery/jquery.min.js'>"+"<"+"/script>");
        </script>

<!-- <![endif]-->

<!--[if IE]>
<script type="text/javascript">
 window.jQuery || document.write("<script src='${ctx}/ui/common/jquery/jquery1x.min.js'>"+"<"+"/script>");
</script>
<![endif]-->
<script type="text/javascript">
            if('ontouchstart' in document.documentElement) document.write("<script src='${ctx}/ui/common/jquery/jquery.mobile.custom.min.js'>"+"<"+"/script>");
        </script>
<script src="${ctx}/ui/common/bootstrap/js/bootstrap.min.js"></script>

<!-- page specific plugin scripts -->

<!--[if lte IE 8]>
          <script src="ui/easyui/js/excanvas.min.js"></script>
        <![endif]-->
<script src="${ctx}/ui/common/jquery/jquery-ui.custom.min.js"></script>
<script src="${ctx}/ui/common/jquery/jquery.ui.touch-punch.min.js"></script>
<script src="${ctx}/ui/common/jquery/jquery.easypiechart.min.js"></script>
<script src="${ctx}/ui/common/jquery/jquery.sparkline.min.js"></script>
<script src="${ctx}/ui/common/flot/jquery.flot.min.js"></script>
<script src="${ctx}/ui/common/flot/jquery.flot.pie.min.js"></script>
<script src="${ctx}/ui/common/flot/jquery.flot.resize.min.js"></script>

<!-- ace scripts -->
<script src="${ctx}/ui/common/ace/js/ace-elements.min.js"></script>
<script src="${ctx}/ui/common/ace/js/ace.min.js"></script>

<!-- the following scripts are used in demo only for onpage help and you don't need them -->
<link rel="stylesheet" href="${ctx}/ui/common/ace/css/ace.onpage-help.css" />
<link rel="stylesheet" href="${ctx}/ui/common/docs/assets/js/themes/sunburst.css" />

<script type="text/javascript"> ace.vars['base'] = '${ctx}'; </script>
<script src="${ctx}/ui/common/ace/js/elements.onpage-help.js"></script>
<script src="${ctx}/ui/common/ace/js/ace.onpage-help.js"></script>
<script src="${ctx}/ui/common/docs/assets/js/rainbow.js"></script>
<script src="${ctx}/ui/common/docs/assets/js/language/generic.js"></script>
<script src="${ctx}/ui/common/docs/assets/js/language/html.js"></script>
<script src="${ctx}/ui/common/docs/assets/js/language/css.js"></script>
<script src="${ctx}/ui/common/docs/assets/js/language/javascript.js"></script>

<script src="${ctx}/ui/common/bootstrap/bootstrap-tab.js"></script>

<!-- json -->
  <script type="text/javascript" src="${ctx}/ui/common/json/json2.js"></script>

<script type="text/javascript" src="${ctx}/ui/easyui/cxfw2/cxfw2.js"></script>

<link rel="stylesheet" type="text/css" href="${ctx}/ui/easyui/got/icon.css" />
<script type="text/javascript" src="${ctx}/ui/easyui/got/got.js"></script>

<script type="text/javascript" src="${ctx}/ui/easyui/got/lang/${lang}.js"></script>

<c:forEach var="js" items="${view.uiMap[lang].dataMap }">
<script type="text/javascript" src="${ctx}${js.value }"></script>
</c:forEach>
