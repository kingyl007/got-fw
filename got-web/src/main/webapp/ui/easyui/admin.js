function message(msg) {
    $.messager.show({
        title: '消息',
        msg: msg,
        showType: 'slide'
    });
}

function error(msg) {
    $.messager.alert('错误', msg, 'error');
}

function messageAndReturn(msg, returnUrl) {
    $.messager.alert('消息', msg, 'info', function (r) {
        clickBtn(returnUrl);
    });
}

function confirm(title, msg, func) {
    $.messager.confirm(title, msg, func);
}

function clickBtn(btn) {
    var a = $("#" + btn).get(0);
    var e = document.createEvent('MouseEvents');
    e.initEvent('click', true, true);
    a.dispatchEvent(e);
}

/** 
* 判断是否为空
*/
function isNull(obj) {
    if (obj == null || typeof obj == "undefined" || isNaNNumber(obj) || obj.toString() == "undefined")
        return true;
    else
        return false;
}

/** 
* 判断是否为空或空字符串
*/
function isNullOrEmpty(obj) {
    if (isNull(obj) || obj == "" || obj == " ") {
        return true;
    }
    else {
        return false;
    }
}

/** 
* 判断是否为空数字
*/
function isNaNNumber(obj) {
    if (typeof obj == "number" && obj.toString() == "NaN") {
        return true;
    }
    else {
        return false;
    }
}

var loadingIndex = 0;

/** 
* 显示等待画面
*/
function showLoading(id) {
    if (isNull(id)) {
        id = "body";
    }
    if (loadingIndex == 0) {
        $("<div class=\"datagrid-mask\"></div>").css({zIndex:9999, display: "block", width: "100%", height: $(window).height() }).appendTo(id);
        $("<div class=\"datagrid-mask-msg\"></div>").html("正在处理，请稍待...").appendTo(id).css({zIndex:10000, display: "block", left: ($(id).outerWidth(true) - 190) / 2, top: ($(id).height() - 45) / 2 });
    }
    loadingIndex++;
}

/** 
* 隐藏等待画面
*/
function hideLoading(id) {
    if (isNull(id)) {
        id = "body";
    }
    if (loadingIndex == 1) {
        $(id).find("div.datagrid-mask-msg").remove();
        $(id).find("div.datagrid-mask").remove();
    }
    loadingIndex--;
}

/** 
* 初始化标签内部内容
*/
function initHtml(id, value) {
    $(id).html(value);
}

/** 
* 初始化输入框的值
*/
function initText(id, value) {
    $(id).attr("value", value);
}

/** 
* 初始化日期控件的值
*/
function initDateBox(id, value) {
    $(id).datebox('setValue', value);
}

/** 
* 初始化日期时间控件的值
*/
function initDatetimeBox(id, value) {
    $(id).datetimebox('setValue', value);
}

/** 
* 初始化数字控件的值
*/
function initNumberBox(id, value) {
    $(id).numberbox("setValue", value);
}

/** 
* 初始化普通下拉式选择框的值
*/
function initSelect(id, value) {
    $(id + " option[value='" + value + "']").attr("selected", true);
}

/** 
* 初始化选择框的值
*/
function initCheckBox(id, value) {
    if (value == true) {
        $(id).attr("checked", true);
    }
    else {
        $(id).removeAttr("checked");
    }
}

/** 
* 异步请求
* @param url 请求地址
* @param data 请求参数
* @param fn 请求成功事件
*/
function ajaxRequest(url, data, fn) {
    $.ajax({
        type: 'post',
        contentType: 'application/json',
        url: url,
        data: data,
        dataType: 'json',
        success: fn,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            var errMsg = "";
            try {
                var responseText = $.parseJSON(XMLHttpRequest.responseText);
                if (!isNull(responseText) && !isNullOrEmpty(responseText.Message)) {
                    errMsg = "[" + textStatus + XMLHttpRequest.status + "] " + errorThrown + "\r\n" + responseText.Message;
                }
                else {
                    errMsg = "[" + textStatus + XMLHttpRequest.status + "] " + errorThrown + "\r\n" + XMLHttpRequest.responseText;
                }
            }
            catch (error) {
                errMsg = "[" + textStatus + XMLHttpRequest.status + "] " + errorThrown;
            }
            location.href = "../SystemError.aspx?ErrorMessage=" + errMsg;
        }
    });
}

/** 
* 同步请求
* @param url 请求地址
* @param data 请求参数
* @param fn 请求成功事件
*/
function ajaxSyncRequest(url, data, fn) {
    $.ajax({
        type: 'post',
        contentType: 'application/json',
        url: url,
        data: data,
        dataType: 'json',
        success: fn,
        async: false,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            var errMsg = "";
            try {
                var responseText = $.parseJSON(XMLHttpRequest.responseText);
                if (!isNull(responseText) && !isNullOrEmpty(responseText.Message)) {
                    errMsg = "[" + textStatus + XMLHttpRequest.status + "] " + errorThrown + "\r\n" + responseText.Message;
                }
                else {
                    errMsg = "[" + textStatus + XMLHttpRequest.status + "] " + errorThrown + "\r\n" + XMLHttpRequest.responseText;
                }
            }
            catch (error) {
                errMsg = "[" + textStatus + XMLHttpRequest.status + "] " + errorThrown;
            }
            location.href = "../SystemError.aspx?ErrorMessage=" + encodeURIComponent(errMsg);
        }
    });
}

/** 
* 异步请求
* @param url 请求地址
* @param data 请求参数
* @param fn 请求成功事件
*/
function ajaxRequest2(url, data, fn) {
    $.ajax({
        type: 'post',
        contentType: 'text/json',
        url: url,
        data: data,
        dataType: 'json',
        success: fn,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            var errMsg = "";
            try {
                var responseText = $.parseJSON(XMLHttpRequest.responseText);
                if (!isNull(responseText) && !isNullOrEmpty(responseText.Message)) {
                    errMsg = "[" + textStatus + XMLHttpRequest.status + "] " + errorThrown + "\r\n" + responseText.Message;
                }
                else {
                    errMsg = "[" + textStatus + XMLHttpRequest.status + "] " + errorThrown + "\r\n" + XMLHttpRequest.responseText;
                }
            }
            catch (error) {
                errMsg = "[" + textStatus + XMLHttpRequest.status + "] " + errorThrown;
            }
            location.href = "../SystemError.aspx?ErrorMessage=" + errMsg;
        }
    });
}

/** 
* 同步请求
* @param url 请求地址
* @param data 请求参数
* @param fn 请求成功事件
*/
function ajaxSyncRequest2(url, data, fn) {
    $.ajax({
        type: 'post',
        contentType: 'text/json',
        url: url,
        data: data,
        dataType: 'json',
        success: fn,
        async: false,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            var errMsg = "";
            try {
                var responseText = $.parseJSON(XMLHttpRequest.responseText);
                if (!isNull(responseText) && !isNullOrEmpty(responseText.Message)) {
                    errMsg = "[" + textStatus + XMLHttpRequest.status + "] " + errorThrown + "\r\n" + responseText.Message;
                }
                else {
                    errMsg = "[" + textStatus + XMLHttpRequest.status + "] " + errorThrown + "\r\n" + XMLHttpRequest.responseText;
                }
            }
            catch (error) {
                errMsg = "[" + textStatus + XMLHttpRequest.status + "] " + errorThrown;
            }
            location.href = "../SystemError.aspx?ErrorMessage=" + errMsg;
        }
    });
}

/** 
* 取得URL参数
*/
function queryString() {
    var requestObject = new Object();
    var str = location.search;

    if (!isNullOrEmpty(str)) {
        if (str.indexOf("?") == 0) {
            str = str.substr(1);
        }

        var arr1 = str.split("&");
        if (arr1.length > 0) {
            for (var i = 0; i < arr1.length; i++) {
                var arr2 = arr1[i].split("=");
                if (arr2.length == 2) {
                    eval("requestObject." + arr2[0] + " = '" + arr2[1] + "';");
                }
            }
        }
    }
    return requestObject;
}

function boolFormatter(v) {
    var cellHtml = "";
    var value = v.trim();
    if (value == "0" || value == 0 || value == "false" || value == "False" || value == false || !value) {
        cellHtml = '<img src="images/tree_checkbox_0.gif" ></img>';
    } else {
        cellHtml = '<img src="images/tree_checkbox_1.gif" ></img>';
    }
    return cellHtml;
}

function defaultFormatter(v) {
    var cellHtml = "";
    var value = v.trim();
    if (value == "0" || value == 0 || value == "false" || value == "False" || value == false || !value) {
        cellHtml = '';
    } else {
        cellHtml = '<img src="images/tree_checkbox_1.gif" ></img>';
    }
    return cellHtml;
}

function moneyFormatter(v) {
    var cellHtml = "";
    var value = v.trim();
    try {
        cellHtml = parseFloat(value).toFixed(2);
    }
    catch (error) {
        cellHtml = value;
    }
    return cellHtml;
}

