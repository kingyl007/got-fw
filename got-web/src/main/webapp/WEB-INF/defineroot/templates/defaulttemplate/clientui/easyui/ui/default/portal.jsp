<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@page import="cn.got.platform.core.model.layout.*"%>
<%@page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html>
<html lang="zh">
<head>
<title>${view.title }</title>
<%
	if (!"1".equals(request.getAttribute("isDialog"))) {
%>
<jsp:include page="../header.jsp"></jsp:include>
<%
	}
%>
<!-- 新 Bootstrap 核心 CSS 文件 -->
<link rel="stylesheet" href="${pageContext.request.contextPath}/ui/common/bootstrap/3.3.0/css/bootstrap.min.css">

<!-- 可选的Bootstrap主题文件（一般不用引入） -->
<link rel="stylesheet" href="${pageContext.request.contextPath}/ui/common/bootstrap/3.3.0/css/bootstrap-theme.min.css">

<!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
<script src="${pageContext.request.contextPath}/ui/common/bootstrap/3.3.0/js/bootstrap.min.js"></script>
    <!-- ECharts单文件引入 -->
    <script src="${pageContext.request.contextPath}/ui/common/echarts2.2.7/dist/echarts.js"></script>
    <script type="text/javascript">
        // 路径配置
        require.config({
            paths: {
                echarts: '${pageContext.request.contextPath}/ui/common/echarts2.2.7/dist'
            }
        });
      	var ${pageId}={
      	    <jsp:include page="../default_view_object.jsp" />
      			charts : {
      			  
      			},
      			gotoReport : function(id,label) {
      			  // btn-info
      			  // btn-warning
      			  // btn-danger
      			  // btn-success
      			  window.location.href = "getView?fwCoord.project=${view.coord.project}&fwCoord.lang=${view.coord.lang}&fwCoord.ui=${view.coord.ui}&fwCoord.function=" + ${pageId}.actionArg[id]['function'] +"&fwCoord.view=" + ${pageId}.actionArg[id]['view'];
              	  $("#title2", window.parent.document).html(label);
      			},
      			      			
      			updatePortalData : function() {
      			  var allData = {};
      			  var data = $(${pageId}.getId("form")).serialize();
      			got.ajax({
      			    cache : true,
      			    type : "POST",
      			    url : "getPortalData",
      			    dataType : "json",
      			    data : data,
      			    async : false,
      			    error : function(res, ts, e) {
      					// $(${pageId}.getId(id+ '_value')).html("ERR");
      					// $(${pageId}.getId(id)).attr("class", "btn btn-info btn-lg");
      			    },
      			    success : function(returnData) {
      			    	if (returnData) {
      			    		for(var key in returnData) {
           					  $(${pageId}.getId(key+ '_value')).html(returnData[key]);
           					  if (returnData[key] > 0) {
           	      		  		$(${pageId}.getId(key)).attr("class", "btn btn-warning btn-lg");
           					  } else {
           					    $(${pageId}.getId(key)).attr("class", "btn btn-info btn-lg");
           					  }
      			    		}

	      	      		  <c:forEach var="chart" items="${view.charts }">
	      	      		  	${pageId}.${chart.init}(${pageId}, ${pageId}.charts,'${chart.id}', '${pageId}_${chart.id}ChartDiv', '${chart.title}', returnData['${chart.id}']);
	      	      		  </c:forEach>
      			    		allData = returnData;
      			    	}
      			      
      			    }});
      			  return allData;
      			},
      		}
      		
      		$(function() {		
      			<c:if test="${not empty view.onInit}">
      			if (${pageId}['${view.onInit}']) {
      			  ${pageId}['${view.onInit}'](${pageId}, $(${pageId}.getId("form")).serialize());
      			}
      			</c:if>

      		  // TODO init charts and buttons 
      		  // setInterval(${pageId}.updatePortalData, 10000);
      		  ${pageId}.updatePortalData('first');
      		});
    </script>
</head>
<body style="background-color:transparent;">
	<form id="${pageId}_form" name="form" action="portal" method="post">
		<input type="hidden" id="${pageId}_project" name="fwCoord.project" value="${view.coord.project }" />
		<input type="hidden" id="${pageId}_function" name="fwCoord.function" value="${view.coord.function }" />
		<input type="hidden" id="${pageId}_view" name="fwCoord.view" value="${view.coord.view }" />
		<input type="hidden" id="${pageId}_lang" name="fwCoord.lang" value="${view.coord.lang }" />
		<input type="hidden" id="${pageId}_ui" name="fwCoord.ui" value="${view.coord.ui }" />
<table width="100%" height="100%">
	<tr>
	<td>
		<div id="todoList" style="height:200px;">
	待办事项：
	<table class="easyui-datagrid" style="width:400px" data-options="striped:true, fitColumns:true">   
    <thead>   
        <tr>   
            <th data-options="field:'code'">Id</th>   
            <th data-options="field:'name', width:200">任务</th>   
            <th data-options="field:'price'">操作</th>   
        </tr>   
    </thead>   
    <tbody>   
    <!-- 
        <tr>   
            <td>001</td><td>有3条报警记录</td><td><a href="#">进入</a></td>   
        </tr>   
        <tr>   
            <td>002</td><td>有12条报障记录</td><td><a href="#">进入</a></td>   
        </tr>   
     -->
    </tbody>   
</table>  
	</div>
	</td>
	<c:forEach var="chart" items="${view.charts }">
		<td id="${pageId }_${chart.id}ChartDiv" width="500px" style="height:400px;"></td>
	</c:forEach>
</table>
<c:if test="${not empty view.actions }" >
<div class="formTitle">最新状态</div>
<table width="100%" height="100%" border="0">
	<tr>
	<td width="50%" style="height: 300px;" valign="top">
	<c:forEach var="act" items="${view.actions}"  varStatus="status">
		<button id="${pageId }_${act.id}" type="button" class="btn btn-info btn-lg" style="font-size:24px" onClick="${pageId}.gotoReport('${act.id}','${act.label }')">
	  		<span class="glyphicon ${act.icon }"></span> <font id="${pageId }_${act.id}_label">${act.label }</font><br><font id="${pageId }_${act.id}_value">N/A</font>
		</button>
	</c:forEach>
	</td>
	</tr>
</table>
</c:if>
</form>
</body>
