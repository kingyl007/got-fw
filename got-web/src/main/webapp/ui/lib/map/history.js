var map = null;
var historyArray = []; // 保存历史轨迹数据
var polylineLayer = null; // 缓存轨迹层
var vehicle;
var mxtrue = false;
var vehicleMarker;
var infoWindow;
var timer;
var interval = 100;
var intervalMax = 300;
var playIndex = 0; // 播放位置索引
var playSpeed = 3;
var playing = 0; // 是否正在播放
var allMileage = 0.0;//总里程
var averSpeed = 0.0;//平均速度
var fastSpeed = 0.0;//最高速度
var style = 'hf';
var oldStatus = 0;
var oldTime = null;
var stopTime = 0;
var allStopTime = 0;
var runTime = 0;
var stopMark = 0;
var mxi = 1;
var zMileage = 0.0;
var markers = [];
var mx = false;

function initialize(){
	map = setMap(map, mapType, lat, lng, zoom);
	initPlayback();
	initDialog();
	getGpsDataHistoryList(vehicleNum, beginTime, endTime);

}

function initPlayback() {
	
	$("#play_btn").click(function() {
		mxtrue = false;
		if($("#play_btn").attr("class") == "pa01") {
			playback();
			$("#play_btn").attr("class", "pa03");
		} else {
			pause();
			$("#play_btn").attr("class", "pa01");
		}
	});

	$("#stop_btn").click(function() {
		stop();
	})
	$("#slider").slider({
		range: "min",
		change: function(event, ui) {
			if(!mxtrue){
				playIndex = $("#slider").slider("value");
				play();
			}else{
				mxplay($("#slider").slider("value"));
			}
		}
	});
	
	$("#speed_setting a").click(function() {
		var index = $("#speed_setting a").index($(this));
		if(index == 0) {
			if(playSpeed > 1) {
				playSpeed--;
			}
		} else if(index == 1) {
			if(playSpeed < 5) {
				playSpeed++;
			}
		}
		interval = intervalMax/playSpeed;
		$("#speed_setting span").html("x" + playSpeed);
		if(playing == 1) {
			clearInterval(timer);
			timer = setInterval(timerRefresh, interval);
		}
	});
}

function initDialog() {
	//$("#dialog").dialog({modal: true});
	$("#dialog2").show();
}

function openMx(){
	if(!mx){
		mx = true;
		$('#mx').show();
		$('#map_canvas').css('height',$('#map_canvas').height()-320+'px');
	}
}

function getHistory(){
	var b = $('#mileage_begin_time').datebox('getValue');
	var e = $('#mileage_end_time').datebox('getValue');
	window.location.href = "/history?vehicle_num="+vehicleNum+"&begin_time="+b+"&end_time="+e+"&map_type="+mapType+"&lat="+lat+"&lng="+lng+"&zoom="+zoom;	
}

// 获取轨迹数据
function getGpsDataHistoryList(vehicleNum, beginTime, endTime) {
	historyArray.length = 0;
	removeHistoryTrack(polylineLayer,map);
	$.getJSON("/history/get_vehicle_data_history", {"vehicle_num":vehicleNum, "begin_time":beginTime, "end_time":endTime, "map_type":mapType, "rand":Math.random}, function(data) {
		if(data.list && data.list.length > 0) {
			var fenmu = data.list.length;
			var allSpeed = 0;
			zMileage = 0.0;
			allStopTime = 0;
			var oMileage = 0.0;
			for(var i = 0; i < data.list.length; i++) {
				if(i!=0){
					zMileage = zMileage + (data.list[i].tm - oMileage);
					zMileage = Math.round(zMileage*100)/100;
					oMileage = data.list[i].tm;
				}else{
					oMileage = data.list[i].tm;
				}
				var gpsDataHistory = new GpsDataHistory(data.list[i].lat, data.list[i].lng, data.list[i].vsn, data.list[i].ms, data.list[i].dn, data.list[i].s, data.list[i].gt, data.list[i].a, zMileage, data.list[i].speed);
				historyArray.push(gpsDataHistory);
				if(i == 0) {
					vehicle = new Vehicle();
					vehicle.vid = data.vehicle.vid;
					vehicle.vn = data.vehicle.vn;
					vehicle.t = data.vehicle.t;
					updateVehicle(vehicle, gpsDataHistory);
					var image = getImage(vehicle);
					vehicleMarker = createMarker(vehicle, image, map);
					infoWindow = new CXInfoWindow(vehicle, map, false);
				}
				if(data.list[i].s>fastSpeed){
					fastSpeed = data.list[i].s;
				}
				allSpeed += data.list[i].s;
			}
			averSpeed = allSpeed / fenmu;
			polylineLayer = drawHistoryTrack(historyArray, map);
			$("#slider").slider("option", "max", data.list.length - 1);
		//	$("#averSpeed").html(averSpeed);
		//	$("#fastSpeed").html(fastSpeed);
		}else{
			alert("无此车辆数据");
		}
		//$("#dialog").dialog("close");
		$("#dialog2").hide();
		$("#slider").slider("value", playIndex);
	});	
}

function updateVehicle(vehicle, gpsDataHistory) {
	vehicle.lat = gpsDataHistory.lat;
	vehicle.lng = gpsDataHistory.lng;
	vehicle.vsn = gpsDataHistory.vsn;
	vehicle.ms = gpsDataHistory.ms;
	vehicle.dn = gpsDataHistory.dn;
	vehicle.s = gpsDataHistory.s;
	vehicle.gt = gpsDataHistory.gt;
	vehicle.a = gpsDataHistory.a;
	vehicle.tm = gpsDataHistory.tm;
	vehicle.speed = gpsDataHistory.speed;
}

function getImage(vehicle) {
	var image = null;
	if(vehicle.ms == '0'){
		if(vehicle.t.length == 2){
			var strs = vehicle.t.split(""); 
			var j = strs[1]
			image = "/images/cars/"+j+"_offline.png";
		}else{
			image = "/images/cars/" + vehicle.t +"_off.png";
		}
	}else if (vehicle.ms == '1') {
		if(vehicle.t.length == 2){
			var strs = vehicle.t.split(""); 
			var j = strs[1];
			if (vehicle.vsn == '1') {
				image = "/images/cars/"+j+"_move_" + vehicle.dn + ".png";
			} else {
				image = "/images/cars/"+j+"_stop_" + vehicle.dn + ".png";
			}
		}else{
			image = "/images/cars/" + vehicle.t +".png";
		}
	}
	return image;
}

function playback() {
	timer = setInterval(timerRefresh, interval);
	playing = 1;
}

function timerRefresh() {
	playIndex++;
	if(playIndex < historyArray.length) {
		$("#slider").slider("value", playIndex);
	} else {
		pause();
		var b = beginTime.replace(/-/g,"/");
		var begin = new Date(b);
		var e = endTime.replace(/-/g,"/");
		var end = new Date(e);
		var allTime = end.getTime()-begin.getTime();
		var at = changeSecondsToTime(allTime/1000)
		var html = "";
		html += '<p><b>总时间：</b>'+ at +'</p>';
		html += '<p><b>里程：</b>'+ zMileage +'km</p>';
		html += '<p><b>运行：</b>'+ changeSecondsToTime(runTime/1000) +'</p>';
		html += '<p><b>停留：</b>'+ changeSecondsToTime(allStopTime/1000) +'</p>';
		html += '<p></p>';
		$(".tip_mid").html(html);
	}
}

function mxplay(value){
	var gpsDataHistory = historyArray[value];
	updateVehicle(vehicle, gpsDataHistory);
	var image = getImage(vehicle);
	changeMarker(vehicleMarker, vehicle.lat, vehicle.lng, image, map);
	infoWindow.setVehicle(vehicle);
	if(!isPointInMap(vehicle.lat, vehicle.lng, map)) {
	   centerTo(map, vehicle.lat, vehicle.lng);
	}
}

function play() {
	//获取时间点
	var gpsDataHistory = historyArray[playIndex];
	updateVehicle(vehicle, gpsDataHistory);
	if(vehicle.vsn == '0'){
		if(oldStatus == '0'){
			//停车时间增加
			var str = vehicle.gt.replace(/-/g,"/");
			var date = new Date(str);
			if(oldTime!=null){
				stopTime = stopTime + date.getTime() - oldTime.getTime();
			}
			oldTime = date;
			oldStatus = '0';
		}else if(oldStatus == '1'){
			//此段时间加到停车时长中
			var str = vehicle.gt.replace(/-/g,"/");
			var date = new Date(str);
			if(oldTime!=null){
				stopTime = stopTime + date.getTime() - oldTime.getTime();
			}
			oldTime = date;
			oldStatus = '0';
		}
	}else if(vehicle.vsn == '1') {
		if(oldStatus == '0'){
			//判断停车时间是否超出标示时间
			var tt=$("#stm").find('option:selected').val();
			if(stopTime>=tt){
				//生产mark
				var result = changeSecondsToTime(stopTime/1000);
				//alert("生成一个mark"+result);
				var start = oldTime.getTime()-stopTime;
				var startTime = new Date(start);
				var marker = createStopMarker(startTime.toCommonCase(),oldTime.toCommonCase(),result,vehicle,map);
				markers.push(marker);				
			}
			//结束一阶段的停车时间记录，清空
			allStopTime += stopTime;
			stopTime = 0;
			//记录增加运行时间
			var str = vehicle.gt.replace(/-/g,"/");
			var date = new Date(str);
			if(oldTime!=null){
				runTime = runTime + date.getTime() - oldTime.getTime();
			}
			oldTime = date;
			oldStatus = '1';
		}else if(oldStatus == '1'){
			//此段时间加到运行时间中
			var str = vehicle.gt.replace(/-/g,"/");
			var date = new Date(str);
			if(oldTime!=null){
				runTime = runTime + date.getTime() - oldTime.getTime();
			}
			oldTime = date;
			oldStatus = '1';
		}
	}
	if((!(playIndex < historyArray.length))&&oldStatus=='0'){
		var str = endTime.replace(/-/g,"/");
		var date = new Date(str);
		if(oldTime!=null){
			stopTime = stopTime + date.getTime() - oldTime.getTime();
		}
	}
	var image = getImage(vehicle);
	changeMarker(vehicleMarker, vehicle.lat, vehicle.lng, image, map);
	infoWindow.setVehicle(vehicle);
	if(!isPointInMap(vehicle.lat, vehicle.lng, map)) {
	   centerTo(map, vehicle.lat, vehicle.lng);
	}
	var dn = "";
	for(var i = 0;i<directionName.length;i++){
		if(vehicle.dn==directionName[i][0]){
			dn = directionName[i][1];
		}
	}
	var html = '<tr><td style="width:30px;">'+mxi+'</td><td style="width:150px;">'+vehicle.gt+'</td><td style="width:90px;">'+vehicle.lng+'</td><td style="width:90px;">'+vehicle.lat+'</td><td style="width:125px;">'+vehicle.speed+'</td><td style="width:70px;">'+dn+'</td><td style="width:100px;">'+vehicle.s+'</td><td><a href="javascript:void(0)" onclick="goStop('+playIndex+')">'+vehicle.a+'</a></td></tr>';
	mxi++;
	$("#mingxi").append(html);
	//alert($("#mingxi").scrollHeight());
	$("#mmxx").scrollTop($("#mingxi").height());
	
}

function goStop(value){
	mxtrue = true;
	$("#slider").slider("value", value);
}

function pause() {
	clearInterval(timer);
	playing = 0;
}

function stop() {
	clearInterval(timer);
	playing = 0;
	playIndex = 0;
	runTime = 0;
	oldTime = null;
	allStopTime = 0;
	removeMarkers(markers,map);
	$("#slider").slider("value", playIndex);
	$("#mingxi").html(null);
	mxi = 1;
}

function toggleInfoWindow(vid) {
	infoWindow.toggle();
}

function _cxInfoWindowHide() {
	infoWindow.hide();
}