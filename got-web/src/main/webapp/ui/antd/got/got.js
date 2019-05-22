// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.format = function(fmt) { // author: meizz
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};

$.fn.serializeObject = function() {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [ o[this.name] ];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};


String.prototype.endWith=function(str){
if(str==null||str==""||this.length==0||str.length>this.length)
  return false;
if(this.substring(this.length-str.length)==str)
  return true;
else
  return false;
return true;
};

String.prototype.startWith=function(str){
if(str==null||str==""||this.length==0||str.length>this.length)
  return false;
if(this.substr(0,str.length)==str)
  return true;
else
  return false;
return true;
};

var got = {
		vues : {},
		addDialogStr : function(dialogId, content) {
			var dialogContent = '<el-dialog id="' + dialogId + '" :title="title" :visible.sync="showDialog" :width="width">';
			dialogContent += content;
			var tail = "";
			tail += '<span slot="footer" class="dialog-footer">';
			tail += '<el-button type="primary" @click="confirmDialog" :loading="loading">确定</el-button>';
			tail += '<el-button @click="showDialog = false">取消</el-button>';
			tail += '</span>';
			tail += '</el-dialog>';
			dialogContent = dialogContent.replace('<div class="TAIL_HERE" />', tail);
			return dialogContent;
		},
		setCookie : function (name,value, days) {
			var localDays = 1;
			if (typeof days == 'undefined') {
				localDays = 30;
			} else {
				localDays = days;
			}
		    var exp = new Date();
		    exp.setTime(exp.getTime() + localDays*24*60*60*1000);
		    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
		},

		getCookie : function(name)
		{
		    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)"); //正则匹配
		    if(arr=document.cookie.match(reg)){
		      return unescape(arr[2]);
		    }
		    else{
		     return null;
		    }
		},

		delCookie : function(name)
		{
		    var exp = new Date();
		    exp.setTime(exp.getTime() - 1);
		    var cval=got.getCookie(name);
		    if(cval!=null){
		      document.cookie= name + "="+cval+";expires="+exp.toGMTString();
		    }
		},
		
	clearSelect : function() {
		window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
	},

	strToDate : function(str) {
		if (str == null) {
			return new Date();
		}
		return new Date(str.split('-').join('/'));
	},
	/*
	parseDate : function(str, patt) {
		var now = new Date();
		var yearPat = "/(y+)/g";
		var result = yearPat.exec(patt);
		var year = now.getFullYear();
		var month = 1;
		var day = now.getDate();
		var hour = now().getHours();
		var min = getMinutes();
		if (result && patt.lastIndex>=0) {
			year = str.substr(patt.lastIndex, patt.lastIndex + result.length);
		}
	},
*/
	toDate : function(obj) {
		var dateValue = null;
		var valType = typeof obj;
		if (valType == 'string') {
			dateValue = got.strToDate(obj);
		} else if (valType == 'number') {
			dateValue = new Date();
			dateValue.setTime(obj);
		} else {
			dateValue = obj;
		}
		return dateValue;
	},

	getTimeIntervalStr : function(from, to) {
		var intervals = (to.getTime() - from.getTime()) / 1000;
		if (intervals < 0) {
			intervals = -intervals;
		}

		if (intervals < 0) {
			return "未知";
		}
		var divides = [ 60, 60, 24 ];
		var remains = [ 0, 0, 0, 0 ];
		var i = 0;
		var mod = 0;
		var remain = parseInt(intervals);
		for (; i < divides.length; ++i) {
			mod = parseInt(remain % divides[i]);
			remain = parseInt(remain / divides[i]);
			remains[i] = mod;
		}
		remains[i] = remain;
		var names = [ "秒", "分钟", "小时", "天" ];
		var result = "";
		for (i = remains.length - 1; i > 0; --i) {
			if (remains[i] > 0) {
				result = result + (remains[i]) + (names[i]);
			}
		}
		return result;
	},

	intToColorStr : function(i) {
		return '#' + parseInt(i, 10).toString(16);
	},
	isEmpty : function(obj) {
		return obj == null || obj == "";
	},
	xssFilter : function(obj) {
		if (obj) {
			return String(obj).split('<').join("&lt;").split('>').join('&gt;');
		}
		return obj;
	},
	isSame : function(obj1, obj2) {
		var obj1Empty = got.isEmpty(obj1);
		var obj2Empty = got.isEmpty(obj2);
		if (obj1Empty && obj2Empty) {
			return true;
		}
		return obj1 == obj2;
	},

	removeNoUseData : function(obj) {
		if (obj instanceof Array) {
			var newArr = [];
			for (var i = 0; i < obj.length; ++i) {
				newArr.push(got.removeNoUseData(obj[i]));
			}
			return newArr;
		} else {
			var o = {};
			if (obj) {
				for ( var p in obj) {
					if (p == '_FW_ACTIONS' || p == '_FW_LINKBUTTONS' || p == '_FW_MENUBUTTONS' || p == '_FW_WF_HISTORY') {

					} else {
						o[p] = obj[p];
					}
				}
			}
			return o;
		}
	},

	loadOneJs : function(url, callbackStr, callback) {
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.onload = script.onreadystatechange = function() {
			if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
				if (callback) {
					callback();
				}
				this.onload = this.onreadystatechange = null;
			}
		};

		script.src = url + (callbackStr ? ("&" + callbackStr) : "");
		document.body.appendChild(script);
	},

	ajax : function(opts) {
		var successProc = opts.success;
		if (opts.error == null) {
			opts.error = function(res, ts, e) {
				alert('调用错误:' + res.code);
			};
		}
		var realSuccessProc = null;
		if (successProc == null) {
			successProc = function() {
				
			};
		}
		realSuccessProc = function(data, status, xhr) {
			try {
				var jsonData = data;
				if (typeof jsonData == 'string') {
					jsonData = $.parseJSON(data);
				}
				if (jsonData && jsonData.redirectUrl &&  !jsonData.success) {
					if (opts.autoRedirect == null || opts.autoRedirect==false) {
						alert(jsonData.errorMsg);
					}
					location.href=jsonData.redirectUrl;
					return;
				}
			} catch (error) {
				// DO NOTHING
			}
			successProc(data, status, xhr);
		};
		opts.success = realSuccessProc;
		$.ajax(opts);
	},
};
