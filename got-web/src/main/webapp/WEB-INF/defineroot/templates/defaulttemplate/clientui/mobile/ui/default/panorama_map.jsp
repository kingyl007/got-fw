<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@page import="cn.got.platform.core.model.layout.*"%>
<%@page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
<link rel="stylesheet" href="http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css" />

<script type="text/javascript" src="${pageContext.request.contextPath}/ui/common/map/baidu/map_api.js"></script>
<%
  if (!"1".equals(request.getAttribute("showAsDialog"))) {
%>
<jsp:include page="../header.jsp"></jsp:include>
<%
  }
%>
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/ui/loanriskcontrol/icons/vehicle/default/icon.css" />
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/ui/loanriskcontrol/icons/tag/icon.css" />
<script type="text/javascript">

var ${pageId}={
    <jsp:include page="../default_view_object.jsp" />
  	mapIconPath : "${pageContext.request.contextPath}/ui/loanriskcontrol/icons/tag/",
  	markerOnMap : {},
  	inEditing : false,
  	inEditingBizData : null,
  	mapCenterChangeListeners:[],
};

var playSpeed = 200;
var isPlaying = false;

function play() {
  if ($("#btnPlay").linkbutton("options").text == '播放') {
    isPlaying = true;
    doPlay();
    $("#btnPlay").linkbutton({iconCls:'icon-pause', disabled:false,text:'暂停'});
  } else {
    doPause();
    $("#btnPlay").linkbutton({iconCls:'icon-play', disabled:false,text:'播放'});
  }
}

var carMarker = null;

function doPlay() {
  var node = currentList[currentListIndex];
  if (carMarker == null) {
    carMarker =  createMarker(node['LAT'], node['LNG'], getMarkerIcon({iconCls:getIconClass(node)}), null, showInfoWin);
    addMarker(map, carMarker);
  } else {
    updateMarker(carMarker, node['LAT'], node['LNG'], getMarkerIcon({iconCls:getIconClass(node)}), null);
    if (openInfoWinMarker != null) {
      showInfoWin(carMarker);
    }
  }
  setPointVisible(map, node['LAT'], node['LNG']);
	++currentListIndex;
	if (currentListIndex < currentList.length && isPlaying) {
		setTimeout(function(){
		  doPlay();
		},playSpeed);
    } else {
      play();
      currentListIndex = 0;
      $.remind('提示', '播放完成.',"info", 1600);
    }
}

function doPause() {
  isPlaying = false;
}

function drawLines(list) {
  var lines = [];
  var line;
  var strLatLngs = "";
  var pathStr = "";
  for (var i = 1; i < list.length; ++i) {
    line = createLine(list[i-1]['LAT'] +"," + list[i-1]['LNG']+";" + list[i]['LAT'] +"," + list[i]["LNG"],"", getLineColor(list[i]),4, 0.8);
    addLine(map, line, false);
    lines.push(line);
  }
  var startMarker = createMarker(list[0]['LAT'], list[0]['LNG'], getStartIcon(), "起点", null);
  addMarker(map, startMarker);
  
  var endMarker = createMarker(list[list.length-1]['LAT'], list[list.length-1]['LNG'], getEndIcon(), "终点", null);
  addMarker(map, endMarker);
  
  setOverLaysVisible(map, lines);
}

function getPointFromObj(obj) {
  return createPoint(obj['LAT'], obj['LNG']);
}

function getStartIcon() {
  return '${pageContext.request.contextPath}/ui/loanriskcontrol/icons/tag/m_p20.png';
}
function getEndIcon() {
  return '${pageContext.request.contextPath}/ui/loanriskcontrol/icons/tag/m_p21.png';
}

function getLineColor(obj) {
	var slowColor = "#008000";//0~60
	var midColor = "#0000FF";//60~80
	var highColor = "#FF4500";//80~100
	var crazyColor = "#FF0000";//100~
	var speed = parseInt(obj['SPEED']);
	if (speed < 60) {
	  return slowColor;
	} else if (speed < 80) {
	  return midColor;
	} else if (speed < 120) {
	  return highColor;
	} else if (speed > 120) {
	  return crazyColor;
	} else {
	  return slowColor;
	}
}

function speedChange(newValue, oldValue) {
  playSpeed = 400 - newValue;
}

var currentList = null;

var currentListIndex = 0;

function queryHistory() {
  $("#btnSearch").linkbutton({iconCls:'icon-loading', disabled:true});
  var view = ${pageId};
  var data = $(view.getId("form")).serialize();
  got.ajax({
    cache : true,
    type : "POST",
    url : "getGridData",
    dataType : "json",
    data : data,
    async : true,
    error : function(res, ts, e) {
      $("#btnSearch").linkbutton({iconCls:'icon-search', disabled:false});
      alert("检索错误:" + ts);
      $("#btnPlay").linkbutton({iconCls:'icon-play-disabled', disabled:true,text:'播放'});
    },
    success : function(returnData) {
      $("#btnSearch").linkbutton({iconCls:'icon-search', disabled:false});
      if (returnData == null) {
        alert('检索错误');
        return;
      }
      view.data = returnData;
      currentList = returnData.data;// realResult.list;
      clearOverlays(map);
      carMarker = null;
      isPlaying = false;
      drawLines(currentList);
      currentListIndex = 0;
      $("#btnPlay").linkbutton({iconCls:'icon-play', disabled:false,text:'播放'});
      $("#btnPlot").slider({max:currentListIndex.length, min:0, value:0});
      
    }
  });
}
/*
	var amq = org.activemq.Amq;
	var mqMsgHandler = {
		onCmd: function(msg) {
		  console.info("1_${user.loginId}_${user.customerId} cmd:" + msg);
		},
		
		onGps: function(msg) {
		  if (msg) {
		    var parts = msg.split(',');
		    if (parts.length > 1) {
		      
			    var id = parts[1];
			    if (vehicleMap[id]) {
			      var v = vehicleMap[id];
			      $.each(GPS_COLUMNS, function(i, val) {
			        if (i > 1) {
			          v[val] = parts[i];
			        }
			      });
			      var icon = getIconClass(v);
			      if (icon != v['iconCls']) {
			        v['iconCls'] = icon;
			      	$("#treeVehicleList").tree("update",{target:v, iconCls:icon});
			      }
				    if (markerOnMap[id]) {
				      updateMarker(markerOnMap[id], v['LAT'], v['LNG'], getMarkerIcon(v), v['VEHICLE_NUM']);
				  		console.info("gps:" + msg);
				  		if (openInfoWinMarker == markerOnMap[id]) {
				  		  showInfoWin(openInfoWinMarker);
				  		}
				    }
			    }
			  }
		  }
		},
	};
	*/

	var mapIconPath = "${pageContext.request.contextPath}/ui/loanriskcontrol/icons/vehicle/default/s_";
	var markerOnMap = {};
	var vehicleMap = {};
	var vehicleFilterName = "";
	var openInfoWinMarker = null;
	var GPS_COLUMNS = ['TAG','VEHICLE_ID','VEHICLE_GPS_TIME','CREATE_TIME','GPS_TIME',
	                   'INTERVAL','LAT','LNG','LAT2','LNG2',
	                   'AV','NS','EW','SPEED','DIRECTION',
	                   'DIRECTION_NAME','ORIGINAL_OIL','ORIGINAL_OIL2','OIL','OIL2',
	                   'ORIGINAL_MILEAGE','MILEAGE','TODAY_MILEAGE','TEMPRATURE','POWER',
	                   'SIGNAL','PLANETNUM','MECHINESTATUS','VEHICLE_STATUS_NAME','ADDRESS'];
	var allColumns = [
	    { field: 'VEHICLE_NUM', title: '车牌号码', width: 150, sortable: true,resizable : true, hidden:false},
	    { field: 'VEHICLE_ID', title: '车辆编号', width: 150, sortable: true,resizable : true, hidden:true},
	    { field: 'GROUP_NAME', title: '所属分组', width: 150, sortable: true,resizable : true, hidden:true},
	    { field: 'VEHICLE_TYPE', title: '车辆类型', width: 150, sortable: true,resizable : true, hidden:true},
	    { field: 'MECHINE_TYPE', title: '车机类型', width: 150, sortable: true,resizable : true, hidden:true},
	    { field: 'CUSTOMER_NAME', title: '客户名称', width: 150, sortable: true,resizable : true, hidden:true},
	    { field: 'VEHICLE_ACCOUNT', title: '车辆名称', width: 150, sortable: true,resizable : true, hidden:true},
	    { field: 'LINKINFO', title: '车主联系信息', width: 150, sortable: true,resizable : true, hidden:false},
	    { field: 'INIT_DATE', title: '安装日期', width: 150, sortable: true,resizable : true, hidden:true},
	    { field: 'SERVICE_END_DATE', title: '服务到期日期', width: 150, sortable: true,resizable : true, hidden:true},
	    { field: 'MECHINE_NO', title: '设备号码', width: 150, sortable: true,resizable : true, hidden:false},
	    { field: 'SIM_NO', title: 'SIM卡号', width: 150, sortable: true,resizable : true, hidden:false},
	  { field: 'GPS_TIME', title: 'GPS时间', width: 150, sortable: true,resizable : true, hidden:false},
	  { field: 'CREATE_TIME', title: '信号', width: 150, sortable: true,resizable : true, hidden:false},
	  { field: 'LNG', title: '经度', width: 150, sortable: true,resizable : true, hidden:false},
	  { field: 'LAT', title: '纬度', width: 150, sortable: true,resizable : true, hidden:false},
	  { field: 'DIRECTION_NAME', title: '方向', width: 150, sortable: true,resizable : true, hidden:false},
	  { field: 'SPEED', title: '速度(km/h)', width: 150, sortable: true,resizable : true, hidden:false},
	  { field: 'INTERVAL', title: '间隔', width: 150, sortable: true,resizable : true, hidden:false},
	  { field: 'TEMPRATURE', title: '温度', width: 150, sortable: true,resizable : true, hidden:true},
	  { field: 'TODAY_MILEAGE', title: '当日里程(km)', width: 150, sortable: true,resizable : true, hidden:false},
	  { field: 'MILEAGE', title: '总里程(km)', width: 150, sortable: true,resizable : true, hidden:false},
	  { field: 'MILEAGE_TYPE', title: '里程类型', width: 150, sortable: true,resizable : true, hidden:true},
	  { field: 'ADDRESS', title: '位置', width: 150, sortable: true,resizable : true, hidden:false},
	  { field: 'POWER', title: '设备电量', width: 150, sortable: true,resizable : true, hidden:false},
	  { field: 'SIGNAL', title: 'GSM信号', width: 150, sortable: true,resizable : true, hidden:false},
	  { field: 'PLANTNUM', title: 'GPS卫星数', width: 150, sortable: true,resizable : true, hidden:false},
	  { field: 'MECHINE_POSITION', title: '安装位置', width: 150, sortable: true,resizable : true, hidden:false},
	];
	
	function treeLoadSuccess(node, data) {
		//if (node && node.id) {
		//console.info(node.id);
		//}
		console.info(data);
		if (data) {
		  $.each(data, function(i, vd) {
		    if (vd['VEHICLE_ID']) {
		      vehicleMap[vd['VEHICLE_ID']] = vd;
		    }
		  });
		}
	}
	
	function treeNodeClick(node) {
		// console.info("click" + node['VEHICLE_NUM']);
	}
	
	function treeNodeSelect(node) {
	  // console.info("select:" + node.text);
	}
	
	function treeNodeCheck(node, checked) {
	   console.info("check:" + node.text);
	   var nodes = $("#treeVehicleList").tree("getChecked");
	   var gridRows = [];
	   for (var i = 0; i < nodes.length; ++i) {
	     if (nodes[i]["VEHICLE_ID"]) {
	       gridRows.push(nodes[i]);
	     }
	   }
	   $("#tblWatching").datagrid({data:gridRows});
	   refreshMap(gridRows);
	   if (checked) {
	     // if node is vehicle, center to node
	   }
	}

	function treeNodeDblClick(node) {
	  console.info("dblClick:" + node.text);
	  $("#treeVehicleList").tree("update",{target:node.target, checked:true});
	  showInfoWin(markerOnMap[node.id]);
	}
	
	function treeNodeFormatter(node) {
	  var count = 0;
	  /*
	  */
	  if (node['GROUP_ID']) {
		  if (node['VCOUNT']) {
		    count = node['VCOUNT'];
		  }
		  if (node['SUBCOUNT']) {
		    count = count + node['SUBCOUNT'];
		  }
		  return node.text +"("+count+")"
	  } else {
	    return node.text +"("+(node['VEHICLE_STATUS_NAME']?node['VEHICLE_STATUS_NAME']:"未知") +")";
	  }
	}
	
	function refreshMap(showVehicles) {
	  var checkedVehicles = {};
	  var obj = null;
	  for (var i = 0; i < showVehicles.length; ++i) {
	    var v = showVehicles[i];
	    checkedVehicles[v['VEHICLE_ID']] = true;
	    if (markerOnMap[v['VEHICLE_ID']]) {
	      // update vehicle info
	    } else {
	      // add vehicle info
	      obj = createMarker(v['LAT'], v['LNG'],getMarkerIcon(v), v['VEHICLE_NUM'], showInfoWin );
	      obj['bizObj'] = v;
	      addMarker(map,obj);
	      markerOnMap[v['VEHICLE_ID']] = obj;
	    }
	  }
	  if (obj) {
	    setCenterByPoi(map, obj);
	  }
	  //*
	  for (var m in markerOnMap) {
	    if (checkedVehicles[m]) {
	      continue;
	    } else {
	      // hide or remove
	      deleteMarker(map, markerOnMap[m]);
	      delete markerOnMap[m];
	    }
	  }//*/
	}
	
	function getMarkerIcon(obj) {
	  return mapIconPath + obj['iconCls'].replace("car_","") +'.png';
	}

  var DIRECTION_NAME = [ "正东", "正南", "正西", "正北", "东北",
      "东南", "西北", "西南"];

  var DIRECTION_ICON = ["car_point_E",
      "car_point_S", "car_point_W", "car_point_N", "car_point_NE",
      "car_point_SE", "car_point_NW", "car_point_SW"];
  
	function getIconClass(obj) {
	    var machineStatus = obj["MECHINESTATUS"];
	    var vehicleStatus = obj["VEHICLE_STATUS_NAME"];
	    var direction = obj["DIRECTION_NAME"];
	    if (machineStatus.indexOf("离线") >= 0) {
	      return "car_outline";
	    }
	    else if (machineStatus.indexOf("？？？") >= 0) {
	      return "car_gpsUnvalid";
	    }
	    else if (vehicleStatus.indexOf("停车") >= 0) {
	      return "car_stop";
	    }
	    else {
	      for (var i = 0; i < DIRECTION_NAME.length; ++i) {
	        if (DIRECTION_NAME[i] == (direction)) {
	          return DIRECTION_ICON[i];
	          // TODO 超速
	        }
	      }
	    }
	    return "car_outline";
	}
	
	function buildInfoContent(obj) {
	  var bizObj = currentList[currentListIndex];
	  var infoContext = $("#infoWinTemp").html();
	  if (bizObj && infoContext) {
	    var v = null;
	    for(var k in bizObj) {
	      v = bizObj[k];
	      if (typeof v == 'string') {
	        v = v.split('、').join('');
	      }
	      infoContext = infoContext.split('{'+k+'}').join(v);
	    }
	    return infoContext;
	  }
	  return "";
	}

	
	function vehicleFilterChange(newValue, oldValue) {
  		var queryValue = $('#vehicleSearcher').searchbox('getValue');
	  $("#treeVehicleList").tree({url:'getTreeData?fwCoord.project=${view.coord.project }&fwCoord.function=${view.coord.function}&fwCoord.view=${view.coord.view }&fwParam.queryType=' + newValue +'&fwParam.queryValue=' + queryValue});
	  $("#treeVehicleList").tree("reload");
	}
	
	
	function vehicleSearch(value, name) {
  		var queryType = $('#vehicleFilter').combobox('getValue');
	  $("#treeVehicleList").tree({url:'getTreeData?fwCoord.project=${view.coord.project }&fwCoord.function=${view.coord.function}&fwCoord.view=${view.coord.view }&fwParam.queryType=' + queryType +'&fwParam.queryValue=' + value});
	  $("#treeVehicleList").tree("reload");
	}
	
	function listSelect(rowIndex, rowData) {
	  showInfoWin(markerOnMap[rowData.id]);
	}

	$(function() {
		$("#tblWatching").datagrid(
			{
		        fitColumns : true,
		        striped : true,
		        rownumbers : true,
		        singleSelect : true,
		        onSelect : listSelect,
		        columns : [allColumns],
			});		
		<c:if test="${not empty view.onInit}">
		if (${pageId}['${view.onInit}']) {
		  ${pageId}['${view.onInit}'](${pageId}, $(${pageId}.getId("form")).serialize());
		}
		</c:if>

	    <c:if test="${not empty user}" >
	    /*
		    amq.init(
		     { 
		       uri: 'amq', 
		       logging: true, 
		       timeout: 30, 
		       clientId:(new Date()).getTime().toString() 
		     }
		    );
		    amq.addListener("cmdHandlerId","topic://CLIENT.TOPIC.COMMON", mqMsgHandler.onCmd);
		    amq.addListener("gpsHandlerId","topic://CLIENT.TOPIC.MQ_1_${user.loginId}_${user.customerId}", mqMsgHandler.onGps);
		    */
	    </c:if>
	    // amq.sendMessage(myDestination,myMessage);
	  got.loadOneJs("http://api.map.baidu.com/api?v=2.0&ak=u2vZ9fT7lIzbgGkBTlFQu4Y6", "callback=pageInitMap");
	});
	

	var inited = false;
  function pageInitMap() {
    got.loadOneJs("http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js");
  	map = initMap('map_canvas', "${empty user.args.setting['ADMINISTRATIVE_DIVISION']?'青岛':user.args.setting['ADMINISTRATIVE_DIVISION']}", ${pageId}.mapCenterChangeListeners, function() {
  	  if (!inited) {
  	    addMarker(map, createMarker(${lat}, ${lng}, getStartIcon(), "${vehicleNum}", null));
      	initPanorama(map, 'map_canvas', ${lat},${lng});
      	inited = true;
  	  }
    });		

  	<c:if test="${not empty view.onInit}">
	if (${pageId}['${view.onInit}']) {
	  ${pageId}['${view.onInit}'](${pageId}, $(${pageId}.getId("form")).serialize());
	}
	</c:if>
  }
</script>
<title>[${vehicleNum}]${view.title }</title>
</head>
<body>

	<div id="controlPanel" title="${vehicleNum }"
		style="width: 780px; height: 130px;display: none;"
		data-options="resizable:false,left:300,top:10,closable:false">
	<form id="${pageId}_form" name="form" action="list" method="post">
		<input type="hidden" id="${pageId}_project" name="fwCoord.project" value="${view.coord.project }" />
		<input type="hidden" id="${pageId}_function" name="fwCoord.function" value="${view.coord.function }" />
		<input type="hidden" id="${pageId}_view" name="fwCoord.view" value="${view.coord.view }" />
		<input type="hidden" id="${pageId}_lang" name="fwCoord.lang" value="${view.coord.lang }" />
		<input type="hidden" id="${pageId}_ui" name="fwCoord.ui" value="${view.coord.ui }" />
		
		<input type="hidden" id="${pageId}_totalRow" name="fwPage.totalRow" value="100" /> 
		<input type="hidden" id="${pageId}_pageSize" name="fwPage.pageSize" value="10" /> 
		<input type="hidden" id="${pageId}_pageNumber" name="fwPage.pageNumber" value="1" />
	
		<input type="hidden" id="${pageId}_sortName" name="fwParam.sortName" value="" />
		<input type="hidden" id="${pageId}_sortOrder" name="fwParam.sortOrder" value="" /> 
		<input type="hidden" id="${pageId}_queryValue" name="fwParam.queryValue" value="${vehicleId }" /> 
			<!--开始到结束的日期控件-->
			<table width="100%">
				<tr height="50">
					<td align="center" nowrap="nowrap">
						<span class="attr">开始:</span>
						<input id="${pageId}_from" class="easyui-datetimebox" name="fwParam.from" data-options="required:true,showSeconds:false" value="${from }" style="width: 130px">
						<span class="attr">&nbsp;结束:</span> 
						<input id="${pageId}_from" class="easyui-datetimebox" name="fwParam.to" data-options="required:true,showSeconds:false" value="${to }" style="width: 130px">
						<!--开始回放按钮--> 
						<a id="btnSearch" href="#" class="easyui-linkbutton" data-options="iconCls:'icon-search'" onclick="queryHistory()">搜索</a> 
						<a id="btnPlay" href="#" class="easyui-linkbutton" data-options="iconCls:'icon-play-disabled',disabled:true" onclick="play()">开始</a>
						<!-- 
						<a id="btn" href="#" class="easyui-linkbutton" data-options="iconCls:'icon-search'">暂停</a>
						<a id="btn" href="#" class="easyui-linkbutton" data-options="iconCls:'icon-search'">继续</a>
						 -->
					</td>
					<td align="right">
						<!--调整速度快和慢-->
						速度: 
					</td>
					<td align="left">
						<input  class="easyui-slider"
						data-options="min:100,max:300,step:50, value:200, showTip:false, rule:['慢','|','快'], onChange: speedChange"
						style="width: 50px"></input >
					</td>
				</tr>
				<tr>
					<td colspan="3" align="center">
						<input id="playPlot"  class="easyui-slider"
						data-options="min:0,max:10,step:1, value:0"
						style="width: 99%"></input >
					</td>
				</tr>
			</table>
		</form>
	</div>
	
	<div class="easyui-layout" data-options="fit:true">
		<div data-options="region:'center', filt:true"
			title="" id="map_canvas"></div>
		<div data-options="region:'south',split:true,minHeight:150,collapsed:true"
			title="数据">
			<table id="tblWatching">
				<tbody id="tblWatchingDataArea">
				</tbody>
			</table>
		</div>
	</div>
</body>

	<div id="infoWinTemp"  title="消息框内容"
		style="display:none">
		<h4 style='margin:0 0 5px 0;padding:0.2em 0'></h4>
		<table>
		<tr><td valign='top' style='width:65px;text-align:left;font-weight:bold'>状态：</td><td>{VEHICLE_STATUS_NAME}</td><tr>
		<tr><td valign='top' style='width:65px;text-align:left;font-weight:bold''>时间：</td><td>{CREATE_TIME}</td><tr>
		<tr><td valign='top' style='width:65px;text-align:left;font-weight:bold''>GPS时间：</td><td>{GPS_TIME}</td><tr>
		<tr><td valign='top' style='width:65px;text-align:left;font-weight:bold''>状态：</td><td>{MECHINESTATUS}</td><tr>
		<tr><td valign='top' style='width:65px;text-align:left;font-weight:bold''>位置：</td><td>{ADDRESS}</td><tr>
		<tr><td colspan='2'>
		<!-- 
		<input type='button' onclick='playBack("{VEHICLE_ID}","{VEHICLE_NUM}")' value='轨迹回放' />&nbsp;
		<input type='button' onclick='vehicleTrack("{VEHICLE_ID}")' value='跟踪' />
		 -->
		</td><tr>
		</table>		
	</div>
	
	<div id="winTrack" class="easyui-window"  title="单车跟踪"
		data-options="closed:'true'" 
		style="width: 250px; height: 250px;padding: 0px">
	</div>
</html>