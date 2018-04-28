//==========baidu map relative begin===================== 
var autoComplete = null;
function initLocationQueryControl(inputId, map) {
  var G = function(id) {
    return document.getElementById(id);
  };
  var setPlace = function(myValue) {
    // map.clearOverlays(); //清除地图上所有覆盖物
    function myFun() {
      var p = local.getResults().getPoi(0);
      if (p && p.point) {
        var pp = p.point; // 获取第一个智能搜索的结果
        map.centerAndZoom(pp, 18);
        if (map_lcListeners) {
          var ne = {point:pp, lat:pp.lat,lng:pp.lng};
          $.each(map_lcListeners, function(i, l) {
            if (l) {
              l(ne);
            }
          });
        }
      } else {
        console.info(local.getResults());
      }
      // map.addOverlay(new BMap.Marker(pp)); //添加标注
    }
    var local = new BMap.LocalSearch(map, { // 智能搜索
      onSearchComplete : myFun
    });
    local.search(myValue);
  };
  autoComplete = new BMap.Autocomplete( // 建立一个自动完成的对象
  {
    "input" : inputId,
    "location" : map,
    "onSearchComplete": function(r) {
      // autoComplete.show();
      $("#tangram-suggestion--TANGRAM__m-main").css({"display":"solid","z-index":"2147483647"});
    },
  });

  autoComplete.addEventListener("onhighlight", function(e) { // 鼠标放在下拉列表上的事件
  /*
   * var str = ""; var _value = e.fromitem.value; var value = ""; if
   * (e.fromitem.index > -1) { value = _value.province + _value.city +
   * _value.district + _value.street + _value.business; } str = "FromItem<br />index = " +
   * e.fromitem.index + "<br />value = " + value;
   * 
   * value = ""; if (e.toitem.index > -1) { _value = e.toitem.value; value =
   * _value.province + _value.city + _value.district + _value.street +
   * _value.business; } str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " +
   * value; G("searchResultPanel").innerHTML = str;
   */

  });

  // var myValue;
  autoComplete.addEventListener("onconfirm", function(e) { // 鼠标点击下拉列表后的事件
    var _value = e.item.value;
    var myValue = _value.province + _value.city + _value.district + _value.street
        + _value.business;
    /*
     * G("searchResultPanel").innerHTML = "onconfirm<br />index = " +
     * e.item.index + "<br />myValue = " + myValue;
     */
    setPlace(myValue);
  });

}

// 智能搜索控件
var SmartQueryControl = function(opts) {
  // 默认停靠位置和偏移量
  this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
  this.defaultOffset = new BMap.Size(20, 20);
  if (opts && opts.anchor) {
    this.defaultAnchor = opts.anchor;
  }
  if (opts && opts.offset) {
    this.defaultOffset = opts.offset;
  }
}


function getCoordType() {
  return "baidu";
}

function clearOverlays(map) {
  if (map) {
    map.clearOverlays();
  }
}
function showInfoWin(marker) {
  var opts = {
    width : 250, // 信息窗口宽度
    height : 0, // 信息窗口高度
  };
  var sContent = buildInfoContent(marker);
//  if (infoWindow == null) {
    infoWindow = new BMap.InfoWindow(sContent, opts); // 创建信息窗口对象
    marker.openInfoWindow(infoWindow);
//  } else {
//    infoWindow.setContent(sContent);
//    marker.openInfoWindow(infoWindow);
//  }

    openInfoWinMarker = marker;
}

function showCustomInfoWin(marker,map) {
	var sContent = buildInfoContent(marker);
	if (infoWindow == null) {
	  infoWindow = new CXInfoWindow(marker.getPosition().lat, marker.getPosition().lng, sContent); // 创建信息窗口对象
	  map.addOverlay(infoWindow);
	} 
	infoWindow.setData(marker.getPosition().lat, marker.getPosition().lng, sContent);
	infoWindow.show();
}

function setOverLaysVisible(map, overlays) {
  var arr = [];
  $.each(overlays, function(i, o) {
    if (o['getPosition']) {
      arr.push(o.getPosition());
    } else if (o['getPath']) {
      $.each(o.getPath(), function(j, p) {
        arr.push(p);
      });
    }
  });
  map.setViewport(arr);
}

function setCenterByPoi(map, poi) {
  if (poi['getPosition']) {
    map.panTo(poi.getPosition());
  } else if (poi['getPath']) {
    map.panTo(poi.getPath()[0]);
  } else if(poi['lat'] && poi['lng']){
    map.panTo(poi);
  }
}

function setZoom(map, zoom) {
  map.setZoom(zoom);
}

function zoomIn(map) {
  map.zoomIn();
}

function zoomOut(map) {
  map.zoomOut();
}


//=================marker ==========================
function deleteMarker(map, marker) {
  if (marker && marker['bizLabel']) {
    map.removeOverlay(marker['bizLabel']);
  }
  if (marker && marker['bizRange']) {
    map.removeOverlay(marker['bizRange']);
  }
  if (marker) {
  	map.removeOverlay(marker);
  }
}
function addMarker(map, marker) {
  map.addOverlay(marker);
  if (marker['bizRange']) {
    map.addOverlay(marker.bizRange);
  }
}

function setMarkerEditable(overlay, editable) {
//  if (editable) {
//    overlay.enableDragging();
//  } else {
//    overlay.disableDragging();
//  }
}
function createPoint(lat, lng) {
  return new BMap.Point(lng, lat);
}

function setPointVisible(map, lat, lng) {
  var p = createPoint(lat,lng);
  if (!map.getBounds().containsPoint(p)) {
    map.panTo(p); 
  }
}

function isPointVisible(map, lat, lng) {
  return map.getBounds().containsPoint(createPoint(lat, lng));
}

//添加标注到地图
function createMarker(lat, lng, icon, label, markerClickProc, rangeOpts) {
var point = new BMap.Point(lng, lat);
var marker = new BMap.Marker(point, {
 icon : new BMap.Icon(icon, new BMap.Size(32, 32))
});
if (label != null && label != "") {
  var labelObj = new BMap.Label(label, {
   offset : new BMap.Size(20, 0)
  });
  marker.setLabel(labelObj);
  marker['bizLabel'] = labelObj;
}
if (typeof rangeOpts != 'undefined') {
 var circle = new BMap.Circle(point,rangeOpts.radius,{
   strokeColor:rangeOpts.strokeColor, 
   strokeWeight:rangeOpts.thickness, 
   strokeOpacity:rangeOpts.strokeOpacity, 
   fillColor:rangeOpts.fillColor, 
   fillOpacity:rangeOpts.fillOpacity}); //创建圆
 marker['bizRange'] = circle;
}
marker.addEventListener("infowindowclose", function(event) {
 openInfoWinMarker = null;
});

// 响应地图标注点击事件
if (markerClickProc) {
  marker.addEventListener("click", function(event) {
  	markerClickProc(event.target, event.target.getMap());
  });
}
return marker;
}

function updateMarker(marker, lat, lng, icon, label, rangeOpts) {
  var point = new BMap.Point(lng, lat);
  marker.setPosition(point);
  marker.setIcon(new BMap.Icon(icon, new BMap.Size(32, 32)));
  if (label != null && marker.getLabel() != null) {
    marker.getLabel().setContent(label);
  }
  if (marker['bizRange']) {
    marker.bizRange.setCenter(point);
    if (typeof rangeOpts != 'undefined') {
      var c = marker['bizRange'];
      c.setRadius(rangeOpts.radius);
      c.setStrokeColor(rangeOpts.strokeColor);
      c.setStrokeWeight(rangeOpts.thickness);
      c.setStrokeOpacity(rangeOpts.strokeOpacity);
      c.setFillColor(rangeOpts.fillColor);
      c.setFillOpacity(rangeOpts.fillOpacity);
    }
  }
}

function updateLabel(map, overlay, label) {
  if (overlay['bizLabel']) {
    if (label) {
      overlay['bizLabel'].setContent(label);
    } else {
      if (overlay['setLabel']) {
        overlay.setLabel(null);
      } else {
        map.removeOverlay(overlay['bizLabel']);
        overlay['bizLabel'] = null;
      }
    }
  }
}

function updateMarkerIcon(marker, icon) {
marker.setIcon(new BMap.Icon(icon, new BMap.Size(32, 32)));
}

function moveRange(map, marker) {
  if (marker.bizRange) {
    marker.bizRange.setCenter(marker.getPosition());
    map.addOverlay(marker.bizRange);
  }
}
//========================line ================================
function deleteLine(map, line) {
  if (line && line['bizLabel']) {
    map.removeOverlay(line['bizLabel']);
  }
  if (line) {
  	map.removeOverlay(line);
  }
}

function setLineEditable(overlay, editable) {
  if (editable) {
    overlay.enableEditing();
  } else {
    overlay.disableEditing();
  }
}
function addLine(map, line, changeView) {
  map.addOverlay(line);
  if (line['bizLabel']) {
    map.addOverlay(line['bizLabel']);
  }
  if (typeof changeView == 'undefined' || changeView) {
    map.setViewport(line.getPath());
  }
}

function createLine(latlngs, label, color, thickness, opacity) {
  var polyline = new BMap.Polyline(createPathFromStr(latlngs), {
    strokeColor : color,
    strokeWeight : thickness,
    strokeOpacity : (opacity ? opacity : 0.5)
  });

  if (label != null && label != "") {
    var labelObj = new BMap.Label(label, {
      position : polyline.getPath()[0],
      offset : new BMap.Size(-10, -10)
    });
    polyline['bizLabel'] = labelObj;
  }
  return polyline;
}

function updateLine(polyline, latlngs, label, color, thickness, opacity) {
  polyline.setPath(createPathFromStr(latlngs));
  polyline.setStrokeColor(color);
  polyline.setStrokeWeight(thickness);
  polyline.setStrokeOpacity(opacity);
  if (polyline.bizLabel) {
    polyline.bizLabel.setContent(label);
    polyline.bizLabel.setPosition(polyline.getPath()[0]);

  }
}
//========================area======================================
function deleteArea(map, area) {
  if (area && area['bizLabel']) {
    map.removeOverlay(area['bizLabel']);
  }
  if (area) {
  	map.removeOverlay(area);
  }
}
function addArea(map, area, changeView) {
  map.addOverlay(area);
  if (area['bizLabel']) {
    map.addOverlay(area['bizLabel']);
  }
  if (typeof changeView == 'undefined' || changeView) {
    map.setViewport(area.getPath());
  }
}
function setAreaEditable(overlay, editable) {
  if (editable) {
    overlay.enableEditing();
  } else {
    overlay.disableEditing();
  }
}

function createArea(latlngs, label, color, thickness, opacity, fillColor,
    fillOpacity) {
  var area = new BMap.Polygon(createPathFromStr(latlngs), {
    strokeColor : color,
    strokeWeight : 2,
    strokeOpacity : (opacity ? opacity : 0.5),
    fillColor : fillColor,
    fillOpacity : (fillOpacity ? fillOpacity : 0.5)
  });

  if (label != null && label != "") {
    var labelObj = new BMap.Label(label, {
      position : area.getPath()[0],
      offset : new BMap.Size(-10, -10)
    });
    area['bizLabel'] = labelObj;
  }
  return area;
}

function updateArea(polygon, latlngs, label, color, thickness, opacity,
    fillColor, fillOpacity) {
  polygon.setPath(createPathFromStr(latlngs));
  polygon.setStrokeColor(color);
  polygon.setStrokeWeight(thickness);
  polygon.setStrokeOpacity(opacity);
  polygon.setFillColor(fillColor);
  polygon.setFillOpacity(fillOpacity);
  if (polygon.bizLabel) {
    polygon.bizLabel.setContent(label);
    polygon.bizLabel.setPosition(polygon.getPath()[0]);

  }
}
//=======================================================================
function showCloseHandler(overlay, label, handler) {
  if (overlay.bizLabel) {
    if (overlay.getPath) {
      var newLabel = label + handler;
      console.info(newLabel);
      overlay.bizLabel.setContent(newLabel);
    } else {
      if (label != "") {
        overlay.bizLabel.setContent(label);
      }
    }
  }
}

function createPathFromStr(latlngs) {
  var points = [];
  if (latlngs) {
    var farr = latlngs.split(';');
    for (var i = 0; i < farr.length; ++i) {
      var sarr = farr[i].split(',');
      if (sarr.length > 1) {
        points.push(new BMap.Point(sarr[1], sarr[0]));
      }
    }
    return points;
  }
}

function adaptePointStr(str) {
  var points = str.split(';');
  var newStr = "";
  var pa = null;
  $.each(points, function(i, p) {
    pa = p.split(',');
    if (newStr != "") {
      newStr = newStr + ";";
    }
    newStr = newStr + pa[1] +"," + pa[0];
  });
  return newStr;
}

function createStrFromPath(arr) {
  str ="";
  if (arr) {
    $.each(arr, function(i, p) {
      if (str != "") {
        str = str +";";
      }
      str = str + p.lat+","+p.lng;
    });
  }
  return str;
}

function createPointArrayFromOverlay(overlay) {
  var pointArr = [];
  if (overlay.getPath) {
    var pathArr = overlay.getPath();
    for (var i = 0; i < pathArr.length; ++i) {
      pointArr.push([ pathArr[i].lat, pathArr[i].lng ]);
    }
  } else {
    var p = overlay.getPosition();
    pointArr.push([ p.lat, p.lng ]);
  }
  return pointArr;
}


var drawingManager = null;

function stopDrawing(map) {
  if (drawingManager) {
    drawingManager.close();
    drawingManager = null;
  }
}

function startDrawing(map, overlayType, handler, id, label, lcolor, lthickness,
    lopacity, fcolor, fopacity) {
  // view.inEditingBizData['MARKER_TYPE'], view.drawingFinishHandler
  var drawComplete = function(e) {
    var labelObj = null;
    if (overlayType == "0") {
      labelObj = new BMap.Label(label, {
        offset : new BMap.Size(20, 0)
      });
      e.overlay.setLabel(labelObj);
      map.setZoom(18);
      setCenterByPoi(map, e.overlay);
    } else {
      labelObj = new BMap.Label(label, {
        position : e.overlay.getPath()[0],
        offset : new BMap.Size(20, 0)
      });
      map.addOverlay(labelObj);
    }
    e.overlay['bizLabel'] = labelObj;
    if (handler) {
      handler(e, overlayType, id);
    }
  };

  stopDrawing(map);
  var styleOptions = {
    strokeColor : lcolor, // 边线颜色。
    fillColor : fcolor, // 填充颜色。当参数为空时，圆形将没有填充效果。
    strokeWeight : lthickness, // 边线的宽度，以像素为单位。
    strokeOpacity : lopacity, // 边线透明度，取值范围0 - 1。
    fillOpacity : fopacity, // 填充的透明度，取值范围0 - 1。
    strokeStyle : 'solid' // 边线的样式，solid或dashed。
  }
  // 实例化鼠标绘制工具
  var dt = -99;
  switch (parseInt(overlayType)) {
  case 0:
    dt = BMAP_DRAWING_MARKER;
    map.setZoom(18);
    break;
  case 1:
    dt = BMAP_DRAWING_POLYLINE;
    break;
  case 2:
    dt = BMAP_DRAWING_POLYGON;
    break;
  default:
    
    break;
  }
  if (dt != -99) {
    drawingManager = new BMapLib.DrawingManager(map, {
      enableDrawingTool : false, // 是否显示工具栏
      drawingToolOptions : {
        anchor : BMAP_ANCHOR_TOP_RIGHT, // 位置
        offset : new BMap.Size(5, 5), // 偏离值
      },
      circleOptions : styleOptions, // 圆的样式
      polylineOptions : styleOptions, // 线的样式
      polygonOptions : styleOptions, // 多边形的样式
      rectangleOptions : styleOptions
    // 矩形的样式
    });
    // 添加鼠标绘制工具监听事件，用于获取绘制结果
    drawingManager.addEventListener('overlaycomplete', drawComplete);
    drawingManager.setDrawingMode(dt);
    drawingManager.open();
  }

}

function getAddressByPoint(point, callback) {
  var geoc = new BMap.Geocoder();
  geoc.getLocation(point , function(rs){
    var addComp = rs.addressComponents;
    var splitAddr = addComp.province + "、" + (addComp.province==addComp.city?'':addComp.city) + "、" + addComp.district + "、" + addComp.street + "、" + addComp.streetNumber;
    addComp['onlineStr'] = splitAddr;
    callback(splitAddr.split('、').join(''), addComp);
  });        
}

function getAddressByOverlay(overlay, callback) {
  var point = getOverlayPoint(overlay);
  if (point != null) {
    getAddressByPoint(point, callback);
  }
}

function getOverlayPoint(overlay) {
  if (overlay != null) {
    if (overlay['getPosition']) {
      return overlay.getPosition();
    } else if (overlay['getPath']) {
      return overlay.getPath()[0];
    }
  }
  return null;
}

function getMapCenter(map) {
  return map.getCenter();
}

var lastDriving = null;

function driveRoute(fromLat, fromLng, toLat, toLng, map) {
	if (lastDriving) {
		if (lastDriving.getResults() && lastDriving.getResults().getPlan(0) && lastDriving.getResults().getPlan(0).getRoute(0)) {
			deleteLine(map, lastDriving.getResults().getPlan(0).getRoute(0).getPolyline());
		}
	}
	var p1 = new BMap.Point(fromLng,fromLat);
	var p2 = new BMap.Point(toLng,toLat);

	var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: lastDriving == null}});
	driving.search(p1, p2);
	lastDriving = driving;
}

function translateRawPointToMapPoint(lat, lng, callback) {
	var ggPoint = new BMap.Point(lng,lat);
  var convertor = new BMap.Convertor();
  var pointArr = [];
  pointArr.push(ggPoint);
  convertor.translate(pointArr, 1, 5, function (data){
    if(data.status === 0) {
      // var marker = new BMap.Marker(data.points[0]);
    	callback(data.points[0].lat, data.points[0].lng);
    }
  });
}

var map_lcListeners = null;
//=====================================================
function initMap(canvas, currentCity, loacationChangeListeners, loadedHandler) {

//通过JavaScript的prototype属性继承于BMap.Control
SmartQueryControl.prototype = new BMap.Control();

//自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
//在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
SmartQueryControl.prototype.initialize = function(map) {
 // 创建一个DOM元素
 var div = document.createElement("div");
 div.innerHTML = '<div id="r-result"><input type="text" id="suggestId" size="20" placeholder="输入关键字搜索" autocomplete="off" /></div><div id="searchResultPanel" style="display:none; z-index:10000"></div>';

 // 添加DOM元素到地图中
 map.getContainer().appendChild(div);
 initLocationQueryControl('suggestId', map);
 // 将DOM元素返回
 return div;
}

//============= 自定义InfoWindow开始 ===================

CXInfoWindow = function(_lat, _lng, _infoContext) {
this.lat_ = _lat;
this.lng_ = _lng;
this.infoContext_ = _infoContext;

this.div_ = null;
this.isShow = true;
};

CXInfoWindow.prototype = new BMap.Overlay();

CXInfoWindow.prototype.initialize = function(map) {
this.map_ = map;

var html = '<div id="cartip" class="tips2" style="margin:-170px 0px 0px 30px;">';
html += '<div class="tip_top">'+''+'<span id="tipclose"></span></div>';
html += '<div class="tip_mid">' + this.infoContext_;
html += '<p></p></div>';
html += '<div class="tip_btm"></div></div>';


if(this.div_ == null) {
	this.div_ = document.createElement('div');
	this.div_.id = "infoWindowDiv";
}
this.div_.innerHTML = html;

this.map_.getPanes().markerPane.appendChild(this.div_);
if ($("#cartip").height() > 0) {
  this.pheight = $("#cartip").height();
} else {
  console.info("to zero1");
}
this.bindEvent();
return this.div_;
};

CXInfoWindow.prototype.draw = function() {
var lnglat = new BMap.Point(this.lng_, this.lat_);
var sw = this.map_.pointToOverlayPixel(lnglat);
var div = this.div_;
if(this.div_.offsetHeight > 0) {
	this.offset_ = this.div_.offsetHeight;
} else {
	this.offset_ = 0;
}
div.style.position = "absolute";
div.style.left = sw.x - 32 + 'px';

div.style.top = sw.y /*- this.pheight*/ - 160 + 'px';
// console.info(div.style.top+"," + this.pheight +"," + this.offset_);
};

CXInfoWindow.prototype.show = function() {
if (this.div_) {
	this.div_.style.visibility = "visible";
}
this.isShow = true;
};

CXInfoWindow.prototype.hide = function() {
if (this.div_) {
	this.div_.style.visibility = "hidden";
}
this.isShow = false;
};

CXInfoWindow.prototype.toggle = function() {
if (this.div_) {
	if(this.div_.style.visibility == "hidden") {
		this.show();
	} else {
		this.hide();
	}
}
};

CXInfoWindow.prototype.bindEvent = function() {
$("#tipclose").click(function() {
	if (infoWindow) {
		infoWindow.hide();
	}
//	if($.isFunction(window._cxInfoWindowHide)) {
//		_cxInfoWindowHide(); // CXInfoWindow接口方法：关闭
//	}
});
};

CXInfoWindow.prototype.setData = function(_lat, _lng, _infoContext) {
this.lat_ = _lat;
this.lng_ = _lng;
this.infoContext_ = _infoContext;

this.refresh();
};

CXInfoWindow.prototype.refresh = function() {

var html = '<div class="tip_top">'+''+'<span id="tipclose"></span></div>';

html += '<div class="tip_mid">' + this.infoContext_;

html += '</p></div><div class="tip_btm"></div>';


$("#cartip").html(html);
if ($("#cartip").height()>0) {
  pheight = $("#cartip").height();
} else {
  console.info("to zero2");
}
this.draw();
this.bindEvent();
};

//============= 自定义InfoWindow结束 ===================
  map_lcListeners = loacationChangeListeners;
  var map = new BMap.Map(canvas); // 创建Map实例

  if (loadedHandler) {
    map.addEventListener("tilesloaded",loadedHandler);
  }
  // 创建地址解析器实例
  var myGeo = new BMap.Geocoder();
  // 将地址解析结果显示在地图上,并调整地图视野
  myGeo.getPoint(currentCity, function(point) {
    if (!point) {
      point = new BMap.Point(120, 36);
    }
    // 百度地图API功能
    map.centerAndZoom(point, 11);
    // map.centerAndZoom(new BMap.Point(116.404, 39.915), 11); // 初始化地图,设置中心点坐标和地图级别
    map.addControl(new BMap.MapTypeControl()); // 添加地图类型控件
    map.setCurrentCity(currentCity); // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
    // \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/

    // 创建控件
    var queryCtrl = new SmartQueryControl({
      anchor : BMAP_ANCHOR_TOP_LEFT,
      offset : new BMap.Size(20, 20),
    });
    // 添加到地图当中
    map.addControl(queryCtrl);

    // /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\

    map.enableContinuousZoom();

    var cityCtrl = new BMap.CityListControl({
      anchor : BMAP_ANCHOR_TOP_LEFT,
      offset : new BMap.Size(180, 18),
      // 切换城市之间事件
      onChangeBefore : function(e) {
      },
      // 切换城市之后事件
      onChangeAfter : function(e) {
        var p = map.getCenter();
        var ne = {point:p, lat:p.lat,lng:p.lng};
        if (map_lcListeners) {
          $.each(map_lcListeners, function(i, l) {
            if (l) {
              l(ne);
            }
          });
        }
      }
    });
    map.addControl(cityCtrl);
  }, currentCity);

  return map;
}

function initPanorama(map, canvas, lat, lng) {
  
  var stCtrl = new BMap.PanoramaControl(); //构造全景控件
  stCtrl.setOffset(new BMap.Size(20, 20));
  map.addControl(stCtrl);//添加全景控件
  
  map.centerAndZoom(new BMap.Point(lng,lat), 18);
  map.addTileLayer(new BMap.PanoramaCoverageLayer());
  var panorama = new BMap.Panorama(canvas); 
  panorama.setPov({heading: -40, pitch: 6});
  panorama.setPosition(new BMap.Point(lng, lat));
}
// ==========baidu map relative end=====================
//============= 自定义InfoWindow开始 ===================

CXInfoWindow = function(_lat, _lng, _infoContext) {
	this.lat_ = _lat;
	this.lng_ = _lng;
	this.infoContext_ = _infoContext;
	
	this.div_ = null;
	this.isShow = true;
};

// ============= 自定义InfoWindow结束 ===================