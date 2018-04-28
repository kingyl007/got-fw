// ============= 自定义Vehicle对象开始 ===================

Vehicle.prototype = new Object();

function Vehicle() {
	this.vid = null; // 车辆ID
	this.vn = null;  // 车牌号
	this.lat = null;  // 纬度
	this.lng = null;  // 经度
	this.t = null;  // 车辆类型
	this.vsn = null;  // 车辆状态
	this.ms = null;  // 车机状态
	this.dn = null;  // 方向
	this.s = null;  // 中文详细状态
	this.tm = null;  // 当日里程
	this.gt = null;  // 信号时间
	this.a = null;  // 中文详细地址
	this.am = null; // 报警状态
	this.speed = null; // 速度
	this.ct=null;
	this.sl=null;
	this.mp = [];
	this.mt = null;

	this.marker = null;  // 地图标注对象
}

Vehicle.prototype.setSimpleData = function(data) {
	this.vid = data.vid;
	this.vn = data.vn;
	this.lat = data.lat;
	this.lng = data.lng;
	this.t = data.t;
	this.vsn = data.vsn;
	this.ms = data.ms;
	this.dn = data.dn;
	this.am = data.am;
	this.speed = data.speed;
	this.gt=data.gt;
	this.ct=data.ct;
	this.sl=data.sl;
	if(typeof(data.mp) != "undefined"){
		var array = data.mp.split(";");
		for(var i = 0;i<array.length;i++){ 
			var simple = array[i].split(",");
			if(mapType == "google" || mapType == "satellite"){
				var p = new google.maps.LatLng(simple[0], simple[1]);
			}else if(mapType == "baidu"){
				var p = new BMap.Point(simple[1], simple[0]);
			}else if(mapType == "mapabc"){
				var p = new MMap.LngLat(simple[1], simple[0]);
			}
			this.mp.push(p);
		}
	}else{		
		this.mp.length = 0;
	}
	this.mt = data.mt;
}

Vehicle.prototype.setData = function(data) {
	this.setSimpleData(data);
	this.s = data.s;
	this.tm = data.tm;
	this.gt = data.gt;
	this.a = data.a;
	this.ct=data.ct;
	this.sl=data.sl;
}

// ============= 自定义Vehicle对象结束 ===================

// ============= 自定义VehicleNum对象开始 ===================

VehicleNum.prototype = new Object();

function VehicleNum(vn, vid) {
	this.label = vn;
	this.value = vid;
}

// ============= 自定义VehicleNum对象结束 ===================

// ============= 自定义GpsDataHistory对象开始 ===================

GpsDataHistory.prototype = new Object();

function GpsDataHistory(_lat, _lng, _vsn, _ms, _dn, _s, _gt, _a, _tm, _speed) {
	this.lat = _lat;
	this.lng = _lng;
	this.vsn = _vsn;
	this.ms = _ms;
	this.dn = _dn;
	this.s = _s;
	this.gt = _gt;
	this.a = _a;
	this.tm = _tm;
	this.speed = _speed;
}

// ============= 自定义GpsDataHistory对象结束 ===================

// ============= 操作script文件开始 ===================

function createScript(filename) {
	var fileref=document.createElement("script");
	fileref.setAttribute("type","text/javascript");
	fileref.setAttribute("src", filename);
	return fileref;
}

function addScript(filename) {
	if(!checkScript(filename)) {
		var fileref = createScript(filename);
		if(typeof(fileref) != "undefined") {
			document.getElementsByTagName("head")[0].appendChild(fileref);
		}
		return fileref;
	}
}

function removeScript(filename) {
	var allsuspects=document.getElementsByTagName("script");
	for(var i = 0; i < allsuspects.length; i++) {
		if(allsuspects[i] && allsuspects[i].getAttribute("src") != null && allsuspects[i].getAttribute("src").indexOf(filename) != -1) {
			allsuspects[i].parentNode.removeChild(allsuspects[i]);
		}
	}
}

function checkScript(filename) {
	var result = false;
	var allsuspects=document.getElementsByTagName("script");
	for(var i = 0; i < allsuspects.length; i++) {
		if(allsuspects[i] && allsuspects[i].getAttribute("src") != null && allsuspects[i].getAttribute("src").indexOf(filename) != -1) {
			result = true;
		}
	}
	return result;
}

function replaceScript(oldfilename, newfilename) {
	var allsuspects=document.getElementsByTagName("script");
	for(var i = 0; i < allsuspects.length; i++) {
		if(allsuspects[i] && allsuspects[i].getAttribute("src") != null && allsuspects[i].getAttribute("src").indexOf(oldfilename) != -1) {
			var newelement = createScript(newfilename);
			allsuspects[i].parentNode.replaceChild(newelement, allsuspects[i]);
			return newelement;
		}
	}
}

// ============= 操作script文件结束 ===================

// ============= 操作cookie开始 ===================

function setCookie(name, value, expire) {
	var exp = new Date();
	exp.setTime(exp.getTime() + expire*24*60*60*1000);
	document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

function getCookie(name) {
	var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
     if(arr != null) {
		 return unescape(arr[2]);
	 }else {
		 return null;
	 }
}

function delCookie(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var val = getCookie(name);
	if(val != null) {
		document.cookie = name + "=" + escape(val) + ";expires=" + exp.toGMTString();
	}
}

// ============= 操作cookie结束 ===================

// ============= 工具函数开始 ===================

function changeSecondsToTimeNoSeconds(seconds) {
    var _days = parseInt(seconds/(24*60*60));
    var _hours = parseInt((seconds%(24*60*60))/(60*60)); 
    var _minutes = parseInt((seconds%(60*60))/60);
//    var _seconds = parseInt(seconds%60);
    var result = "";
    if(_days > 0) {
        result += _days + "天";
    }
    if(_hours > 0) {
        result += _hours + "小时";
    }
    if(_minutes > 0) {
        result += _minutes + "分";
    }
//    if(_seconds > 0) {
//        result += _seconds + "秒";
//   }
	if(result == "") {
		result = "0分";
	}
    return result;
}


function changeSecondsToTime(seconds) {
    var _days = parseInt(seconds/(24*60*60));
    var _hours = parseInt((seconds%(24*60*60))/(60*60));
    var _minutes = parseInt((seconds%(60*60))/60);
    var _seconds = parseInt(seconds%60);
    var result = "";
    if(_days > 0) {
        result += _days + "天";
    }
    if(_hours > 0) {
        result += _hours + "小时";
    }
    if(_minutes > 0) {
        result += _minutes + "分";
    }
    if(_seconds > 0) {
        result += _seconds + "秒";
    }
	if(result == "") {
		result = "0分";
	}
    return result;
}

Date.prototype.toCommonCase=function(){ 
	var xYear=this.getYear(); 
	xYear=xYear+1900; 

	var xMonth=this.getMonth()+1; 
	if(xMonth<10){ 
	xMonth="0"+xMonth; 
	} 

	var xDay=this.getDate(); 
	if(xDay<10){ 
	xDay="0"+xDay; 
	} 

	var xHours=this.getHours(); 
	if(xHours<10){ 
	xHours="0"+xHours; 
	} 

	var xMinutes=this.getMinutes(); 
	if(xMinutes<10){ 
	xMinutes="0"+xMinutes; 
	} 

	var xSeconds=this.getSeconds(); 
	if(xSeconds<10){ 
	xSeconds="0"+xSeconds; 
	} 
	return xYear+"-"+xMonth+"-"+xDay+" "+xHours+":"+xMinutes+":"+xSeconds; 
	} 


// ============= 工具函数结束  ===================

// ============= 报警开始 ===================

var alarmType = ["紧急报警", "非法开门", "电瓶拆除", "天线开路", "天线短路", "GPS故障", "欠压", "电池故障", "温度异常"];

// ============= 报警结束 ===================

// ==============方向开始===================

var directionName = [["n","正北"],["s","正南"],["e","正东"],["w","正西"],["ne","东北"],["se","东南"],["nw","西北"],["sw","西南"]];

// ==============方向结束===================

// ============= jQuery插件开始 ===================

jQuery.fn.pager = function(options) {
    options = jQuery.extend({
        amount: 0, // 总数量
        allNo: 0, // 总页数
        pageNo: 0, // 当前页数
        pageSize: 0, // 每页数量
        callback: function(n) {},
        id: 0 // pager编号
    }, options||{});
    var page_pre = "page_pre_" + options.id;
    var page_next = "page_next_" + options.id;
    var page_no = "page_no_" + options.id;
    var HTML = '<div class="macji"><ul class="macji-skin"><li class="pagell">';
    HTML += '<a id="' + page_pre + '" class="next png">上一页</a>';
    HTML += '<span id="' + page_no + '">0</span>';
    HTML += '<a id="' + page_next + '" class="next png">下一页</a>';
    HTML += '</li></ul></div>';
    $(this).html(HTML);
    var pageNoHTML = '';
    var diff = 4; // 省略号差值设置
    if(options.pageNo <= diff) {
        for(var i = 1; i < options.pageNo; i++) {
            pageNoHTML += '<a class="png">' + i + '</a>';
        }
        pageNoHTML += '<a class="current png">' + i + '</a>';
    } else {
        pageNoHTML += '<a class="png">1</a><p>...</p>';
        for(var i = diff - 2; i > 0; i--) {
            pageNoHTML += '<a class="png">' + (options.pageNo - i) + '</a>';
        }
        pageNoHTML += '<a class="current png">' + options.pageNo + '</a>';
    }
    if((options.allNo - options.pageNo) < diff) {
        if((options.allNo - options.pageNo) > 0) {
            for(var i = 1; i < (options.allNo - options.pageNo); i++) {
                pageNoHTML += '<a class="png">' + (options.pageNo + i) + '</a>';
            }
            pageNoHTML += '<a class="png">' + options.allNo +'</a>';
        }
    } else {
        for(var i = 1; i < (diff - 1); i++) {
           pageNoHTML += '<a class="png">' + (options.pageNo + i) + '</a>';
        }
        pageNoHTML += '<p>...</p><a class="png">' + options.allNo + '</a>';
    }
    $("#" + page_no, $(this)).html(pageNoHTML);
    $("a", $("#" + page_no, $(this))).each(function () {
        $(this).click(function() {
            options.callback($(this).text());
        });
    });
    if (options.pageNo > 1) {
        $("#" + page_pre, $(this)).click(function () {options.callback(((options.pageNo > 1) ? (options.pageNo - 1) : (1)));});
    }
    if (options.pageNo < options.allNo) {
        $("#" + page_next, $(this)).click(function () {options.callback(((options.pageNo < options.allNo) ? (options.pageNo + 1) : (options.allNo)));});
    }
    return $(this);
}

// ============= jQuery插件结束 ===================
