<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
<script type="text/javascript"
	src="http://api.map.baidu.com/api?v=2.0&ak=u2vZ9fT7lIzbgGkBTlFQu4Y6"></script>
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
	var mapIconPath = "${pageContext.request.contextPath}/ui/loanriskcontrol/icons/vehicle/default/s_";
	var markerOnMap = {};
	var vehicleFilterName = "";
	var openInfoWinMarker = null;
	var allColumns = [];
	
	function treeLoadSuccess(node, data) {
		//if (node && node.id) {
		//console.info(node.id);
		//}
		// console.info(data);
		for (var i = 0; i < data.length; ++i) {
			// data[i].text = data[i].text +"1";
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
	      obj = createMarker(v['LAT2'], v['LNG2'],getMarkerIcon(v), v['VEHICLE_NUM'], showInfoWin );
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
	
	function buildInfoContent(obj) {
	  var bizObj = obj['bizObj'];
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
//==========baidu map relative begin=====================	
function showInfoWin(marker) {
	var opts = {
	  width : 250,     // 信息窗口宽度
	  height: 0     // 信息窗口高度
	};
	var sContent = buildInfoContent(marker);
	var infoWindow = new BMap.InfoWindow(sContent,opts); // 创建信息窗口对象

	marker.openInfoWindow(infoWindow);
	openInfoWinMarker = marker;

	infoWindow.redraw();
}
function setCenterByPoi(map, poi) {
  if (poi['getPosition']) {
  	map.setCenter(poi.getPosition());
  } else if (poi['getPath']) {
    map.setCenter(poi.getPath()[0]);
  }
}
function deleteMarker(map, marker) {
  map.removeOverlay(marker);
}
function addMarker(map, marker) {
	map.addOverlay(marker);
}

function deleteLine(map, line) {
  map.removeOverlay(line);
  if (line['bizLabel']) {
    map.removeOverlay(line['bizLabel']);
  }
}
function addLine(map, line) {
  map.addOverlay(line);
  if (line['bizLabel']) {
    map.addOverlay(line['bizLabel']);
  }
}

function deleteArea(map, area) {
  map.removeOverlay(line);
  if (area['bizLabel']) {
    map.removeOverlay(area['bizLabel']);
  }
}
function addArea(map, area) {
  map.addOverlay(area);
  if (area['bizLabel']) {
    map.addOverlay(area['bizLabel']);
  }
}
//添加标注到地图
function createMarker(lat, lng, icon, label, showInfoWinProc) {
	var marker = new BMap.Marker(new BMap.Point(lng,lat), {icon:new BMap.Icon(icon, new BMap.Size(32,32))});
	var labelObj = new BMap.Label(label, {offset : new BMap.Size(20, 0)});
	marker.setLabel(labelObj);
	
	marker.addEventListener("infowindowclose", function(event) {
		openInfoWinMarker = null;
	});

	// 响应地图标注点击事件
	marker.addEventListener("click", function(event) {
	  showInfoWinProc(event.target);
	});
	return marker;
}

function createLine(latlngs, label, color, thickness, opacity) {
  	var farr = latlngs.split(';');
  	var points = [];
  	for (var i = 0; i < farr.length; ++i) {
  	  var sarr = farr[i].split(',');
  	  if (sarr.length > 1) {
  	  	points.push(new BMap.Point(sarr[1],sarr[0]));
  	  }
  	}
	var polyline = new BMap.Polyline(points, {strokeColor:color, strokeWeight:2, strokeOpacity:(opacity?opacity:0.5)}); 
	
	var labelObj = new BMap.Label(label, {position : polyline.getPath()[0], offset : new BMap.Size(-10, -10)});
	polyline['bizLabel'] = labelObj;
	return polyline;
}

function createArea(latlngs, label, color, thickness, opacity, fillColor, fillOpacity) {
  	var farr = latlngs.split(';');
  	var points = [];
  	for (var i = 0; i < farr.length; ++i) {
  	  var sarr = farr[i].split(',');
  	  if (sarr.length > 1) {
  	  	points.push(new BMap.Point(sarr[1],sarr[0]));
  	  }
  	}
	var area = new BMap.Polygon(points, {strokeColor:color, strokeWeight:2, strokeOpacity:(opacity?opacity:0.5), fillColor:fillColor,fillOpacity:(fillOpacity?fillOpacity:0.5)}); 
	
	var labelObj = new BMap.Label(label, {position : area.getPath()[0], offset : new BMap.Size(-10, -10)});
	area['bizLabel'] = labelObj;
	return area;
}
//==========baidu map relative end=====================		
	
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
	});
</script>
<title>地图展示</title>
</head>
<body class="easyui-layout">

	<div data-options="region:'west',split:true" title="车辆列表" style="width: 200px;">
    <div class="easyui-layout" data-options="fit:true">
      <div data-options="region:'south',split:false,border:false">
      <!-- 
            <input type="button" value="demo" onClick="$('#treeVehicleList2').show();$('#treeVehicleList').hide();" />
            <input type="button" value="demo2" onClick="$('#treeVehicleList').show();$('#treeVehicleList2').hide();" />
       -->
      </div>
      <div data-options="region:'north',split:false,border:false, ">
		<select id="vehicleFilter" class="easyui-combobox" name="vehicleFilter" data-options="editable:false, onChange:vehicleFilterChange" width="100%">   
		    <option value="">全部</option>
		    <option value="在线">在线</option>
		    <option value="离线">离线</option>
		    <option value="停车">停车</option>
		    <option value="行驶">行驶</option>
		    <option value="超速">超速</option>
		    <option value="停车超时">停车超时</option>
		    <option value="定位中">定位中</option>
		</select>
		<input id="vehicleSearcher" class="easyui-searchbox" style="width:100px" data-options="searcher:vehicleSearch,prompt:'输入搜索...',value:'${fwParam.queryValue }'" width="100%"></input> 
      </div>
      <div data-options="region:'center',split:false,border:false">
        <ul id="treeVehicleList" class="easyui-tree" data-options="checkbox:true,url:'getTreeData?fwCoord.project=${view.coord.project }&fwCoord.function=${view.coord.function}&fwCoord.view=${view.coord.view }&fwParam.queryValue=${fwParam.queryValue }', onLoadSuccess:treeLoadSuccess, onClick:treeNodeClick, onDblClick:treeNodeDblClick, formatter:treeNodeFormatter, onSelect:treeNodeSelect, onCheck:treeNodeCheck"></ul>
        <ul id="treeVehicleList2" style="display:none" class="easyui-tree" data-options="checkbox:true, onLoadSuccess:treeLoadSuccess"></ul>
      </div>
    </div>
	</div>

	<div data-options="region:'center',split:false,border:false">
		<div class="easyui-layout" data-options="fit:true">
			<div data-options="region:'center',split:false,tools:'#mapToolsBtn'" title="监控地图" id="map_canvas">
			</div>	
			<div id="addressBox"  title="地址检索" style="display:none">	
			<div id="searchBox"></div>
			<div id="r-result">
			<input type="text" id="suggestId" size="20" value="百度" style="width: 290px;"/>
			</div>
			<div id="searchResultPanel"
				style="border: 1px solid #C0C0C0; width: 150px; height: auto; display: none;"></div>
			</div>
			<div data-options="region:'south',split:true" style="height: 150px;">
		      <div id="tt" class="easyui-tabs" data-options="fit:true,region:'south',split:true,">
		        <div title="监控列表" >
		        	<table id="tblWatching">
					<tbody id="tblWatchingDataArea">
					</tbody>
					</table>
		        </div>
		      </div>
			</div>
		</div>
	</div>

	<div id="infoWinTemp"  title="消息框内容"
		style="display:none">
		<h4 style='margin:0 0 5px 0;padding:0.2em 0'>{VEHICLE_NUM}</h4>
		<table>
		<tr><td valign='top' style='width:65px;text-align:left;font-weight:bold'>状态：</td><td>{VEHICLE_STATUS_NAME}</td><tr>
		<tr><td valign='top' style='width:65px;text-align:left;font-weight:bold''>时间：</td><td>{CREATE_TIME}</td><tr>
		<tr><td valign='top' style='width:65px;text-align:left;font-weight:bold''>GPS时间：</td><td>{GPS_TIME}</td><tr>
		<tr><td valign='top' style='width:65px;text-align:left;font-weight:bold''>位置：</td><td>{ADDRESS}</td><tr>
		<tr><td colspan='2'>
		<input type='button' onclick='playBack("{VEHICLE_ID}","{VEHICLE_NUM}")' value='轨迹回放' />&nbsp;
		<input type='button' onclick='vehicleTrack("{VEHICLE_ID}")' value='跟踪' />
		</td><tr>
		</table>		
	</div>
	
	<div id="winTrack" class="easyui-window"  title="单车跟踪"
		data-options="closed:'true'" 
		style="width: 250px; height: 250px;padding: 0px">
	</div>

</body>
</html>
<script type="text/javascript">
	// 百度地图API功能
	var map = new BMap.Map("map_canvas"); // 创建Map实例
	map.centerAndZoom(new BMap.Point(120, 36), 11); // 初始化地图,设置中心点坐标和地图级别
	map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
	map.setCurrentCity("青岛"); // 设置地图显示的城市 此项是必须设置的
	map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
</script>
