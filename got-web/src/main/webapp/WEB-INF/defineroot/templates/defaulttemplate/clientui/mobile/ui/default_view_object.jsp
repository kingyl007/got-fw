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