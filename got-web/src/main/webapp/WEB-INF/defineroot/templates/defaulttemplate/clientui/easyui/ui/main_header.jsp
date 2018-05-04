<base target="_self" />
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<meta name="description" content="overview &amp; stats" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!-- bootstrap & fontawesome -->
<link rel="stylesheet" href="${ctx}/ui/lib/font-awesome/font-awesome.min.css" />

<!--[if !IE]> -->
<script type="text/javascript">
            window.jQuery || document.write("<script src='${ctx}/ui/lib/jquery-1.10.2/jquery.min.js'>"+"<"+"/script>");
        </script>

<!-- <![endif]-->

<!--[if IE]>
<script type="text/javascript">
 window.jQuery || document.write("<script src='${ctx}/ui/lib/jquery-1.10.2/jquery1x.min.js'>"+"<"+"/script>");
</script>
<![endif]-->
<script type="text/javascript">
    if('ontouchstart' in document.documentElement) document.write("<script src='${ctx}/ui/lib/jquery-1.10.2/jquery.mobile.custom.min.js'>"+"<"+"/script>");
</script>
<!-- page specific plugin scripts -->

<!--[if lte IE 8]>
          <script src="ui/easyui/js/excanvas.min.js"></script>
        <![endif]-->
<script src="${ctx}/ui/lib/jquery-1.10.2/jquery-ui.custom.min.js"></script>
<script src="${ctx}/ui/lib/jquery-1.10.2/jquery.ui.touch-punch.min.js"></script>
<script src="${ctx}/ui/lib/jquery-1.10.2/jquery.easypiechart.min.js"></script>
<script src="${ctx}/ui/lib/jquery-1.10.2/jquery.sparkline.min.js"></script>
<script src="${ctx}/ui/lib/jquery-1.10.2/flot/jquery.flot.min.js"></script>
<script src="${ctx}/ui/lib/jquery-1.10.2/flot/jquery.flot.pie.min.js"></script>
<script src="${ctx}/ui/lib/jquery-1.10.2/flot/jquery.flot.resize.min.js"></script>

<link rel="stylesheet" href="${ctx}/ui/lib/bootstrap/css/bootstrap.min.css" />
<script src="${ctx}/ui/lib/bootstrap/js/bootstrap.min.js"></script>
<script src="${ctx}/ui/lib/bootstrap/bootstrap-tab.js"></script>


<!-- page specific plugin styles -->

<!-- text fonts -->

<!-- ace styles -->
<link rel="stylesheet" href="${ctx}/ui/lib/ace/css/ace.min.css" id="main-ace-style" />

<!--[if lte IE 9]>
            <link rel="stylesheet" href="${ctx}/ui/lib/ace/css/ace-part2.min.css" />
        <![endif]-->
<link rel="stylesheet" href="${ctx}/ui/lib/ace/css/ace-skins.min.css" />
<link rel="stylesheet" href="${ctx}/ui/lib/ace/css/ace-rtl.min.css" />

<!--[if lte IE 9]>
          <link rel="stylesheet" href="${ctx}/ui/lib/ace/css/ace-ie.min.css" />
        <![endif]-->

<!-- inline styles related to this page -->

<!-- ace settings handler -->
<script src="${ctx}/ui/lib/ace/js/ace-extra.min.js"></script>

<!-- ace scripts -->
<script src="${ctx}/ui/lib/ace/js/ace-elements.min.js"></script>
<script src="${ctx}/ui/lib/ace/js/ace.min.js"></script>

<!-- the following scripts are used in demo only for onpage help and you don't need them -->
<link rel="stylesheet" href="${ctx}/ui/lib/ace/css/ace.onpage-help.css" />
<link rel="stylesheet" href="${ctx}/ui/lib/rainbow/assets/js/themes/sunburst.css" />

<script type="text/javascript"> ace.vars['base'] = '${ctx}'; </script>
<script src="${ctx}/ui/lib/ace/js/elements.onpage-help.js"></script>
<script src="${ctx}/ui/lib/ace/js/ace.onpage-help.js"></script>


<!-- HTML5shiv and Respond.js for IE8 to support HTML5 elements and media queries -->

<!--[if lte IE 8]>
        <script src="${ctx}/ui/lib/js/html5shiv.min.js"></script>
        <script src="${ctx}/ui/lib/js/respond.min.js"></script>
       <![endif]-->
<!-- basic scripts -->

<script src="${ctx}/ui/lib/rainbow/assets/js/rainbow.js"></script>
<script src="${ctx}/ui/lib/rainbow/assets/js/language/generic.js"></script>
<script src="${ctx}/ui/lib/rainbow/assets/js/language/html.js"></script>
<script src="${ctx}/ui/lib/rainbow/assets/js/language/css.js"></script>
<script src="${ctx}/ui/lib/rainbow/assets/js/language/javascript.js"></script>
<!-- json -->
  <script type="text/javascript" src="${ctx}/ui/lib/json/json2.js"></script>

<!-- 
<script type="text/javascript" src="${ctx}/ui/easyui/cxfw2/cxfw2.js"></script>
 -->

<link rel="stylesheet" type="text/css" href="${ctx}/ui/easyui/got/icon.css" />
<script type="text/javascript" src="${ctx}/ui/easyui/got/got.js"></script>

<script type="text/javascript" src="${ctx}/ui/easyui/got/lang/${lang}.js"></script>

<c:forEach var="js" items="${view.uiMap[lang].dataMap }">
<script type="text/javascript" src="${ctx}${js.value }"></script>
</c:forEach>
