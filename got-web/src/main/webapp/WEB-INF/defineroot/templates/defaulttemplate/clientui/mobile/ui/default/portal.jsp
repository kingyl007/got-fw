<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@page import="cn.got.platform.core.model.layout.*"%>
<%@page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<%
  String basePath = request.getScheme() + "://"
					+ request.getServerName() + ":" + request.getServerPort()
					+ "/";
%>

<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="utf-8">
  <!-- Tell the browser to be responsive to screen width -->
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
<title>${view.title }</title>
<%
  FwView view = (FwView) request.getAttribute("view");
	if (view != null) {
	  Map<String, List<FwAction>> groupActionMap = new HashMap<String, List<FwAction>>();
	  if (view.getActions() != null) {
	    String groupId = null;
	    for (FwAction act : view.getActions()) {
	      if ((act.getVisible())) {
		      if (act.getGroup() == null || "".equals(act.getGroup())) {
		        groupId = "";
		      } else {
		        groupId = act.getGroup();
		      }
		      if (!groupActionMap.containsKey(groupId)) {
		        List<FwAction> list = new ArrayList<FwAction>();
		        groupActionMap.put(groupId, list);
		      }
		      groupActionMap.get(groupId).add(act);
	      }
	    }
	  }
	  request.setAttribute("actionMap", groupActionMap);
	}
	if (!"1".equals(request.getAttribute("isDialog"))) {
%>
<jsp:include page="../header.jsp"></jsp:include>
<%
	}
%>

    <!-- ECharts单文件引入 
    <script src="${pageContext.request.contextPath}/ui/common/echarts2.2.7/dist/echarts.js"></script>
    -->
    <script type="text/javascript">
        // 路径配置
        /*
        require.config({
            paths: {
                echarts: '${pageContext.request.contextPath}/ui/common/echarts2.2.7/dist'
            }
        });
        */
      	var ${pageId}={
      	    <jsp:include page="../default_view_object.jsp" />
      			charts : {
      			  
      			},
      			gotoReport : function(id,label) {
      			  // btn-info
      			  // btn-warning
      			  // btn-danger
      			  // btn-success
      			  // alert(label);
      			  // top.showPage(${pageId}.actionArg[id]['function'], null, label, "getView?fwCoord.project=${view.coord.project}&fwCoord.lang=${view.coord.lang}&fwCoord.ui=${view.coord.ui}&fwCoord.function=" + (${pageId}.actionArg[id]['gotoFunction']?${pageId}.actionArg[id]['gotoFunction']:${pageId}.actionArg[id]['function']) +"&fwCoord.view=" + (${pageId}.actionArg[id]['gotoView']?${pageId}.actionArg[id]['gotoView']:${pageId}.actionArg[id]['view']), true);
      				document.location= "getView?fwCoord.project=${view.coord.project}&fwCoord.lang=${view.coord.lang}&fwCoord.ui=${view.coord.ui}&fwCoord.function=" + (${pageId}.actionArg[id]['gotoFunction']?${pageId}.actionArg[id]['gotoFunction']:${pageId}.actionArg[id]['function']) +"&fwCoord.view=" + (${pageId}.actionArg[id]['gotoView']?${pageId}.actionArg[id]['gotoView']:${pageId}.actionArg[id]['view']);
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
      			    async : true,
      			    error : function(res, ts, e) {
      					// $(${pageId}.getId(id+ '_value')).html("ERR");
      					// $(${pageId}.getId(id)).attr("class", "btn btn-info btn-lg");
      			    },
      			    success : function(returnData) {
      			    	if (returnData) {
      			    		for(var key in returnData) {
           					  $(${pageId}.getId(key+ '_value')).html(returnData[key]);
           					  if (returnData[key] > 0) {
           	      		  		// $(${pageId}.getId(key)).attr("class", "small-box bg-red");
           					  } else {
           					    // $(${pageId}.getId(key)).attr("class", "small-box bg-aqua");
           					  }
      			    		}
/*
	      	      		  <c:forEach var="chart" items="${view.charts }">
	      	      		  	${pageId}.${chart.init}(${pageId}, ${pageId}.charts,'${chart.id}', '${pageId}_${chart.id}ChartDiv', '${chart.title}', returnData['${chart.id}']);
	      	      		  </c:forEach>
	      	      		  if (returnData['_FW_OTHER_DATA']) {
	      	      		    var deviceData = returnData['_FW_OTHER_DATA'];
	      	      		    $.each(deviceData, function(key) {
	      	      		      $(${pageId}.getId("deviceInfo_"+key)).html(deviceData[key]);
	      	      		    });
	      	      		  }
	      	      		  */
      			    		allData = returnData;
      			    	}
      			      
      			    }});
      			  return allData;
      			},
      		};
      	
      		function updatePortalData() {
      			${pageId}.updatePortalData();
      		}
      		
      		$(function() {
      		  // TODO init charts and buttons 
      		  // setInterval(${pageId}.updatePortalData, 10000);
      		  setTimeout(${pageId}.updatePortalData('first'),5000);
      		  /*
      		  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      	       // 获取已激活的标签页的名称
      	        var activeTab = $(e.target)[0].hash;
      	       // if(activeTab=="#day-div") loadDay();//加载图表
      	       // if(activeTab=="#week-div") loadWeek();
      	       // if(activeTab=="#month-div") loadMonth();
      		  <c:forEach var="chart" items="${view.charts }">
      		  	if (activeTab.indexOf('${chart.id}ChartContainer') > 0) {
      		  		${pageId}.${chart.init}(${pageId}, ${pageId}.charts,'${chart.id}', '${pageId}_${chart.id}ChartDiv', '${chart.title}', null);
      		  	}
      		  </c:forEach>
      	       
      	       });
      		  */
      			<c:if test="${not empty view.onInit}">
      			if (${pageId}['${view.onInit}']) {
      			  ${pageId}['${view.onInit}'](${pageId}, $(${pageId}.getId("form")).serialize());
      			}
      			</c:if>

      		});

//==MQ Start==
      	var amq = null;
      	var mqMsgHandler = {
      		onAlarm: function(msg) {
      		  if (msg && msg.indexOf("*alm,") >= 0) {
      		  	console.info("${pageId}:1_${user.loginId}_${user.customerId} cmd:" + msg);
      		  	${pageId}.updatePortalData();
      		  }
      		},
      	};
      	
      	$(function() {
      	    <c:if test="${not empty user}" >
      	    	if (!top.globalMQ) {
      	    	  	amq = org.activemq.Amq;
      			    amq.init(
      			     { 
      			       uri: 'amq', 
      			       logging: true, 
      			       timeout: 30, 
      			       clientId:(new Date()).getTime().toString() 
      			     }
      			    );
      	    	} else {
      	    	  amq = top.globalMQ;
      	    	}
      		    amq.addListener("${pageId}_alarmId","topic://CLIENT.TOPIC.MQ_1_${user.loginId}_${user.customerId}", mqMsgHandler.onAlarm);
      	    </c:if>
      	    // amq.sendMessage(myDestination,myMessage);
      	});
//==MQ End==
  
    </script>
</head>
<body style="background-color:transparent;margin-left: 5px;margin-right: 5px;">
	<form id="${pageId}_form" name="form" action="portal" method="post">
		<input type="hidden" id="${pageId}_project" name="fwCoord.project" value="${view.coord.project }" />
		<input type="hidden" id="${pageId}_function" name="fwCoord.function" value="${view.coord.function }" />
		<input type="hidden" id="${pageId}_view" name="fwCoord.view" value="${view.coord.view }" />
		<input type="hidden" id="${pageId}_lang" name="fwCoord.lang" value="${view.coord.lang }" />
		<input type="hidden" id="${pageId}_ui" name="fwCoord.ui" value="${view.coord.ui }" />
      <!-- Small boxes (Stat box) -->
      <c:set var="panelCount" value="${0 }" />
      <table width="100%">
      <tr><td width="50%">
		  <c:forEach var="act" items="${view.actions}"  varStatus="status">
			<c:if test="${empty act.group && act.visible}">
				<c:set var="panelCount" value="${panelCount+1 }" />
		          <a class="easyui-linkbutton"  id="${pageId }_action_${act.id}" 
					 style="width:99%;height:40px"
					data-options="size:'large'" href="javascript:${pageId}.gotoReport('${act.id}','${act.label }')"
					><span style="font-size:14px"><i class="fa ${act.icon }"></i>&nbsp;<span id="${pageId }_${act.id}_label">${act.label }</span>&nbsp;<span id="${pageId }_${act.id}_value">N/A</span></span></a>	
		        ${(panelCount%2==1)?'</td><td width="50%">':'</td></tr><tr><td width="50%">' }
	        </c:if>
		  </c:forEach>
		</td></tr>
      </table>
</form>
</body>
