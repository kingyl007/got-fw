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
	  		
  		getTree: function() {
  		  return $(${pageId}.getId("tree"));
  		},
	    treeData: [
<c:forEach var="group" items="${gotResource}" varStatus="status">
	{id:'${pageId }_div_${group.PKEY}', 
		text:'${group.RES_NAME}',
		iconCls:'fwicon-group',
		state:'open',
		checked: ${group.HAVE_PRIVILEGE=='1'}, 
		attributes:{type:'GROUP', pkey: '${group.PKEY}'},
		children: [
			<c:forEach var="function" items="${group.children}" varStatus="funcStatus">
				{id:'${pageId }_div+${group.PKEY}+${function.PKEY}',
					text: '${function.RES_NAME}',
					iconCls:'fwicon-function',
					state:'${function.type=='url'?'open':'closed'}',
					checked: ${function.HAVE_PRIVILEGE=='1'},
					attributes:{type:'FUNCTION', pkey: '${function.PKEY}'},
					<c:if test="${function.TYPE != 'url'}">
					children: [
						{id:'${pageId }_div_actions_${function.PKEY}',
							text: '操作',
							iconCls:'fwicon-action',
							state:'open',
							checked: ${function.HAVE_PRIVILEGE=='1'},
							attributes:{type:'ACTIONS', pkey: '${function.PKEY}'},
							/*
							children: [
								// actions
								<c:forEach var="action" items="${function.children}" varStatus="actionStatus">
								
								</c:forEach>
							]
							*/
						},
						{id:'${pageId }_div_columns_${function.PKEY}',
							text: '列',
							iconCls:'fwicon-column',
							state:'open',
							checked: ${function.HAVE_PRIVILEGE=='1'},
							attributes:{type:'COLUMNS', pkey: '${function.PKEY}'},
							/*
							children: [
								// columns
								<c:forEach var="col" items="${function.children2}" varStatus="colStatus">
								
								</c:forEach>
							]
							*/
						},
						<c:if test="${function.HAVE_CUST_COL == '1' || function.HAVE_DEPT_COL == '1' || function.HAVE_OWNER_COL == '1' }">
							{id:'${pageId }_div_datalevel_${function.PKEY}',
								text: '数据权限',
								iconCls:'fwicon-datalevel',
								state:'open',
								checked: ${function.HAVE_PRIVILEGE=='1'},
								attributes:{type:'DATALEVELS', pkey: '${function.PKEY}'},
								children: [
									// datalevel
									<c:forEach var="dl" items="${view.dictMap['DATA_LEVEL'].itemList}" varStatus="dlStatus">
					              		<c:if test="${dl.value < 1 || (function.HAVE_CUST_COL == '1' && dl.value > 0 && dl.value < 9) || (function.HAVE_DEPT_COL == '1' && dl.value > 10 && dl.value < 19) || (function.HAVE_OWNER_COL == '1' && dl.value > 20 && dl.value < 29)}">
				      						{id:'${pageId }_${group.PKEY}_${function.PKEY}_datalevel_${dl.value}',
				      							text: '${dl.label}',
				      							iconCls:'fwicon-datalevel',
				      							state:'open',
				      							checked: ${(function['DATA_LEVEL_MAP'][dl.value]=='1')},
				    							attributes:{type:'DATALEVEL', pkey: '${function.PKEY}', value: '${dl.value}'},
				      						},
										</c:if>
										<c:if test="${fn:contains(dl.value,'9') && !dlStatus.last}">
										
										</c:if>
					              	</c:forEach>
								]
							},
						</c:if>
					],
					</c:if>
					// 
				},
			</c:forEach>
	    ]
	},
</c:forEach>
		],
		
		data : {
			<c:forEach var="item" items="${functionMap}" varStatus="status">
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
		
		getOldSelectedData: function() {
			return ${pageId}.data;
		},
		
		getNewSelectedData: function() {
			var newData = {};
			$('input:checkbox').each(function(c) {
				if (this.id && this.id.indexOf(${pageId}.id) == 0) {
					if (this.name.indexOf("actions.") == 0 || this.name.indexOf("columns.") == 0 || this.name.indexOf("datalevel.") == 0) {
						return true;
					}
					if (newData[this.name] == null) {
						newData[this.name] = {};
					}
					if (this.id.indexOf('_datalevel_') >= 0) {
						if (this.checked) {
							if (newData[this.name]['DATA_LEVEL']) {
								newData[this.name]['DATA_LEVEL'] = newData[this.name]['DATA_LEVEL'] + "," + this.value;
							} else {
								newData[this.name]['DATA_LEVEL'] = this.value;
							}
						}
					} else {
						newData[this.name]['HAVE_PRIVILEGE'] = (this.checked ? '1' : '0');
					}
				}
			});
			return newData;
		},
		expandedPanels : {},
		realCheckBox : {},
			
		beforeFunctionExpand : function(node) {
				if (node.attributes && node.attributes['loaded']) {
					return true;
				} else {
					console.info(node.id);
					console.info(node.children);
					var lid = node.id;
					var idparts = lid.split('+');
					if (idparts.length > 2) {
						var groupId = idparts[idparts.length - 2];
						var functionId = idparts[idparts.length - 1];
						var postData = ${pageId}.buildFormDataObject(${pageId}, null);
						postData['fwParam.selectedData'] = {PKEY:functionId, ROLE_ID:$(${pageId}.getId('roleId')).val()};
						showLoading();
						got.ajax({
						  cache : true,
						  type : "POST",
						  url : "getSelectData",
						  dataType : "json",
						  data : postData,
						  async : true,
						  error : function(res, ts, e) {
							hideLoading();
						    alert("数据加载错误:" + ts);
						    return false;
						  },
						  success : function(returnData) {
							hideLoading();
						    if (returnData == null) {
						    	$.messager.alert('提示','数据加载错误');
						      return false;
						    }
						    // TODO 
						    // 
						    if (returnData && returnData["data"] && returnData["data"][0]) {
								var functionCheckStatus = node.checked; //"";
						    	var actionList = returnData.data[0]["actionList"];
						    	var columnList = returnData.data[0]["columnList"];
								var actionNodeList = [];
								var columnNodeList = [];
								var lnode = null;
								var checkedStatus = false;
						    	if (actionList != null && actionList.length > 0) {
						    		for (var i = 0; i < actionList.length; ++i) {
							    		if (actionList[i]["HAVE_PRIVILEGE"]) {
							    			if (actionList[i]["HAVE_PRIVILEGE"] == 1) {
							    				checkedStatus = true;
							    			} else {
							    				checkedStatus = false;
							    			}
							    		} else {
							    			checkedStatus = functionCheckStatus;
							    		}
							    		
						    			lnode = {id:"${pageId }_" + groupId +"_" + functionId + "_actions_"+actionList[i]["PKEY"],
						    					text:actionList[i]["RES_NAME"],
						    					iconCls:(actionList[i]["RES_ICON"]?actionList[i]["RES_ICON"]:'fwicon-action'),
						    					checked:checkedStatus,
						    					attributes:{type:'ACTION', pkey:actionList[i]["PKEY"]},
						    					};
						    			actionNodeList.push(lnode);
						    		}
						    		// node.children[0].children = actionNodeList;
						    		var actionsNode = ${pageId}.getTree().tree('find', idparts[0] +'_actions_' + functionId);
						    		${pageId}.getTree().tree('append', {parent:actionsNode.target, data:actionNodeList});
							    } else {
									// delete node.children[0].children;
							    }
						    if (columnList != null && columnList.length > 0) {
					    		for (var i = 0; i < columnList.length; ++i) {
						    		if (columnList[i]["HAVE_PRIVILEGE"]) {
						    			if (columnList[i]["HAVE_PRIVILEGE"] == 1) {
						    				checkedStatus = true;
						    			} else {
						    				checkedStatus = false;
						    			}
						    		} else {
						    			checkedStatus = functionCheckStatus;
						    		}
						    		
					    			lnode = {id:"${pageId }_" + groupId +"_" + functionId + "_columns_"+columnList[i]["PKEY"],
					    					text:columnList[i]["RES_NAME"],
					    					iconCls:(columnList[i]["RES_ICON"]?columnList[i]["RES_ICON"]:'fwicon-column'),
					    					checked:checkedStatus,
					    					attributes:{type:'COLUMN', pkey:columnList[i]["PKEY"]},
					    					};
					    			columnNodeList.push(lnode);
					    		}
					    		// node.children[1].children = columnNodeList;
						    	var columnsNode = ${pageId}.getTree().tree('find', idparts[0] +'_columns_' + functionId);
					    		${pageId}.getTree().tree('append', {parent: columnsNode.target, data: columnNodeList});
						    } else {
						    	// delete node.children[1].children;
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
								var functionCheckBox = null;
								$('input:checkbox').each(function(i, c){
									if (c.id == '${pageId}_' + groupId +"_" + functionId) {
										functionCheckBox = c;
									}
									$(c).unbind('change');
									$(c).change(function() {
										${pageId}.realCheckBox[this.id] = this;
										cascadeSelect(this);
									});
								});
								/*
								if (functionCheckBox) {
									$(functionCheckBox).change();
								}
								*/
						    }
						    if (!node.attributes) {
						    	node.attributes = {};
						    }
							node.attributes['loaded'] = true;
							return true;
						  }
						});
					}
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
	  	var define = ${pageId};
	  	$(define.getId('tree')).tree({
	  		checkbox:true, 
	  		onBeforeExpand: define.beforeFunctionExpand,
	  		data: define.treeData});
	  	/*
		$(define.geteid("tree")).tree({
		  url: '../fwright/getEasyuiRightData',
		  queryParams:  cxfw2.buildDefinePostObject(define, false),
		  checkbox : true,
		  cascadeCheck : true,
		  onSelect: function(node) {
		    $(define.geteid("treeSelectedId")).val(node.id);
		    },
		  formatter : function(node) {return '<table><tr><td width=200>' + node.text +'</td><td nowrap><input type="checkbox">本人 <input type="checkbox">下级 <input type="checkbox">本部门 <input type="checkbox">下级部门 <input type="checkbox">本工作组 <input type="checkbox">本客户 <input type="checkbox">下级客户 </td></tr></table>'},
		});
		
		$(define.geteid("tempTree")).tree({
		  data: [{text: 'Search Result'}],
		});		
		<c:if test="${not empty view.onInit}">
		if (${pageId}['${view.onInit}']) {
		  ${pageId}['${view.onInit}'](${pageId}, $(${pageId}.getId("form")).serialize());
		}
		</c:if>
		*/
		<c:if test="${not empty openerId}">
			${openerId}.dialogs['${fwParam.openerActionId}'] = ${pageId};
			${pageId}.opener = ${openerId}; 
		</c:if>		
		
		<c:if test="${not empty view.onInit}">
		if (${pageId}['${view.onInit}']) {
		  ${pageId}['${view.onInit}'](${pageId}, $(${pageId}.getId("form")).serialize());
		}
		</c:if>

		// cxfw2.buildAllButtons(define, "buttonArea");
		// define.loadData();
	});
</script>
</head>
<body id="${pageId}_body">
	<form id="${pageId}_form" name="form" action="list" method="post">
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
		<input type="hidden" id="${pageId}_treeSelectedId" name="fwParam.selectedData" value="" /> 
		<input type="hidden" id="${pageId}_roleId" name="ROLE_ID" value="${ROLE_ID }" />
	<div>
		<table style="margin: 10px">
			<tr>
				<td id="${pageId}_buttonArea"></td>
			</tr>
		</table>
		<div class="easyui-panel" data-options="height : 400">
			<div id="${pageId}_tree"  class="easyui-tree"/>
		</div>
		<!-- 
		<div id="${pageId}_tempTree"  class="easyui-tree" style="display: none;"/>
		 -->
	</div>
	</form>
<form id="${pageId}_dataForm" name="dataForm" action="list" method="post">
<input type="hidden" id="${pageId}_roleId" name="ROLE_ID" value="${ROLE_ID }" />
</form>
</body>
<div id="${pageId}_dialogs" style="display : none"></div>
</html>
