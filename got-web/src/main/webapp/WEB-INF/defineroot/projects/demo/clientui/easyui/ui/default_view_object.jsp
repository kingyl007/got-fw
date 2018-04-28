<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@page import="cn.got.platform.core.model.layout.*"%>
<%@page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
id : '${pageId}',
title : '${not empty view.title?view.title:function.title}',
width : ${not empty view.width?view.width:'600' },
height : ${not empty view.height?view.height:'450' },
isInDialog : ${showAsDialog==1 },
userId : '${user.id }',
customerId : '${user.customerId }',
dialogs: {
	
},
openerSelectedData : ${not empty openerSelectedData?openerSelectedData:'{}'},
actionArg: {
	<c:forEach items="${view.actions}" var="act" varStatus="actStatus">
		'${act.id}' : {
		'icon': '${act.icon }',
		'label': '${act.label }',
		<c:if test="${not empty act.argument}">
           		  <c:forEach items="${act.argument.map}" var="actarg" varStatus="argStatus">
           		  	'${actarg.key}': '${actarg.value}',
           		  </c:forEach>
           </c:if>
           	  },
	</c:forEach>
},
otherActions: {
	<c:forEach items="${otherActions}" var="entry">
		${entry.key}:[
		<c:forEach items="${entry.value.children}" var="act" varStatus="actStatus">
			${actStatus.index>0?',':''}
				{
				  id: '${act.id}',
				  label: '${act.label}',
				  type: '${act.type}',
				  click: '${act.click}',
				  icon: '${act.icon}',
				  visible: ${act.visible},
				  enable:  ${act.enable},
				}
		</c:forEach>
		              ],
	</c:forEach>
},
buildFormDataObject: function(view, newViewName) {
	var obj = {
	'fwParam.openerId' : '${openerId}',
	'fwParam.openerSelectedData' : view.openerSelectedData,
	};
	$(":input", $(view.getId('form'))).each(function() {
	obj[this.name] = $(this).val();
	});
	if (newViewName) {
		obj['fwCoord.view'] = newViewName;
	}
	return obj;
},
	
getId : function(key) {
	return "#${pageId}_" + key;
},

getForm : function() {
	return $(${pageId}.getId("form"));	
},

onFileFieldValueChange : function(newValue, oldValue) {
	if (newValue && newValue != '') {
		var displayStr = newValue;
		if(newValue.endWith('.png') || newValue.endWith('.jpg') || newValue.endWith('.jpeg') || newValue.endWith('.bmp') || newValue.endWith('.gif')) {
			displayStr = "<img src='getImage?fwCoord.project=${view.coord.project }&fileName=" + newValue +"' width='300px' height='200px'/>"; 
		}
		console.info(displayStr);
		$('#' + this.id + '_tooltip').tooltip({content:displayStr});
	}
},
	
onFileSelected : function(event, id) {
	var view = ${pageId };
	var fileInputId = view.getId(id + '_file');
	if ($(fileInputId).val() == null || $(fileInputId).val() == "") {
		return;
	}
	var postData = {};
	$.messager.progress();
	$.messager.progress('bar').progressbar({text:'上传中，请稍候...'}); 
	$.ajaxFileUpload({
		url : 'uploadFile?fwCoord.project='+$(view.getId('project')).val(),
		secureuri : false,
		fileElementId : fileInputId.substring(1),
		dataType : 'json',
		data : postData,
		error : function(res, ts, e) {
			$.messager.progress('close'); 
			$.messager.alert('提示', "上传错误 :" + ts, 'error');
		},
		success : function(result, status) {
			$.messager.progress('close');
			if (result.success) {
				if (result.errorMsg && result.errorMsg != '') {
					$.messager.alert('提示', "上传成功:" + result.errorMsg, 'info');
				} else {
					$.remind('提示', '上传成功', "info", 1600);
				}
				if (result.resultData && result.resultData.sfile) {
					$(view.getId(id)).textbox('setValue', result.resultData.sfile);
					$(view.getId(id)).textbox('setText', result.resultData.cfilename);
				}
			} else {
				if (result.validResultMap) {
					view.dialogs[dialogName].validErrorMap = result.validResultMap;
					got.doValidate(view.dialogs[dialogName], true);
					$.remind('错误', '上传错误:' + result.errorMsg, "error", 3000);
				} else {
					$.messager.alert('提示', "上传错误:" + result.errorMsg, 'error');
				}
			}
			$(fileInputId).val('');
		}
	});	
},

dictMap : {
	<c:forEach var="dict" items="${view.dictMap}">
// \/ \/ \/ ${dict.key} start \/ \/ \/
		 ${dict.key} : {
			 <c:forEach var="dictItem" items="${dict.value.itemList}">
			 	'${dictItem.value}' : '${dictItem.label}',
			 	<c:if test="${dictItem.value == dict.value.defaultValue }">
		 		'' : '${dictItem.label}', /*default value*/
			 	</c:if>
			  </c:forEach>
				 },
// /\ /\ /\ ${dict.key} end /\ /\ /\ 
			</c:forEach>
		},
		
		
		<c:forEach var="item" items="${view.clientLogicMap}" varStatus="status">
// \/ \/ \/ ${item.key} start \/ \/ \/
	${item.key} : ${item.value.body},
// /\ /\ /\ ${item.key} end /\ /\ /\
		</c:forEach>