var vidSelected = "";
var isInitMap = true;
var map = null;
var mapType = null;
var lat = 32.018513;
var lng = 108.535393;
var zoom = 5;
var customer = null;//登录用户的customer信息
var vehicleId = null;//选中的小车的id
var pheight;
//var vehicleNum = '';//报表选中小车的num
var style = 'jk';
var model = null;
var timer;
var interval = 10; // 设置间隔时间
var timeLeft = 10; // 剩余时间
var EARTH_RADIUS = 6378137.0;  //地球半径，用于围栏中计算两点间距离的
var mMarker = null;//可移动点
var polygon = null;//画的圆
var m = '200';//轨迹半径数
var Cpoints = [];

var allVehicleNum = 0; //显示左侧列表的总车辆
var onlineVehicleNum = 0;//显示左侧列表的在线车辆
var offlineVehicleNum = 0;//显示左侧列表的离线车辆
var vehicleArray = []; // 缓存Vehicle对象数组
var vehicleNumArray = []; // 缓存Vehicle车牌号数组
var allVehicleNumArray = [];// 缓存所有vehicle车牌号数组
var allGroupNameArray = [];//缓存所有group名字id的数组
var vehicleNumData = [];
var infoWindow = null; // 全局InfoWindow对象
var infoWindowX = null;//围栏时的infoWindow
var currentVid = ""; // 当前显示InfoWindow的车辆ID
var isInfoWindowShow = false;
var distanceTool = null; // 全局测距工具
var currentTab = "all"; // 当前显示的车辆列表
var searchVehicleNumText = "";

var alarmSound = false;//报警铃声是否开启
var alarmNewNum = 0; // 报警未查看数量
var alarmListNum = 0; // 报警列表数量
var alarmShow = 0; // 报警列表框是否弹出

var currentZIndex = 10000;

var currentReportDiv = "report_mileage"; // 当前显示的报表层
var isReportControllerInit = false; // 是否初始化报表统计
var isReportMileageDivInit = false; // 是否初始化里程统计层
var isReportStoppingDivInit = false; // 是否初始化停车统计层
var isReportAlarmDivInit = false; // 是否初始化报警统计层
var isReportDrivingDivInit = false; // 是否初始化行车统计层
var isReportOverspeedDivInit = false; // 是否初始化超速统计层
var isReportNoflameoutDivInit = false; // 是否初始化停车未熄火统计层

//var selectedcarid = 0; //左侧小车列表选中状态下的小车ID

//设置地图类型
function setMapType(type) {
	$("#map_canvas").empty();
	vehicleArray.length = 0;
	map = null;
	infoWindow = null;
	currentVid = ""; // 当前显示InfoWindow的车辆ID
	distanceTool = null;// 全局测距工具
	polylineLayer = null;//在history中有用
	mMarker = null;//可移动点
	polygon = null;//画的圆
	infoWindowX = null;
	if(mapType == null) {
		refreshMap(type);
	} else if(mapType != type) {
		var oldfilename;
		var newfilename;
		if(mapType == "google" || mapType == "satellite") {
			oldfilename = "/js/carvitamin_googleapi.js";
		} else if(mapType == "baidu") {
			oldfilename = "/js/carvitamin_baiduapi.js";
		} else if(mapType == "mapabc") {
			oldfilename = "/js/carvitamin_mapabcapi.js";
		}
		if(type == "google" || type == "satellite") {
			newfilename = "/js/carvitamin_googleapi.js";
		} else if(type == "baidu") {
			newfilename = "/js/carvitamin_baiduapi.js";
		} else if(type == "mapabc") {
			newfilename = "/js/carvitamin_mapabcapi.js";
		}
		var script = replaceScript(oldfilename, newfilename);
		script.onload = script.onreadystatechange = function() {
			if(!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
				
				refreshMap(type);
			}
		}
	}
}
//刷新地图
function refreshMap(type) {
	
	var _lat = getCookie("lat");
	var _lng = getCookie("lng");
	var _zoom = getCookie("zoom");
	
	if(_lat != null) {
		lat = new Number(_lat);
	}
	if(_lng != null) {
		lng = new Number(_lng);
	}
	if(_zoom != null) {
		zoom = parseInt(_zoom);
	}
	
	map = setMap(map, type, lat,lng, zoom);
	mapType = type;
	if (vidSelected != "") {
		getSelectedVehiclesSimpleData(vidSelected, true, true, false);
	}
}


$.extend({ 
includePath: '', 
include: function(file) { 
var files = typeof file == "string" ? [file]:file; 
for (var i = 0; i < files.length; i++) { 
var name = files[i].replace(/^\s|\s$/g, ""); 
var att = name.split('.'); 
var ext = att[att.length - 1].toLowerCase(); 
var isCSS = ext == "css"; 
var tag = isCSS ? "link" : "script"; 
var attr = isCSS ? " type='text/css' rel='stylesheet' " : " language='javascript' type='text/javascript' "; 
var link = (isCSS ? "href" : "src") + "='" + $.includePath + name + "'"; 
if ($(tag + "[" + link + "]").length == 0) document.write("<" + tag + attr + link + "></" + tag + ">"); 
} 
} 
}); 

//更新汽车信息
function updateVehicleList(vehicle){
	var change =  $("li[vn='" + vehicle.vid + "']");
	var html = "";
	var ms = "";
	if(vehicle.ms == '0'){
		//<input class="'+vehicle.vid+'" name="" type="checkbox" value="" checked>
		html = '<span class="chkbox"><input class="'+vehicle.vid+'" name="" type="hidden" value="" checked></span><a href="javascript:void(0);">';
		if(vehicle.t.length == 2){
			var strs = vehicle.t.split(""); 
			var j = strs[1];
			html +=  '<img src="/images/cars_small/'+j+'_offline.png"/>';
		}else{
			html +=  '<img src="/images/cars_small/' + vehicle.t +'.png"  />';
		}
		html += '<span class="lbt">'+vehicle.vn+'</span><span class="ldt" >离线</span>'+(typeof(vehicle.mt) != "undefined"?vehicle.mt:" ")+'</a></li>';
	//	$("#off").html(++offlineVehicleNum);
	//	$("#on").html(--onlineVehicleNum);
	}else if (vehicle.ms == '1') {
		//<input class="'+vehicle.vid+'" name="" type="checkbox" value="" checked>
		html = '<span class="chkbox"><input class="'+vehicle.vid+'" name="" type="hidden" value="" checked></span><a href="javascript:void(0);">';
		if (vehicle.vsn == '0' || vehicle.speed == 0) {
			if(vehicle.t.length == 2){
				var strs = vehicle.t.split(""); 
				var j = strs[1];
    		html += '<img src="/images/cars_small/'+j+'_stop_'+vehicle.dn+'.png"  />';
    	}else{
    		html += '<img src="/images/cars_small/' + vehicle.t +'.png" />';
    	}
		} else {
			if(vehicle.t.length == 2){
				var strs = vehicle.t.split(""); 
				var j = strs[1];
    		html += '<img src="/images/cars_small/'+j+'_move_'+vehicle.dn+'.png"  />';
    	}else{
    		html += '<img src="/images/cars_small/' + vehicle.t +'.png"  />';
    	}
		}
		if (vehicle.vsn == '0' || vehicle.speed == 0) {
		  html += '<span class="lbt">'+vehicle.vn+'</span><span class="ldt Red">停车</span>'+(typeof(vehicle.mt) != "undefined"?vehicle.mt:" ")+'</a>';
		} else if(vehicle.vsn == '1') {
		  html += '<span class="lbt">'+vehicle.vn+'</span><span class="ldt Green">' + vehicle.speed + '</span>'+(typeof(vehicle.mt) != "undefined"?vehicle.mt:" ")+'</a>';
		} else {
		  html += '<span class="lbt">'+vehicle.vn+'</span><span class="ldt rose">' + vehicle.speed + '超速</span>'+(typeof(vehicle.mt) != "undefined"?vehicle.mt:" ")+'</a>';
		}
	//	$("#on").html(++onlineVehicleNum);
	//	$("#off").html(--offlineVehicleNum);
	}
	for(var w = 0;w<change.length;w++){
		//ms = change.get(w).attr("ms");
		//alert(ms);
		ms = change.eq(w).attr("ms");
		change.eq(w).attr("ms",vehicle.ms);
		change.get(w).innerHTML = html;
	}
	if(vehicle.ms != ms){
		if(ms>vehicle.ms){
			$("#on").html(++onlineVehicleNum);
			$("#off").html(--offlineVehicleNum);
		}else{
			$("#off").html(++offlineVehicleNum);
			$("#on").html(--onlineVehicleNum);
		}
	}
}


//更新左上方titile并显示列表
function getLeftList(customerId,customerName){
	$("#nowCustomer").html(customerName);
	$("#nowCustomerId").val(customerId);
	getGroupsAndVehicles(customerId);
}

//获取分组和汽车列表
function getGroupsAndVehicles(customerId, queryStr){
	var htmlContent = "";
	var carsonlinecon = "";
	var carsofflinecon = "";
	$("#allcars").empty();
	$("#carsonline").empty();
	$("#carsoffline").empty();
	var url = "/console/get_groups_and_vehicles";
	var queryObj = {"customer_id":customerId ,"rand":Math.random};
	if ("undefined" != typeof queryStr && queryStr != "") {
	  url = "/console/get_vehicles_by_query";
	  queryObj.queryStr=queryStr;
	}
	$.getJSON(url, queryObj, function(data) {
		vidSelected = "";
		allVehicleNum = 0;
		onlineVehicleNum = 0;
		offlineVehicleNum = 0;
		allVehicleNumArray = [];
		allGroupNameArray = [];
		for (var i = 0; i < data.length; i++) { //for 开始
			var allVehicleContent = "";
			var carsonline = "";
	        var carsoffline = "";
			var group = data[i];
			allGroupNameArray.push([group.gid,group.gn]);
			var vehicles = group.vehicles;
			var k = 0; // 在线车辆索引
			var l = 0; // 离线车辆索引
			var groupVehicleNum = 0;
			if (vehicles != null && typeof(vehicles) != "undefined") {
				groupVehicleNum = vehicles.length;
				allVehicleNum += groupVehicleNum;
				for (var j = 0; j < vehicles.length; j++) { //第二个FOR开始
					var vehicle = vehicles[j];
					allVehicleNumArray.push([vehicle.vid,vehicle.vn]);
					// 生成全部车辆列表
					if (vehicle.ms == '0') {
						//<input class="'+vehicle.vid+'" name="" type="checkbox" value="" checked>
						allVehicleContent += '<li class="offl" vn="'+vehicle.vid+'" ms="'+vehicle.ms+'"><span class="chkbox"><input class="'+vehicle.vid+'" name="" type="hidden" value="" checked></span><a href="javascript:void(0);">';
						carsoffline += '<li class="offl" vn="'+vehicle.vid+'" ms="'+vehicle.ms+'"><span class="chkbox"><input class="'+vehicle.vid+'" name="" type="hidden" value="" checked></span><a href="javascript:void(0);">';
					//	if(vehicle.t == '00'){
						if(vehicle.t.length == 2){
							var strs = vehicle.t.split(""); 
							var o = strs[1];
							allVehicleContent +=  '<img src="/images/cars_small/'+o+'_offline.png" />';
							carsoffline +=  '<img src="/images/cars_small/'+o+'_offline.png" />';
						}else{
							allVehicleContent +=  '<img src="/images/cars_small/' + vehicle.t +'.png" />';
							carsoffline +=  '<img src="/images/cars_small/' + vehicle.t +'.png" />';
						}
						carsoffline += '<span class="lbt">'+vehicle.vn+'</span><span class="ldt">离线</span>'+(typeof(vehicle.mt) != "undefined"?vehicle.mt:" ")+'</a></li>';
						allVehicleContent += '<span class="lbt">'+vehicle.vn+'</span><span class="ldt">离线</span>'+(typeof(vehicle.mt) != "undefined"?vehicle.mt:" ")+'</a></li>';//'<li><span class="chkbox"><input name="" type="checkbox" value=""></span><a href="#" class="offline"><span class="lbt">'+vehicle.vn+'</span><span class="ldt">离线</span></a></li>';
						l++;
						vidSelected += vehicle.vid + ",";
					} else if (vehicle.ms == '1') {
					  // online
						allVehicleContent += '<li class="onl" vn="'+vehicle.vid+'" ms="'+vehicle.ms+'"><span class="chkbox"><input class="'+vehicle.vid+'" name="" type="hidden" value="" checked></span><a href="javascript:void(0);">';//
            carsonline += '<li class="onl" vn="'+vehicle.vid+'" ms="'+vehicle.ms+'"><span class="chkbox"><input class="'+vehicle.vid+'" name="" type="hidden" value="" checked></span><a href="javascript:void(0);">';//<input class="'+vehicle.vid+'" name="" type="checkbox" value="" checked>
            if (vehicle.vsn == '0' || vehicle.speed == 0) {
							if(vehicle.t.length == 2){
								var strs = vehicle.t.split(""); 
								var o = strs[1];
            		allVehicleContent += '<img src="/images/cars_small/'+o+'_stop_'+vehicle.dn+'.png" />';
            		carsonline += '<img src="/images/cars_small/'+o+'_stop_'+vehicle.dn+'.png" />';
            	}else{
            		allVehicleContent += '<img src="/images/cars_small/' + vehicle.t +'.png" />';
            		carsonline += '<img src="/images/cars_small/' + vehicle.t +'.png" />';
            	}
						} else {
							if(vehicle.t.length == 2){
								var strs = vehicle.t.split(""); 
								var o = strs[1];
            		allVehicleContent += '<img src="/images/cars_small/'+o+'_move_'+vehicle.dn+'.png" />';
            		carsonline +='<img src="/images/cars_small/'+o+'_move_'+vehicle.dn+'.png" />';
            	}else{
            		allVehicleContent += '<img src="/images/cars_small/' + vehicle.t +'.png" />';
            		carsonline += '<img src="/images/cars_small/' + vehicle.t +'.png" />';
            	}
            	//在状态中判断是否超速
						}
            if (vehicle.vsn == '0' || vehicle.speed == 0) {
              allVehicleContent += '<span class="lbt">'+vehicle.vn+'</span><span class="ldt Red">停车</span>'+(typeof(vehicle.mt) != "undefined"?vehicle.mt:" ")+'</a></li>';
              carsonline += '<span class="lbt">'+vehicle.vn+'</span><span class="ldt Red">停车</span>'+(typeof(vehicle.mt) != "undefined"?vehicle.mt:" ")+'</a></li>';
            } else if(vehicle.vsn == '1'){
              allVehicleContent += '<span class="lbt">'+vehicle.vn+'</span><span class="ldt Green">' + vehicle.s + '</span>'+(typeof(vehicle.mt) != "undefined"?vehicle.mt:" ")+'</a></li>';
              carsonline += '<span class="lbt">'+vehicle.vn+'</span><span class="ldt Green">' + vehicle.s + '</span>'+(typeof(vehicle.mt) != "undefined"?vehicle.mt:" ")+'</a></li>';
            }else{
              allVehicleContent += '<span class="lbt">'+vehicle.vn+'</span><span class="ldt rose">' + vehicle.s + '超速 </span>'+(typeof(vehicle.mt) != "undefined"?vehicle.mt:" ")+'</a></li>';
              carsonline += '<span class="lbt">'+vehicle.vn+'</span><span class="ldt rose">' + vehicle.s + '超速 </span>'+(typeof(vehicle.mt) != "undefined"?vehicle.mt:" ")+'</a></li>';
            }
            /*
                        	if(i==-1){
                        		allVehicleContent += '<span class="lbt">'+vehicle.vn+'</span><span class="ldt Green">' + vehicle.s + '</span></a></li>';
                        		carsonline += '<span class="lbt">'+vehicle.vn+'</span><span class="ldt Green">' + vehicle.s + '</span></a></li>';
                        	}else{
                        		allVehicleContent += '<span class="lbt">'+vehicle.vn+'</span><span class="ldt Green">' + vehicle.s + ' 超速</span></a></li>';
                        		carsonline += '<span class="lbt">'+vehicle.vn+'</span><span class="ldt Green">' + vehicle.s + ' 超速</span></a></li>';
                        	}*/
            
                        k++;
						vidSelected += vehicle.vid + ",";
					}
					// 缓存车牌号用于轨迹回放时搜索车辆
					var vehicleNum = new VehicleNum(vehicle.vn, vehicle.vid);
					vehicleNumArray.push(vehicleNum);
				} //第二个FOR结束
				onlineVehicleNum += k;
				offlineVehicleNum += l;	
				//return htmlContent;	
			}
			var editegroup = '';
			if(group.gid>0){
				editegroup = '<div class="groupedit"><a onclick=editdo(this,event,"'+group.gid+'","'+group.gn+'");>编辑</a><a onclick="deldo(this,event,'+group.gid+');">删除</a></div>';
			}
			allVehicleContent = '<h2 onclick="$(this).next().slideToggle();" onmouseover=$(this).children(".groupedit").show(); onmouseout=$(this).children(".groupedit").hide();>'+group.gn+'('+groupVehicleNum+')'+editegroup+'</h2><div style="display:block;">'+allVehicleContent+ '</div>';
			carsoffline = '<h2 onclick="$(this).next().slideToggle();" onmouseover=$(this).children(".groupedit").show(); onmouseout=$(this).children(".groupedit").hide();>'+group.gn+'('+l+')'+editegroup+'</h2><div style="display:block;">'+carsoffline+ '</div>';
			carsonline = '<h2 onclick="$(this).next().slideToggle();" onmouseover=$(this).children(".groupedit").show(); onmouseout=$(this).children(".groupedit").hide();>'+group.gn+'('+k+')'+editegroup+'</h2><div style="display:block;">'+carsonline+ '</div>';
			htmlContent += allVehicleContent;
			carsofflinecon +=carsoffline;
			carsonlinecon +=carsonline;
		} 
		var groups = '<div class="addgroup"><div class="search_out"><input id="doSearch" type="text" value="请输入设备号/IMEI号" style="color:#999;" onclick=$(this).val("");><span onClick=doSearch($("#doSearch").val());></span></div><a onclick="openAddGroup()">添加组</a></div>'; 
		$('#allcars').empty();
		$('#allcars').html(groups+htmlContent);

		//赋值在线车辆
	    /*var getCarOnline = $("#allcars a[class='online']"); //按class=offline获取所有在线的车辆
	    var setCarOnline = ""; 
	    $.each(getCarOnline, function() {
		    setCarOnline += '<li><span class="chkbox"><input name="" type="checkbox" value=""></span><a href="#" class="online">'+$(this).html()+'</a></li>';
        });*/
        //$("#carsonline").html(htmlContent);
		$("#carsoffline").html(groups+carsofflinecon);
		$("#carsonline").html(groups+carsonlinecon);
		$("#all").html(allVehicleNum);
		$("#on").html(onlineVehicleNum);
		$("#off").html(offlineVehicleNum);
		bindVehicleListEvent();//勾选和双击事件
		listCheck();
		initSearchDiv();
		isInitMap = false;
		var vehicleNum = $("#checkVehicleNum").val();
		if(vehicleNum!=""){
			for(var i = 0;i<allVehicleNumArray.length;i++){
				if(allVehicleNumArray[i][1]==vehicleNum){
					vehicleId = allVehicleNumArray[i][0];
				}
			}
			listStyle();
			getVehicleDataAndCenter(vehicleId);
		}
	});
}

function listCheck(){
	$('#showcontent').tabs({   
	    border:false,   
		onSelect:function(title){ 
			vidSelected = '';
	    	var check = title.substring(0,2);
	    	if(check=="全部"){
	    		var onl = $(".onl");
	    		for(var i = 0;i<onl.length;i++){
	    			var on = onl.eq(i).attr("vn");
	    			vidSelected = vidSelected.replace(new RegExp(on + ",", "gm"), "");
	                vidSelected += on + ",";
	    		}
	    		var offl = $(".offl");
	    		for(var j = 0;j<offl.length;j++){
	    			var off = offl.eq(j).attr("vn");
	    			vidSelected = vidSelected.replace(new RegExp(off + ",", "gm"), "");
	                vidSelected += off + ",";
	    		}
	    	}else if(check=="在线"){
	    		var onl = $(".onl").attr("vn");
	    		var onl = $(".onl");
	    		for(var i = 0;i<onl.length;i++){
	    			var on = onl.eq(i).attr("vn");
	    			vidSelected = vidSelected.replace(new RegExp(on + ",", "gm"), "");
	                vidSelected += on + ",";
	    		}
	    	}else{
	    		var offl = $(".offl").attr("vn");
	    		var offl = $(".offl");
	    		for(var k = 0;k<offl.length;k++){
	    			var off = offl.eq(k).attr("vn");
	    			vidSelected = vidSelected.replace(new RegExp(off + ",", "gm"), "");
	                vidSelected += off + ",";
	    		}
	    	}
	    	getSelectedVehiclesSimpleData(vidSelected, true, isInitMap, true);//生成地图mark使用
		}   
	});
}

function openAddGroup(){
	$("#addgroupname").val(null);
	$("#addgroup").dialog("open");
}

function editdo(o,evt,groupId,gn){
    var e=(evt)?evt:window.event;  
    if (window.event) {  
        e.cancelBubble=true;  
    }else {  
        //e.preventDefault();  
        e.stopPropagation();  
    }
    $("#groupid").val(groupId);
    $('#updategroupname').val(gn);
	$("#editgroup").dialog("open");
}

//删除分组
function deldo(o,evt,groupId){
    var e=(evt)?evt:window.event;  
    if (window.event) {  
        e.cancelBubble=true;  
    }else {  
        //e.preventDefault();  
        e.stopPropagation();  
    }  
	if(confirm("您确定要删除该组吗?")==true){
	//	alert(groupId);
        $.getJSON("/console/delete_group",{"group_id":groupId,"rand":Math.random},function(data){
        	alert(data);
        	getGroupsAndVehicles(customer.cid);
        });
	}else{
        
    } 
}
//获取部分数据的单独信息，生成marker  getSelectedVehiclesSimpleData(vidSelected, true, false ,false);
function getSelectedVehiclesSimpleData(vehicleIds, isAll, isInitMap, isList) {
	//alert(selectedcarid);
	//if(selectedcarid!=0){
		//}
	$.getJSON("/console/get_selected_vehicles_simpledata", {"vehicle_ids":vehicleIds, "map_type":mapType, "rand":Math.random}, function(data) {
		// 判断是否是地图初始化，如果是则不执行清除Marker操作
		if(!isInitMap) {
			if (isAll) {
				removeAllMarkers(vehicleArray, map);
				if(isList){
					vehicleArray.length = 0;
					if(infoWindow != null) {
						infoWindow.hide();
					}
				}
			} else {
				removeMarker(vehicleIds, vehicleArray, map);
			}
		}
		
		for (var i = 0; i < data.length; i++) {
			var vehicle = new Vehicle();
			vehicle.setSimpleData(data[i]);
			var marker = generateMarker(vehicle);
			vehicle.marker = marker;
			vehicleArray.push(vehicle);
			
			//判断是否有围栏
			b:if(vehicle.mp.length != 0){
				//如果有，判断是否超出围栏
				var flag = inCircle(vehicle.lat,vehicle.lng,vehicle.mp);
				if(!flag){
					var list = $("#alarmlist tr");
					if(list.length==0){
						alarmListNum++;
						if(alarmShow != 0) {
					        alarmNewNum++;
					        if(alarmNewNum > 0) {
					        	$("#alarm_newnum a").html(alarmNewNum);
					        	$("#alarm_newnum").show();
					        }
					    }
						var date = new Date();
					    var dateFormatString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
					    var alarmHtml = '<tr id=a'+alarmListNum+'><td style="width:110px;">' + vehicle.vn + '</td><td style="width:100px;">超出围栏</td><td>' + dateFormatString + '</td><td style="width:100px;"><a href="javascript:void(0);" onclick=deleteAlarm("a'+alarmListNum+'");>[清除记录]</a></td></tr>';
					    $("#alarmlist").append(alarmHtml);
					}else{
						for(var j = 0;j<list.length;j++){
							var row = list.eq(j);
							if(((vehicle.vn==row.children('td').eq(0).html())&&'超出围栏'==row.children('td').eq(1).html())){
								break b;
							}
						}
						alarmListNum++;
						if(alarmShow != 0) {
					        alarmNewNum++;
					        if(alarmNewNum > 0) {
					        	$("#alarm_newnum a").html(alarmNewNum);
					        	$("#alarm_newnum").show();
					        }
					    }
						var date = new Date();
					    var dateFormatString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
					    var alarmHtml = '<tr id=a'+alarmListNum+'><td style="width:110px;">' + vehicle.vn + '</td><td style="width:100px;">超出围栏</td><td>' + dateFormatString + '</td><td style="width:100px;"><a href="javascript:void(0);" onclick=deleteAlarm("a'+alarmListNum+'");>[清除记录]</a></td></tr>';
					    $("#alarmlist").append(alarmHtml);
					}
				}
			}
			
			// 判断infoWindow是否打开，如果打开则重新获取新数据显示
			if(vehicle.vid == currentVid && isInfoWindowShow) {
				if(infoWindow == null) {
					infoWindow = new CXInfoWindow(vehicle, map, true);
					currentVid = vehicle.vid;
				}
				getVehicleData(vehicle);
			}
			//更新汽车列表
			updateVehicleList(vehicle);
			// 判断报警
			if(vehicle.am != null) {
				//alert(vehicle.am);
				addAlarm(vehicle);
			}
		}
		listStyle();
		bindVehicleListEvent();
	});
}

//下载轨迹窗口
function download1(vehicleNum){
	$("#commendilog").dialog("open"); 
	$("#downloadvn").val(vehicleNum);
}

//开始下载
function downloadContrail(){
	var vehicleNum = $("#downloadvn").val();
	var beginTime = $("#begin_time").datebox("getValue");
	var endTime = $("#end_time").datebox("getValue");
	//$.getJSON("/history/download_history", {"vehicle_num":vehicleNum, "begin_time":beginTime, "end_time":endTime, "map_type":"baidu"},function(data){});
	//window.open("/history/download_history?vehicle_num="+vehicleNum+"&begin_time="+beginTime+"&end_time="+endTime+"&map_type=baidu");
	window.location.href="/history/download_history?vehicle_num="+vehicleNum+"&begin_time="+beginTime+"&end_time="+endTime+"&map_type=baidu";
}

//设置存储 围栏
function setFence(value){
	//alert(infoWindow.vehicle_.vid);
	var p = getFenceString();	
	$.getJSON("/console/set_fence", {"vehicle_id":infoWindow.vehicle_.vid ,"fence_name": value ,"marker_point":p ,"rand":Math.random}, function(data){
		alert(data);
		getSelectedVehiclesSimpleData(vidSelected, true, false ,false);
		infoWindowX.hide();
		clearCircle();
		clearMarker();
	});
}

//取消设置围栏
function clearFence(){
	infoWindowX.hide();
	clearCircle();
	clearMarker();
}

//删除围栏
function deleteFence(vehicleId){
	$.getJSON("/console/delete_fence", {"vehicle_id":vehicleId ,"rand":Math.random}, function(data){
		alert(data);
		if(data=="删除成功"){
			if(polygon!=null){
				clearCircle();
			}
			getSelectedVehiclesSimpleData(vidSelected, true, false ,false);
		}
	});
}

//开启报警声音
function openAlarm(){
	var _alarmSound = getCookie("AS");
	if(_alarmSound == "true"){
		alarmSound = true;
		$("#alarmSound").attr("checked","true");
	}
//	alert("当加载时获取cookie中的值是"+alarmSound);
	$("#alarmSound").click(function(){
		alarmSound = $(this).is(":checked");
//		alert("cookie设置为"+alarmSound);
		setCookie("AS", alarmSound, 365);
	});
	//这里添加声音
    setInterval(sound, 10000);
}

//添加报警
function addAlarm(vehicle){
	var ams = vehicle.am.split(",");
	a:for(var i = 0;i<ams.length-1;i++){
		var index = ams[i];
		var list = $("#alarmlist tr");
		if(list.length==0){
			alarmListNum++;
			if(alarmShow != 0) {
		        alarmNewNum++;
		        if(alarmNewNum > 0) {
		        	$("#alarm_newnum a").html(alarmNewNum);
		        	$("#alarm_newnum").show();
		        }
		    }
			var date = new Date();
		    var dateFormatString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
		    var alarmHtml = '<tr id=a'+alarmListNum+'><td style="width:110px;">' + vehicle.vn + '</td><td style="width:100px;">' + alarmType[index] + '</td><td>' + dateFormatString + '</td><td style="width:100px;"><a href="javascript:void(0);" onclick=deleteAlarm("a'+alarmListNum+'");>[清除记录]</a></td></tr>';
		    $("#alarmlist").append(alarmHtml);
		}else{
			for(var i = 0;i<list.length;i++){
				var row = list.eq(i);
				if(((vehicle.vn==row.children('td').eq(0).html())&&alarmType[index]==row.children('td').eq(1).html())){
					break a;
				}
			}
			alarmListNum++;
			if(alarmShow != 0) {
		        alarmNewNum++;
		        if(alarmNewNum > 0) {
		        	$("#alarm_newnum a").html(alarmNewNum);
		        	$("#alarm_newnum").show();
		        }
		    }
			var date = new Date();
		    var dateFormatString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
		    var alarmHtml = '<tr id=a'+alarmListNum+'><td style="width:110px;">' + vehicle.vn + '</td><td style="width:100px;">' + alarmType[index] + '</td><td>' + dateFormatString + '</td><td style="width:100px;"><a href="javascript:void(0);" onclick=deleteAlarm("a'+alarmListNum+'");>[清除记录]</a></td></tr>';
		    $("#alarmlist").append(alarmHtml);
		}
	}
}

//删除报警
function deleteAlarm(id){
	$("#"+id).remove();
}

//报警声是否响
function sound(){
	if(alarmSound&&$("#alarmlist tr").length>0){
		$("#as").empty();
		var a = '<audio src="success.mp3" autoplay="true"></audio>';
		$("#as").html(a);
	}
}

//清除报警列表
function removeAlarm(){
	$("#alarmlist").empty();
	alarmListNum = 0;
}

//获取车辆详细信息并冒泡显示加居中。。。。
function getVehicleDataAndCenter(vid) {
	vidSelected = vidSelected.replace(new RegExp(vid + ",", "gm"), "");
	vidSelected += vid + ",";
	removeMarker(vid, vehicleArray, map);
	$.getJSON("/console/get_vehicle_data", {"vehicle_id":vid, "map_type":mapType, "rand":Math.random}, function(data) {
		if(data==null){
			alert("此车辆平台已过期");
		//alert(data.speed);
		}else{
			var vehicle = new Vehicle();
			vehicle.setData(data);
			if(!(vehicle.lat==0&&vehicle.lng==0)){
				var marker = generateMarker(vehicle);
				vehicle.marker = marker;
				vehicleArray.push(vehicle);
				if(infoWindow == null) {
					infoWindow = new CXInfoWindow(vehicle, map, true);
				} else {
					infoWindow.setVehicle(vehicle);
					infoWindow.show();
				}
				currentVid = vehicle.vid;
				
				centerTo(map, vehicle.lat, vehicle.lng);
			}else{
				alert("此车辆暂无数据");
			}
		}
	});
	
}

//获取车辆的详细数据
function getVehicleData(vehicle) {
	$.getJSON("/console/get_vehicle_data", {"vehicle_id":vehicle.vid, "map_type":mapType, "rand":Math.random}, function(data) {
		vehicle.setData(data);
		infoWindow.setVehicle(vehicle);
	});
}

//搜索框中点击后触发左侧列表样式
function doSearch(value){
  // alert(value);
  if ("" == value) {
    getLeftList($("#nowCustomerId").val(), $("#nowCustomer").html());
  } else if ("请输入设备号/IMEI号" == value){
    // DO NOTHING
  } else {
    // DONE background query matched vehicles
    getGroupsAndVehicles(0, value);
  }
//	for(var i = 0;i<allVehicleNumArray.length;i++){
//		if(allVehicleNumArray[i][1]==value){
//			vehicleId = allVehicleNumArray[i][0];
//		}
//	}
//	listStyle();
//	getVehicleDataAndCenter(vehicleId);
}

//左侧列表点击样式
function listStyle(){
	var margintop = 0;
	if($.NV('shell')=='搜狗浏览器'){margintop = 1;};
	var num = '';
	for(var i = 0;i<allVehicleNumArray.length;i++){
		if(allVehicleNumArray[i][0]==vehicleId){
			num = allVehicleNumArray[i][1];
		}
	}
	$('.accordion li').removeClass('domenu');
	$('.accordion li .sub_menu').remove();
	var content = '<div class="sub_menu" style=" width:250px; ">'+
	  '<div class="leftsubmenu" style=" float:right; width:115px;">'+
	  '<a href="javascript:void(0);" style="float:left;margin-left:3px; height:17px; padding:0px; line-height:17px;" onclick=follow("'+num+'")>跟踪</a>'+
	  '<a href="javascript:void(0);"  onclick=playback("'+num+'") style="float:left;margin-left:5px;  height:17px; padding:0px; line-height:17px;">回放</a>'+
	  '<a href="javascript:void(0);"  onclick=showMenu("'+vehicleId+'","'+num+'",event) style="float:left;margin-left:5px;  height:17px; padding:0px; line-height:17px;">更多>></a>';
//	  '<ul class="sf-menu"  style="float:left; width:45px;"><li class="current" style=" width:45px;">'+
//	    '<a  style=" margin-top:'+margintop+'px; padding:0px 0px 0px 7px;  font: 12px Microsoft YaHei; font-size:12px; width:45px; "  onclick=$("#thisul2").show();>更多>></a>'+
//	      '<div>'+
//	      '<ul id="thisul2" style="margin-top:-10px; display:none; z-index:999; "><li><a  style="padding:0px 0px 0px 5px;width:75px;" href="javascript:void(0);" onclick=disdialog("'+vehicleId+'");>设备信息</a></li>'+
//	      '<li><a style="padding:0px 0px 0px 5px;width:75px;" onclick=$("#subul99").show();$("#subul03").hide();>移动至组 >></a>'+
//	        '<ul id="subul99" style="display:none;">';
//	for(var i = 0;i<allGroupNameArray.length;i++){
//		content += '<li><a href="javascript:void(0);" onclick="updateVehicleGroup('+allGroupNameArray[i][0]+')">'+allGroupNameArray[i][1]+'</a></li>';
//	}
//	content += '</ul></li><li><a style="padding:0px 0px 0px 5px;width:75px;" onClick=download1("'+num+'")>下载轨迹</a></li>';
//	content += '<li><a style="padding:0px 0px 0px 5px;width:75px;" onclick=$("#subul99").hide();$("#subul03").show();>设备指令 >></a><ul id="subul03" style="display:none;">';
//	content += '<li><a  onclick=openCutDialog("'+vehicleId+'","'+num+'");>远程断油电</a></li>';
//	content += '<li><a  onclick=openRestoreDialog("'+vehicleId+'","'+num+'");>远程恢复油电</a></li>';
//	content += '<li><a  onclick=getSingle("'+vehicleId+'");>查询定位</a></li>';
//	content += '<li><a href="javascript:void(0);" onClick="download1('+num+')">下载轨迹</a></li>';
//	content += '</ul></li>';
//	content += '</ul></li></ul>';
	content += '</div></div>';
	$('.'+vehicleId).parent().parent().append(content);
	var leftsubmenu = $('.sf-menu').superfish({}); //渲染以上菜单样式
	$('.'+vehicleId).parent().parent().addClass('domenu');
	/*var ischeck = $(this).parent().children(".chkbox").children("."+vehicleId+"").is(":checked");
	if(!ischeck){
		roomids = document.getElementsByClassName(vehicleId);  
        for (var j = 0; j < roomids.length; j++) { 
            roomids.item(j).checked = true;  
        }
        vidSelected = vidSelected.replace(new RegExp(vehicleId + ",", "gm"), "");
        vidSelected += vehicleId + ",";
	}*/
}
function showMenu(vehicleId,vehicleNum, evt) {
//  var groupList = "";
//  for(var i = 0;i<allGroupNameArray.length;i++){
//    groupList += '<div >'+allGroupNameArray[i][1]+'</div>';
//  }
//  $("#menuGroups").html(groupList);
  var groupParent = $('#menuChangeGroupMain')[0];  // 获取菜单项
  var item = $('#mm').menu('getItem', groupParent);

  $.each($('#menuGroups div'), function(index, d) {
    $("#mm").menu("removeItem", d);
  });
  for(var i = 0;i<allGroupNameArray.length;i++){
    if (allGroupNameArray[i][0] >=0) {
      $('#mm').menu('appendItem', {
        parent: item.target,  // 设置父菜单元素
        text: allGroupNameArray[i][1],
        name: 'menuGroup_' + allGroupNameArray[i][0],
        // onclick: function(){alert(allGroupNameArray[i][0])}
      });
    }
  }  
  $('#mm').menu({onClick: function(item) {
    if (item.name == "menuEviceInfo") {
      disdialog(vehicleId);
    } else if (item.name == "menuDownloadHistory") {
      download1(vehicleNum);
    } else if (item.name == "menuCmdRelay") {
      openCutDialog(vehicleId, vehicleNum);
    } else if (item.name == "menuCmdRelayOff") {
      openRestoreDialog(vehicleId, vehicleNum);
    } else if (item.name == "menuCmdPosition") {
      getSingle(vehicleId);
    } else if (item.name.indexOf("menuGroup_")>=0) {
      updateVehicleGroup(item.name.substr(10));
    } else {
      alert(item.name + "," + vehicleId +"," + vehicleNum);
    }
  }});
  $('#mm').menu('show',{left:(evt.x?evt.x:evt.pageX), top:(evt.y?evt.y:evt.pageY)});
  
}

//复选框和单击事件
function bindVehicleListEvent(){
	$(".lbt").parent().click(function(){
		var vid = $(this).parent().find('input').attr('class').toString();
		/*var ischeck = $(this).parent().children(".chkbox").children("."+vid+"").is(":checked");
		if(!ischeck){
			roomids = document.getElementsByClassName(vid);  
	        for (var j = 0; j < roomids.length; j++) { 
	            roomids.item(j).checked = true;  
	        }
	        vidSelected = vidSelected.replace(new RegExp(vid + ",", "gm"), "");
	        vidSelected += vid + ",";
		}*/
		vehicleId = vid;
		listStyle();
		getVehicleDataAndCenter(vehicleId);
	});
	/*$(".chkbox").children().click(function() {
		var ischeck = $(this).is(":checked");
	//	alert(ischeck);
		if(ischeck){
			var classname = $(this).attr("class");
			roomids = document.getElementsByClassName(classname);  
            for (var j = 0; j < roomids.length; j++) { 
                roomids.item(j).checked = true;  
            }
            vidSelected = vidSelected.replace(new RegExp(classname + ",", "gm"), "");
            vidSelected += classname + ",";
            
            getSelectedVehiclesSimpleData(classname, false, false, false);
		}else{
			var classname = $(this).attr("class");
			$("."+classname+"").removeAttr("checked");
			removeMarker(classname, vehicleArray, map);
			if(infoWindow != null) {
				infoWindow.hide();
			}
			vidSelected = vidSelected.replace(new RegExp(classname + ",", "gm"), "");
		}
	});*/
}

//切换InfoWindow层,当点击maker的时候出发infowindow
function toggleInfoWindow(vid) {
	var vehicle = null;
	for(var i = 0; i < vehicleArray.length; i++) {
		if(vehicleArray[i].vid == vid) {
			vehicle = vehicleArray[i];
		}
	}
	if(vehicle != null) {
		if(infoWindow == null) {
			infoWindow = new CXInfoWindow(vehicle, map, true);
			currentVid = vehicle.vid;
		} else {
			infoWindow.toggle();
			if(currentVid != vehicle.vid) {
				infoWindow.setVehicle(vehicle);
				infoWindow.show();
				currentVid = vehicle.vid;
			}
		}
		if(vehicle.s == null || vehicle.tm == null || vehicle.gt == null || vehicle.a == null) {
			getVehicleData(vehicle);
		}
	}
}

//关闭冒出来的泡！
function _cxInfoWindowHide() {
	infoWindow.hide();
}

//放大功能
function _cxInfoWindowAmplify(){
	$.getJSON("/console/get_vehicle_data", {"vehicle_id":currentVid, "map_type":mapType, "rand":Math.random}, function(data) {
		var vehicle = new Vehicle();
		vehicle.setData(data);
		var _lat = vehicle.lat;
		var _lng = vehicle.lng;
		amplify(map, _lat, _lng ,18);
		infoWindow.setVehicle(vehicle);
	});
}

//小气泡的回放按钮触发
function playback(num){
	//让回放窗口显示出来
  $('#hftype').change(function(){
    $('.shi_jian').hide();
    $('.ri_qi').hide();
    $('.gui_ji').hide();
    $('.'+$(this).children('option:selected').val()+'').show();
    if($(this).children('option:selected').val()=="shi_jian"){
      $("#back_mode").val(1);
    }else if($(this).children('option:selected').val()=="ri_qi"){
      $("#back_mode").val(2);
    }else{
      $("#back_mode").val(3);
    }
});
  
  $("#hftype").val("shi_jian");
  $('.shi_jian').show();
  $('.ri_qi').hide();
  $('.gui_ji').hide();
  $("#back_mode").val(1);

  var date = new Date();
  var y = date.getFullYear();
  var m = date.getMonth()+1;
  var d = date.getDate();

  var beginTime = y + '-' + (m<10?('0'+m):m) + '-' + (d<10?('0'+d):d) + ' 00:00:00';
  var endTime = y + '-' + (m<10?('0'+m):m) + '-' + (d<10?('0'+d):d) + ' 23:59:59';

//  $.fn.datebox.defaults.formatter =function(date) {
//    alert(date);
//    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() ;//+" " + date.getHours() +":" + date.getMinutes() +":" + date.getSeconds();
//  };
//  $("#history_start_time").datebox({
//    formatter:function(date) {
//      alert(date);
//      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() +" " + date.getHours() +":" + date.getMinutes() +":" + date.getSeconds();
//    }
//  });
//  $("#history_end_time").datebox({
//    formatter:function(date) {
//      alert(date);
//      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() +" " + date.getHours() +":" + date.getMinutes() +":" + date.getSeconds();
//    }
//  });
  $("#history_start_time").datebox("setValue", beginTime);
  $("#history_end_time").datebox("setValue", endTime);
	$("#huifang").dialog("open");
	$("#playback_num").val(num);
}

//回放事件开始
function goPlayBack(){
	var vehicleNum = $("#playback_num").val();
	var beginTime = null;
	var endTime = null;
	var mode = $("#back_mode").val();
	if(mode==1){
		beginTime = $("#history_start_time").datebox("getValue");
		endTime = $("#history_end_time").datebox("getValue");
	}else if(mode==2){
		var date = $("#rpdate").datebox("getValue");
		beginTime = date + ' 00:00';
		endTime = date + ' 23:59';
	}else{
		var date = new Date();
		var val = $("#history_time").val();
		if(val < 5) {
			endTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
			date.setHours(date.getHours() - val);
			beginTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
		} else if(val == 5) {
			beginTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 00:00';
			endTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 23:59';
		}
	}
	if (beginTime > endTime) {
	  var tempTime = beginTime;
	  beginTime = endTime;
	  endTime = tempTime;
	}
	window.open("/history?vehicle_num=" + vehicleNum + "&begin_time=" + beginTime + "&end_time=" + endTime + "&map_type=" + mapType + "&lat=" + lat + "&lng=" + lng + "&zoom=" + zoom, "_blank");
	//alert(beginTime);
	//alert(endTime);
	$("#huifang").dialog("close");
}

function follow(num){
	window.open("/follow?vehicle_num=" + num + "&map_type=" + mapType + "&lat=" + lat + "&lng=" + lng + "&zoom=" + zoom, "_blank");
}

//设置地图上小车的颜色
function generateMarker(vehicle) {
	if(vehicle.ms == '0'){
		if(vehicle.t.length == 2){
			var strs = vehicle.t.split(""); 
			var j = strs[1]
			var image = "/images/cars/"+j+"_offline.png";
		}else{
			image = "/images/cars/" + vehicle.t +".png";
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
	return createMarker(vehicle, image, map);
}


//设置cookie,具体方法在carvitamin_core中
function setMapCookie() {
	setCookie("lat", lat, 365);
	setCookie("lng", lng, 365);
	setCookie("zoom", zoom, 365);
}

//初始化地图控件
function initMapSelector() {
	$("#current_maptype").click(function() {
		if ($(".mapmax").css("display") == "none") {
			$(".mapmax").slideDown(function() {
				$("body").one("click", function() {
					if ($(".mapmax").css("display") != "none") {
						$(".mapmax").slideUp();
					}
				});
			});
		} else {
			$(".mapmax").slideUp();
		}
	});
	$(".mapmax a").click(function() {
		var mapTypeIndex = $(".mapmax a").index($(this));
		$(".mapmax a").removeClass("map");
		$(this).addClass("map");
		$(".mapmax").slideUp();
		if (mapTypeIndex == 0) {
			$("#current_maptype span").html("谷歌地图");
			setMapType("google");
		} else if (mapTypeIndex == 1) {
			$("#current_maptype span").html("百度地图");
			setMapType("baidu");
		} else if (mapTypeIndex == 2) {
			$("#current_maptype span").html("高德地图");
			setMapType("mapabc");
		} else if (mapTypeIndex == 3) {
			$("#current_maptype span").html("卫星地图");
			setMapType("satellite");
		} else {
			// do nothing
		}
	});
}

// 初始化刷新时间设置控件
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

//刷新时间,到了时间重新进行方法
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
		getSelectedVehiclesSimpleData(vidSelected, true, false ,false);
		setMapCookie();
	}
	$("#time_left_second").html(timeLeft);
}

//搜索功能框
function initSearchDiv(){
  $("#doSearch").bind("keydown", function(event) {
    if(event.keyCode === $.ui.keyCode.ENTER) {
      doSearch($("#doSearch").val());
    }
  });
//	vehicleNumData = [];
//	for(var i = 0;i<allVehicleNumArray.length;i++){
//		vehicleNumData.push(allVehicleNumArray[i][1]);
//	}
//	$("#doSearch").bind("keydown click", function(event) {
//    	if(event.keyCode === $.ui.keyCode.TAB && $(this).data("ui-autocomplete").menu.active) {
//        	event.preventDefault();        
//        }else if(typeof(event.keyCode) == "undefined"){
//    		$(this).autocomplete("search", "");
//        }
//    }).autocomplete({
//        minLength: 0,
//        source: function(request, response) {
//    		response($.ui.autocomplete.filter(vehicleNumData, extractLast(request.term)));        
//        },
//        focus: function(event, ui) {
//            return false;
//        },
//        select: function(event, ui) {
//            var terms = split(this.value);
//            terms.pop();
//            terms.push(ui.item.label);
//            terms.push("");
//            this.value = terms.join("");
//            return false;
//        }
//    }).data("ui-autocomplete")._renderItem = function(ul, item) {
////      $(ul).css("z-index", currentZIndex);
//        if($(ul).children().length <= 1000) {
//            return $("<li>").append("<a>" + item.label + "</a>").appendTo(ul);
//        } else {
//            return $("</li>");
//        }
//    };
}

function split(val) {
    return val.split(/,\s*/);
}

function extractLast(term) {
    return split(term).pop();
}

//添加分组
function addGroup(groupName){
	//还要有customerId
	var customerId = customer.cid;
	if(groupName!=""){
		$.getJSON("/console/add_group",{"customer_id":customerId, "group_name":groupName, "rand":Math.random},function(data){
			alert(data);
			getGroupsAndVehicles(customer.cid);
		});
		$('#addgroup').dialog('close');
	}else{
		alert("分组名不能为空");
	}
	
}

//修改分组
function updateGroup(gid,groupName){
	if(groupName!=""){
		$.getJSON("/console/update_group",{"group_id":gid, "group_name":groupName, "rand":Math.random},function(data){
			alert(data);
			getGroupsAndVehicles(customer.cid);
		});
		$('#editgroup').dialog('close');
		
	}else{
		alert("分组名不能为空");
	}
	
}

//车辆更换分组
function updateVehicleGroup(groupId){
  if (groupId >=0) {
  //	alert(groupId);
  	$.getJSON("/console/update_vehicle_group",{"group_id":groupId, "vehicle_id":vehicleId, "rand":Math.random},function(data){
  		alert(data);
  		getGroupsAndVehicles(customer.cid);
  	});
  }
}

//跳转报表页面
function goReport(){
	var num = "";
	for(var i = 0;i<allVehicleNumArray.length;i++){
		if(allVehicleNumArray[i][0]==vehicleId){
			num = allVehicleNumArray[i][1];
		}
	}
	
	window.location.href="/reports/mileage.jsp?vehicleNum="+num;
	window.event.returnValue = false; 
}

function load2(){
    using(['dialog','messager'], function(){
        $('#dd').dialog({
		title:'Dialog',
		width:300,
		height:200
	});
	$.messager.show({
		title:'info',
		msg:'dialog created'
	});
  });
}

//计算地图实际距离开始-————————————————————————————————
function getRad(d){
    return d*Math.PI/180.0;
}

/**
 * caculate the great circle distance
 * @param {Object} lat1
 * @param {Object} lng1
 * @param {Object} lat2
 * @param {Object} lng2
 */
function getGreatCircleDistance(lat1,lng1,lat2,lng2){
    var radLat1 = getRad(lat1);
    var radLat2 = getRad(lat2);
    
    var a = radLat1 - radLat2;
    var b = getRad(lng1) - getRad(lng2);
    
    var s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    var s = s*EARTH_RADIUS;
    s = Math.round(s*10000)/10000.0; 
    return s;
      
}
//计算地图实际距离结束-————————————————————————————————

//设备详细信息
function disdialog(vehicleId){
	$.getJSON("/mechine/get_mechine_vehicleId", {"vehicle_id":vehicleId, "rand":Math.random}, function(data){
		$("#mb").val(data.mb);
		$("#sn").val(data.sn);
		$("#ind").val(data.id);
		$("#ed").val(data.ed);
		$("#mname").val(data.mname);
		$("#mn").val(data.mn);
		$("#con").val(data.con);
		$("#cop").val(data.cop);
		$("#vn").val(data.vn);
		$("#s").val(data.s);
		for(var i = 1;i<=7;i++){
			$("#ci"+i).attr("checked",null);
		}
		//roomids = document.getElementsById("ci"+data.ci);
		//roomids.checked = true;
		//alert(data.ci);
		if(data.ci.length!=2){
			var j = data.ci-1;
			$("input[name='ico']").get(j).checked=true;
		}else{ 
			var strs = data.ci.split(""); 
//			for(var i = 0; i < strs.length; i++) {
//				alert(strs[i]); 
//			} parseInt
			var j = parseInt(strs[1])+7;
			$("input[name='ico']").get(j).checked=true;
		}
		//$("#ci"+data.ci).checked=true; 
		$("#cor").val(data.cor);
		if(data.ivl==0){
			$("input[name='ivl']").get(0).checked=true;
		}else{
			$("input[name='ivl']").get(1).checked=true;
		}
		$('#settings').dialog('open');
	});
}

//修改设备信息
function updateMechine(){
	var mn = $("#mn").val();
	var con = $("#con").val();
	var cop = $("#cop").val();
	var vn = $("#vn").val();
	var s = $("#s").val();
	var sn = $("#sn").val();
	//$("#ci"+data.ci).attr("checked","checked");
	//.is(":checked")
	var ico = null;
	var radio = $('input[name=ico]');
	for(var i = 0;i<radio.length; i++){
		if(radio.eq(i).is(":checked")){
			ico = radio.eq(i).attr("value");
		}
	}
	var cor = $("#cor").val();
	var ivl = 1;
	if($('input[name=ivl]').eq(0).is(":checked")){
		ivl = 0;
	}
	var resetpass = 1;
	if($('input[name=resetpass]').eq(0).is(":checked")){
		resetpass = 0;
	}
	$.getJSON("/mechine/update_mechine", {"sim_no":sn, "mechine_no":mn, "car_owner_name":con, "car_owner_phone":cop, "vehicle_num":vn, "up_speed":s, "car_icon": ico, "car_owner_remark":cor, "if_vehicle_login":ivl, "if_reset_pass":resetpass, "rand":Math.random}, function(data){
		alert(data);
	});
	$('#settings').dialog('close');
}

function changeUnderfined(data){
	if(typeof(data) != "undefined"){
		return data;
	}else{
		return "";
	}
}

//服务商
function getService(){
	$("#service").html(null);
	$("#tel").html(null);
	$("#aess").html(null);
	var pid = customer.pid;
	$.getJSON("user/get_customer",{"customer_id":pid ,"rand":Math.random()}, function(data){
		$("#service").html(data.cn);
		$("#tel").html(data.ct);
		$("#aess").html(data.ca);
	});
	$('#providers').dialog('open');
}

//这里比onload还要早
//$(document).ready(function($){


//var example = $('.sf-menu').superfish({});
//var today=new Date();
//$('#history_start_time').datebox('setValue',today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate()+' 00:00:00'); 
//$('#history_end_time').datebox('setValue',today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate()+' 23:59:59'); 

//$('#begin_time').datebox('setValue',today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate()+' 00:00:00'); 
//$('#end_time').datebox('setValue',today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate()+' 23:59:59'); 
	
//$("#huifang").dialog("close");

var today=new Date();
//$('#rpdate').datebox('setValue',today.getFullYear()+"/"+(today.getMonth() + 1)+"/"+today.getDate()); 
//$('#begin_time').datebox('setValue',today.getFullYear()+"/"+(today.getMonth() + 1)+"/"+(today.getDate()-1)+" "+today.getHours() + ":" + today.getMinutes() + ":" +today.getSeconds()); 
//$('#end_time').datebox('setValue',today.getFullYear()+"/"+(today.getMonth() + 1)+"/"+today.getDate()+" "+today.getHours() + ":" + today.getMinutes() + ":" +today.getSeconds()); 

//$('.accordion').find('h2').click(function(){
//	    $(this).next().slideToggle();
//	}).next().hide();
//	//div圆角效果 开始
//	if (window.PIE) {
//        $('.rounded').each(function() {
//            PIE.attach(this);
//        });
//    }
//	//div圆角效果 结束
////	$('#dlg').dialog('close');
////	initialize();
//	//setMapType("google");
//	// setMapType("baidu");
//	refreshMap("baidu");
//	$('#alarm_newnum').hide();
//	alarmShow = 1;
//	$("#openwarning").click(function(){
//        $("#carwarning").fadeIn(300);
//        alarmNewNum = 0;
//        alarmShow = 0;
//        $("#alarm_newnum").hide();
//	});
//	$("#cartip").fadeIn(300);
//	$("#point").fadeIn(300);
//    $("#tipclose").click(function(){
//        $("#cartip").fadeOut(300);
//	});
//	
//	$("#closewarning").click(function(){
//        $("#carwarning").fadeOut(300);
//        alarmShow = 1;
//	});
//	
///*更换皮肤 开始*/
//	$('.styleswitch').click(function()
//	{
//		switchStylestyle(this.getAttribute("rel"));
//		return false;
//	});
//	var c = readCookie('style');
//	if (c) switchStylestyle(c);
//	
///*更换皮肤 结束*/
//});

/*换肤函数 开始*/
function switchStylestyle(styleName)
{
	$('link[@rel*=style][@title]').each(function(i) 
	{
		this.disabled = true;
		if (this.getAttribute('title') == styleName) this.disabled = false;
	});
	createCookie('style', styleName, 365);
}

// cookie functions http://www.quirksmode.org/js/cookies.html
function createCookie(name,value,days)
{
	if (days)
	{
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}
function readCookie(name)
{
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++)
	{
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}
function eraseCookie(name)
{
	createCookie(name,"",-1);
}
/*换肤函数 结束*/
