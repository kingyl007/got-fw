<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ page trimDirectiveWhitespaces="true"%>
<%@page import="cn.got.platform.core.model.layout.*"%>
<%@page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<!DOCTYPE html>
<html lang="zh">
<head>
<title>${view.title }</title>
<%
  // loop all columns 
	FwView view = (FwView) request.getAttribute("view");
	List<FwColumn> validColumns = new ArrayList<FwColumn>();
	List<FwColumn> hiddenColumns = new ArrayList<FwColumn>();
	if (view.getColumns() != null) {
		for (FwColumn col : view.getColumns()) {
			if (col.getToView() && col.getVisible()) {
				validColumns.add(col);
			} else {
			    if (col.getToView() || col.isPk()) {
			  		hiddenColumns.add(col);
			    }
			}
		}
	}
	int columnCount = (validColumns.size() > 3?3:validColumns.size());
	int width = 333 * columnCount;
	int height = 22 * validColumns.size() / columnCount + 145;
	request.setAttribute("validColumns", validColumns);
	request.setAttribute("hiddenColumns", hiddenColumns);
	request.setAttribute("columnCount", columnCount);
	request.setAttribute("width", width);
	request.setAttribute("height", height);

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
	var ${pageId}={
	    <jsp:include page="../default_view_object.jsp" />
	    
	    loadMultiCombogridData : function(ctlId, doQuery) {
	    	var ctl = $('#' + ctlId);
	    	var pageOptions = ctl.combogrid('grid').datagrid('getPager').pagination('options');
			var localPageNumber = pageOptions.pageNumber;
			var localPageSize = pageOptions.pageSize;
			//if (typeof doQuery != 'undefined' && doQuery) {
	      	ctl.combogrid('grid').datagrid('load', 
	      		{q: $('#'+ctlId+'_toolbar_queryText').textbox('getText'),
	      		// page:localPageNumber,
	      		// rows:localPageSize,
	      		});  
			//}
	    },
	    
	    setOtherData : function(returnData) {
	    	var view = ${pageId};
	    	$(view.getId('workFlowComment')).textbox('setValue','');
	    	if (returnData['_FW_WF_HISTORY']) {
	    		$(view.getId('datagrid')).datagrid('loadData', returnData['_FW_WF_HISTORY']);
	    	}
	    	if (returnData['_FW_WF_WORKFLOW_ID']) {
	    		$(view.getId('diagram')).attr('src', 'getImage?type=bpmn&piid='+returnData['_FW_WF_WORKFLOW_ID']+'&fwCoord.project=' + $(view.getId('project')).val());
	    		$(view.getId('diagram')).attr('alt', '流程图');
	    	} else {
	    		$(view.getId('diagram')).attr('src', '');
	    	}
	    },
	    
		validate : function() {
			return true;
		},
		isValueInited: false,
		isColEventsBinded: false,
		setValueIniting: function(b) {
		  var view = ${pageId};
		  view.isValueInited = !b;
		  if (!b) {
		    // enable valid
		    got.doValidate(view, true);
		    if (!view.isColEventsBinded) {
	        	view.bindEvents();
	        	view.isColEventsBinded = true;
		    }
		  } else {
		    // disable valid
		    got.doValidate(view, false);
		  }
		},
		validErrorMap: {},
		
		combogridHandlers : {
			columnFormatter: function(val,data,index) {
				return data['#SHOWCOLUMN#']; 
			},
            onLoadSuccess : function(data) {
                if (${pageId}.data) {
                  var exists = false;
                  $.each(
                          data.rows,
                          function(key, rowData) {
                            if (rowData['#VALUEFIELD#'] == define.data['#ID#']) {
                              exists = true;
                            }
                          });
                  if (!exists) {
                    var so = {};
                    so['#VALUEFIELD#'] = define.data['#ID#'];
                    so['#LABELFIELD#'] = define.data['#SHOWCOLUMN#'];
                    data.rows.splice(0, 0, so);
                    $(${pageId}.getId('#ID#')).combogrid("grid").datagrid(
                        "loadData", data);
                  }
                }
              },
              onSelect : function(rowIndex, rowData) {
            	  var otherRefColumns = [];
                // TODO if have other refer value set same time
                  var selectMap = {};
                  $.each(otherRefColumns, function(key, val) {
                    selectMap[key] = rowData[val];
                  });
                  $.each(otherRefColumns, function(key, val) {
                	  got.setFormValue($(${pageId}.getId(key)), rowData, key);
                  });
              }
		},
			
		queryGridData: function() {
		},
		
		setDivValue: function(fe, returnData, k) {
			var text = returnData[k];
			if (fe.length > 0) {
				if (fe.attr('onFormat')) {
					text = ${pageId}[fe.attr('onFormat')](text, returnData, 0);
				} else if (fe.attr('dictionary')) {
					text = ${pageId}.dictMap[fe.attr('dictionary')][text];
				} else if (fe.attr('showColumn')) {
					var str = ''; 
					$.each(fe.attr('showColumn').split(','), function(i, s) {
						str += (returnData[s] +' ');
						});
					text = str;
				}
			}
			if (text == null) {
				text = "";
			}
			$(${pageId}.getId(k +"_DIV")).html('&nbsp;' + got.xssFilter(text));
		},
		
		bindEvents: function() {
		  var view = ${pageId};
		  console.info("bindEvents");
		  <c:forEach var="col" items="${validColumns}" varStatus="status">
		  try {
		  	
		  	<c:if test="${col.ui == 'ueditor'}">
			  	UE.getEditor('${pageId}_${col.id}').ready(function() {
			      if (${pageId}.data && ${pageId}.data['${pageId}_${col.id}']) {
			      	this.setContent(${pageId}.data['${pageId}_${col.id}']);
			      }
			  	});
		  	</c:if>
		  } catch (error) {
		  	
		  }
		  	<c:if test="${not empty col.onChange}" >
			  	<c:choose>
				<c:when test="${ col.ui == 'checkbox01'}">
					
				</c:when>
				<c:when test="${not empty col.dictionary && not empty view.dictMap[col.dictionary]}"> // easyui-combobox
				
				</c:when>
				<c:when test="${not empty col.showColumn && not empty col.valueRef }"> // easyui-combogrid
				
				</c:when>
				<c:when test="${not empty col.showColumn}">// easyui-combobox
				
				</c:when>
				<c:when test="${col.ui == 'easyui-datetimebox' }"> // easyui-datetimebox
				
				</c:when>
				<c:when test="${col.ui == 'easyui-datebox' }"> // easyui-datebox
				
				</c:when>
				<c:otherwise>// easyui-textbox
					$(view.getId('${col.id}')).textbox({onChange : function(newValue, oldValue) {if(${pageId}.isValueInited) ${pageId}.${col.onChange}(${pageId}, newValue, '${col.id}_change',0);}});
				console.info('${col.id}');
				</c:otherwise>
				</c:choose> 
			</c:if>
			<c:if test="${not empty col.onClick}">
				$($(view.getId('${col.id}')).textbox("textbox")).click(function(e) {${pageId}.${col.onClick}(${pageId}, null, '${col.id}_click', 0, e);});
			</c:if>
		  </c:forEach>
				console.info('click init');
		},
	};
	
	$(function() {
		var view = ${pageId};
		<c:if test="${not empty openerId}">
			${openerId}.dialogs['${fwParam.openerActionId}'] = view;
			view.opener = ${openerId}; 
		</c:if>
		// $.parser.parse(${pageId}.getId('inputPanel'));
		$(view.getId('inputPanel')).panel();
		$(view.getId('checkPanel')).panel();
		$(view.getId('checkHistoryPanel')).panel();
		$(view.getId('workFlowChartPanel')).panel();
		$(view.getId('workFlowComment')).textbox();
		

		$(view.getId("datagrid")).datagrid(
			{
				fitColumns : false,
				striped : true,
				rownumbers : true,
				autoRowHeight : false,
				columns : [ [
					{
						field : 'currentUserName',
						title : '审批人',
						width : 100,
						halign : 'center',
					},
					{
						field : 'time',
						title : '审批时间',
						width : 200,
						halign : 'center',
						formatter : function(val,data,index) {
							  var dateValue = got.toDate(val);
							  if (dateValue != null) {
							    if (dateValue.format) {
							      console.info("4");
							      return dateValue.format('yyyy-MM-dd hh:mm:ss');
							    }
							    return dateValue;
							  }
							  return "";
							},
					},
					{
						field : 'name',
						title : '步骤',
						width : 100,
						halign : 'center',
					}, 
					{
						field : 'statusName',
						title : '审批结果',
						width : 100,
						halign : 'center',
					}, 
					{
						field : 'memo',
						title : '备注',
						width : 200,
						halign : 'center',
					}, 
					] ],
			});
		<c:if test="${not empty view.onInit}">
		if (${pageId}['${view.onInit}']) {
		  ${pageId}['${view.onInit}'](${pageId}, $(${pageId}.getId("form")).serialize());
		}
		</c:if>
		<c:forEach var="col" items="${validColumns}" varStatus="status">
		<c:if test="${not empty col.valueRef && col.multiSelect && col.ui == 'easyui-combogrid'}">
		  	$('#${pageId}_${col.id}').combogrid('grid').datagrid({onLoadSuccess : function(data){
		  		// console.info($('#${pageId}_${col.id}').combo('getValues'));
          		}
		  	});
		</c:if>
		</c:forEach>
		// eval('(' + String(${pageId}.combogridHandlers.demo).replace(/demo/g, 'justlike') +')')();
	});
</script>
</head>
<body>
	<c:if test="${showAsDialog != '1' }">
		<div id="${pageId}_titleDiv" class="formTitle">${view.title }</div>
	</c:if>
	<form id="${pageId}_form" name="detailForm" method="post">
		<input type="hidden" id="${pageId}_project" name="fwCoord.project" value="${view.coord.project }" /> 
		<input type="hidden" id="${pageId}_function" name="fwCoord.function" value="${view.coord.function }" /> 
		<input type="hidden" id="${pageId}_view" name="fwCoord.view" value="${view.coord.view }" />
		<input type="hidden" id="${pageId}_lang" name="fwCoord.lang" value="${view.coord.lang }" /> 
		<input type="hidden" id="${pageId}_ui" name="fwCoord.ui" value="${view.coord.ui }" /> 

		<input type="hidden" id="${pageId}_openerFunction" name="fwParam.openerFunction" value="${fwParam.openerFunction }" />
		<input type="hidden" id="${pageId}_openerView" name="fwParam.openerView" value="${fwParam.openerView }" /> 
		<input type="hidden" id="${pageId}_openerActionId" name="fwParam.openerActionId" value="${fwParam.openerActionId }" />

		<c:forEach var="col" items="${hiddenColumns }">
			<input type="hidden" id="${pageId}_${col.id}" name="${col.id }" ui="hidden" value="" />
		</c:forEach>
		<table width="99%">
			<tr>
				<td align="center">
					<div id="${pageId}_inputPanel"class="easyui-panel" style="height:150px;padding:10px;"   
        				data-options="collapsible:true">   
						<table id="${pageId}_formTable" width="99%" cellspacing="0">
							<tr class="trEdit">
								<c:set var="cellCount" value="${0}" />
								<c:forEach var="col" items="${validColumns}" varStatus="status">
									<c:if test="${col.type == 'MEMO' && cellCount > 0 && cellCount % columnCount != 0}">
										<c:set var="loopCount" value="${0}" />
										<c:forEach var="skipCount" begin="${cellCount }" end="${cellCount + columnCount }">
											<c:if test="${skipCount % columnCount == 0 }">
												<c:set var="loopCount" value="${skipCount - cellCount }" />
											</c:if>
										</c:forEach>
										<c:forEach var="skip" begin="1" end="${loopCount }" varStatus="skipStatus">
											<td></td><td></td><td></td>
											<c:if test="${skipStatus.last }">
												</tr><tr class="trEdit">
											</c:if>
										</c:forEach>
										<c:set var="cellCount" value="${skipCount }" />
									</c:if>
									<td width="10%" class="tdEdit datagrid-row-alt" nowrap>${not empty col.label?col.label:col.field }:
									</td>
									<td nowrap width="<fmt:formatNumber value="${(col.type=='MEMO'?100:100/columnCount)-11 }" pattern="0"/>%" colspan="${col.type=='MEMO'?(columnCount*3-2):1 }"><c:choose>
											<c:when test="${ col.ui == 'checkbox01'}">
												<input type="checkbox" id="${pageId }_${col.id }"
													name="${col.id }" ${col.editable?'':'disabled' }
													value="1" ui="${col.ui }" />
											</c:when>
											<c:otherwise>
												<input type="hidden" id="${pageId}_${col.id}" name="${col.id }" ui="hidden" value="" />
												<div id="${pageId}_${col.id}_DIV" onFormat="${col.onFormat }" dictionary="${col.dictionary }" showColumn="${col.showColumn }"></div>
											</c:otherwise>
										</c:choose></td><td width="1%"><font color="#ff0000"></font></td>
										<c:set var="cellCount" value="${cellCount+(col.type == 'MEMO'?columnCount:1) }" />
									<c:if test="${(cellCount)%columnCount==0 || col.type == 'MEMO'}">
										</tr>
										<tr class="trEdit">
									</c:if>
								</c:forEach>
							</tr>
						</table>
					</div>
						</td>
						</tr>
						<c:if test="${not empty function.workFlowDefine }" >
						<tr>
						<td>
						<div id="${pageId}_checkPanel"class="easyui-panel" title="审批" style="height:100px;padding:5px;"   
        				data-options="collapsible:true">
        				<table height="100%" width="100%">
        				<tr>
        				<td nowrap="nowrap">审核意见:</td>
        				<td width="100%"><input type="text" style="width:0px; display:none;"/>
        					<input class="easyui-textbox" id="${pageId }_workFlowComment" name="fwParam.workFlowComment" data-options="multiline:true,width:${width-30 },height:60" style="width: 100%;height: 100%"> 
        					</input>
        				</td>
        				</tr>
        				</table>
        				</div>
						</td>
						</tr>
						<tr>
						<td>
						<div id="${pageId}_checkHistoryPanel"class="easyui-panel" title="审批历史" style="height:200px;padding:10px;"   
	        				data-options="collapsible:true,collapsed:false">
							<table id="${pageId}_datagrid" width="100%">
								<tbody id="${pageId}_dataArea" width="100%">
								</tbody>
							</table>
						</div>
						</td>
						</tr>
						<tr>
						<td>
						<div id="${pageId}_workFlowChartPanel"class="easyui-panel" title="审批流程图" style="height:300px;padding:10px;"   
        				data-options="collapsible:true,collapsed:true">
        				<image id="${pageId }_diagram" src="" alt="" width="100%" height="100%"/>
        				</div>
						</td>
						</tr>
						</c:if>
						<tr>
							<td id="${pageId}_buttonArea" align="center">
							<c:if test="${showAsDialog != '1'}">
<c:forEach var="act" items="${view.actions}" varStatus="status">
	<c:if test="${act.visible }">
	<a class="easyui-linkbutton"  id="${pageId }_action_${act.id}" 
	iconCls="${act.icon }" 
	data-options="plain:false"
	href="javascript:${pageId}.${act.click }(${pageId}, null, '${act.id }', null, event)">${act.label }</a>
	</c:if>
</c:forEach>
							</c:if>
							</td>
						</tr>
				</td>
			</tr>
		</table>
	</form>
</body>
<div id="${pageId}_dialogs" style="display: none"></div>
</html>
