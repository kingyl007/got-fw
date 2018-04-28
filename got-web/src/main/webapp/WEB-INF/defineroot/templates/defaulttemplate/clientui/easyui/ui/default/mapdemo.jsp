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
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/ui/loanriskcontrol/icons/vehicle/1688/16x16/icon.css" />
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/ui/loanriskcontrol/icons/tag/icon.css" />
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/ui/loanriskcontrol/icons/battery/icon.css" />
<script type="text/javascript">

var ${pageId}={
    <jsp:include page="../default_view_object.jsp" />
  	mapTagIconPath : "${pageContext.request.contextPath}/ui/loanriskcontrol/icons/tag/",
  	markerOnMap : {},
  	inEditing : false,
  	inEditingBizData : null,
  	mapCenterChangeListeners:[],
  	getGrid : function() {
  	  return $("#tblWatching");
  	},
  	
  	buildDeviceCmd : function(cmd, vehicleId, pwd, content) {
  	  // *cmd,S20_1,1,wyl,1,656636600202041,12345,1#
  	  return "*cmd," + cmd + ",1,${user.loginId},${user.customerId},"+vehicleId+"," + pwd + "," + content + "#";
  	},
};

	var mapVehicleIconPath = "${pageContext.request.contextPath}/ui/loanriskcontrol/icons/vehicle/1688/25x25/s_";
	var gridVehicleIconPath = "${pageContext.request.contextPath}/ui/loanriskcontrol/icons/vehicle/1688/25x25/s_";
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
	  'POWER' : {formatter: powerFormatter},
	  'TEMPRATURE' : {formatter : temperatureFormatter},
	  // 'MECHINESTATUS' : {formatter : mechineStatusFormatter},
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
	  var str =  /**"<img src='" + getGridMarkerIcon(row) + "' />" +*/ value;
	  if (row['MAIN_VEHICLE_ID'] == row['VEHICLE_ID']) {
	  	str = str + (row['NO_LINE'] == '1'?'[无线1]':'[有线1]');
	  }
	  return str;
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
		if (row['NO_LINE'] == '1') {
		  var index = "unknown";
		  	var percent = 0; 
		  if (value) {
		  	percent = parseInt(value);
		  	if (percent > 100) {
		  		percent = parseInt((index - 2000)*100/(3200-2000));
		  	}

		  	if (percent <= 6 && percent > 0) {
		  		percent = percent*100/6;
		  	}
		  	if (percent < 0) {
		  		percent = 0;
		  	}
		  	index = parseInt(percent / 20);
		  }
		  return "<img width='15' height='7' src='${pageContext.request.contextPath}/ui/loanriskcontrol/icons/battery/battery_" + index + ".png' alt='"+value+"'/><font size='1'>"+(percent)+"%</font>";
		  // return "<div style='background:url(\'${pageContext.request.contextPath}/ui/loanriskcontrol/icons/battery/battery_" + index + ".png\') no-repeat;'>"+(index*20)+"%</div>";
		} else {
			return "";
		}
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
		  // autoExpandNodes();
		}
		updateVehicleStatusProc();
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
	   refreshMap(gridRows, node);
	   if (checked) {
	     // if node is vehicle, center to node
	   }
	}
	
	function treeNodeContextMenu(event, node) {
		if (node['VEHICLE_ID']) {
			event.preventDefault();
			getTree().tree('select', node.target);
			deviceCmdTargetVehicles = [{id : node.id, num : node['VEHICLE_NUM']}];
	    	$("#deviceCmdMenu").menu("show", {left:event.clientX,top:event.clientY});
		}
	}

	function treeNodeDblClick(node) {
		if (node) {
		  sendCmd(${pageId}.buildDeviceCmd("A4", node.id, "", ""));
		  getTree().tree("update",{target:node.target, checked:true});
		  getTree().tree("expand", node.target);
		  if (node.id && markerOnMap[node.id]) {
			  showInfoWin(markerOnMap[node.id]);
			  // setCenterByPoi(map, markerOnMap[node.id]);
		  }
		}
		got.clearSelect();
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
	  	var str = node.text;
	  	if (node['MAIN_VEHICLE_ID'] == node['VEHICLE_ID']) {
		  	str = str + (node['NO_LINE'] == '1'?'[无线1]':'[有线1]');
		} 
	    if (got.isEmpty(node['VEHICLE_DISPLAY_STATUS'])) {
	      updateVehicleDisplayStatus(node);
	    } 
	    return str +"("+ node['VEHICLE_DISPLAY_STATUS'] + ")";
	  }
    	return str;
	}
	
	function refreshMap(showVehicles, currentNode) {
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
		      obj = createMarker(v['LAT'], v['LNG'],getMarkerIcon(v), v['VEHICLE_NUM'], showInfoWin );
		      obj['bizObj'] = v;
		      addMarker(map,obj);
		      markerOnMap[v['VEHICLE_ID']] = obj;
	      } else {
	        if (typeof currentNode != 'undefined' && currentNode && v['VEHICLE_ID'] == currentNode['VEHICLE_ID']) {
		        if (invalidVehicles != "") {
		          invalidVehicles += ",";
		        }
		        invalidVehicles += v['VEHICLE_NUM'];
	        }
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
	
	function getGridMarkerIcon(obj) {
		return gridVehicleIconPath + obj['iconCls'].replace("car_","") +'.png';
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
	  if (columnMap[key] && columnMap[key].formatter && key != 'VEHICLE_NUM') {
	    return columnMap[key].formatter(data[key], data , 0);
	  } else if (key == 'MECHINESTATUS') {
	    if ((data[key] == null || data[key].indexOf('离线')>=0) && data['NO_LINE'] != '1') {
	      return "";
	    } else {
	    	var ms = data[key];
	      if(ms.length > 10) {
	      	ms = "<a title='" + ms +"'>" + ms.substring(0,10) +"...</a>";
	      }
	      return ms;
	    }
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
	    // infoContext = infoContext.split('{EXTEND_DATA}').join('');
	    return infoContext;
	  }
	  return "";
	}
	
	function btnTreeQueryAllClick() {
		vehicleFilterChange('');
	}
	
	function btnTreeQueryOnlineClick() {
		vehicleFilterChange('在线');
	}
	
	function btnTreeQueryOfflineClick() {
		vehicleFilterChange('离线');
	}
	
	function btnTreeQueryNotActiveClick() {
		vehicleFilterChange('未激活');
	}
	
	function querySummaryOfVehicleCount() {
		var view = ${pageId};
		var postData = view.buildFormDataObject(view, null);
		postData['fwParam.queryType'] = 'vehicleCountSummary';
		got.ajax({
			type : "POST",
			url : "getExtendData",
			dataType : "json",
			data : postData,
			async : true,
			error : function(res, ts, e) {
				console.info(e);
			},
			success : function(result) {
				if (result && result.success) {
					$('#btnTreeQueryAll').linkbutton({text:'全部<sub>' + result.resultData['ALL'] + '</sub>'});
					$('#btnTreeQueryOnline').linkbutton({text:'在线<sub>' + result.resultData['ONLINE'] + '</sub>'});
					$('#btnTreeQueryOffline').linkbutton({text:'离线<sub>' + result.resultData['OFFLINE'] + '</sub>'});
					$('#btnTreeQueryNotActive').linkbutton({text:'未激活<sub>' + result.resultData['NOT_ACTIVE'] + '</sub>'});
				} else {
					console.info(result);
				}
			}
		});
	}
	
	function vehicleFilterChange(newValue, oldValue) {
		$('#vehicleFilter').val(newValue);
  		var queryValue = $('#vehicleSearcher').searchbox('getValue');
	  getTree().tree({url:'getTreeData?fwCoord.project=${view.coord.project }&fwCoord.function=${view.coord.function}&fwCoord.view=${view.coord.view }&fwParam.queryType=' + newValue +'&fwParam.queryValue=' + queryValue});
	  getTree().tree("reload");
	  querySummaryOfVehicleCount();
	}
	
	
	function vehicleSearch(value, name) {
  		// var queryType = $('#vehicleFilter').combobox('getValue');
  		var queryType = $('#vehicleFilter').val();
	  getTree().tree({url:'getTreeData?fwCoord.project=${view.coord.project }&fwCoord.function=${view.coord.function}&fwCoord.view=${view.coord.view }&fwParam.queryType=' + queryType +'&fwParam.queryValue=' + value});
	  getTree().tree("reload");
	  querySummaryOfVehicleCount();
	}
	
	function listSelect(rowIndex, rowData) {
	  treeNodeDblClick(rowData);
	}
	
	function sendCmd(cmd) {
	  amq.sendMessage("topic://CLIENT.TOPIC.CMD.UP", cmd);
	}
	
	function treePanelResize(width, height) {
	  $("#vehicleSearcher").searchbox("resize", width - 10);
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
		querySummaryOfVehicleCount();
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
		   if (node['NO_LINE'] != '1' && !got.isEmpty(node['VEHICLE_GPS_TIME']) && got.toDate(node['VEHICLE_GPS_TIME']) > limitDate) {
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
	var amq = null;
	var mqMsgHandler = {
		onCmd: function(msgStr) {
		  console.info("1_${user.loginId}_${user.customerId} cmd:" + msgStr);
		  if (msgStr) {
		  	var msgs = msgStr.split('#');
		  	var msg = null;
		  	for(var i = 0; i < msgs.length; ++i) {
		  		msg = msgs[i];
		  		if (msg == null || msg == '') {
		  			continue;
		  		}
		  		if (msg == '*tst') {
		  			setTimeout(function() {
		  				amq.sendMessage("topic://CLIENT.TOPIC.CMD.UP", "*lgn,1,${user.loginId},${user.customerId}#");
		  			}, 5000);
		  		}
		  	}
		  }
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
					  		  showInfoWin(openInfoWinMarker);
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
//==MQ End==
	
  function getTree() {
    return $("#treeVehicleList");
  }
  
  function pageInitMap() {
    got.loadOneJs("http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js");
  	map = initMap('map_canvas', "${empty user.args.setting['ADMINISTRATIVE_DIVISION']?'青岛':user.args.setting['ADMINISTRATIVE_DIVISION']}", ${pageId}.mapCenterChangeListeners);		

  	<c:if test="${not empty view.onInit}">
	if (${pageId}['${view.onInit}']) {
	  ${pageId}['${view.onInit}'](${pageId}, $(${pageId}.getId("form")).serialize());
	}
	</c:if>

	  if (autoSelectedVehicleId != null && autoSelectedVehicleId != '') {
	    console.info('call direct show when init')
	    directShowVehicle(autoSelectedVehicleId);
	  } else {
	    console.info('need not direct show when init')
	    autoSelectedVehicleId = null;
	  }
	setInterval(updateVehicleStatusProc, 60000);
  }
  
  function updateVehicleStatusProc() {
    if (vehicleMap) {
      var v = null;
      for(key in vehicleMap) {
        v = vehicleMap[key];
        updateVehicleDisplayStatus(v);
        if (getTree().tree("getNode", v.target)) {
      		getTree().tree("update",{target:v.target, text:v.text});
      		console.info('update:' + v.text);
        }
      }
      if (openInfoWinMarker) {
        showInfoWin(openInfoWinMarker);
      }
    }
  }
  
  function playBack(vehicleId, vehicleNum) {
    window.open('getView?fwCoord.project=${view.coord.project}&fwCoord.function=history&fwCoord.lang=zh_cn&fwCoord.ui=easyui&vehicleId=' + encodeURIComponent(vehicleId) +"&vehicleNum=" + encodeURIComponent(vehicleNum));
  }
  
  function showPanorama(vehicleId, vehicleNum) {
    window.open('getView?fwCoord.project=${view.coord.project}&fwCoord.function=panorama&fwCoord.lang=zh_cn&fwCoord.ui=easyui&vehicleId=' + encodeURIComponent(vehicleId) +"&vehicleNum=" + encodeURIComponent(vehicleNum) +"&lat=" + vehicleMap[vehicleId]['LAT'] +"&lng=" + vehicleMap[vehicleId]['LNG']);
  }
  
  var deviceCmdTargetVehicles = null;
  
  function sendDeviceCmd(event, vehicleId, vehicleNum) {
    deviceCmdTargetVehicles = [{id:vehicleId, num:vehicleNum}];
    $("#deviceCmdMenu").menu("show", {left:event.clientX,top:event.clientY});
    
  }
  
  function deviceCmdHandler(item) {
    var actionId = $("#" + item.id).attr("actionId");
    console.info('clicked:' + item.id +"," + item.name +"," + item.onclick +"," + actionId);
    
    ${pageId}[item.name](${pageId},deviceCmdTargetVehicles, actionId, 0, null );
  }
  
  var autoExpandedGroups = [];
  
  var autoSelectedVehicleId = '${fwParam.otherRequestParameters['vehicleId']}';
  
  function autoExpandNodes() {
    if (autoExpandedGroups && autoExpandedGroups.length > 0) {
	  var id = null;
	  var i = 0;
	  for(; i < autoExpandedGroups.length;++i) {
	    id = autoExpandedGroups[i]['GROUP_ID'];
	    console.info('to find group ' + id);
	    var node = getTree().tree("find", id);
	    if (node) {
	      console.info('found group ' + id);
	      if (node.state == 'open') {
	        console.info('found group opened' + id);
	        getTree().tree("expand", node.target);
	      } else {
	        console.info('found group not opened' + id);
	        autoExpandedGroups = autoExpandedGroups.slice(i);
	        getTree().tree("expand", node.target);
	        return;
	      }
	    } else {
	      console.info('cannot find group and wait' + id);
	      return;
	    }
	  }
	  if (autoSelectedVehicleId != null) {
	    console.info('all group opened, need vehicle' + autoSelectedVehicleId);
	    var node = getTree().tree("find", autoSelectedVehicleId);
	    if (node) {
	      treeNodeDblClick(node);
	    }
	    autoSelectedVehicleId = null;
	    autoExpanedGroups = [];
	  }
    }
  }
  
  function directShowVehicle(id) {
    console.info('to show ' + id);
    var node = getTree().tree("find", id);
    if (node) {
      treeNodeDblClick(node);
    } else {
      console.info('load ' + id);
      autoSelectedVehicleId = id;
      var postData = ${pageId}.buildFormDataObject(${pageId}, "");
      postData["id"] = id;
      got.ajax({
  		  cache : true,
  		  type : "POST",
  		  url : "queryTreeData",
  		  dataType : "json",
  		  data : postData,
  		  async : true,
  		  error : function(res, ts, e) {
  		    // $.messager.alert('提示','数据加载错误。','error');
  		  },
  		  success : function(returnData) {
  		    if (returnData == null) {
  		      // $.messager.alert('提示','数据加载错误。','error');
  		      return;
  		    }
  		    // autoExpandedGroups = returnData;
  		    console.info(returnData);
  		    if (returnData && returnData.length && returnData.length > 0) {
  		    	if (returnData[returnData.length -1]) {
  		    		var index = returnData.length - 1;
  		    		var vehicle = returnData[index];
  		    		var node = null;
  		    		if (vehicle['LRC_STATUS'] && vehicle['LRC_STATUS'] == '2') {
  		    			node = getTree().tree('find', '-2');
  		    			index = index - 1;
  		    		} else if (vehicle['IS_FOCUSED'] && vehicle['IS_FOCUSED'] == '1') {
  		    			node = getTree().tree('find', '-1');
  		    			index = index - 1;
  		    		} else {
	  		    		for (; index>=0; --index) {
	  		    			node = getTree().tree('find', returnData[index]['id']);
	  		    			if (node && node.target) {
	  		    				break;
	  		    			}
	  		    		}
  		    		}
  		    		var addedNode = null;
  		    		for (var i = index + 1; i < returnData.length; ++i) {
  		    			getTree().tree('append', {parent:node?node.target:null,data:[returnData[i]]});
  		    			node = getTree().tree('find', returnData[i].id);
  		    		}
  		    		getTree().tree('expandTo', node.target);
  		    		getTree().tree('scrollTo', node.target);
  		    		// vehicleMap[node['VEHICLE_ID']] = node;
  		    		getTree().tree('select', node.target);
  		    		treeNodeDblClick(node);
  		    	}
  		    }
  		    // autoExpandNodes();
  		  }
  		});		
  	}
  }

	$(function() {
	  if (autoSelectedVehicleId != null && autoSelectedVehicleId != '') {
	    console.info('call direct show when init')
	    directShowVehicle(autoSelectedVehicleId);
	  } else {
	    console.info('need not direct show when init')
	    autoSelectedVehicleId = null;
	  }
	});
</script>
<title>${view.title }</title>
</head>
<body class="easyui-layout">
	<div data-options="region:'west',split:true, width:300" title="车辆列表">
    <div class="easyui-layout" data-options="fit:true">
      <div data-options="region:'south',split:false,border:false">
      <!-- 
            <input type="button" value="demo" onClick="$('#treeVehicleList2').show();$('#treeVehicleList').hide();" />
            <input type="button" value="demo2" onClick="$('#treeVehicleList').show();$('#treeVehicleList2').hide();" />
       -->
      </div>
      <div data-options="region:'north',split:false,border:false,onResize:treePanelResize,height:60">
      <a id="btnTreeQueryAll" href="#" class="easyui-linkbutton" data-options="group:'vehicleFilter', toggle:true,plain:true,selected:true,onClick:btnTreeQueryAllClick">全部</a>  
      <a id="btnTreeQueryOnline" href="#" class="easyui-linkbutton" data-options="group:'vehicleFilter', toggle:true,plain:true,selected:false,onClick:btnTreeQueryOnlineClick">在线</a>  
      <a id="btnTreeQueryOffline" href="#" class="easyui-linkbutton" data-options="group:'vehicleFilter', toggle:true,plain:true,selected:false,onClick:btnTreeQueryOfflineClick">离线</a>  
      <a id="btnTreeQueryNotActive" href="#" class="easyui-linkbutton" data-options="group:'vehicleFilter', toggle:true,plain:true,selected:false,onClick:btnTreeQueryNotActiveClick">未激活</a>  
      <br>

      <input id="vehicleFilter" type="hidden" />
      <!-- 
		<select id="vehicleFilter" class="easyui-combobox" name="vehicleFilter" data-options="editable:false, onChange:vehicleFilterChange">   
		    <option value="">全部</option>
		    <option value="在线">在线</option>
		    <option value="离线">离线</option>
		    <option value="未激活">未激活</option>
		    <option value="停车">停车</option>
		    <option value="行驶">行驶</option>
		    <option value="超速">超速</option>
		    <option value="停车超时">停车超时</option>
		    <option value="定位中">定位中</option>
		</select>
       -->
		<input id="vehicleSearcher" class="easyui-searchbox"  data-options="searcher:vehicleSearch,prompt:'输入搜索...',value:'${fwParam.queryValue }'"></input> 
      </div>
      <div data-options="region:'center',split:false,border:false" width="100%" height="100%">
        <ul id="treeVehicleList" class="easyui-tree" data-options="checkbox:true,
        	url : 'getTreeData?fwCoord.project=${view.coord.project }&fwCoord.function=${view.coord.function}&fwCoord.view=${view.coord.view }&fwParam.queryValue=${fwParam.queryValue }', 
        	onLoadSuccess : treeLoadSuccess, 
        	onClick : treeNodeClick, 
        	onDblClick : treeNodeDblClick, 
        	formatter : treeNodeFormatter, 
        	onSelect : treeNodeSelect, 
        	onCheck : treeNodeCheck,
        	onContextMenu : treeNodeContextMenu,
        	"></ul>
        <ul id="treeVehicleList2" style="display:none" class="easyui-tree" data-options="checkbox:true, onLoadSuccess:treeLoadSuccess"></ul>
      </div>
    </div>
	</div>

	<div data-options="region:'center',split:false,border:false">
		<div class="easyui-layout" data-options="fit:true">
			<div data-options="region:'center',split:false,tools:'#mapToolsBtn'" title="监控地图" id="map_canvas">
			</div>	
			<div data-options="region:'south',split:true,height:150, onResize:gridPanelResize">
		      <div id="tabWatching" class="easyui-tabs" data-options="fit:true,region:'south',split:true,tools:[
	<c:forEach var="act" items="${view.actions}">
		<c:if test="${act.group == 'inGridTitle' && act.visible}">
			{iconCls:'${act.icon }', handler:function(event) {${pageId }.${act.click}(${pageId },null,'${act.id }',0,event)} },
		</c:if>
	</c:forEach>
	]">
		        <div title="监控列表" >
		        	<table id="tblWatching" width="100%">
					<tbody id="tblWatchingDataArea" width="100%">
					</tbody>
					</table>
		        </div>
		      </div>
			</div>
		</div>
	</div>

	<div id="infoWinTemp"  title="消息框内容"
		style="display:none">
		<h4 style='margin:0 0 5px 0;padding:0.2em 0'><table width="100%"><tr><td>{VEHICLE_NUM} 贷款状态:{LRC_STATUS}</td><td align="right">{POWER}</td></tr></table></h4>
		<table>
		<tr><td valign='top' style='width:65px;text-align:left;font-weight:bold'>状态：</td><td>{VEHICLE_DISPLAY_STATUS} {MECHINESTATUS}</td><tr>
		<tr><td valign='top' style='width:65px;text-align:left;font-weight:bold'>时间：</td><td>{CREATE_TIME}</td><tr>
		<tr><td valign='top' style='width:65px;text-align:left;font-weight:bold'>GPS时间：</td><td>{GPS_TIME}</td><tr>
		<tr><td valign='top' style='width:65px;text-align:left;font-weight:bold'>速度：</td><td>{SPEED}</td><tr>
		<tr><td valign='top' style='width:65px;text-align:left;font-weight:bold'>当日里程：</td><td>{TODAY_MILEAGE}</td><tr>
		<tr><td valign='top' style='width:65px;text-align:left;font-weight:bold'>位置：</td><td>{ADDRESS}</td><tr>
		<tr><td colspan='2'>
		<input type='button' onclick='playBack("{VEHICLE_ID}","{VEHICLE_NUM}")' value='轨迹回放' />&nbsp;
		<input type='button' onclick='vehicleTrack("{VEHICLE_ID}")' value='跟踪' />&nbsp;
		<input type='button' onclick='showPanorama("{VEHICLE_ID}","{VEHICLE_NUM}")' value='街景' />&nbsp;
		<input type='button' onclick='sendDeviceCmd(event, "{VEHICLE_ID}","{VEHICLE_NUM}")' value='发送指令' />
		</td><tr>
		</table>		
	</div>
	
	<div id="winTrack" class="easyui-window"  title="单车跟踪"
		data-options="closed:'true'" 
		style="width: 250px; height: 250px;padding: 0px">
	</div>

	<div id="deviceCmdMenu" style="display: none; " class="easyui-menu" data-options="onClick:deviceCmdHandler">
		<c:forEach var="cmd" items="${otherActions['deviceCmd'].children}" varStatus="status">
			<div id="${pageId}_${cmd.id }" name="${cmd.click }" actionId="${cmd.id }" data-options="iconCls:'${cmd.icon }'">${cmd.label }</div>
		</c:forEach>
	</div>
	<div id="${pageId}_dialogs" style="display: none">
		<div id="${pageId}_relay_dialog">
		<table width="100%">
		<tr>
		<td>
<b>${project.props['project.name'] }提醒您：</b><br><br>
      在使用“${project.props['project.name'] }”断油断电/供油供电功能前，请您务必仔细阅读并透彻理解本声明。您可以选择不使用“${project.props['project.name'] }”断油断电/供油供电功能，但如果您确定要使用，您的使用行为将被视为对本声明全部内容的认可。<br><br>
			1、尊敬的“${project.props['project.name'] }”用户，“${project.props['project.name'] }”的断油断电/供油供电功能须您增配了“${project.props['project.name'] }”继电器等相关硬件之后方可使用；<br><br>
			2、在您增配了“${project.props['project.name'] }”继电器等相关硬件之后，便可以利用断油断电/供油供电功能向“${project.props['project.name'] }”发出指令，对相应车辆进行断油断电/供油供电操作；<br><br> 
			3、鉴于断油断电/供油供电可能对被操作车辆带来不安全的负面影响，在您使用此功能之前请充分考虑是否确实要即时对相关车辆断油断电/供油供电； <br><br>
			4、对您执行断油断电/供油供电功能所带来的一切后果，${project.props['project.name'] }概不负责，亦不承担任何法律责任； <br><br>
			5、如因不可抗力或其他无法控制的原因造成“${project.props['project.name'] }”断油断电/供油供电功能无法正常使用，从而导致相关损失，${project.props['project.name'] }将不承担责任，亦不承担任何法律责任。<br>
			</td>
			</tr>
			<tr>
			<td align="center">
			密码：<input id="${pageId}_relay_password" class="easyui-textbox" data-options="type:'password',required:true" style="width:100px"> <font color="#ff0000">*</font>
			</td>
			</tr>
		</table>
		</div>

		<div id="${pageId}_relayOff_dialog">
		<table width="100%">
			<tr>
			<td>&nbsp;
			</td>
			</tr>
			<tr>
			<td align="center">
			密码：<input id="${pageId}_relayOff_password" class="easyui-textbox" data-options="type:'password',required:true" style="width:100px"> <font color="#ff0000">*</font>
			</td>
			</tr>
		</table>
		</div>

		<div id="${pageId}_setInterval_dialog">
		<table width="100%">
			<tr>
			<td colspan="2">&nbsp;
			</td>
			</tr>
			<tr>
				<td align="right">回传间隔(秒/次):</td>
				<td align="left">
				<input id="${pageId}_setInterval_value" class="easyui-textbox" data-options="type:'text',required:true" style="width:100px"> <font color="#ff0000">*</font>
				</td>
			</tr>
			<tr>
				<td align="right">密码：</td>
				<td align="left">
				<input id="${pageId}_setInterval_password" class="easyui-textbox" data-options="type:'password',required:true" style="width:100px"> <font color="#ff0000">*</font>
				</td>
			</tr>
		</table>
		</div>

		<div id="${pageId}_setInterval_dialog2">
		<table width="100%">
			<tr>
			<td colspan="2">&nbsp;
			</td>
			</tr>
			<tr>
				<td align="right"><input type="radio" id="${pageId}_setInterval_timerMode" name="intervalMode" value="interval" checked/><label for="${pageId}_setInterval_timerMode">定时模式</label></td>
				<td align="left">
					间隔： <input id="${pageId}_setInterval_min" name="intervalGroupCtl" class="easyui-textbox" data-options="type:'text'" style="width:50px"> 分<input id="${pageId}_setInterval_sec" name="intervalGroupCtl" class="easyui-textbox" data-options="type:'text'" style="width:50px"> 秒
				</td>
			</tr>
			<tr>
			<td colspan="2">&nbsp;
			</td>
			</tr>
			<tr>
				<td align="right" valign="top"><input type="radio" id="${pageId}_setInterval_alarmMode" name="intervalMode" value="alarm"/><label for="${pageId}_setInterval_alarmMode">闹钟模式</label></td>
				<td align="left">
					<input type="checkbox" id="${pageId}_setInterval_chkAlarm1" name="alarmGroupCtl"  checked/><label for="${pageId}_setInterval_chkAlarm1">第一组</label><input id="${pageId}_setInterval_alarm1" name="alarmGroupCtl" class="easyui-timespinner"  style="width:100px;" data-options="min:'00:00',showSeconds:false" /> 
					<input type="checkbox" id="${pageId}_setInterval_chkAlarm2" name="alarmGroupCtl"  checked/><label for="${pageId}_setInterval_chkAlarm2">第二组</label><input id="${pageId}_setInterval_alarm2" name="alarmGroupCtl" class="easyui-timespinner"  style="width:100px;" data-options="min:'00:00',showSeconds:false" />
					<br><br>
					<input type="checkbox" id="${pageId}_setInterval_chkAlarm3" name="alarmGroupCtl"  checked/><label for="${pageId}_setInterval_chkAlarm3">第三组</label><input id="${pageId}_setInterval_alarm3" name="alarmGroupCtl" class="easyui-timespinner"  style="width:100px;" data-options="min:'00:00',showSeconds:false" />
					<input type="checkbox" id="${pageId}_setInterval_chkAlarm4" name="alarmGroupCtl"  checked/><label for="${pageId}_setInterval_chkAlarm4">第四组</label><input id="${pageId}_setInterval_alarm4" name="alarmGroupCtl" class="easyui-timespinner"  style="width:100px;" data-options="min:'00:00',showSeconds:false" />
				</td>
			</tr>
			<tr>
			<td colspan="2">&nbsp;
			</td>
			</tr>
			<tr>
				<td align="right">密码：</td>
				<td align="left">
				<input id="${pageId}_setInterval_password2" class="easyui-textbox" data-options="type:'password',required:true" style="width:100px"> <font color="#ff0000">*</font>
				</td>
			</tr>
		</table>
		</div>

		<div id="${pageId}_setText_dialog">
		<table width="100%">
			<tr>
			<td colspan="2">&nbsp;
			</td>
			</tr>
			<tr>
				<td id="${pageId}_setText_label" align="right">内容:</td>
				<td align="left">
				<input id="${pageId}_setText_value" class="easyui-textbox" data-options="type:'text',required:true" style="width:100px"> <font color="#ff0000">*</font>
				</td>
			</tr>
		</table>
		</div>

		<div id="${pageId}_setNumber_dialog">
		<table width="100%">
			<tr>
			<td colspan="2">&nbsp;
			</td>
			</tr>
			<tr>
				<td id="${pageId}_setNumber_label" align="right">内容:</td>
				<td align="left">
				<input id="${pageId}_setNumber_value" class="easyui-numberbox" data-options="min:0, precision:0, required:true" style="width:100px"> <font color="#ff0000">*</font>
				</td>
			</tr>
		</table>
		</div>
	</div>
	
	<div>
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
		</form>	
	</div>
</body>
</html>