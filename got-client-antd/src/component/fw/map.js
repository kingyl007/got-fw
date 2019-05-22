import { Select, Spin, Input, Popconfirm, Button, message } from 'antd';
import * as MapApi from '../../util/map/baidu_map_api';
import * as got from '../../logic/got';
import copy from 'copy-to-clipboard';

const MAP_CALLBACK = {ok:1};
export class Map extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      map:null,
      mapIconPath : "../ui/loanriskcontrol/icons/tag/",
      markerOnMap : {},
      inEditing : false,
      inEditingBizData : null,
      mapCenterChangeListeners:[],
      mapId:'baidumap_canvas_' + String(Math.random()).substring(2),
    }
  }
  
  componentDidMount() {
    if (this.props.onRef) {
        this.props.onRef(this);
    }
    const { BMap, BMAP_STATUS_SUCCESS } = window
    window.message = message;
    window.copy = copy;
    const {currentCity, showQueryControl, showCityListControl, showNavigationControl, showGeolocationControl,showMapTypeControl, onSelectCenter, zoomLevel} = this.state;
    let loaded = false;
    console.info('mapid', this.state.mapId);
    let localShowGeolocationControl = null;
    if (showGeolocationControl) {
      localShowGeolocationControl = {...showGeolocationControl};
      if (localShowGeolocationControl.callback) {
        localShowGeolocationControl.callback = (lat,lng, address)=> {
          MapApi.translateMapPointToGcPoint(lat, lng, (lat, lng)=> {
            showGeolocationControl.callback(lat, lng, address);
          })
        }
      }
    }
    const map = MapApi.initMap(
      this.state.mapId, 
      {currentCity:currentCity?currentCity:'青岛', 
        showQueryControl, 
        showCityListControl,
        showNavigationControl,
        showGeolocationControl:localShowGeolocationControl,
        showMapTypeControl,
        zoomLevel,
      }, 
      onSelectCenter?onSelectCenter:[(obj)=>console.info('map init ok', obj)],
      ()=> {
        if (!loaded) {
          if (this.props.onRef) {
              this.props.onRef(this);
          }
          console.info('loaded')
          if (this.props.loadedCallback) {
            this.props.loadedCallback();
          }
          if (this.props.points) {
            this.props.points.map((point,index)=> {
              this.showPoint({...point, centerToOverlay:index==0?true:false});
            })
          }
          loaded = true;
        }
      }
    );
    
    map.addEventListener("touchmove", (e) => {
      this.state.touchMoved = true;
    });
    map.addEventListener("touchend", (e) => {
      if (!this.state.touchMoved) {
        console.info('touchend', e);
        if (this.state.inEditing && this.state.inEditingBizData) {
          this.state.inEditingBizData['P_LAT'] = e.point.lat;
          this.state.inEditingBizData['P_LNG'] = e.point.lng;
          const overlay = this.showOverlayOnMap(this.state.inEditingBizData);
          MapApi.getAddressByOverlay(overlay, (address, addComp)=> {
            console.info(addComp);
            overlay.bizObj.address = address;
            if (overlay.bizObj.clickFun) {
              overlay.bizObj.clickFun(overlay.bizObj.id);
            }
            
          })
        }
      }
      this.state.touchMoved = false;
    });
    this.setState({map});
    window.reactRef = this;
  }
  
  fillPointsToBizData  =  (bizData) => {
    var overlay = this.state.markerOnMap[bizData['MARKER_ID']];
    if (overlay) {
      var arr = MapApi.createPointArrayFromOverlay(overlay);
      if (bizData['MARKER_TYPE'] == 0 && arr.length > 0) {
        bizData['P_LAT'] = arr[0][0];
        bizData['P_LNG'] = arr[0][1];
      } else {
        var str = "";
        for (var i = 0; i < arr.length; ++i) {
          if (i > 0) {
            str = str +";";
          }
          str = str + arr[i][0]+"," + arr[i][1];
        }
        bizData['MARKER_POINTS'] = str;
      }
        bizData['COORD_TYPE'] = getCoordType();
    }
    
  }
  
  closeOverlay = (id) => {
    const {markerOnMap, map, inEditing, inEditingBizData} = this.state;
    if (markerOnMap[id]) {
      this.removeOverlayFromMap(markerOnMap[id]['bizObj']);
    } else {
      console.info(id);
    }
    if (inEditing && inEditingBizData) {
        var bizData = inEditingBizData;
      MapApi.startDrawing(map, bizData['MARKER_TYPE'], drawingFinishHandler,bizData['MARKER_ID'], bizData['MARKER_NAME'],got.intToColorStr(bizData['L_COLOR']),bizData['L_THICKNESS'],0.5, got.intToColorStr(bizData['A_COLOR']),0.5);
    }
  }
  
  drawingFinishHandler = (e,overlayType,id)=> {
    const {markerOnMap, map, inEditing, inEditingBizData} = this.state;
    if (overlayType == '0' && markerOnMap[id]) {
      var range = markerOnMap[id].bizRange;
      MapApi.deleteMarker(map, markerOnMap[id]);
      MapApi.updateMarkerIcon(e.overlay, this.getMarkerIcon(inEditingBizData));
      if (range != null) {
        e.overlay['bizRange'] = range;
        MapApi.moveRange(map, e.overlay);
      }
      e.overlay['bizObj'] = inEditingBizData;
      markerOnMap[inEditingBizData['MARKER_ID']] = e.overlay;
      this.setOverlayEditable(inEditingBizData, inEditing);

      if (e.overlay.bizObj.infoTemplate) {
        MapApi.getAddressByOverlay(e.overlay, (address, addComp)=> {
          console.info('drawingFinishHandler', addComp);
          e.overlay.bizObj.address = address;
          e.overlay.bizObj.addComp = addComp;
          var sContent = e.overlay.bizObj.infoTemplate.replace('{address}', address);
          MapApi.showInfoWin(e.overlay, sContent, {id:e.overlay.bizObj.id, infoId:e.overlay.bizObj.infoId, clickFun:e.overlay.bizObj.clickFun});
        })
      } else {
        // if (e.overlay.bizObj.clickFun) {
        //   e.overlay.bizObj.clickFun(id);
        // }
      }
    }
  }

	stopOverlayEdit = () => {
	  // 停止绘制
	  MapApi.stopDrawing(map);
	  // 停止编辑
    const {markerOnMap, map, inEditing, inEditingBizData} = this.state;
	  if (inEditingBizData) {
	    if (markerOnMap[inEditingBizData['MARKER_ID']]) {
	      this.showOverlayOnMap(inEditingBizData);
	    }
	    this.setOverlayEditable(inEditingBizData, false);
    }
    this.setState({inEditingBizData:null, inEditing:false});
	};
	
	stopOverlayCreate = () => {
	  // 停止绘制
	  MapApi.stopDrawing(map);
	  // 停止编辑
    const {markerOnMap, map, inEditing, inEditingBizData} = this.state;
	  if (inEditingBizData) {
	    if (markerOnMap[inEditingBizData['MARKER_ID']]) {
	      this.removeOverlayFromMap(inEditingBizData);
	    }
	  }
    this.setState({inEditingBizData:null, inEditing:false});
	}
	
	startOverlayEdit = (bizData) => {
    const {markerOnMap, map, inEditing, inEditingBizData} = this.state;
	  this.stopOverlayEdit();
	  var overlay = this.showOverlayOnMap(bizData);
	  this.setOverlayEditable(bizData, true);
	  if (bizData['MARKER_TYPE'] == 0 || overlay == null) {
	  	MapApi.startDrawing(map, bizData['MARKER_TYPE'], this.drawingFinishHandler,bizData['MARKER_ID'], bizData['MARKER_NAME'],got.intToColorStr(bizData['L_COLOR']),bizData['L_THICKNESS'],0.5, got.intToColorStr(bizData['A_COLOR']),0.5);
    }
    
    this.setState({inEditingBizData:bizData, inEditing:true});
    return overlay;
	}
	
	setOverlayEditable = (bizData, editable) => {
    
    const {markerOnMap, map, inEditing, inEditingBizData} = this.state;
	  var markerId = bizData['MARKER_ID'];
      var overlay = markerOnMap[markerId];
      if (overlay) {
	      if (bizData['MARKER_TYPE'] == 0) {
	        MapApi.setMarkerEditable(overlay, editable);
	      } else if (bizData['MARKER_TYPE'] == 1) {
	        MapApi.setLineEditable(overlay, editable);
	      } else if (bizData['MARKER_TYPE'] == 2) {
			    MapApi.setAreaEditable(overlay, editable);
	      }
	      var handler = "";
	      if (editable) {
	        handler = '<a title="清除" onclick="'+'${pageId}.closeOverlay(\''+ markerId+'\')'+'" style="cursor:pointer">  <i class="fa fa-times" />  </a>'; 
	      }
	      MapApi.showCloseHandler(overlay, bizData['MARKER_NAME'], handler);
      }
	}
	
	showOverlayOnMap = (bizData, centerToOverlay) => {
    const {markerOnMap, map, inEditing, inEditingBizData} = this.state;
	  var obj = markerOnMap[bizData['MARKER_ID']];
	  var overlayLabelStr = bizData['MARKER_NAME'];
	  if (obj) {
	    // update
	      if (bizData['MARKER_TYPE'] == 0) {
	      	MapApi.updateMarker(obj, bizData['P_LAT'], bizData['P_LNG'], this.getMarkerIcon(bizData), overlayLabelStr, 
	      	    {radius:bizData['P_RADIUS'], 
    	  		strokeColor:got.intToColorStr(bizData['L_COLOR']),
    	  		thickness:bizData['L_THICKNESS'],
    	  		strokeOpacity:0.1, 
    	  		fillColor:got.intToColorStr(bizData['A_COLOR']), 
    	  		fillOpacity: 0.2});
	      } else if (bizData['MARKER_TYPE'] == 1) {
	        MapApi.updateLine(obj, bizData['MARKER_POINTS'], overlayLabelStr, got.intToColorStr(bizData['L_COLOR']),bizData['L_THICKNESS'],0.5);
	      } else if (bizData['MARKER_TYPE'] == 2 || bizData['MARKER_TYPE'] == 4) {
	        MapApi.updateArea(obj, bizData['MARKER_POINTS'], overlayLabelStr, got.intToColorStr(bizData['L_COLOR']),bizData['L_THICKNESS'],0.5, got.intToColorStr(bizData['A_COLOR']), 0.5);
	      }
	      obj['bizObj'] = bizData;
	  } else {
      // add overlay info
      if (bizData['MARKER_TYPE'] == 0) {
      	obj = MapApi.createMarker(bizData['P_LAT'], bizData['P_LNG'], this.getMarkerIcon(bizData), overlayLabelStr, null, 
      	    {radius:bizData['P_RADIUS'], 
      	  		strokeColor:got.intToColorStr(bizData['L_COLOR']),
      	  		thickness:bizData['L_THICKNESS'],
      	  		strokeOpacity:0.1, 
      	  		fillColor:got.intToColorStr(bizData['A_COLOR']), 
      	  		fillOpacity: 0.2} );
        MapApi.addMarker(map,obj);
      } else if (bizData['MARKER_TYPE'] == 1) {
        if (bizData['MARKER_POINTS']) {
	        obj = MapApi.createLine(bizData['MARKER_POINTS'], overlayLabelStr, got.intToColorStr(bizData['L_COLOR']),bizData['L_THICKNESS'],0.5);
	        MapApi.addLine(map, obj);
        } else {
          return null;
        }
      } else if (bizData['MARKER_TYPE'] == 2 || bizData['MARKER_TYPE'] == 4) {
        if (bizData['MARKER_POINTS']) {
	        obj = MapApi.createArea(bizData['MARKER_POINTS'], overlayLabelStr, got.intToColorStr(bizData['L_COLOR']),bizData['L_THICKNESS'],0.5, got.intToColorStr(bizData['A_COLOR']), 0.5);
	        MapApi.addArea(map, obj);
        } else {
          return null;
        }
      }
	      if (obj) {
		      obj['bizObj'] = bizData;
		      markerOnMap[bizData['MARKER_ID']] = obj;
	      }
	  }
	  if (obj && (centerToOverlay === undefined || centerToOverlay === null || centerToOverlay === true)) {
	    MapApi.setCenterByPoi(map, obj);
	  }
	  return obj;
  }
  
  removeOverlay = (map, id)=> {
    var obj = this.state.markerOnMap[id];
	  if (obj) {
	    MapApi.deleteMarker(map, obj);
	  }
    delete this.state.markerOnMap[id];
  }
	
	removeOverlayFromMap = (bizData) => {
	  var obj = this.state.markerOnMap[bizData['MARKER_ID']];
	  if (obj) {
	    MapApi.deleteMarker(map, obj);
	    delete this.state.markerOnMap[bizData['MARKER_ID']];
	  }
	}
	
	clearAllOverlayFromMap = () => {
	  MapApi.clearOverlays(map);
	  this.state.markerOnMap = {};
  }
  
	mapIconPath = "../ui/loanriskcontrol/icons/tag/";
		
	
	getMarkerIcon = (obj) => {
		if (obj && obj['P_ICON']) {
		  return obj['P_ICON'];
		} else {
			return null;	  
		}
  }
  
  markerClicked = (e) => {
    console.info('ok', e);
  }

  render() {
    return (
      <div>
      <div id={this.state.mapId} style={{width: this.state.width?this.state.width:'100%', height: this.state.height?this.state.height:'99vh' }}>
        <Button>Test Button</Button>
      </div>
      <Popconfirm ref="dialog">

      </Popconfirm>
      </div>
    );
  }

  // ====== map connect operation

  clearClusters = () => {
    const {map} = this.state;
    MapApi.clearClusters(map);
  }
  clusterMarkers = (markers) => {
    const {map} = this.state;
    MapApi.clusterMarkers(map, markers);
  }
  addButton = ({lat, lng, label})=> {
  }

  setZoom = (level) => {
    const {map} = this.state;
    MapApi.setZoom(map, level);
  }

  centerAndZoom = (lat, lng, level) => {
    const {map} = this.state;
    MapApi.translateGcPointToMapPoint(lat, lng, (lat, lng)=> {
      MapApi.centerAndZoom(map, lat, lng, level);
    });
  }

  setPointsVisible = (ids)=> {
    const {map} = this.state;
    const overlays = ids.map(key=>this.state.markerOnMap[key]);
    MapApi.setOverLaysVisible(map, overlays);
  }

  /**
   * callback(distance:距离（米）, duration：用时（秒）)
   * 
   */
  driveRouteCallback = (fromLat, fromLng, toLat, toLng, callback) => {
    const {map} = this.state;
    MapApi.translateGcPointToMapPoint(fromLat, fromLng, (fromLat, fromLng)=> {
      MapApi.translateGcPointToMapPoint(toLat, toLng, (toLat, toLng)=> {
        MapApi.driveRouteCallback(fromLat, fromLng, toLat, toLng, map, callback);
      });
    });
  }

  deletePoint = (id) => {
    const {map} = this.state;
    this.removeOverlay(map, id);
  }

  showLine = ({id, points, lineColor, lineThickness}) => {
        const {map} = this.state;
        let latLngs = '';
        if (points) {
          points.map(p=> {latLngs = latLngs?latLngs+';':latLngs, latLngs += (p.lat+',' + p.lng)});
        }
    const bizData = {MARKER_ID:id, 
      MARKER_TYPE:1,
      L_COLOR:lineColor?lineColor:'#00ff00',
      L_THICKNESS:lineThickness?lineThickness:3,
      MARKER_POINTS: latLngs,
    };
    console.info('showLine', bizData);
    const overlay = this.showOverlayOnMap(bizData);
  }

  showPoint = ({id, name, lat, lng, icon, doneCallback, radius, lineColor, lineThickness, fillColor, infoContent, buttonOpts,centerToOverlay}) => {
    MapApi.translateGcPointToMapPoint(lat, lng, (lat, lng)=> {
      
    const {map} = this.state;
    const bizData = {MARKER_ID:id, 
      MARKER_NAME:name,
      MARKER_TYPE:0,
      P_LAT:lat, 
      P_LNG:lng, 
      P_ICON:icon, 
      P_RADIUS:radius, 
      L_COLOR:lineColor,
      L_THICKNESS:lineThickness, 
      A_COLOR:fillColor,
    };
    const overlay = this.showOverlayOnMap(bizData, centerToOverlay);
    if (infoContent) {
      MapApi.addMarkerClickListener(overlay, ()=> MapApi.showInfoWin(overlay, infoContent));
      if (centerToOverlay === undefined || centerToOverlay === null || centerToOverlay === true) {
        MapApi.showInfoWin(overlay, infoContent);
      }
    }
    // if (!buttonOpts) {
    //   buttonOpts = {name, lat, lng};
    // }
    if (buttonOpts) {
      buttonOpts.lat = lat;
      buttonOpts.lng = lng;
      if (!buttonOpts.name) {
        buttonOpts.name = name;
      }
      buttonOpts.click = ()=>{this.showOverlayOnMap(bizData); MapApi.showInfoWin(overlay, infoContent);};
      MapApi.addButton(map, buttonOpts );
    }
    if (doneCallback) {
      doneCallback(id, overlay);
    }
  });
  }

  selectPoint = ({id, name, lat, lng, callback, noInfo})=> {
    const {map} = this.state;
    const center = MapApi.getMapCenter(map);
    if (!lat) {
      lat = center.lat;
    }
    if (!lng) {
      lng = center.lng;
    }
    MapApi.translateGcPointToMapPoint(lat, lng, (lat, lng)=> {
    const bizData = {MARKER_ID:id, MARKER_NAME:name,MARKER_TYPE:0,P_LAT:lat, P_LNG:lng};
    const overlay = this.startOverlayEdit(bizData);
    const clickFun = (id)=>{
      const marker = this.state.markerOnMap[id];
      if (marker) {
        const point = MapApi.getOverlayPoint(marker);
        if (callback) {
          MapApi.translateMapPointToGcPoint(point.lat, point.lng, (lat, lng) => {
            callback(id, lat, lng, marker.bizObj.address, marker.bizObj.addComp);
          })
        } else {
          console.warn('please set callback(id, lat, lng, address, addComp) parameter for selectPoint({id, name, lat, lng, callback})');
        }
      }
    };
    const infoId = 'infobutton_' + id + String(Math.random()).substring(2);
    let infoContent = null;
    if (!noInfo) {
      infoContent = '{address}' + '<hr><button id="'+infoId+'" type="button" class="ant-btn ant-btn-primary"><span>设置为'+name+'</span></button>';
      bizData['infoTemplate'] = infoContent;
    }
    MapApi.getAddressByOverlay(overlay, (address, addComp)=> {
      overlay.bizObj.address = address;
      overlay.bizObj.addComp = addComp;
      
      console.info(overlay.bizObj.addComp);
      overlay.bizObj.id = id;
      overlay.bizObj.infoId = infoId;
      overlay.bizObj.clickFun = clickFun;
      if ( overlay.bizObj.infoTemplate) {
        var sContent = overlay.bizObj.infoTemplate.replace('{address}', address);
        MapApi.showInfoWin(overlay, sContent,{id, infoId, clickFun});
      }
    })
  });
  }

  setCenter = ({lat, lng})=> {
    const {map} = this.state;
    MapApi.translateGcPointToMapPoint(lat, lng, (lat, lng)=> {
    MapApi.setCenterByPoi(map, {lat, lng});
    });
  }

  getAddress = ({lat, lng, callback}) => {
    MapApi.getAddress(lat, lng, callback);
  }
}

export default() => {
  return <Map />
}