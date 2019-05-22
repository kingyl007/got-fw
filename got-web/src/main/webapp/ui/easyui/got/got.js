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
		var d = new Date(str.split('-').join('/'));
		if (d == 'Invalid Date') {
			return str;
		}
		return d;
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
	
	getNumberStr : function(val, decimalSize) {
		 var f = parseFloat(val); 
     if (!isNaN(f) && (decimalSize === 0 || decimalSize > 0)) {
    	 var power = Math.pow(10, decimalSize);
    	 return Math.round(f * power) / (power * 1.0);
    	 /*
    	 return f.toFixed(decimalSize);
    	  */
     }
     return val; 
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

	setFormValue : function(fe, returnData, k) {
		if (fe.length > 0) {
			if (fe.attr('ui') == 'easyui-datebox') {
				var v = got.toDate(returnData[k]);
				fe.datebox({formatter : function(date) {
					return date.format((fe.attr('pattern') != null && fe.attr('pattern') != '')?fe.attr('pattern'):'yyyy-MM-dd');
				}});
//				fe.datebox('parser', function(s) {
//					
//				});
				fe.datebox('setValue', (v && v['format']) ? v.format((fe.attr('pattern') != null && fe.attr('pattern') != '')?fe.attr('pattern'):'yyyy-MM-dd') : '');
			} else if (fe.attr('ui') == 'easyui-datetimebox') {
				var v = got.toDate(returnData[k]);
				fe.datetimebox({formatter : function(date) {
					return date.format((fe.attr('pattern') != null && fe.attr('pattern') != '')?fe.attr('pattern'):'yyyy-MM-dd hh:mm:ss');
				}});
				fe.datetimebox('setValue', (v && v['format']) ? v.format((fe.attr('pattern') != null && fe.attr('pattern') != '')?fe.attr('pattern'):'yyyy-MM-dd hh:mm:ss') : '');
			} else if (fe.attr('ui') == 'easyui-timespinner') {
				fe.datetimebox('setValue', returnData[k]);
			} else if (fe.attr('ui') == 'easyui-numberbox') {
				fe.numberbox('setValue', returnData[k]);
			} else if (fe.attr('ui') == 'easyui-combogrid') {
				fe.combogrid('setValue', returnData[k]);
				fe.combogrid('setText', returnData[k]);
				if (returnData[k]) {
					var showValue = returnData[fe.attr('showColumn')];
					var realValue = returnData[k];
					var labelField = fe.combogrid("grid").datagrid('options').textField;
					var valueField = fe.combogrid("grid").datagrid('options').idField;
					var gridData = fe.combogrid("grid").datagrid("getData");
					var valueExists = false;
					$.each(gridData.rows, function(key, rowData) {
						if (rowData[valueField] == realValue) {
							valueExists = true;
						}
					});
					if (!valueExists) {
						var so = {};
						so[valueField] = realValue;
						so[labelField] = showValue;
						gridData.rows.splice(0, 0, so);
						fe.combogrid("grid").datagrid("loadData", gridData);
					}
					if (fe.combogrid("options")["multiple"]) {
						fe.combogrid('setValues', returnData[k].split(','));
					} else {
						fe.combogrid('setValue', realValue);
						fe.combogrid('setText', showValue);
					}
				}
			} else if (fe.attr('ui') == 'easyui-combobox') {
				fe.combobox('setValue', returnData[k]);
				if (returnData[k]) {
					if (typeof (fe.attr('showColumn')) != 'undefined') {
						fe.combobox({
							editable : false,
							readonly : true,
							hasDownArrow : false,
							valueField : 'value',
							textField : 'label',
							data : [ {
								value : returnData[k],
								label : returnData[fe.attr('showColumn')]
							} ],
							value : returnData[k],
							panelHeight : 22,
						});
					}

					if (fe.combobox("options")["multiple"]) {
						fe.combobox('setValues', returnData[k].split(','));
					} else {
						fe.combobox('setValue', returnData[k]);
						//fe.combobox('setText', showValue);
					}
					/*
					 * var opts = fe.combobox("options"); console.info(opts); if
					 * (opts["multiple"]) { fe.combobox('setValues',
					 * returnData[k].split(',')); } else {
					 * fe.combobox('setValue',returnData[k]); var listData =
					 * fe.combobox("getData"); if (listData) { for (var li=0; li <
					 * listData.length; ++li) { if (listData[li][opts.valueField] ==
					 * returnData[k]) {
					 * fe.combobox("textbox").val(listData[li][opts.textField]); break; } } } }
					 */
				}
			} else if (fe.attr('ui') == 'easyui-combotree') {
				if (returnData[k]) {
					if (typeof returnData[k] == 'string') {
						fe.combotree('setValues', returnData[k].split(','));
					} else {
						fe.combotree('setValue', returnData[k]);
					}
				} else {
					fe.combotree('setValue', returnData[k]);
				}
			} else if (fe.attr('ui') == 'easyui-textbox' || fe.attr('ui') == 'easyui-filebox') {
				fe.textbox('setValue', returnData[k]);
			} else if (fe.attr('ui') == 'checkbox01') {
				if (fe.val() == returnData[k]) {
					fe.attr('checked', true);
				} else {
					fe.attr('checked', false);
				}
			} else if (fe.attr('ui') == 'ueditor' || $('#' + fe.attr('id') +'_EDITOR').attr('ui') == 'ueditor') {
				try {
					UE.getEditor(fe.attr('id')).setContent(returnData[k]);
					returnData[fe.attr('id')] = returnData[k];
				} catch (error) {
					console.info(error);
				}
			} else {
				fe.val(returnData[k]);
			}
		}
	},

	showGridEmptyInfo : function(grid) {

	},

	getFormValue : function(fe) {
		if (fe.length > 0) {
			if (fe.attr('ui') == 'easyui-passwordbox') {
				return fe.passwordbox('getValue');
				// if (fe.attr('ui') == 'easyui-datebox') {
				// return fe.datebox('getValue');
				// } else if (fe.attr('ui') == 'easyui-datetimebox') {
				// return fe.datetimebox('getValue');
				// } else if (fe.attr('ui') == 'easyui-combogrid') {
				// return fe.combogrid('getValue');
				// } else if (fe.attr('ui') == 'easyui-combobox') {
				// return fe.combobox('getValue');
				// } else if (fe.attr('ui') == 'easyui-textbox') {
				// return fe.textbox('getValue');
			} else if (fe.attr('ui') == 'ueditor') {
				try {
					return UE.getEditor(fe.attr('id')).getContent();
				} catch (error) {
					console.info(error);
					return fe.val();
				}
			} else {
				var v = fe.val();
				if (v) {
					if (fe.attr('ui').indexOf('date')>=0) {
						return got.toDate(v).getTime();
					}
					return v;
				} else {
					if (fe.attr('ui') == 'checkbox01') {
						return '0';
					}
				}
			}
		}
		return null;
	},

	checkRequireTypeSize : function(ctl, val, require, type, maxSize, minSize) {

	},

	doValidate : function(view, doValidate) {
		var fun = doValidate ? "enableValidation" : "disableValidation";
		var result = true;
		var totalResult = true;
		var validateFun = function(index, ctl) {
			var id = ctl.id;
			if (id && id.indexOf(view.id) == 0) {
				var ui = $(ctl).attr("ui");
				var validCtl = true;
				if (ui) {
					// console.info(ui);
					if (ui == "easyui-textbox") {
						if (!$(ctl).textbox("options").disabled && !$(ctl).textbox("options").readonly) {
							$(ctl).textbox(fun);
							if (doValidate) {
								result = $(ctl).textbox("isValid");
								totalResult = result ? totalResult : result;
							}
						}
					} else if (ui == "easyui-combobox") {
						if (!$(ctl).combobox("options").disabled && !$(ctl).combobox("options").readonly) {
							if ($(ctl).attr('canInput') == 'true' && $(ctl).combobox('getText') != '' && (typeof $(ctl).combobox('getValue') == 'undefined' || $(ctl).combobox('getValue') == null || $(ctl).combobox('getValue') == '')) {
								$(ctl).append("<option value='"+$(ctl).combobox('getText')+"'>"+$(ctl).combobox('getText')+"</option>");
								$(ctl).combobox('setValue', $(ctl).combobox('getText'));
							}
							$(ctl).combobox(fun);
							if (doValidate) {
								result = $(ctl).combobox("isValid");
								totalResult = result ? totalResult : result;
							}
						}
					} else if (ui == "easyui-combogrid") {
						if (!$(ctl).combogrid("options").disabled && !$(ctl).combogrid("options").readonly) {
							$(ctl).combogrid(fun);
							if (doValidate) {
								result = $(ctl).combogrid("isValid");
								totalResult = result ? totalResult : result;
							}
						}
					} else if (ui == "easyui-combotree") {
						if (!$(ctl).combotree("options").disabled && !$(ctl).combotree("options").readonly) {
							$(ctl).combotree(fun);
							if (doValidate) {
								result = $(ctl).combotree("isValid");
								totalResult = result ? totalResult : result;
							}
						}
					} else if (ui == "easyui-datetimebox") {
						if (!$(ctl).datetimebox("options").disabled && !$(ctl).datetimebox("options").readonly) {
							$(ctl).datetimebox(fun);
							if (doValidate) {
								result = $(ctl).datetimebox("isValid");
								totalResult = result ? totalResult : result;
							}
						}
					} else if (ui == "easyui-datebox") {
						if (!$(ctl).datebox("options").disabled && !$(ctl).datebox("options").readonly) {
							$(ctl).datebox(fun);
							if (doValidate) {
								result = $(ctl).datebox("isValid");
								totalResult = result ? totalResult : result;
							}
						}
					} else if (ui == "easyui-timespinner") {
						if (!$(ctl).timespinner("options").disabled && !$(ctl).timespinner("options").readonly) {
							$(ctl).timespinner(fun);
							if (doValidate) {
								result = $(ctl).timespinner("isValid");
								totalResult = result ? totalResult : result;
							}
						}
					} else if (ui == "easyui-numberbox") {
						if (!$(ctl).numberbox("options").disabled && !$(ctl).numberbox("options").readonly) {
							$(ctl).numberbox(fun);
							if (doValidate) {
								result = $(ctl).numberbox("isValid");
								totalResult = result ? totalResult : result;
							}
						}
					} else if (ui == "easyui-validatebox") {
						$(ctl).validatebox(fun);
						if (doValidate) {
							result = $(ctl).validatebox("isValid");
							totalResult = result ? totalResult : result;
						}
					} else {
						validCtl = false;
					}
				}
			}
		};
		$("input").each(validateFun);
		$("select").each(validateFun);

		return totalResult;
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

if ($.fn.datagrid) {
	$.extend($.fn.datagrid.defaults.editors, {
		combogrid : {
			init : function(container, options) {
				var input = $('<input type="text" class="datagrid-editable-input">').appendTo(container);
				input.combogrid(options);
				return input;
			},
			destroy : function(target) {
				$(target).combogrid('destroy');
			},
			getValue : function(target) {
				return $(target).combogrid('getValue');
			},
			setValue : function(target, value) {
				$(target).combogrid('setValue', value);
			},
			resize : function(target, width) {
				$(target).combogrid('resize', width);
			}
		}
	});
}

if ($.fn.datagrid) {
	$.extend($.fn.datagrid.defaults.editors, {
		colorpicker : {
			// colorpicker就是你要自定义editor的名称
			init : function(container, options) {
				var input = $('<input>').appendTo(container);
				input.ColorPicker({
					color : '#0000ff',
					onShow : function(colpkr) {
						$(colpkr).fadeIn(500);
						return false;
					},
					onHide : function(colpkr) {
						$(colpkr).fadeOut(500);
						
						return false;
					},
					onChange : function(hsb, hex, rgb) {
						input.css('backgroundColor', '#' + hex);
						input.css('color', '#' + (!hex));
						input.val('#' + hex);
					}
				});
				return input;
			},
			getValue : function(target) {
				return $(target).val();
			},
			setValue : function(target, value) {
				$(target).val(value);
				$(target).ColorPickerSetColor(value);
			},
			resize : function(target, width) {
				var input = $(target);
				if ($.boxModel == true) {
					input.width(width - (input.outerWidth() - input.width()));
				} else {
					input.width(width);
				}
			}
		}
	});
}
if ($.fn.validatebox) {
	$.extend($.fn.validatebox.defaults.rules, {
		datetime : {
			validator : function(value, param) {
				if (param[0] == '') {
					param[0] = 'yyyy-MM-dd hh:mm:ss';
				}
				var d = got.strToDate(value);
				return d.format(param[0]) == value;
			},
			message : '时间格式不正确，正确格式：{0}',
		},
		date : {
			validator : function(value, param) {
				if (param[0] == '') {
					param[0] = 'yyyy-MM-dd';
				}
				var d = got.strToDate(value);
				return d.format(param[0]) == value;
			},
			message : '日期格式不正确，正确格式：{0}',
		},
		num : {
			validator : function(value, param) {
				var reg = null;
				if (param[0] != '') {
					reg = new RegExp(param[0],'gi');
					param[2] = param[0];
				} else {
					if (param[1] > 0) {
						reg = new RegExp("^[\-|0-9]+(.[0-9]{1,"+param[1]+"})?$","gi");
						param[2] = '最大'+param[1]+'位小数';
					} else {
						reg = new RegExp("^[0-9]*$","gi");
						param[2] = '正整数';
					}
				}
				return reg.test(value);
			},
			message : '数字格式不正确，正确格式：{2}',
		},
		fwRemote : {
			validator : function(value, param) {
				var view = param[0];
				var key = param[1];
				if (view.validErrorMap[key]) {
					if (view.validErrorMap[key] == null || view.validErrorMap[key] == '') {
						return true;
					} else {
						param[2] = view.validErrorMap[key];
						return false;
					}
				}
				return true;
			},
			message : '{2}',
		}
	});
}

$.extend({
	remind : function(title, msg, icon, timeout) {
		var options = {
			"icon" : icon,
			"title" : title,
			"msg" : msg,
			"timeout" : timeout,
		};
		var _msg = '<div style="width:100%;">';
		if (options.icon != undefined) {
			_msg += '<div class="messager-icon messager-' + options.icon + '"></div>';
		}
		if (options.msg != undefined) {
			_msg += '<div style="word-break : break-all;">' + options.msg + '</div>';
		}
		_msg += '</div>';
		options.msg = _msg;
		$.messager.show(options);
	}
});