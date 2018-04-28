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
<%
	}
%>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${view.title} - ${project.props['project.name'] }</title>
  <!-- Tell the browser to be responsive to screen width -->
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
<jsp:include page="header.jsp" />

    <!-- ECharts单文件引入 -->
    <script src="${pageContext.request.contextPath}/ui/common/echarts2.2.7/dist/echarts.js"></script>
    <script type="text/javascript">
        // 路径配置
        require.config({
            paths: {
                echarts: '${pageContext.request.contextPath}/ui/common/echarts2.2.7/dist'
            }
        });
  		var isUpdatingPortalData = false;
  		
      	var ${pageId}={
      	    <jsp:include page="../default_view_object.jsp" />
      			charts : {
      			  
      			},
      			gotoReport : function(id,label) {
      			  // btn-info
      			  // btn-warning
      			  // btn-danger
      			  // btn-success
      			  top.showPage(${pageId}.actionArg[id]['function'], null, label, "getView?fwCoord.project=${view.coord.project}&fwCoord.lang=${view.coord.lang}&fwCoord.ui=${view.coord.ui}&fwCoord.function=" + (${pageId}.actionArg[id]['gotoFunction']?${pageId}.actionArg[id]['gotoFunction']:${pageId}.actionArg[id]['function']) +"&fwCoord.view=" + (${pageId}.actionArg[id]['gotoView']?${pageId}.actionArg[id]['gotoView']:${pageId}.actionArg[id]['view']), true);
      			},
      			

      			updatePortalData : function() {
      				if (isUpdatingPortalData) {
      					return;
      				}
      				isUpdatingPortalData = true;
      			  var allData = {};
      			  var data = $(${pageId}.getId("form")).serialize();
      			got.ajax({
      			    cache : true,
      			    type : "POST",
      			    url : "getPortalData",
      			    dataType : "json",
      			    data : data,
      			    async : true,
      			  	autoRedirect : true,
      			    error : function(res, ts, e) {
      			    	isUpdatingPortalData = false;
      					// $(${pageId}.getId(id+ '_value')).html("ERR");
      					// $(${pageId}.getId(id)).attr("class", "btn btn-info btn-lg");
      			    },
      			    success : function(returnData) {
      			    	isUpdatingPortalData = false;
      			    	if (returnData) {
      			    		for(var key in returnData) {
           					  $(${pageId}.getId(key+ '_value')).html(returnData[key]);
           					  if (returnData[key] > 0) {
           	      		  		// $(${pageId}.getId(key)).attr("class", "small-box bg-red");
           					  } else {
           					    // $(${pageId}.getId(key)).attr("class", "small-box bg-aqua");
           					  }
      			    		}

	      	      		  <c:forEach var="chart" items="${view.charts }">
	      	      		  	${pageId}.${chart.init}(${pageId}, ${pageId}.charts,'${chart.id}', '${pageId}_${chart.id}ChartDiv', '${chart.title}', returnData['${chart.id}']);
	      	      		  </c:forEach>
	      	      		  if (returnData['_FW_OTHER_DATA']) {
	      	      		    var deviceData = returnData['_FW_OTHER_DATA'];
	      	      		    $.each(deviceData, function(key) {
	      	      		      $(${pageId}.getId("deviceInfo_"+key)).html(deviceData[key]);
	      	      		    });
	      	      		  }
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
      <div class="row">
      <c:set var="panelCount" value="${2 }" />
	<c:forEach var="act" items="${view.actions}"  varStatus="status">
		<c:if test="${empty act.group && act.visible}">
		<c:set var="panelCount" value="${panelCount+1 }" />
        <div class="col-lg-2 col-xs-3">
          <!-- small box -->
          <div  id="${pageId }_${act.id}" class="small-box ${panelCount % 4 == 0?"bg-aqua":""} ${panelCount % 4 == 1?"bg-green":""} ${panelCount % 4 == 2?"bg-yellow":""} ${panelCount % 4 == 3?"bg-red":""}">
            <div class="inner">
              <h3 id="${pageId }_${act.id}_value">N/A</h3>

              <p id="${pageId }_${act.id}_label">${act.label }</p>
            </div>
            <div class="icon">
              <i class="fa ${act.icon }"></i>
            </div>
            <c:if test="${act.enable }">
            <a href="javascript:${pageId}.gotoReport('${act.id}','${act.label }')" class="small-box-footer">详细 <i class="fa fa-arrow-circle-right"></i></a>
            </c:if>
          </div>
        </div>
        <!-- ./col -->
        </c:if>
	</c:forEach>        
      </div>
      <!-- /.row -->


      <!-- Main row -->
      <div class="row">
        <!-- Left col -->
        <section class="col-lg-7 connectedSortable">
          <!-- Custom tabs (Charts with tabs)-->
          <div class="nav-tabs-custom">
            <!-- Tabs within a box -->
            <ul class="nav nav-tabs pull-right">

		<li class="active"><a href="#${pageId }_summaryChartContainer" data-toggle="tab" onclick="">设备汇总</a></li>
	<c:forEach var="chart" items="${view.charts }" varStatus="status">
		<li class="${status.index < 0?'active':'' }"><a href="#${pageId }_${chart.id}ChartContainer" data-toggle="tab" onclick="">${chart.title}</a></li>
	</c:forEach>
              <li class="pull-left header"><i class="fa fa-inbox"></i> 图表</li>
            </ul>
            <div class="tab-content no-padding">
              <!-- Morris chart - Sales -->
	<c:forEach var="chart" items="${view.charts }" varStatus="status">
			  <div class="chart tab-pane ${status.index < 0?'active':'' }" id="${pageId }_${chart.id}ChartContainer" style="position: relative; height: 324px;">
              	<div id="${pageId }_${chart.id}ChartDiv" style="height: 324px;"></div>
			  </div>
	</c:forEach>
			  <div class="chart tab-pane active" id="${pageId }_summaryChartContainer" style="position: relative; height: 324px;">
	<div class="box">
            <!-- /.box-header -->
            <table width="100%" height="324px;">
            	<tr><td width="10%"></td><td width="40%"><b>总设备</b></td><td><b><span id="${pageId}_deviceInfo_total">0</span> 台</b></td> </tr>
            	<tr><td></td><td style="text-indent: 25px">已使用设备</td><td style="text-indent: 25px"><span id="${pageId}_deviceInfo_used_total">0</span> 台</td> </tr>
            	<tr><td></td><td style="text-indent: 50px">有线设备</td><td style="text-indent: 50px"><span id="${pageId}_deviceInfo_used_line">0</span> 台</td> </tr>
            	<tr><td></td><td style="text-indent: 50px">无线设备</td><td style="text-indent: 50px"><span id="${pageId}_deviceInfo_used_noline">0</span> 台</td> </tr>
            	<tr><td></td><td style="text-indent: 25px">未使用设备</td><td style="text-indent: 25px"><span id="${pageId}_deviceInfo_notuse_total">0</span> 台</td> </tr>
            	<tr><td></td><td style="text-indent: 50px">有线设备</td><td style="text-indent: 50px"><span id="${pageId}_deviceInfo_notuse_line">0</span> 台</td> </tr>
            	<tr><td></td><td style="text-indent: 50px">无线设备</td><td style="text-indent: 50px"><span id="${pageId}_deviceInfo_notuse_noline">0</span> 台</td> </tr>
            </table>
            
            <!-- /.box-body -->
          </div>
          </div>
            </div>
          </div>
          <!-- /.nav-tabs-custom -->

          <!-- Chat box -->
          <!-- /.box (chat box) -->


          <!-- quick email widget -->

        </section>
        <!-- /.Left col -->
	        <!-- right col (We are only adding the ID to make the widgets sortable)-->
	        <section class="col-lg-5 connectedSortable">
        <c:forEach var="grp" items="${view.actionGroups }">
        	<c:if test="${not empty actionMap[grp.id] }">
	          <!-- TO DO List -->
	          <div class="box box-primary">
	            <div class="box-header">
	              <i class="ion ion-clipboard"></i>
	
	              <h3 class="box-title">${grp.title }</h3>
					<!-- 
	              <div class="box-tools pull-right">
	                <ul class="pagination pagination-sm inline">
	                  <li><a href="#">&laquo;</a></li>
	                  <li><a href="#">1</a></li>
	                  <li><a href="#">2</a></li>
	                  <li><a href="#">3</a></li>
	                  <li><a href="#">&raquo;</a></li>
	                </ul>
	              </div>
					 -->
	            </div>
	            <!-- /.box-header -->
	            <div class="box-body">
	              <ul class="todo-list">
	              	<c:forEach var="act" items="${actionMap[grp.id] }">
		                <li>
		                  <!-- drag handle -->
		                      <span class="handle">
		                        <i class="fa fa-ellipsis-v"></i>
		                        <i class="fa fa-ellipsis-v"></i>
		                      </span>
		                  <!-- checkbox 
		                  <input type="checkbox" value="">
		                  -->
		                  <!-- todo text -->
		                  	<a href="javascript:${pageId}.gotoReport('${act.id}','${act.label }')">
		                  <span id="${pageId }_${act.id}_value" class="text">${act.label }</span>
		                  	</a>
		                  <!-- Emphasis label 
		                  <small class="label label-danger"><i class="fa fa-clock-o"></i> 2 mins</small>
		                  -->
		                  <!-- General tools such as edit or delete
		                  <div class="tools">
		                    <i class="fa fa-edit"></i>
		                  </div>
		                  -->
		                </li>
	              	</c:forEach>
	            <!-- /.box-body 
	            <div class="box-footer clearfix no-border">
	              <button type="button" class="btn btn-default pull-right"><i class="fa fa-plus"></i> Add item</button>
	            </div>
	            -->
	          </div>
			        </c:if>
		        </c:forEach>
	          <!-- /.box -->
	
	          <!-- Map box -->
	          <!-- /.box -->
	
	          <!-- solid sales graph -->
	          <!-- /.box -->
	
	          <!-- Calendar -->
	          <!-- /.box -->
	
	        </section>
        <!-- right col -->
      </div>
      <!-- /.row (main row) -->
</form>
<jsp:include page="footer.jsp" />
</body>
