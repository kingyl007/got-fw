// ============= 设置地图开始 ===================

function setMap(map, mapType, _lat, _lng, _zoom) {
	var lnglat = new MMap.LngLat(_lng, _lat);
	var mapOptions = {
		level: _zoom,
		center: lnglat,
		doubleClickZoom: true,
		scrollwheel: true
	}
	map = new MMap.Map("map_canvas", mapOptions);
	map.bind(map, "dragend", function() {
		var center = map.getCenter();
		lat = center.lat;
		lng = center.lng;
	});
	map.bind(map, "zoomchange", function() {
		var center = map.getCenter();
		lat = center.lat;
		lng = center.lng;
		zoom = map.getZoom();
	});
	map.bind(map, "resize", function() {
		addToolBar(map);
	});
	addToolBar(map);
	return map;
}

function addToolBar(map) {
    var width = $(window).width();
    map.plugin(["MMap.ToolBar","MMap.OverView","MMap.Scale"],function(){    
        if(map.toolbar != null) {
            map.removeControl(map.toolbar);
        }
        map.toolbar = new MMap.ToolBar({offset:new MMap.Pixel (width - 420,200), ruler:true, direction:true});
        map.addControl(map.toolbar);
    });    

}

function centerTo(map, _lat, _lng) {
	map.panTo(new MMap.LngLat(_lng, _lat));
	lat = _lat;
	lng = _lng;
}

function amplify(map, _lat, _lng ,_zoom){
	map.setZoom(_zoom);
	centerTo(map, _lat, _lng);
}


// ============= 设置地图结束 ===================

// ============= 地图工具开始 ===================

function isPointInMap(_lat, _lng, map) {
    var bounds = map.getBounds();
    var sw = bounds.southwest;
    var ne = bounds.northeast;
    if(_lat >= sw.lat && _lat <= ne.lat && _lng >= sw.lng && _lng <= ne.lng) {
        return true;
    } else {
        return false;
    }
}

function drawLine(startLat, startLng, endLat, endLng, map) {
    var path = [];
    path.push(new MMap.LngLat(startLng, startLat));
    path.push(new MMap.LngLat(endLng, endLat));
    var polyline = new MMap.Polyline({
        id: "polyline_",
        path: path,
        strokeColor: "#48ed00",
        strokeOpacity: 1.0,
        strokeWeight: 4
    });
    map.addOverlays(polyline);
}

//可手动拖动的标记
function moveMarker(vehicleId,vehicleNum,lat,lng){
	//0.00127041,0.001270409  200m
	if(mMarker!=null){
		map.removeOverlays("m");
	}
	var atng = new MMap.LngLat(lng,lat);
	var latlng = new MMap.LngLat(lng+0.0020,lat);
	mMarker = new MMap.Marker({
		id: "m",
		position: latlng,
		offset:new MMap.Pixel(-10, -30),
		visible:true,
		draggable: true
	});
	map.addOverlays(mMarker);
	if(infoWindowX!=null){
		infoWindowX.setMessage(vehicleId,vehicleNum,'200',mMarker.getPosition());
	}else{
		infoWindowX = new XXInfoWindow(vehicleId,vehicleNum,'200',mMarker.getPosition(), map, true);
	}
	drawCircle(lat,lng,200,true);
	map.bind(mMarker, 'dragging', function(e) {
		m = getGreatCircleDistance(lat,lng,mMarker.getPosition().lat,mMarker.getPosition().lng);
		infoWindowX.setMessage(vehicleId,vehicleNum,m,mMarker.getPosition());
	});
	map.bind(mMarker, 'dragend', function(e) {
		drawCircle(lat,lng,m,true);
		//alert(Cpoints);
	});
}

//取点
function drawCircle(lat, lng, radius, flag) {
	
	radius = radius/1600;
	var d2r = Math.PI / 180;
	var r2d = 180 / Math.PI;
	var Clat = radius * 0.014483;  // Convert statute miles into degrees latitude
	var Clng = Clat / Math.cos(lat * d2r);
	if(Cpoints.length!=0){
		Cpoints.length = 0;
	}
	// 计算圆周上33个点的经纬度，若需要圆滑些，可以增加圆周的点数
	for (var i = 0; i < 33; i++) {
		var theta = Math.PI * (i / 16);
		Cy = lat + (Clat * Math.sin(theta));
		Cx = lng + (Clng * Math.cos(theta));
		var P = new MMap.LngLat(Cx,Cy);
		Cpoints.push(P);
	}
//	alert(Cpoints);
//	strokeColor = strokeColor || "#0055ff";   // 边框颜色，默认"#0055ff"
//	strokeWidth = strokeWidth || 1;           // 边框宽度，默认1px
//	strokeOpacity = strokeOpacity || 1;       // 边框透明度，默认不透明
//	fillColor = fillColor || strokeColor;     // 填充颜色，默认同边框颜色
//	fillOpacity = fillOpacity || 0.1;         // 填充透明度，默认0.1
	if(flag){
		setCircle(null);
	}else{
		//设置存储围栏
		setFence('200米');
	}
//	return Cpoints;
}

//画圆
function setCircle(points){
	if(polygon!=null){
		clearCircle();
	}
	if(points!=null){
		polygon = new MMap.Polygon({
			id: "c",
			path: points, 
		    strokeColor: "#FF0000",  
		    strokeOpacity: 0.8,  
		    strokeWeight: 2,  
		    fillColor: "#FF0000",  
		    fillOpacity: 0.35
		});
	}else{
		polygon = new MMap.Polygon({
			id: "c",
			path: Cpoints, 
		    strokeColor: "#FF0000",  
		    strokeOpacity: 0.8,  
		    strokeWeight: 2,  
		    fillColor: "#FF0000",  
		    fillOpacity: 0.35  
		});
	}
	map.addOverlays(polygon);	
}

//清除地图上的圆
function clearCircle(){
	map.removeOverlays("c");
	polygon = null;
}

//秦楚地图上的可移动点
function clearMarker(){
	map.removeOverlays("m");
	mMarker = null;
}

//判断一个点是否在一个圆内
function inCircle(lat,lng,polygon){
	var flag = false;	
	var i = 0;
    var j = 0;
    var n = polygon.length;
    for (i = 0, j = n - 1; i < n; j = i++){
        if (((polygon[i].lng > lng) != (polygon[j].lng > lng))&& (lat < (polygon[j].lat - polygon[i].lat) * (lng - polygon[i].lng) / (polygon[j].lng - polygon[i].lng) + polygon[i].lat))
			{
				flag = !flag;
			}
    }
    return flag;
}

//查看围栏
function getFence(vehicleId){
	var p = null;
	if(typeof(vehicleArray) == "undefined"){
		var points = vehicle.mp;
		if(points.length!=0){
			p = points[7];
			amplify(map, p.lat(), p.lng() ,16);
			setCircle(points);
		}else{
			alert("此车并未设置围栏");
		}
	}else{
		for(var i = 0;i<vehicleArray.length;i++){
			if(vehicleArray[i].vid==vehicleId){
				var points = vehicleArray[i].mp;
				if(points.length!=0){
					p = points[7];
					amplify(map, p.lat, p.lng ,16);
					setCircle(points);
				}else{
					alert("此车并未设置围栏");
				}
			}
		}
	}
}

//获取围栏信息的字符串形式
function getFenceString(){
	var p = '';
	for(var i = 0;i<Cpoints.length;i++){
		if(i<Cpoints.length-1){
			p += Cpoints[i].lat+','+Cpoints[i].lng+';';
		}else{
			p += Cpoints[i].lat+','+Cpoints[i].lng;
		}
	}
	return p;
}


function toggleDistanceTool(map) {
	if(distanceTool == null) {
		map.plugin(['MMap.MouseTool'], function() {
			distanceTool = new MMap.MouseTool(map);
			distanceTool.rule();
			distanceTool._isDistanceToolOpen = true;
		});
	} else {
		if(distanceTool._isDistanceToolOpen) {
			distanceTool.close();
			distanceTool._isDistanceToolOpen = false;
		} else {
			distanceTool.rule();
			distanceTool._isDistanceToolOpen = true;
		}
	}
}

// ============= 地图工具结束 ===================

// ============= 地图标注开始 ===================

function createStart(vehicle,map,time){
	var lnglat = new MMap.LngLat(vehicle.lng, vehicle.lat);
	var marker = new MMap.Marker({
		id: "first",
		position: lnglat,
		offset: new MMap.Pixel(-15, -15),
		draggable: false,
		cursor: "default",
		visible: true,
		zIndex: 0
		//content: '始于'+time
	});
	map.addOverlays(marker);
	map.setContent("始于"+time);
}

function createStopMarker(startTime,endTime,result,vehicle,map){
	var lnglat = new MMap.LngLat(vehicle.lng, vehicle.lat);
	var marker = new MMap.Marker({
		id: vehicle.vid+"stop",
		position: lnglat,
		offset: new MMap.Pixel(-15, -15),
		draggable: false,
		cursor: "default",
		visible: true,
		zIndex: 0
	});
	map.addOverlays(marker);
	map.setContent("停车时长:"+result+" \n开始时间:"+startTime+" \n结束时间:"+endTime);
	return marker;
}

function removeMarkers(markers,map){
	for(var i = 0;i<markers.length;i++){
		map.removeOverlays(markers[i]);
	}
}

function createMarker(vehicle, image, map) {
	var lnglat = new MMap.LngLat(vehicle.lng, vehicle.lat);
	var marker = new MMap.Marker({
		id: vehicle.vid,
		position: lnglat,
		icon: image,
		offset: new MMap.Pixel(-15, -15),
		draggable: false,
		cursor: "default",
		visible: true,
		zIndex: 0
	});
	map.addOverlays(marker);
	marker.vid = vehicle.vid;
	map.bind(marker, 'click', function(e) {
		toggleInfoWindow(marker.vid);
		if(polygon!=null){
		//	polygon.setMap(null);
			clearCircle();
		}
		vehicleId = vehicle.vid;
		listStyle();
	});
	return marker;
}

function removeMarker(_vids, _vehicleArray, map) {
	var vids = _vids.split(",");
	for (var i = 0; i < vids.length; i++) {
		for (var j = 0; j < _vehicleArray.length; j++) {
			if (_vehicleArray[j].vid == vids[i]) {
				map.removeOverlays(vids[i]);
				_vehicleArray.splice(j, 1);
				break;
			}
		}
	}
}

function removeAllMarkers(_vehicleArray, map) {
	//map.clearOverlays();
	for (var i = 0; i < _vehicleArray.length; i++) {
		map.removeOverlays(_vehicleArray[i].marker);
	}
	_vehicleArray.length = 0;
	infoWindow = null;
}

function changeMarker(marker, lat, lng, image, map) {
	marker.setPosition(new MMap.LngLat(lng, lat));
	var icon = new MMap.Icon({image:image, size:new MMap.Size(33,33), imageOffset:new MMap.Pixel(0, 0)});
	marker.setIcon(icon);
}

// ============= 地图标注结束 ===================

// ============= 自定义InfoWindow开始 ===================

CXInfoWindow = function(_vehicle, _map, _showControl) {
	this.vehicle_ = _vehicle;
	this.map_ = _map;
	this.showControl = _showControl; // 是否显示控制部分
	 
	var html = '<div id="cartip" class="tips2" style="margin:-15px 0px 0px 30px;">';
	html += '<div class="tip_top" style="font-size:14px; font-weight:bold;">'+this.vehicle_.vn+'<span id="tipclose" onclick="if($.isFunction(window._cxInfoWindowHide)){_cxInfoWindowHide();}" ></span></div>';
//	html += '<div class="tip_mid"><p><b>状态：</b>'+ (this.vehicle_.vsn == "0" ? "停车 " : "行驶 ") + (this.vehicle_.s == null ? "" : this.vehicle_.s) +'</p>';
	var dn = "";
	for(var i = 0;i<directionName.length;i++){
		var text = directionName[i];
		if(text[0]==this.vehicle_.dn){
			dn = text[1];
		}
	}
	html += '<div class="tip_mid"><p><b>状态：</b>'+this.vehicle_.speed+'km/h('+dn+') '+ (this.vehicle_.vsn == "0" ? (this.vehicle_.sl==null?"停车 ":("停车("+this.vehicle_.sl+") ")) : "行驶 ") + (this.vehicle_.s == null ? "" : this.vehicle_.s) +'</p>';
//	html += '<p><b>速度：</b>'+this.vehicle_.speed+' ('+dn+')</p>';
	html += '<p><b>里程：</b>'+this.vehicle_.tm+'(当日)</p>';
	html += '<p><b>信号：</b>'+ (this.vehicle_.ct == null ? "" : this.vehicle_.ct) +'</p>';
	if((this.vehicle_.a)!=null){
		html += '<p id="place"><b>位置：</b>'+this.vehicle_.a.replace(/\s/g, "")+'</p><div id="detailed"><a href="javascript:void(0);" onClick=getDetailed("'+this.vehicle_.vid+'");>查看详细位置</a></div>';
	}else{
		html += '<p id="place"><b>位置：</b>'+this.vehicle_.a+'</p><div id="detailed"><a href="javascript:void(0);" onClick=getDetailed("'+this.vehicle_.vid+'");>查看详细位置</a></div>';
	}
	html += '<p>';
	var type = getCookie("TYPE");
	if(style=="jk"){
		if(model==null){
			if(type=="user"){
				html += '<a id="infowindow_follow"  onclick="if($.isFunction(window.follow)){follow("'+this.vehicle_.vn+'");}"  href="javascript:void(0);" style="float:left">跟踪</a>';
			}
			html += '<a id="infowindow_playback" onclick="if($.isFunction(window.playback)){playback("'+this.vehicle_.vn+'")}" href="javascript:void(0)"  style="float:left">回放</a><a href="javascript:void(0);" onclick="if($.isFunction(window._cxInfoWindowAmplify)){_cxInfoWindowAmplify();}"   style="float:left">放大</a><a href="/reports/mileage.jsp?vehicleNum='+this.vehicle_.vn+'" style="float:left">报表</a>';
			html += '<ul class="sf-menu" id="mores"  style="float:left; width:50px; padding:3px 0px 0px 0px;  margin:2px 0px 0px 0px;">';
			html += '<li class="current" style=" padding:0px; margin:0px;"><a  style=" padding:0px; margin:0px;  color:#3369BA;  font: 12px Microsoft YaHei, 微软雅黑, Arial, Lucida Grande, Tahoma, sans-serif; " onclick=$("#thisul").show();>更多 >></a><ul id="thisul" style="display:none">';
			html += '<li><a href="javascript:void(0);"   onClick=disdialog("'+this.vehicle_.vid+'")>设备信息</a></li>';
			//html += '<li><a>锁定显示</a></li>';
			html += '<li class="current"><a  onclick=$("#subul02").hide();$("#subul01").show();>电子围栏<font  title="设置车辆的活动范围，在启动围栏情况下，车辆超出围栏范围后，平台会提示超范围报警信息。如果设置了短信提醒，手机会收到1条超范围报警（短信费用从设备上的电话卡中按普通短信资费标准扣除）。" style="color:#3399FF;cursor:help;">[?]</font> >></a><ul id="subul01" style="display:none;">';
			html += '<li class="current"><a href="javascript:void(0);" onClick="drawCircle('+this.vehicle_.lat+', '+this.vehicle_.lng+', 200, false)">200米范围</a></li>';
			html += '<li><a href="javascript:void(0);" onclick=moveMarker("'+this.vehicle_.vid+'","'+this.vehicle_.vn+'","'+this.vehicle_.lat+'","'+this.vehicle_.lng+'")>自定义范围</a></li>';
			html += '<li><a href="javascript:void(0);" onclick=getFence("'+this.vehicle_.vid+'")>查看围栏</a></li>';
			html += '<li><a href="javascript:void(0);" onclick=deleteFence("'+this.vehicle_.vid+'")>停用围栏</a></li>';
			html += '<li><a  onclick=$("#smsatt").dialog("open");>短信提醒设置</a></li></ul></li>';
			html += '<li><a  onclick=$("#subul01").hide();$("#subul02").show();>设备指令 >></a><ul id="subul02" style="display:none;">';
			html += '<li><a  onclick=openCutDialog("'+this.vehicle_.vid+'","'+this.vehicle_.vn+'");>远程断油电</a></li>';
			html += '<li><a  onclick=openRestoreDialog("'+this.vehicle_.vid+'","'+this.vehicle_.vn+'");>远程恢复油电</a></li>';
			html += '<li><a  onclick=getSingle("'+this.vehicle_.vid+'");>查询定位</a></li>';
			html += '<li><a href="javascript:void(0);" onClick=download1("'+this.vehicle_.vn+'")>下载轨迹</a></li>';
			html += '</ul></li></ul>';
		}else{
			html += '<a id="infowindow_playback" onclick="if($.isFunction(window.playback)){playback('+this.vehicle_.vn+')}" href="javascript:void(0)"  style="float:left">回放</a><a href="javascript:void(0);" onclick="if($.isFunction(window._cxInfoWindowAmplify)){_cxInfoWindowAmplify();}"   style="float:left">放大</a><a href="/reports/mileage.jsp?vehicleNum='+this.vehicle_.vn+'" style="float:left">报表</a>';
		}
	}
	html += '</p></div><div class="tip_btm"></div></div>';
	
	
	/*var html = '<div id="data"><div class="datat png"><div class="close"><a class="closebt png" onclick="if($.isFunction(window._cxInfoWindowHide)){_cxInfoWindowHide();}" ></a></div><font id="data_vn">' + this.vehicle_.vn + '</font></div>';
	html += '<div class="datac png"><ul class="dataul">';
	html += '<li><span>速度：</span><font id="data_speed">' + (this.vehicle_.speed == null ? "" : (this.vehicle_.speed + "km/h")) + '</font></li>';
	html += '<li><span>里程：</span><font id="data_tm">' + (this.vehicle_.tm == null ? "" : (this.vehicle_.tm + "km")) + '</font></li>';
	html += '<li><span>信号：</span><font id="data_gt">' + (this.vehicle_.gt == null ? "" : this.vehicle_.gt) + '</font></li>';
	html += '<li><span>位置：</span><font id="data_a">' + (this.vehicle_.a == null ? "" : this.vehicle_.a) + '</font></li>';
	//html += '<li class="li01"><a>获取详细位置</a></li>';
	html += '<li><span>状态：</span><font id="data_s">' + (this.vehicle_.vsn == "0" ? "停车 " : "行驶 ") + (this.vehicle_.s == null ? "" : this.vehicle_.s) + '</font></li>';
	if(this.showControl) {
		html += '<li class="li02"><a onclick="if($.isFunction(window._cxInfoWindowPlayback)){_cxInfoWindowPlayback();}">回放</a> <a onclick="if($.isFunction(window._cxInfoWindowFollow)){_cxInfoWindowFollow();}">跟踪</a> <a onclick="if($.isFunction(window._cxInfoWindowCommand)){_cxInfoWindowCommand();}">命令</a></li>';
	}
	html += '</ul></div>';
	html += '<div class="datab png"></div></div>';*/
	this.setContent(html);
	this.map_.addOverlays(this);
	this.offset.y = - $("#cartip").height();
	this.latlng_ = new MMap.LngLat(this.vehicle_.lng, this.vehicle_.lat);
	this.setPosition(this.latlng_);

	this.isShow = true;
};

CXInfoWindow.prototype = new MMap.Marker({id:"infoWindow", position:new MMap.LngLat(0,0), offset:new MMap.Pixel(-22, 0), draggable:false, content:''});

CXInfoWindow.prototype.show = function() {
	$("#infoWindow").css("visibility", "visible");
	this.isShow = true;
};

CXInfoWindow.prototype.hide = function() {
	$("#infoWindow").css("visibility", "hidden");
	this.isShow = false;
};

CXInfoWindow.prototype.toggle = function() {
	if($("#infoWindow").css("visibility") == "hidden") {
		this.show();
	} else {
		this.hide();
	}
};

CXInfoWindow.prototype.setVehicle = function(_vehicle) {
	this.vehicle_ = _vehicle;
	if(this.vehicle_.a==null){
		this.vehicle_.a='';
	}
	this.refresh();
};

CXInfoWindow.prototype.refresh = function() {
/*	$("#data_speed").html(this.vehicle_.speed == null ? "" : (this.vehicle_.speed + "km/h"));
	$("#data_vn").html(this.vehicle_.vn);
	$("#data_tm").html(this.vehicle_.tm == null ? "" : (this.vehicle_.tm + "km"));
	$("#data_gt").html(this.vehicle_.gt == null ? "" : this.vehicle_.gt);
	$("#data_a").html(this.vehicle_.a == null ? "" : this.vehicle_.a);
	$("#data_s").html((this.vehicle_.vsn == "0" ? "停车 " : "行驶 ") + (this.vehicle_.s == null ? "" : this.vehicle_.s));*/

	
	var html = '<div class="tip_top" style="font-size:14px; font-weight:bold;">'+this.vehicle_.vn+'<span id="tipclose" onclick="if($.isFunction(window._cxInfoWindowHide)){_cxInfoWindowHide();}" ></span></div>';
	var dn = "";
	for(var i = 0;i<directionName.length;i++){
		var text = directionName[i];
		if(text[0]==this.vehicle_.dn){
			dn = text[1];
		}
	}
	html += '<div class="tip_mid"><p><b>状态：</b>'+this.vehicle_.speed+'km/h('+dn+') '+ (this.vehicle_.vsn == "0" ? (this.vehicle_.sl==null?"停车 ":("停车("+this.vehicle_.sl+") ")) : "行驶 ") + (this.vehicle_.s == null ? "" : this.vehicle_.s) +'</p>';
//	html += '<p><b>速度：</b></p>';
	html += '<p><b>里程：</b>'+this.vehicle_.tm+'(当日)</p>';
	html += '<p><b>信号：</b>'+ (this.vehicle_.ct == null ? "" : this.vehicle_.ct) +'</p>';
	if((this.vehicle_.a)!=null){
		html += '<p id="place"><b>位置：</b>'+this.vehicle_.a.replace(/\s/g, "")+'</p><div id="detailed"><a href="javascript:void(0);" onClick=getDetailed("'+this.vehicle_.vid+'");>查看详细位置</a></div>';
	}else{
		html += '<p id="place"><b>位置：</b>'+this.vehicle_.a+'</p><div id="detailed"><a href="javascript:void(0);" onClick=getDetailed("'+this.vehicle_.vid+'");>查看详细位置</a></div>';
	}
	html += '<p>';
	if(style=="jk"){
		if(model==null){
			var type = getCookie("TYPE");
			if(type=="user"){
				html += '<a id="infowindow_follow"  onclick="if($.isFunction(window.follow)){follow("'+this.vehicle_.vn+'");}"  href="javascript:void(0);" style="float:left">跟踪</a>';
			}
			html += '<a id="infowindow_playback" onclick="if($.isFunction(window.playback)){playback("'+this.vehicle_.vn+'")}" href="javascript:void(0)"  style="float:left">回放</a><a onclick="if($.isFunction(window._cxInfoWindowAmplify)){_cxInfoWindowAmplify();}" href="javascript:void(0);"  style="float:left">放大</a><a href="/reports/mileage.jsp?vehicleNum='+this.vehicle_.vn+'" style="float:left">报表</a>';
			html += '<ul class="sf-menu" id="mores"  style="float:left; width:50px; padding:3px 0px 0px 0px;  margin:2px 0px 0px 0px;">';
			html += '<li class="current" style=" padding:0px; margin:0px;"><a  style=" padding:0px; margin:0px;  color:#3369BA;  font: 12px Microsoft YaHei, 微软雅黑, Arial, Lucida Grande, Tahoma, sans-serif; " onclick=$("#thisul").show();>更多 >></a><ul id="thisul" style="display:none">';
			html += '<li><a href="javascript:void(0);"   onClick=disdialog("'+this.vehicle_.vid+'")>设备信息</a></li>';
			//html += '<li><a>锁定显示</a></li>';
			html += '<li class="current"><a  onclick=$("#subul02").hide();$("#subul01").show();>电子围栏<font  title="设置车辆的活动范围，在启动围栏情况下，车辆超出围栏范围后，平台会提示超范围报警信息。如果设置了短信提醒，手机会收到1条超范围报警（短信费用从设备上的电话卡中按普通短信资费标准扣除）。" style="color:#3399FF;cursor:help;">[?]</font> >></a><ul id="subul01" style="display:none;">';
			html += '<li class="current"><a href="javascript:void(0);" onClick="drawCircle('+this.vehicle_.lat+', '+this.vehicle_.lng+', 200, false)">200米范围</a></li>';
			html += '<li><a href="javascript:void(0);" onclick=moveMarker("'+this.vehicle_.vid+'","'+this.vehicle_.vn+'","'+this.vehicle_.lat+'","'+this.vehicle_.lng+'")>自定义范围</a></li>';
			html += '<li><a href="javascript:void(0);" onclick=getFence("'+this.vehicle_.vid+'")>查看围栏</a></li>';
			html += '<li><a href="javascript:void(0);" onclick=deleteFence("'+this.vehicle_.vid+'")>停用围栏</a></li>';
			html += '<li><a  onclick=$("#smsatt").dialog("open");>短信提醒设置</a></li></ul></li>';
			html += '<li><a  onclick=$("#subul01").hide();$("#subul02").show();>设备指令 >></a><ul id="subul02" style="display:none;">';
			html += '<li><a  onclick=openCutDialog("'+this.vehicle_.vid+'","'+this.vehicle_.vn+'");>远程断油电</a></li>';
			html += '<li><a  onclick=openRestoreDialog("'+this.vehicle_.vid+'","'+this.vehicle_.vn+'");>远程恢复油电</a></li>';
			html += '<li><a  onclick=getSingle("'+this.vehicle_.vid+'");>查询定位</a></li>';
			html += '<li><a href="javascript:void(0);" onClick=download1("'+this.vehicle_.vn+'")>下载轨迹</a></li>';
			html += '</ul></li></ul>';
		}else{
			html += '<a id="infowindow_playback" onclick="if($.isFunction(window.playback)){playback('+this.vehicle_.vn+')}" href="javascript:void(0)"  style="float:left">回放</a><a onclick="if($.isFunction(window._cxInfoWindowAmplify)){_cxInfoWindowAmplify();}" href="javascript:void(0);"  style="float:left">放大</a><a href="/reports/mileage.jsp?vehicleNum='+this.vehicle_.vn+'" style="float:left">报表</a>';
		}
	}
	html += '</p></div><div class="tip_btm"></div>';
	
	
	$("#cartip").html(html);
	this.setContent($("#infoWindow").html());
	this.offset.y = - $("#cartip").height();

	this.latlng_ = new MMap.LngLat(this.vehicle_.lng, this.vehicle_.lat);
	this.setPosition(this.latlng_);
};

// ============= 自定义InfoWindow结束 ===================

//============= 自定义InfoWindow2开始 ===================

XXInfoWindow = function(_id, _num, _range, _latlng, _map, _showControl) {
	this.vehicleId = _id;
	this.vehicleNum = _num;
	this.range = _range;
	this.latlng = _latlng;
	this.map_ = _map;
	
	this.showControl = _showControl; // 是否显示控制部分
	var html = '<div class="tips2" id="point">' +
    '<div class="tip_top">'+this.vehicleNum+' <span id="pointclose" onclick="clearFence()"></span></div>' +
	'<div class="tip_mid">此处的电子围栏是: '+this.range+'米' +
	'<br/>启用当前围栏<a href="javascript:void(0);" onclick="setFence('+m+')">确定</a>|<a href="javascript:void(0);" onclick="clearFence()">取消</a></div>'+
	'<div class="tip_btm"></div>' +
	'</div>';
	
	this.setContent(html);
	this.map_.addOverlays(this);
	this.offset.y = - $("#point").height() - 20;
	this.isShow = true;
	this.setPosition(this.latlng);
};

XXInfoWindow.prototype = new MMap.Marker({id:"infoWindow2", position:new MMap.LngLat(0,0), offset:new MMap.Pixel(-22, 0), draggable:false, content:''});

XXInfoWindow.prototype.show = function() {
	$("#infoWindow2").css("visibility", "visible");
	this.isShow = true;
};

XXInfoWindow.prototype.hide = function() {
	$("#infoWindow2").css("visibility", "hidden");
	this.isShow = false;
};

XXInfoWindow.prototype.toggle = function() {
	if($("#infoWindow2").css("visibility") == "hidden") {
		this.show();
	} else {
		this.hide();
	}
};

XXInfoWindow.prototype.setMessage = function(id,num,range,latlng) {
	this.vehicleId = id;
	this.vehicleNum = num;
	this.range = range;
	this.latlng = latlng;
	this.refresh();
};

XXInfoWindow.prototype.refresh = function() {
	var html = '<div class="tip_top">'+this.vehicleNum+'<span id="pointclose" onclick="clearFence()"></span></div>' +
	'<div class="tip_mid"> 此处的电子围栏是: '+this.range+'米' +
	'<br/>启用当前围栏<a href="javascript:void(0);" onclick="setFence('+m+')">确定</a>|<a href="javascript:void(0);" onclick="clearFence()">取消</a></div>'+
	'<div class="tip_btm"></div>';

	
	$("#point").html(html);
	
	this.setContent($("#infoWindow2").html());
	this.offset.y = - $("#point").height() - 20;
	this.setPosition(this.latlng);
	this.show();
//	$("#data_speed").html(this.vehicle_.speed == null ? "" : (this.vehicle_.speed + "km/h"));
//	$("#data_vn").html(this.vehicle_.vn);
//	$("#data_tm").html(this.vehicle_.tm == null ? "" : (this.vehicle_.tm + "km"));
//	$("#data_gt").html(this.vehicle_.ct == null ? "" : this.vehicle_.ct);
//	$("#data_a").html(this.vehicle_.a == null ? "" : this.vehicle_.a);
//	$("#data_s").html((this.vehicle_.vsn == "0" ? "停车 " : "行驶 ") + (this.vehicle_.s == null ? "" : this.vehicle_.s));
//	this.draw();
};

// ============= 自定义InfoWindow结束 ===================

// ============= 历史轨迹开始 ===================

function drawHistoryTrack(gpsDataHistoryArray, map) {
	var trackPath = [];
	for(var i = 0; i < gpsDataHistoryArray.length; i++) {
		var data = gpsDataHistoryArray[i];
		trackPath.push(new MMap.LngLat(data.lng, data.lat));
	}
	var polyline = new MMap.Polyline({
		id: "polyline",
		path: trackPath,
		strokeColor: "#48ed00",
		strokeOpacity: 1.0,
		strokeWeight: 4
	});

	// 设置最佳视野范围
	var array = new Array();
	array.push(polyline);
	map.setFitView(array);

	map.addOverlays(polyline);
	return polyline;
}

function removeHistoryTrack(polyline, map) {
	if(polyline != null) {
		map.removeOverlays("polyline");
		polyline = null;
	}
}

// ============= 历史轨迹结束 ===================