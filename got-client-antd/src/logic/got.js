
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

String.prototype.trim = function(trimMid) {
  var str = this;
	str = str.replace(/^\s\s*/, '');
	if (trimMid) {
		const ws = /\s/;
		let i = str.length;
		while (ws.test(str.charAt(--i)));
		return str.slice(0, i + 1);
	}
	return str;
}

 /**
	* 参数说明：
	* decimals：保留几位小数
	* dec_point：小数点符号
	* thousands_sep：千分位符号
	* roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
	*/
Number.prototype.format = function(decimals, dec_point, thousands_sep, roundtag) {
	var number = this;
	number = (number + '').replace(/[^0-9+-Ee.]/g, '');
	roundtag = roundtag || "ceil"; //"ceil","floor","round"
	var n = !isFinite(+number) ? 0 : +number,
			prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
			sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
			dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
			s = '',
			toFixedFix = function (n, prec) {

					var k = Math.pow(10, prec);
					console.log();

					return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec*2))).toFixed(prec*2)) / k;
			};
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	var re = /(-?\d+)(\d{3})/;
	while (re.test(s[0])) {
			s[0] = s[0].replace(re, "$1" + sep + "$2");
	}

	if ((s[1] || '').length < prec) {
			s[1] = s[1] || '';
			s[1] += new Array(prec - s[1].length + 1).join('0');
	}
	return s.join(dec);
}

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

export function isEmpty(obj) {
		return !obj || obj == null || obj === "";
};

export function isNumber(val) {
	var regPos = /^\d+(\.\d+)?$/; //非负浮点数
	var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
	if(regPos.test(val) || regNeg.test(val)){
		return true;
	}else{
		return false;
	}
}

export function intToColorStr(i) {
	if (String(i).indexOf('#') == 0) {
		return i;
	}
	return '#' + parseInt(i, 10).toString(16);
}

export function strToDate(str) {
	if (str == null) {
		return new Date();
	}
	var d = new Date(str.split('-').join('/'));
	if (d == 'Invalid Date') {
		return str;
	}
	return d;
}

export function toDate(obj) {
	var dateValue = null;
	var valType = typeof obj;
	if (valType == 'string') {
		dateValue = strToDate(obj);
	} else if (valType == 'number') {
		dateValue = new Date();
		dateValue.setTime(obj);
	} else {
		dateValue = obj;
	}
	return dateValue;
}

 /**
	* 参数说明：
	* number：要格式化的数字
	* decimals：保留几位小数
	* dec_point：小数点符号
	* thousands_sep：千分位符号
	* roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
	*/
export function number_format(number, decimals, dec_point, thousands_sep,roundtag) {
	number = (number + '').replace(/[^0-9+-Ee.]/g, '');
	roundtag = roundtag || "ceil"; //"ceil","floor","round"
	var n = !isFinite(+number) ? 0 : +number,
			prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
			sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
			dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
			s = '',
			toFixedFix = function (n, prec) {

					var k = Math.pow(10, prec);
					console.log();

					return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec*2))).toFixed(prec*2)) / k;
			};
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	var re = /(-?\d+)(\d{3})/;
	while (re.test(s[0])) {
			s[0] = s[0].replace(re, "$1" + sep + "$2");
	}

	if ((s[1] || '').length < prec) {
			s[1] = s[1] || '';
			s[1] += new Array(prec - s[1].length + 1).join('0');
	}
	return s.join(dec);
}

export function validMobileNo(no) {
	var myreg=/^[1][3,4,5,7,8,9][0-9]{9}$/;
	if (!myreg.test(no)) {
			return false;
	} else {
			return true;
	}
}


export function getRealDate(str) {
	if (str.indexOf('{today')==0 && str.indexOf('}') == str.length - 1) {
		let offset = String(str).substring(6, str.length - 1);
		return moment().add(parseInt(offset), 'days');
	} else if (str == 'today') {
		return moment();
	} else {
		return moment(str);
	}
}

//身份证号合法性验证 
//支持15位和18位身份证号
//支持地址编码、出生日期、校验位验证
export function validIdentityCodeValid(code) { 
	var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
	var tip = "";
	var pass= true;
	//验证身份证格式（6个地区编码，8位出生日期，3位顺序号，1位校验位）
	if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
			tip = "身份证号格式错误";
			pass = false;
	}
	
 else if(!city[code.substr(0,2)]){
			tip = "地址编码错误";
			pass = false;
	}
	else{
			//18位身份证需要验证最后一位校验位
			if(code.length == 18){
					code = code.split('');
					//∑(ai×Wi)(mod 11)
					//加权因子
					var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
					//校验位
					var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
					var sum = 0;
					var ai = 0;
					var wi = 0;
					for (var i = 0; i < 17; i++)
					{
							ai = code[i];
							wi = factor[i];
							sum += ai * wi;
					}
					var last = parity[sum % 11];
					if(parity[sum % 11] != code[17]){
							tip = "校验位错误";
							pass =false;
					}
			}
	}
	if (!pass) {
		console.warn('valid id not pass', tip);
	}
	return pass;
}

export function validateVIN(vin){
	if(vin.length>0 && vin.length!=17){
		return false;
	}else{
		var vinVal = vin.toUpperCase();
			//document.getElementById("vin_"+k).value = vinVal;
			var charToNum = {'A':1,'B':2,'C':3,'D':4,'E':5,'F':6,'G':7,'H':8,'J':1,'K':2,'L':3,'M':4,'N':5,'P':7,'R':9,'S':2,'T':3,'U':4,'V':5,'W':6,'X':7,'Y':8,'Z':9};
			var obj = 0;
			var arr = new Array();
			for (var i = 0 ; i < vinVal.length; i++) {
				var temp = vinVal.charAt(i);

				if(charToNum[temp]){
					arr[i] = charToNum[temp];
				}else{
					arr[i] = Number(temp);
				}
				if(i==8){
					arr[i] = vinVal.charAt(i);
				}

			};	
			var a1 = 8;
			for (var i = 0; i < 7; i++) {
				obj += Number(arr[i]) * a1 ;
				a1--;
			};

			obj += Number(arr[7])*10;

			var a2 = 9;
			for (var i = 9; i < 17; i++) {
				obj += Number(arr[i]) * a2;
				a2--;
			};

			var result = Number(obj)%11; 
			if(parseInt(result) === 10){
				result = 'X';
			}
			if(result == arr[8]){
								//成功
					return true;
			}else{
				//失败
				return false;
			}
	}
};
export function getFillHeight(diff) {
  return {
    height :'-moz-calc(100% - '+diff+'px)',
    height :'-webkit-calc(100% - '+diff+'px)',
    height :'-o-calc(100% - '+diff+'px)',
    height :'-ms-calc(100% - '+diff+'px)',
    height :'calc(100% - '+diff+'px)'
  }
};
