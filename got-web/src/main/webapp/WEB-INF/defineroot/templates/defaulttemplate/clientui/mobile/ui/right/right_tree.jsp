<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html>
<html lang="zh">
<head>
<title>${pageId}</title>
<%
	if (!"1".equals(request.getAttribute("isDialog"))) {
%>
<jsp:include page="../header.jsp"></jsp:include>
<%
	}
%>
<script type="text/javascript">
	var ${pageId}=cxfw2.initDefineObject('${pageId}', ${pageDefine});
	
	$(function() {
	  	var define = ${pageId};
	  	
		$(define.geteid("tree")).tree({
		  url: '../fwright/getEasyuiRightData',
		  queryParams:  cxfw2.buildDefinePostObject(define, false),
		  checkbox : true,
		  cascadeCheck : true,
		  onSelect: function(node) {
		    $(define.geteid("treeSelectedId")).val(node.id);
		    },
		  formatter : function(node) {return '<table><tr><td width=200>' + node.text +'</td><td nowrap><input type="checkbox">本人 <input type="checkbox">下级 <input type="checkbox">本部门 <input type="checkbox">下级部门 <input type="checkbox">本工作组 <input type="checkbox">本客户 <input type="checkbox">下级客户 </td></tr></table>'},
		});
		
		$(define.geteid("tempTree")).tree({
		  data: [{text: 'Search Result'}],
		});		
		
		<c:if test="${not empty view.onInit}">
		if (${pageId}['${view.onInit}']) {
		  ${pageId}['${view.onInit}'](${pageId}, $(${pageId}.getId("form")).serialize());
		}
		</c:if>


		cxfw2.buildAllButtons(define, "buttonArea");
		// define.loadData();
	});
</script>
</head>
<body id="${pageId}_body">
<input type="hidden" id="${pageId}_treeSelectedId" name="treeSelectedId" value="" /> 
	<div>
		<table style="margin: 10px">
			<tr>
				<td id="${pageId}_buttonArea"></td>
			</tr>
		</table>
		<div class="easyui-panel" data-options="height : 400">
			<div id="${pageId}_tree"  class="easyui-tree"/>
		</div>
		<div id="${pageId}_tempTree"  class="easyui-tree" style="display: none;"/>
	</div>
</body>
<div id="${pageId}_dialogs" style="display : none"></div>
</html>
