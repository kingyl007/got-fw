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
<link rel="stylesheet" href="${pageContext.request.contextPath}/ui/common/map/infowindow/infowindow.css" />

<script type="text/javascript" src="${pageContext.request.contextPath}/ui/common/map/baidu/map_api.js"></script>
<%
// TODO filter in list action, construct button group
FwView view = (FwView) request.getAttribute("view");
if (view != null) {
	Map<String, FwGroup> groupMap = new HashMap<String, FwGroup>();
	List<FwGroup> actionGroups = view.getActionGroups();
	if (actionGroups != null) {
		for (FwGroup fg : actionGroups) {
			groupMap.put(fg.getId(), fg);
		}
	}
	Map<String, FwGroup> otherGroupMap = new HashMap<String, FwGroup>();
	List<Object> finalActions = new ArrayList<Object>();
	List<FwAction> actions = view.getActions();
	FwGroup group = null;
	if (actions != null) {
		for (FwAction act : actions) {
			if (act.getVisible()) {
				if (act.getGroup() != null
						&& !"".equals(act.getGroup())) {
					group = groupMap.get(act.getGroup());
					if (group != null) {
						group.addChild(act);
						if (!finalActions.contains(group)) {
							finalActions.add(group);
						}
					} else {
						group = otherGroupMap.get(act.getGroup());
						if (group == null) {
							group = new FwGroup();
							group.setId(act.getGroup());
							otherGroupMap
									.put(act.getGroup(), group);
						}
						group.addChild(act);
					}
				} else {
					finalActions.add(act);
				}
			}
		}
		
		for (int i = 0; i < finalActions.size(); ++i) {
			if (finalActions.get(i) instanceof FwGroup) {
				group = (FwGroup)(finalActions.get(i));
				if (group.getChildren().size() == 1) {
					finalActions.remove(i);
					finalActions.add(i, group.getChildren().get(0));
				}
			}
		}
	}
	request.setAttribute("displayActions", finalActions);
	request.setAttribute("otherActions", otherGroupMap);
}
  if (!"1".equals(request.getAttribute("showAsDialog"))) {
%>
<jsp:include page="../header.jsp"></jsp:include>
<%
  }
%>
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/ui/loanriskcontrol/icons/vehicle/default/icon.css" />
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/ui/loanriskcontrol/icons/tag/icon.css" />
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/ui/loanriskcontrol/icons/battery/icon.css" />
<script type="text/javascript">

var ${pageId}={
    <jsp:include page="../default_view_object.jsp" />
    exportFileName : '${vehicleNum}',
  	mapTagIconPath : "${pageContext.request.contextPath}/ui/loanriskcontrol/icons/tag/",
  	markerOnMap : {},
  	inEditing : false,
  	inEditingBizData : null,
  	mapCenterChangeListeners:[],
  	getGrid : function() {
  	  return $("#tblWatching");
  	},
  	
  	buildDeviceCmd : function(cmd,vehicleId, content) {
  	  // *cmd,S20_1,1,wyl,1,656636600202041,12345,1#
  	  return "*cmd," + cmd + ",1,${user.loginId},${user.customerId},"+vehicleId+"," + content + "#";
  	},
};

	var mapVehicleIconPath = "${pageContext.request.contextPath}/ui/loanriskcontrol/icons/vehicle/default/s_";
	var markerOnMap = {};
	var vehicleMap = {};
	var vehicleFilterName = "";
	var openInfoWinMarker = null;
	var infoWindow = null;
	var GPS_COLUMNS = ['TAG','VEHICLE_ID','VEHICLE_GPS_TIME','CREATE_TIME','GPS_TIME',
	                   'INTERVAL','LAT','LNG','LAT2','LNG2',
	                   'AV','NS','EW','SPEED','DIRECTION',
	                   'DIRECTION_NAME','ORIGINAL_OIL','ORIGINAL_OIL2','OIL','OIL2',
	                   'ORIGINAL_MILEAGE','MILEAGE','TODAY_MILEAGE','TEMPRATURE','POWER',
	                   'SIGNAL','PLANETNUM','MECHINESTATUS','VEHICLE_STATUS_NAME','ADDRESS'];
	var localColumns = {
	  'VEHICLE_NUM' : {formatter: vehicleNumFormatter},
	  // 'POWER' : {formatter: powerFormatter},
	  'TEMPRATURE' : {formatter : temperatureFormatter},
	};
	var columnMap = {
	    
	};
	var allColumns = [
<c:if test="${view.columns != null }">
<c:set var="isFirst" value="${true}" />
<c:forEach var="instance" items="${view.columns}" varStatus="status">
<c:if test="${instance.toView || instance.pk}" >
	<c:if test="${!isFirst}">
		,
	</c:if>
	<c:if test="${isFirst}">
	<c:set var="isFirst" value="${false}" />
	</c:if>
		{ field: '${instance.id}', title: '${instance.label}'
	  	, width: ${(not empty instance.width && instance.width > 0)?instance.width:'150'}
		, sortable: true,resizable : true, toUser: ${instance.toUser}
		, hidden:${!instance.visible}
		<c:choose>
			<c:when test="${not empty instance.onFormat}">
				
				, formatter: ${pageId}.${instance.onFormat}
			</c:when>
			<c:when test="${not empty instance.dictionary}">
				, formatter: function(val,data,index){return got.xssFilter(${pageId}.dictMap['${instance.dictionary}'][val]);}
			</c:when>
			<c:when test="${not empty instance.showColumn}">
				, formatter: function(val,data,index){return got.xssFilter(data['${instance.showColumn}']);}
			</c:when>
			<c:when test="${instance.id == '_FW_ACTIONS'}">
				, sortable:false
			</c:when>
			<c:otherwise>
				, formatter: function(val,data,index){return got.xssFilter(val);}
			</c:otherwise>
		</c:choose>
	}
</c:if>
</c:forEach>
</c:if>
	                  ];
	
	function gridPanelResize(width, height) {
	  $("#tblWatching").datagrid({'width':width - 22, 'height':height-38});
	  
	}
	
	function vehicleNumFormatter(value,row,index) {
	  return "<img src='" + getMarkerIcon(row) + "' />" + value;
	}
	
	function temperatureFormatter(value,row,index) {
	  if (got.isEmpty(value) || value == "-999" || value.indexOf("-999|-999|-999|-999|-999")>=0) {
	    return "-";
	  }
	  var ts = value.split("|");
	  if (ts.length >= 5) {
	    var mtstr = "";
	    for(var i = 1; i < 5; ++i) {
	      mtstr = mtstr +"温度" + i +":";
	      if (ts[i] == "-999") {
	        mtstr = mtstr + "-"; 
	      } else {
	        mtstr = mtstr + ts[i];
	      }
	      mtstr = mtstr + ",";
	    }
	    return mtstr;
	  }
	  return value;
	}
	
	function powerFormatter(value,row,index) {
	  var index = "unknown";
	  if (value) {
	  	index = parseInt(value);
	  	if (index > 5) {
	  	  index = 5;
	  	}
	  	if (index < 0) {
	  	  index = 0;
	  	}
	  }
	  return "<img width='30' height='15' src='${pageContext.request.contextPath}/ui/loanriskcontrol/icons/battery/battery_" + index + ".png' alt='"+value+"'/>";
	}
	
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
	   var nodes = getTree().tree("getChecked");
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
		if (node) {
		  getTree().tree("update",{target:node.target, checked:true});
		  if (node.id && markerOnMap[node.id]) {
			  setCenterByPoi(map, markerOnMap[node.id]);
			  showCustomInfoWin(markerOnMap[node.id], map);
		  }
		}
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
	    if (got.isEmpty(node['VEHICLE_DISPLAY_STATUS'])) {
	      updateVehicleDisplayStatus(node);
	    } 
	    return node.text +"("+ node['VEHICLE_DISPLAY_STATUS'] + ")";
	  }
    	return node.text;
	}
	
	function refreshMap(showVehicles) {
	  var checkedVehicles = {};
	  var obj = null;
	  var invalidVehicles = "";
	  for (var i = 0; i < showVehicles.length; ++i) {
	    var v = showVehicles[i];
	    checkedVehicles[v['VEHICLE_ID']] = true;
	    if (markerOnMap[v['VEHICLE_ID']]) {
	      // update vehicle info
	    } else {
	      // add vehicle info
	      if (Math.abs(v['LAT']) > 1 && Math.abs(v['LNG']) > 1) {
		      obj = createMarker(v['LAT'], v['LNG'],getMarkerIcon(v), v['VEHICLE_NUM'], markerClickProc );
		      obj['bizObj'] = v;
		      addMarker(map,obj);
		      markerOnMap[v['VEHICLE_ID']] = obj;
	      } else {
	        if (invalidVehicles != "") {
	          invalidVehicles += ",";
	        }
	        invalidVehicles += v['VEHICLE_NUM'];
	      }
	    }
	  }
	  if (invalidVehicles != "") {
	    $.messager.alert('提示', '车辆位置无效:' + invalidVehicles,"info");
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
	  return mapVehicleIconPath + obj['iconCls'].replace("car_","") +'.png';
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
	    if (machineStatus == null) {
	      machineStatus = "";
	    }
	    if (vehicleStatus == null) {
	      vehicleStatus = "";
	    }
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
	
	function getColumnDisplayValue(data, key) {
	  var view = ${pageId};
	  if (columnMap[key] && columnMap[key].formatter) {
	    return columnMap[key].formatter(data[key], data , 0);
	  } else if (key == 'MECHINESTATUS') {
	    if (data[key] == null || data[key].indexOf('离线')>=0) {
	      return "";
	    }
	  } else if (key == 'POWER') {
	    return powerFormatter(data[key],data,0);
	  }
	  return data[key];
	}
	
	function buildInfoContent(obj) {
	  if (obj == null) {
	    return "";
	  }
	  var bizObj = obj['bizObj'];
	  var infoContext = $("#infoWinTemp").html();
	  if (bizObj && infoContext) {
	    var v = null;
	    var sv = null;
	    for(var k in bizObj) {
	      sv = bizObj[k];
	      v = getColumnDisplayValue(bizObj, k);
        if(sv && sv == v && v.length > 30) {
  	        v = v.split('、').join('');
        	v = "<a title='" + v +"'>" + v.substring(0,30) +"...</a>";
        }
	      infoContext = infoContext.split('{'+k+'}').join(v);
	    }
	    if (bizObj['STOP_INTERVAL']) {
	    	infoContext = infoContext.split('{EXTEND_LABEL}').join("停车时长：");
	    	infoContext = infoContext.split('{EXTEND_DATA}').join(bizObj['STOP_INTERVAL']);
	    } else {
	    	infoContext = infoContext.split('{EXTEND_LABEL}').join("");
	    	infoContext = infoContext.split('{EXTEND_DATA}').join('');
	    }
	    infoContext = infoContext.split("{MECHINESTATUS}").join("");
	    return infoContext;
	  }
	  return "";
	}

	
	function vehicleFilterChange(newValue, oldValue) {
  		var queryValue = $('#vehicleSearcher').searchbox('getValue');
	  getTree().tree({url:'getTreeData?fwCoord.project=${view.coord.project }&fwCoord.function=${view.coord.function}&fwCoord.view=${view.coord.view }&fwParam.queryType=' + newValue +'&fwParam.queryValue=' + queryValue});
	  getTree().tree("reload");
	}
	
	
	function vehicleSearch(value, name) {
  		var queryType = $('#vehicleFilter').combobox('getValue');
	  getTree().tree({url:'getTreeData?fwCoord.project=${view.coord.project }&fwCoord.function=${view.coord.function}&fwCoord.view=${view.coord.view }&fwParam.queryType=' + queryType +'&fwParam.queryValue=' + value});
	  getTree().tree("reload");
	}
	
	function listSelect(rowIndex, rowData) {
		currentListIndex = rowIndex;
		doPlay();
	}
	
	function sendCmd(cmd) {
	  amq.sendMessage("topic://CLIENT.TOPIC.CMD.UP", cmd);
	}
	
	function treePanelResize(width, height) {
	  $("#vehicleSearcher").searchbox("resize", width -90);
	}

	$(function() {
		$.each(allColumns, function(i, ac) {
		  if (ac && ac.field) {
		    columnMap[ac.field] = ac;
			  if (localColumns[ac['field']]) {
			    $.each(localColumns[ac['field']], function(key) {
			      ac[key] = localColumns[ac['field']][key];
			    });
			  }
		  }
		  /*
		  */
		});

		$("#tblWatching").datagrid(
			{
		        fitColumns : false,
		        striped : true,
		        rownumbers : true,
		        autoRowHeight : false,
		        singleSelect : true,
		        onSelect : listSelect,
		        columns : [allColumns],
			});		
		<c:if test="${not empty view.onInit}">
		if (${pageId}['${view.onInit}']) {
		  ${pageId}['${view.onInit}'](${pageId}, $(${pageId}.getId("form")).serialize());
		}
		</c:if>

	  got.loadOneJs("http://api.map.baidu.com/api?v=2.0&ak=u2vZ9fT7lIzbgGkBTlFQu4Y6", "callback=pageInitMap");
	});
	
	function refreshGridData(id) {
	  var rows = $("#tblWatching").datagrid("getRows");
	  if (rows) {
	    $.each(rows, function(i, r) {
	      if (r["VEHICLE_ID"] == id) {
	        $("#tblWatching").datagrid("refreshRow", i);
	      }
	    });
	  }
	}
	var limitDate = new Date();
	limitDate.setFullYear(2000,1,1);
	
	function updateVehicleDisplayStatus(node) {
	  	var str = null;
	  	var date = null;
	    if (!got.isEmpty(node['MECHINESTATUS'])) {
			if (node['MECHINESTATUS'].indexOf('离线')>=0) {
		      str = "离线";
			  if (!got.isEmpty(node['CREATE_TIME']) && got.toDate(node['CREATE_TIME']) > limitDate) {
			    var interval = got.getTimeIntervalStr(got.toDate(node['CREATE_TIME']), new Date());
			    if (!got.isEmpty(interval)) {
			   		str = "离线:" + interval;
			    }
			  } else {
			    str = "未上线";
			  }
			}
	    }
		if (str == null) {
		  if(!got.isEmpty(node['VEHICLE_STATUS_NAME']) && node['VEHICLE_STATUS_NAME'].indexOf('停车')>=0) {
		   str = "停车";
		   if (!got.isEmpty(node['VEHICLE_GPS_TIME']) && got.toDate(node['VEHICLE_GPS_TIME']) > limitDate) {
		     var interval = got.getTimeIntervalStr(got.toDate(node['VEHICLE_GPS_TIME']), new Date());
		     if (!got.isEmpty(interval)) {
		    	str =  "停车:" + interval;
		     }
		   }
		  }
		}
		if (str == null) {
		  str = (!got.isEmpty(node['VEHICLE_STATUS_NAME'])?node['VEHICLE_STATUS_NAME']:"未知");
		}
		node['VEHICLE_DISPLAY_STATUS'] = str;
		return str;
	}
//==MQ Start==
/*
	var amq = null;
	var mqMsgHandler = {
		onCmd: function(msgStr) {
		  console.info("1_${user.loginId}_${user.customerId} cmd:" + msgStr);
		},
		
		onMsg: function(msgStr) {
		  if (msgStr) {
		    var msgs = msgStr.split('#');
		    for (var i = 0; i < msgs.length; ++i) {
		     	msg = msgs[i];
		     	if (msg == null || msg == '') {
		     	  continue;
		     	}
	  			console.info("msg:" + msg);
			    var parts = msg.split(',');
			    if (parts.length > 1) {
			      if (parts[0] == '*gps') {
			    	  // gps data
				    var id = parts[1];
				    if (vehicleMap[id]) {
				      var v = vehicleMap[id];
				      $.each(GPS_COLUMNS, function(i, val) {
				        if (i > 1) {
				          v[val] = parts[i];
				        }
				      });
				      updateVehicleDisplayStatus(v);
				      var icon = getIconClass(v);
				      if (icon != v['iconCls']) {
				        if (getTree().tree("getNode", v.target)) {
				      		getTree().tree("update",{target:v.target, iconCls:icon});
				        }
				      }
					    if (markerOnMap[id]) {
					      updateMarker(markerOnMap[id], v['LAT'], v['LNG'], getMarkerIcon(v), v['VEHICLE_NUM']);
					  		if (openInfoWinMarker == markerOnMap[id]) {
					  		  showCustomInfoWin(openInfoWinMarker);
					  		}
					    }
					    refreshGridData(id);
				    }
				  } else if (parts[0] == '*cfm') {
					  // confirm data
					    var v = vehicleMap[parts[2]];
					  if (v) {
				    	$.remind('设备指令', '<a href="#" onclick="alert(1)">'+v['VEHICLE_NUM']+':' + parts[3]+'</a>',"info", 2200);
					  }
				  }
			    }
		    }
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
		    amq.addListener("${pageId}_cmdDownId","topic://CLIENT.TOPIC.CMD.DOWN", mqMsgHandler.onCmd);
		    amq.addListener("${pageId}_msgHandlerId","topic://CLIENT.TOPIC.MQ_1_${user.loginId}_${user.customerId}", mqMsgHandler.onMsg);
		    console.info('init amq');
	    </c:if>
	    $(window).on('beforeunload', function(){  
	      console.info('before unload');
	  });
	});
	*/
//==MQ End==
	
  function getTree() {
    return $("#treeVehicleList");
  }
  
  function pageInitMap() {
    got.loadOneJs("http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js");
    got.loadOneJs("http://api.map.baidu.com/library/Heatmap/2.0/src/Heatmap_min.js",null, function() {
      console.info('heatmap loaded');
    });
  	map = initMap('map_canvas', "${empty user.args.setting['ADMINISTRATIVE_DIVISION']?'青岛':user.args.setting['ADMINISTRATIVE_DIVISION']}", ${pageId}.mapCenterChangeListeners);		

  	<c:if test="${not empty view.onInit}">
	if (${pageId}['${view.onInit}']) {
	  ${pageId}['${view.onInit}'](${pageId}, $(${pageId}.getId("form")).serialize());
	}
	</c:if>
  }
  
  var playSpeed = 200;
var isPlaying = false;

function play() {
  if (currentList == null) {
    autoStart = true;
    queryHistory();
  }
  if ($("#btnPlay").linkbutton("options").text == '播放') {
    isPlaying = true;
    doPlay();
    $("#btnPlay").linkbutton({iconCls:'icon-pause', disabled:false,text:'暂停'});
  } else {
    doPause();
    $("#btnPlay").linkbutton({iconCls:'icon-play', disabled:false,text:'播放'});
  }
}

function stop() {
  doPause();
  $("#btnPlay").linkbutton({iconCls:'icon-play', disabled:false,text:'播放'});
}

var carMarker = null;

function markerClickProc(marker) {
	showCustomInfoWin(marker,map);
	if (marker['listIndex']) {
		${pageId}.getGrid().datagrid("scrollTo", marker['listIndex']);
		// ${pageId}.getGrid().datagrid("selectRow", marker['listIndex']);
		${pageId}.getGrid().datagrid("highlightRow", marker['listIndex']);
	}
}

function doPlay() {
  if (currentList != null && currentList.length > currentListIndex) {
	  var node = currentList[currentListIndex];

	  if (node['STOP_INTERVAL'] && node['ADDED_STOP_MARKER']==null) {
	    var stopMarker = createMarker(node['LAT'], node['LNG'], getEndIcon(), null, markerClickProc);
	    stopMarker['bizObj'] = node;
	    stopMarker['listIndex'] = currentListIndex;
	    addMarker(map, stopMarker);
	    node['ADDED_STOP_MARKER'] = true;
	  }
	  if (carMarker == null) {
	    carMarker =  createMarker(node['LAT'], node['LNG'], getMarkerIcon({iconCls:getIconClass(node)}), null, markerClickProc);
	    addMarker(map, carMarker);
	  } else {
	    updateMarker(carMarker, node['LAT'], node['LNG'], getMarkerIcon({iconCls:getIconClass(node)}), null);
	  }
	  carMarker['bizObj'] = node;
	    if (openInfoWinMarker != null) {
	    	markerClickProc(carMarker);
	    }
	  setPointVisible(map, node['LAT'], node['LNG']);
	  showCustomInfoWin(carMarker, map);
	  $("#playPlot").slider("setValue", currentListIndex);
	  $("#tblWatching").datagrid('scrollTo', currentListIndex);
	  $("#tblWatching").datagrid('highlightRow', currentListIndex);
	  
	++currentListIndex;
	if (currentListIndex < currentList.length) {
		if (isPlaying) {
			setTimeout(function(){
			  doPlay();
			},playSpeed);
		}
    } else {
      stop();
      currentListIndex = 0;
      $.remind('提示', '播放完成.',"info", 1600);
    }
  } else {
    stop();
  }
}

function playPlotChange(newValue) {
  console.info("change " + newValue);
  if (currentListIndex >= 0) {
	  currentListIndex = newValue;
	  if (!isPlaying) {
	  	doPlay();
	  }
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
    line = createLine(list[i-1]['LAT'] +"," + list[i-1]['LNG']+";" + list[i]['LAT'] +"," + list[i]["LNG"],"", getLineColor(list[i]),4, 1);
    addLine(map, line, false);
    lines.push(line);
  }
  var startMarker = createMarker(list[0]['LAT'], list[0]['LNG'], getStartIcon(), "起点", markerClickProc);
  startMarker['bizObj'] = list[0];
  startMarker['listIndex'] = 0;
  addMarker(map, startMarker);
  
  var endMarker = createMarker(list[list.length-1]['LAT'], list[list.length-1]['LNG'], getEndIcon(), "终点", null);
  addMarker(map, endMarker);
  endMarker['bizObj'] = list[list.length-1];
  endMarker['listIndex'] = list.length - 1;
  
  setOverLaysVisible(map, lines);
  markerClickProc(startMarker);
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
	var slowColor = "#00ff00";//"#008000";//0~60
	var midColor = "#00ff00";//"#0000FF";//60~80
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

var currentListIndex = -1;

var autoStart = false;

function queryHistory() {
  if ($("#chkShowHeat").attr("checked")) {
    loadHeatMap();
  }
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
      $("#tblWatching").datagrid("loadData", currentList);
      // $("#tblWatching").datagrid({});
      clearOverlays(map);
      if ($("#chkShowHeat").attr("checked")) {
      	map.addOverlay(heatmapOverlay);
      }
      carMarker = null;
      isPlaying = false;
      drawLines(currentList);
      currentListIndex = 0;
      $("#playPlot").slider({max:currentList.length-1, value:0});
      $("#btnPlay").linkbutton({iconCls:'icon-play', disabled:false,text:'播放'});
      $("#btnPlot").slider({max:currentListIndex.length, min:0, value:0});
      if (autoStart) {
        play();
        autoStart = false;
      }
    }
  });
}

function loadHeatMap() {
  var view = ${pageId};
  var data = $(view.getId("form")).serialize();
  got.ajax({
    cache : true,
    type : "POST",
    url : "getGridData?coordType=" + getCoordType() +"&fwParam.queryType=heatmap&",
    dataType : "json",
    data : data,
    async : true,
    error : function(res, ts, e) {
      $.remind('提示', '热力图加载错误:' + e,"error", 3000);
    },
    success : function(returnData) {
      if (returnData == null) {
        $.remind('提示', '热力图数据检索错误',"error", 3000);
        return;
      }
		if (!returnData.success) {
	      $.remind('提示', '热力图数据检索错误：' + resultData.errorMsg,"error", 3000);
	      return;
		}
      var heatdata = returnData.data;// realResult.list;
      if (heatdata.length > 0) {
        $.each(heatdata, function(i,d) {
          d['lat'] = d['LAT'];
          d['lng'] = d['LNG'];
          d['count'] = d['PCOUNT'];
        });
        setPointVisible(map, heatdata[0]['LAT'], heatdata[0]['LNG']);
      }
      openHeatmap(heatdata);
    }
  });
}
  
  
  function beforeControlPanelShow() {
    console.info(document.body.clientWidth);
    $("#controlPanel").dialog("move", {left:document.body.clientWidth-410, top:40});
    return true;
  }
 
  if(!isSupportCanvas()){
  	alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')
  }
//详细的参数,可以查看heatmap.js的文档 https://github.com/pa7/heatmap.js/blob/master/README.md
//参数说明如下:
/* visible 热力图是否显示,默认为true
   * opacity 热力的透明度,1-100
   * radius 势力图的每个点的半径大小   
   * gradient  {JSON} 热力图的渐变区间 . gradient如下所示
   *	{
		.2:'rgb(0, 255, 255)',
		.5:'rgb(0, 110, 255)',
		.8:'rgb(100, 0, 255)'
	}
	其中 key 表示插值的位置, 0~1. 
	    value 为颜色值. 
   */
//是否显示热力图
var heatmapOverlay = null;
  function openHeatmap(points){
    if (heatmapOverlay == null) {
		heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
		map.addOverlay(heatmapOverlay);
		if (points != null) {
			heatmapOverlay.setDataSet({data:points,max:5});
		}
    }
    heatmapOverlay.show();
  }
function closeHeatmap(){
  if (heatmapOverlay) {
    heatmapOverlay.hide();
  }
}
  function setGradient(){
   	/*格式如下所示:
	{
  		0:'rgb(102, 255, 0)',
 	 	.5:'rgb(255, 170, 0)',
	  	1:'rgb(255, 0, 0)'
	}*/
   	var gradient = {};
   	var colors = document.querySelectorAll("input[type='color']");
   	colors = [].slice.call(colors,0);
   	colors.forEach(function(ele){
		gradient[ele.getAttribute("data-key")] = ele.value; 
   	});
      heatmapOverlay.setOptions({"gradient":gradient});
  }
//判断浏览区是否支持canvas
  function isSupportCanvas(){
      var elem = document.createElement('canvas');
      return !!(elem.getContext && elem.getContext('2d'));
  }
  
  function changeShowHeatMap(event) {
    if ($("#chkShowHeat").attr("checked")) {
      openHeatmap(null);
    } else {
      closeHeatmap();
    }
  }
</script>
<title>[${vehicleNum}]${view.title }</title>
</head>
<body>

	<div id="controlPanel" class="easyui-dialog" title="${vehicleNum }"
		style="width: 370px; height: 140px;"
		data-options="resizable:false,closable:false,collapsible:true, onBeforeOpen:beforeControlPanelShow">
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
				<tr>
					<td  align="center" nowrap="nowrap">
						<span class="attr">开始:</span>
						<input id="${pageId}_from" class="easyui-datetimebox" name="fwParam.from" data-options="required:true,showSeconds:false" value="${from }" style="width: 130px">
						<span class="attr">&nbsp;结束:</span> 
						<input id="${pageId}_from" class="easyui-datetimebox" name="fwParam.to" data-options="required:true,showSeconds:false" value="${to }" style="width: 130px">
					</td>
				</tr>
				<tr>
					<td align="center" nowrap="nowrap">
						<table width="60%">
						<tr>
						<td>
						<!--开始回放按钮--> 
						<a id="btnSearch" href="#" class="easyui-linkbutton" data-options="iconCls:'icon-search'" onclick="queryHistory()">搜索</a> 
						<a id="btnPlay" href="#" class="easyui-linkbutton" data-options="iconCls:'icon-play'" onclick="play()">开始</a>
						<input type="checkbox" id="chkShowHeat" value="1" checked="checked" onclick="changeShowHeatMap(event)" /><label for="chkShowHeat">停车热力图</label>
						
						<!-- 
						<a id="btn" href="#" class="easyui-linkbutton" data-options="iconCls:'icon-search'">暂停</a>
						<a id="btn" href="#" class="easyui-linkbutton" data-options="iconCls:'icon-search'">继续</a>
						 -->
						 </td>
						 <td>&nbsp;</td>
						<td>
						<!--调整速度快和慢-->
						速度: 
						</td>
						<td>
						<input class="easyui-slider"
						data-options="min:100,max:300,step:50, value:200, showTip:false, rule:['慢','|','快'], onChange: speedChange"
						style="width: 50px"></input >
						</td>
						</tr>
						</table>
					</td>
				</tr>
				<tr><td>&nbsp;</td></tr>
				<tr>
					<td  align="center">
						<input id="playPlot"  class="easyui-slider"
						data-options="min:0,max:0,step:1, value:0, onComplete: playPlotChange"
						style="width: 95%"></input >
					</td>
				</tr>
			</table>
		</form>
	</div>
	
	<div class="easyui-layout" data-options="fit:true">
		<div data-options="region:'center', filt:true"
			title="" id="map_canvas"></div>
		<div title="数据" data-options="region:'south',split:true,minHeight:150,collapsed:true, onResize:gridPanelResize,tools:[
	<c:forEach var="act" items="${view.actions}">
		<c:if test="${act.group == 'inGridTitle' && act.visible}">
			{iconCls:'${act.icon }', handler:function(event) {${pageId }.${act.click}(${pageId },null,'${act.id }',0,event)} },
		</c:if>
	</c:forEach>
	]">
	<div width="100%">
		        	<table id="tblWatching" width="100%">
					<tbody id="tblWatchingDataArea" width="100%">
					</tbody>
					</table>
	</div>
		</div>
	</div>
</body>

	<div id="infoWinTemp"  title="消息框内容"
		style="display:none">
		<h4 style='margin:0 0 5px 0;padding:0.2em 0'></h4>
		<table style="height: 200px">
		<tr><td valign='top' style='width:65px;text-align:left;font-weight:bold'>状态：</td><td>{VEHICLE_STATUS_NAME} {MECHINESTATUS}</td><tr>
		<tr><td valign='top' style='width:65px;text-align:left;font-weight:bold'>时间：</td><td>{CREATE_TIME}</td><tr>
		<tr><td valign='top' style='width:65px;text-align:left;font-weight:bold'>GPS时间：</td><td>{GPS_TIME}</td><tr>
		<tr><td valign='top' style='width:65px;text-align:left;font-weight:bold'>速度：</td><td>{SPEED}</td><tr>
		<tr><td valign='top' style='width:65px;text-align:left;font-weight:bold'>当日里程：</td><td>{TODAY_MILEAGE}</td><tr>
		<tr><td valign='top' style='width:65px;text-align:left;font-weight:bold'>位置：</td><td>{ADDRESS}</td><tr>
		<tr><td valign='top' style='width:65px;text-align:left;font-weight:bold'>{EXTEND_LABEL}</td><td>{EXTEND_DATA}</td><tr>
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
	<div id="${pageId}_dialogs" style="display: none">
	</div>
</html>