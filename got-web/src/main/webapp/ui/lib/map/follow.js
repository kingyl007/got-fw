var map = null;
var vehicle = null;
var lastVehicle = null;
var vehicleMarker = null;
var infoWindow;
var timer;
var interval = 30; // 设置间隔时间
var timeLeft = 30; // 剩余时间
var mMarker = null;
var polygon = null;//画的圆
var mapType = null;
var style = 'gz';
var first = 0;

function initialize() {
	map = setMap(map, mapType, lat, lng, zoom);	
	getVehicleData(vehicleId);
	initTimerSetting();
	timer = setInterval(timerRefresh, 1000);
	connectAtmosphere();
}


function timerRefresh() {
    if(timeLeft > 0) {
        timeLeft--;
    } else {
        timeLeft = interval;
        if(infoWindow != null && infoWindow.isShow) {
            isInfoWindowShow = true;
        } else {
            isInfoWindowShow = false;
        }
        getVehicleData(vehicleId);
    }
    $("#time_left_second").html(timeLeft);
}

function getVehicleData(vehicleId) {
	$.getJSON("/console/get_vehicle_data", {"vehicle_id":vehicleId, "map_type":mapType, "rand":Math.random}, function(data) {
		if(vehicle == null || vehicleMarker == null) {
			vehicle = new Vehicle();
			vehicle.setData(data);
			lastVehicle = new Vehicle();
			lastVehicle.setData(data);
			var image = getImage(vehicle);
			vehicleMarker = createMarker(vehicle, image, map);
			infoWindow = new CXInfoWindow(vehicle, map, false);
			centerTo(map, vehicle.lat, vehicle.lng);
		} else {
			vehicle.setData(data);
			var image = getImage(vehicle);
			changeMarker(vehicleMarker, vehicle.lat, vehicle.lng, image, map);
			infoWindow.setVehicle(vehicle);
		}
		if(!isPointInMap(vehicle.lat, vehicle.lng, map)) {
           centerTo(map, vehicle.lat, vehicle.lng);
        }
		drawLine(lastVehicle.lat, lastVehicle.lng, vehicle.lat, vehicle.lng, map);
		lastVehicle.setData(data);
		if(first==0){
			var myDate = new Date();
			var h = myDate.getHours();       //获取当前小时数(0-23)
			var m = myDate.getMinutes();     //获取当前分钟数(0-59)
			var s = myDate.getSeconds();
			var time = h + ":" + m + ":" + s;
			createStart(vehicle,map,time);
			first = 1;
		}
	});
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

function toggleInfoWindow(vid) {
	infoWindow.toggle();
}

function _cxInfoWindowHide() {
	infoWindow.hide();
}

//初始化刷新时间设置控件
function initTimerSetting() {
	$("#time_left").click(function() {
		if($("#time_setting").css("display") == "none") {
			$("#time_setting").slideDown(function() {
				$("body").one("click", function() {
					if($("#time_setting").css("display") != "none") {
						$("#time_setting").slideUp();
					}
				});
			});
		} else {
			$("#time_setting").slideUp();
		}
	});
	$("#time_setting a").click(function() {
		var timeSettingIndex = $("#time_setting a").index($(this));
		$("#time_setting a").css("color", "#FFFFFF");
		$(this).css("color", "#00D3FF");
		$("#time_setting").slideUp();
		clearInterval(timer);
		var _interval;
		if(timeSettingIndex == 0) {
			_interval = 10;
		} else if(timeSettingIndex == 1) {
			_interval = 30;
		} else if(timeSettingIndex == 2) {
			_interval = 60;
		} else if(timeSettingIndex == 3) {
			_interval = 180;
		} else if(timeSettingIndex == 4) {
			_interval = 300;
		} else if(timeSettingIndex == 5) {
			_interval = 600;
		}
		$("#time_left_second").html(_interval);
		interval = _interval;
		timeLeft = _interval;
		timer = setInterval(timerRefresh, 1000);
	});
}