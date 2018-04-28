<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ page trimDirectiveWhitespaces="true"%>
<%@page import="cn.got.platform.core.model.layout.*"%>
<%@page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>

<!DOCTYPE html>
<html lang="zh">
<head>
<title>${view.title }</title>
<%
  // loop all columns 
	FwView view = (FwView) request.getAttribute("view");
	List<FwGroup> groupList = view.getColumnGroups();
	Map<String, FwGroup> groupMap = new HashMap<String, FwGroup>();
	Map<String, List<FwColumn>> groupColumnsMap = new HashMap<String, List<FwColumn>>();
	if (groupList != null && groupList.size() > 0) {
	  for (FwGroup g : groupList) {
	    groupColumnsMap.put(g.getId(), new ArrayList<FwColumn>());
	    groupMap.put(g.getId(), g);
	  }
	  groupColumnsMap.put("", groupColumnsMap.get(groupList.get(0).getId()));
	  groupMap.put("", groupList.get(0));
	} else {
		groupColumnsMap.put("", new ArrayList<FwColumn>());
	}
	List<FwColumn> validColumns = new ArrayList<FwColumn>();
	List<FwColumn> hiddenColumns = new ArrayList<FwColumn>();
	String groupId = null;
	if (view.getColumns() != null) {
		for (FwColumn col : view.getColumns()) {
			if (col.getToView() && col.getVisible()) {
				validColumns.add(col);
				if (col.getGroup() == null || "".equals(col.getGroup()) || !groupMap.containsKey(col.getGroup())) {
				  groupId = "";
				} else {
				  groupId = col.getGroup();
				}
				groupColumnsMap.get(groupId).add(col);
			} else {
			    if (col.getToView() || col.isPk()) {
			  		hiddenColumns.add(col);
			    }
			}
		}
	}
	int columnCount = (validColumns.size() > 10?2:1);
	int width = 333 * columnCount;
	int height = 22 * validColumns.size() / columnCount + 195;
	request.setAttribute("validColumns", validColumns);
	request.setAttribute("hiddenColumns", hiddenColumns);
	request.setAttribute("columnCount", columnCount);
	request.setAttribute("width", width);
	request.setAttribute("height", height);
	
	request.setAttribute("groupMap", groupMap);
	request.setAttribute("groupColumnsMap", groupColumnsMap);

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
	    
	    getOtherToSaveData: function(data) {
	    	var view = ${pageId};
	    	view.mechineEndEditing();
	    	var cd = $(view.getId("datagrid")).datagrid("getRows");
	    	for (var i = 0; i < cd.length; ++i) {
	    	}
   			return true;
	    },
	    setOtherData: function(data) {
	    	// $(${pageId}.getId("tabs")).tabs("select", 0);
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
		
		bindEvents: function() {
		  var view = ${pageId};
		  console.info("bindEvents");
		  <c:forEach var="col" items="${validColumns}" varStatus="status">
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
		<c:if test="${not empty openerId}">
			${openerId}.dialogs['${fwParam.openerActionId}'] = ${pageId};
			${pageId}.opener = ${openerId}; 
		</c:if>
		$(${pageId}.getId('tabs')).accordion({});
    	<c:forEach var="group" items="${view.columnGroups }" varStatus="groupStatus">
			$.parser.parse(${pageId}.getId('${group.id}_inputPanel'));
		</c:forEach>
		<c:if test="${not empty view.onInit}">
		if (${pageId}['${view.onInit}']) {
		  ${pageId}['${view.onInit}'](${pageId}, $(${pageId}.getId("form")).serialize());
		}
		</c:if>
		var view = ${pageId};
		<c:forEach var="col" items="${validColumns}" varStatus="status">
		<c:if test="${not empty col.valueRef && col.multiSelect && col.ui != 'easyui-combotree'}">
		  	$('#${pageId}_${col.id}').combogrid('grid').datagrid({onLoadSuccess : function(data){
		  		// console.info($('#${pageId}_${col.id}').combo('getValues'));
          		}
		  	});
		</c:if>
		</c:forEach>
		// $(${pageId}.getId("datagrid")).datagrid('refresh');
		// eval('(' + String(${pageId}.combogridHandlers.demo).replace(/demo/g, 'justlike') +')')();
	});
</script>
</head>
<body>
	<c:if test="${showAsDialog != '1' }">
		<div id="${pageId}_titleDiv" class="formTitle">${view.title }</div>
	</c:if>
	<form id="${pageId}_form" name="editForm" method="post">
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
		<div id="${pageId}_tabs" class="easyui-accordion" style="width: 97%;"
			data-options="border:false">
		<c:forEach var="group" items="${view.columnGroups }"
			varStatus="groupStatus">
			<c:if
				test="${not empty groupColumnsMap[group.id] || group.id == 'deviceInfo'}">
				<div id="${pageId}_tab_${group.id}" title="${group.title }"
					data-options="border:false,collapsible:${groupStatus.count>1?'true':'true' },collapsed:${groupStatus.first?'false':'true'} ${not empty group.icon?',iconCls:':'' }${group.icon }"
					style="padding: 20px;">

					<table width="100%">
						<tr>
							<td align="center">
								<div id="${pageId}_${group.id}_inputPanel">
									<table id="${pageId}_formTable" width="85%">
										<tr class="trEdit">
											<c:set var="cellCount" value="${0}" />
											<c:forEach var="col" items="${groupColumnsMap[group.id]}"
												varStatus="status">
												<c:if
													test="${col.type == 'MEMO' && cellCount > 0 && cellCount % columnCount != 0}">
													<c:set var="loopCount" value="${0}" />
													<c:forEach var="skipCount" begin="${cellCount }"
														end="${cellCount + columnCount }">
														<c:if test="${skipCount % columnCount == 0 }">
															<c:set var="loopCount" value="${skipCount - cellCount }" />
														</c:if>
													</c:forEach>
													<c:forEach var="skip" begin="1" end="${loopCount }" varStatus="skipStatus">
														<td></td>
														<td></td>
														<td></td>
														<c:if test="${skipStatus.last }">
										</tr>
										<tr class="trEdit">
											</c:if>
											</c:forEach>
											<c:set var="cellCount" value="${skipCount }" />
											</c:if>
											<td width="10%" nowrap>${not empty col.label?col.label:col.field }:
											</td>
											<td nowrap width="${(col.type=='MEMO'?100:100/columnCount)-11 }%"
												colspan="${col.type=='MEMO'?(columnCount*3-2):1 }"><c:choose>
													<c:when test="${ col.ui == 'checkbox01'}">
														<input type="checkbox" id="${pageId }_${col.id }"
															name="${col.id }" ${col.editable?'':'disabled' }
															value="1" ui="${col.ui }" group="${group.id }" />
													</c:when>
													
													<c:when
														test="${not empty col.dictionary && not empty view.dictMap[col.dictionary]}">
														<select id="${pageId }_${col.id }" name="${col.id }"
															class="easyui-combobox" style="width: 100%;"
															validType="fwRemote[${pageId },'${col.id }','']"
															data-options="validateOnCreate:false,validateOnBlur:true,novalidate:true,required:${col.required },
												multiple:${col.multiSelect },
												readonly:${!col.editable },panelMinHeight:50, panelMaxHeight:100"
															ui="easyui-combobox" group="${group.id }">
															<c:forEach var="dictItem"
																items="${view.dictMap[col.dictionary].itemList }">
																<option value="${dictItem.value }">${dictItem.label
														}</option>
															</c:forEach>
														</select>
													</c:when>
													
													<c:when test="${col.ui == 'easyui-combotree' && not empty col.valueRef}">
														<select id="${pageId }_${col.id }" name="${col.id }"
															class="easyui-combotree"  style="width: 100%;"
															ui="easyui-combotree" group="${group.id }"
															data-options="url:'getTreeData?fwCoord.function=${col.valueRef.function }&fwCoord.view=${col.valueRef.view }&fwCoord.project=${view.coord.project }&fwCoord.lang=${view.coord.lang }&fwCoord.ui=${view.coord.ui }',
															onlyLeafCheck:true,
															method:'get'" ${col.multiSelect?'multiple':'' }></select>
													</c:when>
													
													<c:when
														test="${not empty col.valueRef }">
											<c:if test="${col.multiSelect }" >
												<div class="datagrid-toolbar" id="${pageId }_${col.id }_toolbar" style="width:100%;height:30px;">  
												        <table>  
												            <tr>  
												                <td>  
												                    <input  class="easyui-textbox" id="${pageId }_${col.id }_toolbar_queryText" name="${col.id }_queryText" data-options="buttonText:'检索',buttonIcon:'icon-search',width:200, 
												                    onClickButton:function() {
												                    	${pageId}.loadMultiCombogridData('${pageId }_${col.id }');
												                    }"/>  
												                </td>  
												                <td>  
												                    <div class="dialog-tool-separator"></div>  
												                </td>  
												                <td>  
												                    <a href="javascript:void(0)" class="easyui-linkbutton"  
												                       data-options="iconCls:'icon-no',plain:true, onClick:function() {var ctl = $('#${pageId }_${col.id }'); ctl.combo('clear');ctl.combogrid('setValues',[]);}" id="${pageId }_${col.id }_toolbar_clear">清空选择</a>  
												                </td>  
												            </tr>
												        </table>  
												    </div> 
											</c:if>
														<select id="${pageId }_${col.id }"
															class="easyui-combogrid" name="${col.id }"
															style="width: 100%;"
															validType="fwRemote[${pageId },'${col.id }','']"
															ui="easyui-combogrid" group="${group.id }"
															showColumn="${empty col.showColumn?col.valueRef.label:col.showColumn }"
															 ${col.multiSelect?'multiple':'' }
															data-options="
													<c:if test="${col.multiSelect }">
														editable:false,
														toolbar:'#${pageId }_${col.id }_toolbar',
									                    onSelect : function(rowIndex, rowData) {
									                    	var ctlId = '${pageId }_${col.id }';
									                    	var currentValues = $('#' + ctlId).combo('getValues');
									                    	var currentText = $('#' + ctlId).combo('getText');
									                    	console.info(currentValues);
									                    	var found = false;
									                    	for(var i = 0; i < currentValues.length; ++i) {
									                    		if (currentValues[i] == rowData['${col.valueRef.value}']) {
									                    			found = true;
									                    			break;
									                    		}
									                    	}
									                    	if (!found) {
									                    		currentValues.push(rowData['${col.valueRef.value}']);
									                    		currentText += (',' + rowData['${col.valueRef.label}']);
									                    		$('#' + ctlId).combogrid('setValues', currentValues);
									                    		$('#' + ctlId).combo('setText', currentText);
									                    	}
									                    	return false; 
									                    },
													</c:if>
													<c:if test="${!col.multiSelect }" >
									                    onSelect : function(rowIndex, rowData) {
									                    	<c:forEach var="orc" items="${ col.valueRef.otherRefColumns}" varStatus="orcStatus">
									                    		got.setFormValue($(${pageId }.getId('${orc}')), rowData, '${orc}');
									                    	</c:forEach>
									                    },
													</c:if>
										        	validateOnCreate:false,
										        	validateOnBlur:true,
										        	novalidate:true,
										            panelWidth:400,
										            panelHeight:300,
										            pagination : true,
										            pageSize : 10,
										            fitColumns : true,
										            striped : true,
										            fit : true,
										            pageList : [ 5, 10 ],
										            idField:'${col.valueRef.value }',
										            textField:'${col.valueRef.label }',
			                    					mode: 'remote',
			                    					delay: 800,
			                    					required : ${ col.required},
													multiple:${col.multiSelect },
			                    					readonly : ${!col.editable},
													url:'getRefData?fwCoord.function=${col.valueRef.function }&fwCoord.view=${col.valueRef.view }&fwCoord.project=${view.coord.project }&fwCoord.lang=${view.coord.lang }&fwCoord.ui=${view.coord.ui }',
										            columns:[[
										            	<c:forEach var="gc" items="${col.valueRef.refView.columns}" varStatus="gcStatus">
										            		<%-- 要使用的ID列数据必然显示到列表 --%>
										            		<c:if test="${gc.id == col.valueRef.value || gc.id == col.valueRef.label}">
										            			{ field: '${gc.field}', title: '${gc.label}', width: 150, sortable:true,resizable:true, hidden:${not empty gc.visible && !gc.visible}
																	<c:if test="${not empty gc.showColumn}">
																	, formatter: function(val,data,index){return data['${gc.showColumn}'];}
																	</c:if>
																},
										            		</c:if>
										            		<%-- 其它引用列也显示到列表 --%>
											            	<c:forEach var="orc" items="${ col.valueRef.otherRefColumns}" varStatus="orcStatus">
											            		<c:if test="${gc.id == orc }">
											            		{ field: '${gc.field}', title: '${gc.label}', width: 150, sortable:true,resizable:true, hidden:${not empty gc.visible && !gc.visible}
																	<c:if test="${not empty gc.showColumn}">
																	, formatter: function(val,data,index){return data['${gc.showColumn}'];}
																	</c:if>
																},
											            		</c:if>
											            	</c:forEach>
														</c:forEach>
										            ]],
										            onLoadSuccess : function(data) {
								                      if (${pageId }.data) {
								                        var exists = false;
								                        $.each(data.rows, function(key, rowData) {
								                                  if (rowData['${ col.valueRef.value}'] == ${pageId }.data['${ col.field}']) {
								                                    exists = true;
								                                  }
								                                });
								                        if (!exists) {
								                          var so = ${pageId }.data;
								                          so['${ col.valueRef.value}'] = ${pageId }.data['${col.field}'];
								                          so['${ col.valueRef.label}'] = ${pageId }.data['${col.showColumn}'];
								                          <c:forEach var="orc" items="${ col.valueRef.otherRefColumns}" varStatus="orcStatus">
								                          so['${ orc}'] = ${pageId }.data['${orc}'];
								                          </c:forEach>
								                          <%-- TODO 其它引用列值也显示到列表 --%>
								                          data.rows.splice(0, 0, so);
								                          $(${pageId }.getId('${ col.id}')).combogrid('grid').datagrid(
								                              'loadData', data);
								                        }
								                      }
								                    }
										        "></select>
													</c:when>
													
													<c:when test="${not empty col.showColumn}">
														<select id="${pageId }_${col.id }" name="${col.id }"
															class="easyui-combobox" style="width: 100%;"
															validType="fwRemote[${pageId },'${col.id }','']"
															showColumn="${col.showColumn }" ui="easyui-combobox"
															group="${group.id }"
															data-options="validateOnCreate:false,validateOnBlur:true,novalidate:true,required:${col.required },
												multiple:${col.multiSelect },
												editable:false, readonly:${!col.editable},valueField:'value',hasDownArrow:false,textField:'label',panelMinHeight:22, panelMaxHeight:22">
														</select>
													</c:when>
													
													<c:when test="${col.ui == 'easyui-datetimebox' }">
														<input type="text" id="${pageId }_${col.id }"
															placeholder="${col.prompt }" name="${col.id }"
															style="width: 100%;"
															validType="fwRemote[${pageId },'${col.id }','']"
															class="easyui-datetimebox"
															data-options="validateOnCreate:false,validateOnBlur:true,novalidate:true,required:${col.required },
												 readonly:${!col.editable }"
															ui="${col.ui }" group="${group.id }" />
													</c:when>
													<c:when test="${col.ui == 'easyui-datebox' }">
														<input type="text" id="${pageId }_${col.id }"
															placeholder="${col.prompt }" name="${col.id }"
															style="width: 100%;"
															validType="fwRemote[${pageId },'${col.id }','']"
															class="easyui-datebox"
															data-options="validateOnCreate:false,validateOnBlur:true,novalidate:true,required:${col.required },
												readonly:${!col.editable }"
															ui="${col.ui }" group="${group.id }" />
													</c:when>
													<c:otherwise>
														<input type="text" id="${pageId }_${col.id }"
															placeholder="${col.prompt }" name="${col.id }"
															style="width: 100%;" class="easyui-textbox"
															data-options="validateOnCreate:false,validateOnBlur:true,novalidate:true,required:${col.required },
												validType:[<c:if test="${col.type == 'STR' && col.size > 0 }">'length[0, ${col.size}]',</c:if>'fwRemote[${pageId },\'${col.id }\',\'\']'],
												readonly:${!col.editable }, prompt:'${col.prompt }',multiline:${col.type =='MEMO'?'true':'false'} ${col.type=='MEMO'?',height:50':''}"
															ui="easyui-textbox" group="${group.id }" />
													</c:otherwise>
												</c:choose></td>
											<td width="1%"><font color="#ff0000">${col.required?'*':'&nbsp;' }</font></td>
											<c:set var="cellCount"
												value="${cellCount+(col.type == 'MEMO'?columnCount:1) }" />
											<c:if
												test="${(cellCount)%columnCount==0 || col.type == 'MEMO'}">
										</tr>
										<tr class="trEdit">
											</c:if>
											</c:forEach>
										</tr>
									</table>
								<table width="99%">
									<tr>
										<td id="${pageId}_buttonArea" colspan="2" align="center"></td>
									</tr>
								</table>
								</div>
							</td>
						</tr>
					</table>
				</div>
			</c:if>
		</c:forEach>
		</div>
	</form>
</body>
<div id="${pageId}_dialogs" style="display: none"></div>
</html>
