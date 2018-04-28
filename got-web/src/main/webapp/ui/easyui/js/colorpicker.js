//EasyUI Color Picker类（WEB颜色选择器）
var easyColorPicker = function(iw,iz,sicopath){
	var msie = /msie/i.test(navigator.appVersion.replace(/\s/g,''));
	iw = iw||250;
	this.width = iw;
	this.zindex = iz||10000;
	this.icopath = sicopath;
	this.psize = msie?(iw-44):(iw-34);
};
easyColorPicker.prototype = function(){
	var appendOnce = 0;//允许多实例，单都建立在同一个DOM节点上以节约资源
	return {
		hsb2rgb:function(h,s,b){//HSB转RGB
			var nH,nS,nV,nR,nG,nB,hi,f,p,q,t;
			nH = h/360,nS = s/100,nV = b/100;
			if(!s){
				nR = nV*255|0,nG = nV*255|0,nB = nV*255|0;
				nR = (nR<0)?0:nR,nG = (nG<0)?0:nG,nB = (nB<0)?0:nB;
				return [nR,nG,nB];
			}
			hi = nH*6;
			if(hi == 6){hi = 0;}
			f = hi|0,p = nV * (1 - nS),q = nV * (1 - nS * (hi - f)),t = nV * (1 - nS * (1 - (hi - f)));
			switch(f){
				case 0:nR = nV,nG = t,nB = p;break;
				case 1:nR = q,nG = nV,nB = p;break;
				case 2:nR = p,nG = nV,nB = t;break;
				case 3:nR = p,nG = q,nB = nV;break;
				case 4:nR = t,nG = p,nB = nV;break;
				default:nR = nV,nG = p,nB = q;break;
			}
			nR = nR*255|0,nG = nG*255|0,nB = nB*255|0;
			nR = (nR<0)?0:nR,nG = (nG<0)?0:nG,nB = (nB<0)?0:nB;
			return [nR,nG,nB];
		},
		rgb2hsb:function(r,g,b){//RGB转HSB
			var nH,nS,nV,nR,nG,nB,ndelR,ndelG,ndelB,nmax,nmin,ndelMax;
			nR = r/255,nG = g/255,nB = b/255;
			nmax = Math.max(Math.max(nR,nG),nB),nmin = Math.min(Math.min(nR,nG),nB),ndelMax = nmax-nmin,nV = nmax;
			if(!ndelMax){
				nH = 0,nS = 0,nV = nV*100|0;
				return [nH,nS,nV];
			}
			nS = ndelMax/nmax;
			ndelR = (((nmax - nR) / 6) + (ndelMax / 2)) / ndelMax;
			ndelG = (((nmax - nG) / 6) + (ndelMax / 2)) / ndelMax;
			ndelB = (((nmax - nB) / 6) + (ndelMax / 2)) / ndelMax;
			if(nR == nmax){
				nH = ndelB - ndelG;
			}else if(nG == nmax){
				nH = (1 / 3) + ndelR - ndelB;
			}else if(nB == nmax){
				nH = (2 / 3) + ndelG - ndelR;
			}
			if(nH < 0){nH = nH + 1;}
			if(nH > 1){nH = nH - 1;}
			nH = nH*360|0,nS = nS*100|0,nV = nV*100|0;
			return [nH,nS,nV];
		},
		rgb2hex:function(r,g,b){//RGB转HEX
			r = (r|0).toString(16),g = (g|0).toString(16),b = (b|0).toString(16);
			r = r.length<2?'0'+r:r.length>2?r.substr(0,2):r;
			g = g.length<2?'0'+g:g.length>2?g.substr(0,2):g;
			b = b.length<2?'0'+b:b.length>2?b.substr(0,2):b;
			return '#'+r+''+g+''+b;
		},
		hex2rgb:function(shex){//HEX转RGB
			shex = shex||'#FF0000';
			shex = shex.replace(/\#/g,'');
			var r,g,b,l = shex.length;
			if(l<6){
				r = shex.substr(0,1);
				r = parseInt((r+''+r),16);
				g = shex.substr(1,1);
				g = parseInt((g+''+g),16);
				b = shex.substr(2,1);
				b = parseInt((b+''+b),16);
			}else{
				r = parseInt(shex.substr(0,2),16);
				g = parseInt(shex.substr(2,2),16);
				b = parseInt(shex.substr(4,2),16);
			}
			return [r,g,b];
		},
		bind2:function(dTrigger,dValue,cb){//绑定到控件
			var ome = this;
			dTrigger.onclick = function(){
				var stype = dValue.getAttribute('colortype')||'hex',svalue = dValue.value;
				switch(stype){
					case 'hex':ome.setValue(stype,1,svalue);break;
					default:avalue = (stype+',1,'+svalue).split(',');ome.setValue.apply(ome,avalue);break;
				}
				var dpos = easyUI.getPosition(this);
				var ix = dpos.x,iy = dpos.y+this.offsetHeight+2;
				ome.open(ix,iy);
				var dok = ome.dStatus.getElementsByTagName('button')[1];
				dok.onclick = function(){
					var stype = dValue.getAttribute('colortype')||'hex',aret = ome.getValue();
					dValue.value = aret[stype];
					ome.close();
					if(cb&&cb.constructor==Function){cb(dTrigger,dValue,aret[stype]);}
				};
			};
		},
		open:function(x,y){//开启界面
			var iw = this.width,psize = this.psize;
			this.dLayer.style.width = iw+'px';
			this.dPanel.style.width = psize+'px';
			this.dMask.style.width = psize+'px';
			this.dMask.style.height = psize+'px';
			this.dAttas.style.height = psize+'px';
			this.dLayer.style.left = x+'px';
			this.dLayer.style.top = y+'px';
			this.dLayer.style.display = 'block';
			if(this.onopen&&this.onopen.constructor==Function){this.onopen(this);}
			var ome = this;
			this.dAttas.onclick = function(e){
				e = e||window.event;
				var dSelector = ome.dSelector,ist = Math.max(document.documentElement.scrollTop,document.body.scrollTop);
				var y = (e.offsetY)?e.offsetY:e.clientY+ist-easyUI.getPosition(this).y;
				var h = 360-(y/psize*360|0);
				var s = dSelector.getAttribute('s')||100;
				var b = dSelector.getAttribute('b')||100;
				ome.setSlider(h);
				ome.setValue('hsb',0,h,s,b);
			};
			this.dMask.onmousedown = function(e){
				e = e||window.event;
				var pos = easyUI.getPosition(this),isl = Math.max(document.documentElement.scrollLeft,document.body.scrollLeft),ist = Math.max(document.documentElement.scrollTop,document.body.scrollTop);
				var x = e.offsetX?e.offsetX:e.clientX+isl-pos.x,y = e.offsetY?e.offsetY:e.clientY+ist-pos.y;
				var h = this.getAttribute('hue')|0;
				var s = (x/psize*100)|0;
				var b = (100-y/psize*100)|0;
				ome.setValue('hsb',1,h,s,b);
			};
			var dAttas = this.dAttas,dMask = this.dMask,dSelector = this.dSelector,dSlider = this.dSlider,im = psize+5;
			this.dadd = new easyDragDrop(dSlider,dSlider,[-4,21,im,-1],0,'pointer');
			this.dadd.ondrag = function(ix,iy){
				iy+=4;
				var h = 360-(iy/psize*360|0);
				var s = dSelector.getAttribute('s')||100;
				var b = dSelector.getAttribute('b')||100;
				ome.setValue('hsb',0,h,s,b);
			};
			this.dmdd = new easyDragDrop(dSelector,dSelector,[-5,im,im,-5],0,'pointer');
			this.dmdd.ondrag = function(ix,iy){
				ix+=6,iy+=5;
				var h = dMask.getAttribute('hue')|0;
				var s = (ix/psize*100)|0;
				var b = (100-iy/psize*100)|0;
				ome.setValue('hsb',0,h,s,b);
				dSelector.setAttribute('s',s);
				dSelector.setAttribute('b',b);
			};
		},
		close:function(){//关闭界面
			this.dLayer.style.display = 'none';
			if(this.onclose&&this.onclose.constructor==Function){this.onclose(this);}
		},
		getValue:function(){//取值
			var shex = this.hexValue;
			var srgb = this.rgbValue;
			var shsb = this.hsbValue;
			return {'hex':shex,'rgb':srgb,'hsb':shsb};
		},
		setValue:function(stype,setpos){//设置颜色值
			if(!arguments.length){return;}
			var shex,srgb,shsb,args = Array.prototype.slice.call(arguments,2),l = args.length;
			switch(stype){
				case 'rgb':
					if(l!=3){alert('参数不足！需要指定三个0-255之间的RGB颜色值！');return;}
					srgb = args,shsb = this.rgb2hsb.apply(null,srgb),shex = this.rgb2hex.apply(null,srgb);
					break;
				case 'hsb':
					if(l!=3){alert('参数不足！需要指定三个HSB颜色值！');return;}
					shsb = args,srgb = this.hsb2rgb.apply(null,shsb),shex = this.rgb2hex.apply(null,srgb);
					break;
				default:
					if(!l){alert('参数不足！需要指定一个十六进制的颜色值！');return;}
					shex = args[0],srgb = this.hex2rgb(shex),shsb = this.rgb2hsb.apply(null,srgb);
					break;
			}
			shex = this.rgb2hex.apply(null,srgb);
			this.hexValue = shex;
			this.rgbValue = srgb;
			this.hsbValue = shsb;
			var dmask = this.dMask,dbox = this.dStatus.getElementsByTagName('input');
			var smc = (shsb[1]<100||shsb[2]<100)?this.rgb2hex.apply(null,this.hsb2rgb(shsb[0],100,100)):shex;
			dbox[0].style.backgroundColor = shex;
			dbox[1].value = shex;
			dbox[2].value = shsb;
			dbox[3].value = srgb;
			dmask.style.backgroundColor = smc;
			dmask.setAttribute('hue',shsb[0]);
			if(setpos){this.setSlider(shsb[0]);this.setSelectorPos(shsb[1],shsb[2]);}
		},
		setSelectorPos:function(s,b){//设置选择区域坐标
			var dSelector = this.dSelector,psize = this.psize
			dSelector.style.left = s/100*psize-5+'px';
			dSelector.style.top = (100-b)/100*psize-5+'px';
			dSelector.setAttribute('s',s);
			dSelector.setAttribute('b',b);
		},
		setSlider:function(h){//设置hue滑块坐标
			var dSlider = this.dSlider;
			dSlider.setAttribute('hue',h);
			dSlider.style.top = (360-h)/360*this.psize-4+'px';
		},
		init:function(){//初始化
			var msie = /msie/i.test(navigator.appVersion.replace(/\s/g,''));
			if(!appendOnce){
				var astr = [],w0 = this.width,w1 = this.psize,spath = this.icopath,iz = this.zindex;
				if(msie){
					astr.push('<div style="float:left;width:'+w1+'px;border:1px inset;position:relative;">');
					astr.push('<span style="display:block;font:0/0 Arial;cursor:crosshair;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='+spath+'bg_color_mask.png, sizingMethod=scale);width:'+w1+'px;height:'+w1+'px;"></span>');
					astr.push('<img style="position:absolute;left:-5px;top:-5px;z-index:10;border:none;" src="'+spath+'bg_selector.gif">');
					astr.push('</div>');
					astr.push('<div style="float:left;width:20px;border:1px solid #716F64;position:relative;margin-left:10px;position:relative;">');
					astr.push('<span style="display:block;font:0/0 Arial;cursor:pointer;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='+spath+'bg_colorattas.png, sizingMethod=scale);width:20px;height:'+w1+'px;"></span>');
					astr.push('<img style="position:absolute;left:-1px;top:-4px;z-index:10;border:none;" src="'+spath+'bg_slider.png">');
					astr.push('</div>');
				}else{
					astr.push('<div style="float:left;width:'+w1+'px;border:1px inset;position:relative;">');
					astr.push('<img style="display:block;border:none;cursor:crosshair;width:'+w1+'px;height:'+w1+'px;" src="'+spath+'bg_color_mask.png">');
					astr.push('<img style="position:absolute;left:-5px;top:-5px;z-index:10;border:none;" src="'+spath+'bg_selector.gif">');
					astr.push('</div>');
					astr.push('<div style="float:left;width:20px;border:1px solid #716F64;position:relative;margin-left:10px;position:relative;">');
					astr.push('<img style="display:block;border:none;cursor:pointer;width:20px;height:'+w1+'px;" src="'+spath+'bg_colorattas.png">');
					astr.push('<img style="position:absolute;left:-1px;top:-4px;z-index:10;border:none;" src="'+spath+'bg_slider.png">');
					astr.push('</div>');
				}
				astr.push('<div style="clear:both;padding-top:5px;font-size:12px;font-family:arial;"><p style="margin:0;padding:0;"><label style="display:inline-block;margin-right:5px;">COL:<input type="text" style="width:60px;border:none;font-size:10px;cursor:default;" readonly="readonly"></label><label style="display:inline-block;">HEX:<input type="text" style="width:65px;border:none;background-color:transparent;font-size:10px;" readonly="readonly"></label></p><p style="margin:0;padding:0;"><label style="display:inline-block;">HSB:<input type="text" style="width:65px;border:none;background-color:transparent;font-size:10px;" readonly="readonly"></label><label style="display:inline-block;">RGB:<input type="text" style="width:65px;border:none;background-color:transparent;font-size:10px;" readonly="readonly"></label></p><p style="margin:0;padding:0;padding-top:5px;text-align:right;"><button style="width:45px;">Close</button><button style="margin-left:5px;width:45px;">OK</button></p></div>');
				var dLayer = document.createElement('div');
				dLayer.id = 'easycolorpicker';
				dLayer.style.cssText = 'position:absolute;left:0;top:0;z-index:'+iz+';width:'+w0+'px;padding:5px;overflow:hidden;zoom:1;background:buttonface;display:none;';
				dLayer.innerHTML = astr.join('');
				document.body.appendChild(dLayer);
				this.dLayer = dLayer;
				this.dPanel = dLayer.childNodes[0];
				this.dMask = dLayer.childNodes[0].childNodes[0];
				this.dSelector = dLayer.childNodes[0].childNodes[1];
				this.dAttas = dLayer.childNodes[1].childNodes[0];
				this.dSlider = dLayer.childNodes[1].childNodes[1];
				this.dStatus = dLayer.childNodes[2];
				appendOnce = 1;
			}else{
				var w0 = this.width;
				var dLayer = document.getElementById('easycolorpicker');
				if(!dLayer){alert('Create instance of easy color picker failed!');return;}
				this.dLayer = dLayer;
				this.dPanel = dLayer.childNodes[0];
				this.dMask = dLayer.childNodes[0].childNodes[0];
				this.dSelector = dLayer.childNodes[0].childNodes[1];
				this.dAttas = dLayer.childNodes[1].childNodes[0];
				this.dSlider = dLayer.childNodes[1].childNodes[1];
				this.dStatus = dLayer.childNodes[2];
			}
			this.dStatus.getElementsByTagName('button')[0].onclick = this.close.bind(this);
			this.setValue.apply(this,arguments);
		}
	};
}();