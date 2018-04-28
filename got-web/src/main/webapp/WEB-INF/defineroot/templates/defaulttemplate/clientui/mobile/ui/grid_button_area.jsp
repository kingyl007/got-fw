<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@page import="cn.got.platform.core.model.layout.*"%>
<%@page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:if test="${displayActions != null }">
<c:forEach var="act" items="${displayActions}" varStatus="status">
	<c:if test="${act.tag=='group' }">
		<c:if test="${act.id=='searchGrp' || act.id=='gridSearchGrp'}">
			<input type="text" style="width:0px; display:none;"/>${act.children[0].label}: <input type="text" id="${pageId }_queryValue" name="fwParam.queryValue" value="" onkeyUp="if (event.keyCode==13) {${pageId }.${ act.children[0].click}(${pageId }, null, '${act.children[0].id}', null, event);}" />
		</c:if>
		<c:if test="${act.showDefault!=null && act.showDefault }">
			<a href="javascript:void(0)" id="${pageId }_action_${act.id}" class="easyui-splitbutton"   
        	data-options="menu:'#${pageId }_ag_${act.id}_mm',iconCls:'${act.children[0].icon }'" 
        	onclick="javascript:${pageId }.${act.children[0].click}(${pageId}, null, '${act.children[0].id }', null, event)">${act.children[0].label}</a>   
			<div id="${pageId }_ag_${act.id}_mm" style="width:150px;">
				<c:forEach var="subAct" items="${act.children}" varStatus="subStatus">
					<c:if test="${ subStatus.index > 0}">
					<div id="${pageId }_action_${subAct.id}" data-options="iconCls:'${subAct.icon }', disabled:${(subAct.enable!=null)&&(!subAct.enable)}" 
					onclick="javascript:${pageId}.${subAct.click }(${pageId}, null, '${subAct.id }', null, event)">${subAct.label }</div>   
					</c:if>
				</c:forEach>  
			</div>
		</c:if>
		<c:if test="${act.showDefault==null || !act.showDefault }">
			<a href="javascript:void(0)" id="${pageId }_ag_${act.id}" class="easyui-menubutton"     
	        data-options="menu:'#${pageId }_ag_${act.id}_mm',iconCls:'${act.icon }'">${act.title }</a>   
		<div id="${pageId }_ag_${act.id}_mm" style="width:150px;">
			<c:forEach var="subAct" items="${act.children}" varStatus="subStatus">
				<div id="${pageId }_action_${subAct.id}" data-options="iconCls:'${subAct.icon }', disabled:${(subAct.enable!=null)&&(!subAct.enable)}" 
				onclick="javascript:${pageId}.${subAct.click }(${pageId}, null, '${subAct.id }', null, event)">${subAct.label }</div>   
			</c:forEach>  
		</div>
		</c:if>
	</c:if>
	<c:if test="${act.tag != 'group' }">
	<c:if test="${act.id=='searchList' }">
		<input type="text" style="width:0px; display:none;"/>${act.label }: <input type="text" id="${pageId }_queryValue" name="fwParam.queryValue" value="" onkeyUp="if (event.keyCode==13) {${pageId }.${ act.click}(${pageId }, null, '${act.id}', null, event);}" />
	</c:if>
	<a class="easyui-linkbutton"  id="${pageId }_action_${act.id}" 
	iconCls="${act.icon }" 
	data-options="plain:true"
	href="javascript:${pageId}.${act.click }(${pageId}, null, '${act.id }', null, event)">${act.label }</a>
	</c:if>
</c:forEach>
</c:if>