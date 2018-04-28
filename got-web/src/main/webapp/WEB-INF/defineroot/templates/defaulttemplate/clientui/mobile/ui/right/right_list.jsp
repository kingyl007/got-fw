<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@page import="cn.got.platform.core.model.layout.*"%>
<%@page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!DOCTYPE html>
<html lang="zh">
<head>
<title>${view.title }</title>
<%
String str = ((String)request.getAttribute("openerSelectedData"));
if (str != null) {
  str = str.replaceAll("<", "&lt;");
  request.setAttribute("openerSelectedData", str);
}

if (!"1".equals(request.getAttribute("showAsDialog"))) {
%>
<jsp:include page="../header.jsp"></jsp:include>
<%
}
%>
<script type="text/javascript">
	// var ${pageId}=cxfw2.initDefineObject('${pageId}', ${pageDefine});
	var ${pageId}={
	    <jsp:include page="../default_view_object.jsp" />
		
		data : {
			<c:forEach var="item" items="${privilegeMap}" varStatus="status">
				'${item.key}' : {'HAVE_PRIVILEGE':'${item.value['HAVE_PRIVILEGE']}','DATA_LEVEL':'${item.value['DATA_LEVEL']}'},
			</c:forEach>
		},
		
		validate : function() {
			return true;
		},
		queryGridData: function() {
	  		<c:if test="${not empty view.onQuery}">
			if (this['${view.onQuery}']) {
				this['${view.onQuery}'](this, $(this.getId("form")).serialize());
			}
			</c:if>
		},
		expandedPanels : {},
			
		beforeFunctionExpand : function() {
				if (${pageId}.expandedPanels[this.id]) {
					return true;
				} else {
					var lid = this.id;
					var idparts = lid.split('+');
					var groupId = idparts[idparts.length - 2];
					var functionId = idparts[idparts.length - 1];
					var postData = ${pageId}.buildFormDataObject(${pageId}, null);
					var functionCheckStatus = $(${pageId}.getId(groupId +"_"+functionId)).attr("checked");
					postData['fwParam.selectedData'] = {PKEY:functionId, ROLE_ID:$(${pageId}.getId('roleId')).val()};
					got.ajax({
					  cache : true,
					  type : "POST",
					  url : "getSelectData",
					  dataType : "json",
					  data : postData,
					  async : false,
					  error : function(res, ts, e) {
					    alert("数据加载错误:" + ts);
					    return false;
					  },
					  success : function(returnData) {
					    if (returnData == null) {
					    	$.messager.alert('提示','数据加载错误');
					      return false;
					    }
					    // TODO 
					    // 
					    if (returnData && returnData["data"] && returnData["data"][0]) {
					    	var actionList = returnData.data[0]["actionList"];
					    	var columnList = returnData.data[0]["columnList"];
					    	var privilegeMap = returnData.data[0]["privilegeMap"];
					    	if (privilegeMap) {
					    		for (var key in privilegeMap) {
					    			${pageId}.data[key] = {'HAVE_PRIVILEGE':privilegeMap[key]['HAVE_PRIVILEGE']};
					    		}
					    	}
					    	var actionHtml = "<table width=\"100%\"><tr>";
					    	var tid = null;
					    	var idarr = [];
					    	var checkedStr = "";
					    	for (var i = 0; i < actionList.length; ++i) {
					    		if (i > 0 && i % 4 == 0) {
					    			actionHtml = actionHtml + "</tr><tr>";
					    		}
					    		if (actionList[i]["HAVE_PRIVILEGE"]) {
					    			if (actionList[i]["HAVE_PRIVILEGE"] == 1) {
					    				checkedStr = "checked";
					    			} else {
					    				checkedStr = "";
					    			}
					    		} else {
					    			checkedStr = functionCheckStatus;
					    		}
					    		tid = "${pageId }_" + groupId +"_" + functionId + "_actions_"+actionList[i]["PKEY"];
					    		idarr.push(tid);
					    		actionHtml = actionHtml + "<td nowrap><input id='" + tid
					    		+"' name='"+actionList[i]["PKEY"]+"' type=checkbox value='1' "+(actionList[i]["HAVE_PRIVILEGE"]==1?"checked":"") 
					    		+" /><label for='"+tid+"' >"+actionList[i]["RES_NAME"]+"</label></td>";
					    	}
					    	actionHtml = actionHtml + "</tr></table>";
					    	if (document.getElementById('${pageId }_div_actions_' + functionId)) {
								console.info(document.getElementById('${pageId }_div_actions_' + functionId).innerHTML);
								document.getElementById('${pageId }_div_actions_' + functionId).innerHTML = actionHtml;
					    	}
					    	var columnHtml = "<table width=\"100%\"><tr>";
					    	for (var i = 0; i < columnList.length; ++i) {
					    		if (i > 0 && i % 4 == 0) {
					    			columnHtml = columnHtml + "</tr><tr>";
					    		}
					    		tid = "${pageId }_" + groupId +"_" + functionId + "_columns_"+columnList[i]["PKEY"];
					    		idarr.push(tid);
					    		columnHtml = columnHtml + "<td nowrap><input id='" + tid
					    		+"' name='"+columnList[i]["PKEY"]+"' type=checkbox value='1' "+(columnList[i]["HAVE_PRIVILEGE"]==1?"checked":"") 
					    		+" /><label for='"+tid+"' >"+columnList[i]["RES_NAME"]+"</label></td>";
					    	}
					    	columnHtml = columnHtml + "</tr></table>";
					    	if (document.getElementById('${pageId }_div_columns_' + functionId)) {
								document.getElementById('${pageId }_div_columns_' + functionId).innerHTML = columnHtml;
					    	}
							/*
							$.each(idarr, function(index, id){
								console.info(document.getElementById(id));
								$("#" + id).change(function() {
									console.info($(this).val());
									cascadeSelect(this);
								});
							});
							*/
							$('input:checkbox').each(function(c){
								$(this).unbind('change');
								$(this).change(function() {
									cascadeSelect(this);
								});
							});
					    }
						${pageId}.expandedPanels[lid] = true;
						return true;
					  }
					});
				}
			}
	};
	
	function cascadeSelect(currentCheckBox) {
		$('input:checkbox').each(function(c) {
			if (this.id !=null && this.id != "") {
				if (this.id.indexOf(currentCheckBox.id+"_")>=0) {
					this.checked = currentCheckBox.checked;
				}
				if(currentCheckBox.id.indexOf(this.id+"_") == 0) {
					// console.info(this.id);
					if (currentCheckBox.checked) {
						this.checked = true;
					} else {
						// check if all slibing checkbox unchecked
					}
				}
			} 
		});
	}
	
	$(function() {
		$.parser.parse(${pageId}.getId('rightList'));
		$('input:checkbox').each(function(c){
			$(this).change(function() {
				cascadeSelect(this);
			});
		});
		<c:if test="${not empty openerId}">
			${openerId}.dialogs['${fwParam.openerActionId}'] = ${pageId};
			${pageId}.opener = ${openerId}; 
		</c:if>		
		
		<c:if test="${not empty view.onInit}">
		if (${pageId}['${view.onInit}']) {
		  ${pageId}['${view.onInit}'](${pageId}, $(${pageId}.getId("form")).serialize());
		}
		</c:if>

	});
</script>
</head>
<body id="${pageId}_body">
	<form id="${pageId}_formMain" name="formMain" action="list" method="post">
		<input type="hidden" id="${pageId}_project" name="fwCoord.project" value="${view.coord.project }" />
		<input type="hidden" id="${pageId}_function" name="fwCoord.function" value="${view.coord.function }" />
		<input type="hidden" id="${pageId}_view" name="fwCoord.view" value="${view.coord.view }" />
		<input type="hidden" id="${pageId}_lang" name="fwCoord.lang" value="${view.coord.lang }" />
		<input type="hidden" id="${pageId}_ui" name="fwCoord.ui" value="${view.coord.ui }" />
	
		<input type="hidden" id="${pageId}_sortName" name="fwParam.sortName" value="" />
		<input type="hidden" id="${pageId}_sortOrder" name="fwParam.sortOrder" value="" /> 
		<input type="hidden" id="${pageId}_totalRow" name="fwPage.totalRow" value="0" /> 
		<input type="hidden" id="${pageId}_pageSize" name="fwPage.pageSize" value="-1" /> 
		<input type="hidden" id="${pageId}_pageNumber" name="fwPage.pageNumber" value="1" />
		<input type="hidden" id="${pageId}_queryValue" name="fwParam.queryValue" value="" />
		
		<input type="hidden" id="${pageId}_roleId" name="ROLE_ID" value="${ROLE_ID }" />
		<div>
			<table style="margin: 10px">
				<tr>
					<td id="${pageId}_buttonArea" style="display:none">
<c:if test="${displayActions != null }">
<c:forEach var="act" items="${displayActions}" varStatus="status">
	<c:if test="${act.tag=='group' }">
		<c:if test="${act.id=='searchGrp' }">
			${act.children[0].label}: <input type="text" id="${pageId }_queryValue" name="fwParam.queryValue" value="" onkeyUp="if (event.keyCode==13) {${pageId }.${ act.children[0].click}(${pageId }, null, '${act.children[0].id}', null, event);}" />
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
		${act.label }: <input type="text" id="${pageId }_searchCondition" name="fwParam.queryValue" value="" onkeyUp="${pageId }.queryGridData()" />
	</c:if>
	<a class="easyui-linkbutton"  id="${pageId }_action_${act.id}" 
	iconCls="${act.icon }" 
	data-options="plain:true"
	onclick="javascript:${pageId}.${act.click }(${pageId}, null, '${act.id }', null, event)">${act.label }</a>
	</c:if>
</c:forEach>
</c:if>
</td>
</tr>
</table>
</form>
<form id="${pageId}_form" name="form" action="list" method="post">
<table width="95%">
	<tr>
		<td align="left">
			<div id="${pageId}_rightList">
<c:forEach var="group" items="${gotResource}" varStatus="status">
	<div id="${pageId }_div_${group.PKEY}" class="easyui-panel" 
	title="<input id='${pageId }_${group.PKEY}' name='${group.PKEY}' type=checkbox value='1' ${group.HAVE_PRIVILEGE=='1'?'checked':'' }/><label for='${pageId }_${group.PKEY}' >${group.RES_NAME}</label>"
	        style="width:100%;padding:10px;background:#fafafa;"
                data-options="iconCls:'fwicon-group',collapsible:true,collapsed:false">
		<c:forEach var="function" items="${group.children}" varStatus="funcStatus">
			<div id="${pageId }_div+${group.PKEY}+${function.PKEY}" class="easyui-panel" 
					title="<input id='${pageId }_${group.PKEY}_${function.PKEY}' name='${function.PKEY}' type=checkbox value='1' ${function.HAVE_PRIVILEGE=='1'?'checked':'' } /><label for='${pageId }_${group.PKEY}_${function.PKEY}' >${function.RES_NAME}</label>"
			        style="width:100%; height:0px; padding:${function.type=='url'?'0':'10' }px;background:#fafafa;"
		                data-options="iconCls:'fwicon-function'${function.type=='url'?'':',collapsible:true,collapsed:true'},onBeforeExpand:${pageId }.beforeFunctionExpand ">
		                <c:if test="${function.TYPE=='function'}">
		                	<div id="${pageId }_div_actions_${function.PKEY}" class="easyui-panel" 
		                	title="<input id='${pageId }_${group.PKEY}_${function.PKEY}_actions' name='actions.${function.PKEY}' type=checkbox value='1' ${function.HAVE_PRIVILEGE=='1'?'checked':'' } /><label for='${pageId }_${group.PKEY}_${function.PKEY}_actions' >操作</label>"
		                	style="width:100%; height:0px; padding:10px;background:#fafafa;"
		                	data-options="iconCls:'fwicon-action',collapsible:true,collapsed:false">
			                	<c:forEach var="action" items="${function.children}" varStatus="actionStatus">
			                		<c:if test="${actionStatus.first }">
			                			<table width="100%"><tr>
			                		</c:if>
			                		<c:if test="${!actionStatus.first && actionStatus.index%4==0}">
			                			</tr><tr>
			                		</c:if>
			                		<td nowrap>
			                			<input id='${pageId }_${group.PKEY}_${function.PKEY}_actions_${action.PKEY}' name='${action.PKEY}' type=checkbox value='1' ${action.HAVE_PRIVILEGE=='1'?'checked':'' } /><label for='${pageId }_${group.PKEY}_${function.PKEY}_actions_${action.PKEY}' >${action.RES_NAME}</label>
			                		</td>
			                		<c:if test="${actionStatus.last}">
			                			</tr></table>
			                		</c:if>
			                	</c:forEach>
		                	</div>
		                	<div id="${pageId }_div_columns_${function.PKEY}" class="easyui-panel" 
		                	title="<input id='${pageId }_${group.PKEY}_${function.PKEY}_columns' name='columns.${function.PKEY}' type=checkbox value='1' ${function.HAVE_PRIVILEGE=='1'?'checked':'' } /><label for='${pageId }_${group.PKEY}_${function.PKEY}_columns' >列</label>"
		                	style="width:100%; height:0px; padding:10px;background:#fafafa;"
		                	data-options="iconCls:'fwicon-columns',collapsible:true,collapsed:false">
			                	<c:forEach var="col" items="${function.children2}" varStatus="colStatus">
			                		<c:if test="${colStatus.first }">
			                			<table width="100%"><tr>
			                		</c:if>
			                		<c:if test="${!colStatus.first && colStatus.index%3==0}">
			                			</tr><tr>
			                		</c:if>
			                		<td nowrap>
			                			<input id='${pageId }_${group.PKEY}_${function.PKEY}_columns_${col.PKEY}' name='${col.PKEY}' type=checkbox value='1' ${col.HAVE_PRIVILEGE=='1'?'checked':'' } /><label for='${pageId }_${group.PKEY}_${function.PKEY}_columns_${col.PKEY}' >${col.RES_NAME}</label>
			                		</td>
			                		<c:if test="${colStatus.last}">
			                			</tr></table>
			                		</c:if>
			                	</c:forEach>
		                	</div>
		                	<div id="${pageId }_div_datalevel_${function.PKEY}" class="easyui-panel" 
		                	title="<input id='${pageId }_${group.PKEY}_${function.PKEY}_datalevel' name='datalevel.${function.PKEY}' type=checkbox value='1' /><label for='${pageId }_${group.PKEY}_${function.PKEY}_datalevel' >数据权限</label>"
		                	style="width:100%; height:0px; padding:10px;background:#fafafa;"
		                	data-options="iconCls:'fwicon-datalevel',collapsible:true,collapsed:false">
		                		<table width="100%">
		                		<tr>
			                	<c:forEach var="dl" items="${view.dictMap['DATA_LEVEL'].itemList}" varStatus="dlStatus">
			                		<c:if test="${not fn:contains(dl.value,'9')}">
										<td nowrap><input id='${pageId }_${group.PKEY}_${function.PKEY}_datalevel_${dl.value}' name='${function.PKEY}' type=checkbox value='${dl.value }' ${not empty function['DATA_LEVEL_MAP'][dl.value]?'checked':'' } /><label for='${pageId }_${group.PKEY}_${function.PKEY}_datalevel_${dl.value}' >${dl.label}</label>
									</c:if>
									</td>
									<c:if test="${fn:contains(dl.value,'9') && !dlStatus.last}">
									</tr><tr>
									</c:if>
			                	</c:forEach>
			                	</tr>
		                		</table>
		                	</div>
		                </c:if>
			</div>	
		</c:forEach>
	</div> 
</c:forEach>
			</div>
		</td>
	</tr>
</table>
		</div>
	</form>
</body>
<div id="${pageId}_dialogs" style="display : none"></div>
</html>
