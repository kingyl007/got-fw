<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<html>
<head>
	<title>Index</title>
	<script type="text/javascript" src="ui/easyui/js/jquery/jquery-1.10.2.min.js"></script>
	<script type="text/javascript">
		
          $(function() {
        	alert("OK");
        	got.ajax({
        		cache : true,
        		type : "POST",
        		url : "page",
        		dataType : 'html',
        		data : $('#root_loadPage').serialize(),
        		error : function(res, ts, e) {
        			alert("保存错误:" + ts);
        		},
        		success : function(returnData) {
        			$(document.body).append("<div>" + returnData +"</div>");
        			//$("#maindeak").text(returnData);
        		}
        	});
          });
     </script>
</head>
<body>
<h2>Hello World!</h2>
<div id="root">
<form action="page" method="post" name="loadPage" id="root_loadPage">
	<input type="hidden" id="root_project" name="project" value="${project}" />
	<input type="hidden" id="root_page" name="page" value="easyui/easyui_entry" />
	<input type="hidden" id="root_ui" name="ui" value="${ui}" />
	<input type="hidden" id="root_lang" name="lang" value="${lang}" />
</form>
</div>
</body>
</html>
