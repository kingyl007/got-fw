<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@page import="cn.got.platform.core.model.layout.*"%>
<%@page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>

<!DOCTYPE html>
<html lang="zh">
<head>
<title>${not empty view.title?view.title:function.title}</title>
<%
FwView view = (FwView) request.getAttribute("view");
if (view != null) {
	Map<String, FwGroup> groupMap = new HashMap<String, FwGroup>();
	List<FwGroup> actionGroups = view.getActionGroups();
	if (actionGroups != null) {
		for (FwGroup fg : actionGroups) {
			groupMap.put(fg.getId(), fg);
		}
	}
	Map<String, FwGroup> otherGroupMap = new HashMap<String, FwGroup>();
	List<Object> treeActions = new ArrayList<Object>();
	List<Object> finalActions = new ArrayList<Object>();
	List<Object> targetActionsList = null;
	List<FwAction> actions = view.getActions();
	FwGroup group = null;
	if (actions != null) {
		for (FwAction act : actions) {
			if (act.getVisible()) {
				if (act.getGroup() != null
						&& !"".equals(act.getGroup())) {
					group = groupMap.get(act.getGroup());
					if (group != null) {
						group.addChild(act);
						if (group.getId().startsWith("tree")) {
						  targetActionsList = treeActions;
						} else {
						  targetActionsList = finalActions;
						}
						if (!targetActionsList.contains(group)) {
						  targetActionsList.add(group);
						}
					} else {
					  if ("tree".equals(act.getGroup())) {
					    treeActions.add(act);
					  } else if ("grid".equals(act.getGroup())) {
					    finalActions.add(act);
					  } else {
						group = otherGroupMap.get(act.getGroup());
						if (group == null) {
							group = new FwGroup();
							group.setId(act.getGroup());
							otherGroupMap
									.put(act.getGroup(), group);
						}
						group.addChild(act);
					  }
					}
				} else {
					finalActions.add(act);
				}
			}
		}
		List<List<Object>> filterList = new ArrayList<List<Object>>();
		filterList.add(treeActions);
		filterList.add(finalActions);
		for (List<Object> list : filterList) {
			for (int i = 0; i < list.size(); ++i) {
				if (list.get(i) instanceof FwGroup) {
					group = (FwGroup)(list.get(i));
					if (group.getChildren().size() == 1) {
					  list.remove(i);
					  list.add(i, group.getChildren().get(0));
					}
				}
			}
		}
	}
	request.setAttribute("treeActions", treeActions);
	request.setAttribute("displayActions", finalActions);
	request.setAttribute("otherActions", otherGroupMap);
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

	    buildTreeFormDataObject: function(view, newViewName) {
	    	var obj = {
	    		'fwCoord.project' : $(view.getId("treeProject")).val(),
	    		'fwCoord.function' : $(view.getId("treeFunction")).val(),
	    		'fwCoord.view' : (newViewName ? newViewName : $(view.getId("treeView")).val()),
	    		'fwCoord.lang' : $(view.getId("treeLang")).val(),
	    		'fwCoord.ui' : $(view.getId("treeUi")).val(),
	    		
	    		'fwParam.openerId' : '${openerId}',
	    		'fwParam.openerFunction' : $(view.getId("openerFunction")).val(),
	    		'fwParam.openerView' : $(view.getId("openerView")).val(),
	    		'fwParam.openerActionId' : $(view.getId("openerActionId")).val(),
	    		'fwParam.openerSelectedData' : view.openerSelectedData,
	    	}
	    	
	    	return obj;
	    },
	    treeIdField: '${not empty view.argument?view.argument.map['treeIdField']:''}',
	    treeLabelField: '${not empty view.argument?view.argument.map['treeLabelField']:''}',
	    treeParentIdField: '${not empty view.argument?view.argument.map['treeParentIdField']:''}',
	    
	    treeClosedIconCls: '${not empty view.argument?view.argument.map['treeClosedIconCls']:''}',
	    treeOpenedIconCls: '${not empty view.argument?view.argument.map['treeOpenedIconCls']:''}',
	    treeLeafIconCls: '${not empty view.argument?view.argument.map['treeLeafIconCls']:''}',
	    treeCanAddRoot : ${((not empty view.argument) and (not empty view.argument.map['treeCanAddRoot']))?view.argument.map['treeCanAddRoot']:'true'},
	    getTree : function() {
	    	return $(${pageId}.getId("tree"));
	    },
		searchStatus: {
		  queryValue : null,
		  inSearching : false,
		  resultList : null,
		  index : 0,
		},
		selectNode : function(view) {
		  var currentIndex = view.searchStatus.index;
		  // var currentIndex = preIndex + 1;
		  if (currentIndex >= view.searchStatus.resultList.length) {
		    currentIndex = 0;
		  }
		  console.info('to select ' + currentIndex);
		  console.info(view.searchStatus.resultList[currentIndex]);
		  if (currentIndex >=0 && currentIndex < view.searchStatus.resultList.length) {
		    // var preItem = view.searchStatus.resultList[preIndex];
		    var item = view.searchStatus.resultList[currentIndex];
		    var toExpandItem  = item;
		    if (item["TARGET"]) {
		      var targetNode = view.getTree().tree("find", item["id"]);
		      if (targetNode && targetNode.target) {
		        // view.getTree().tree("expandTo", targetNode.target);
		        view.getTree().tree("select", targetNode.target);
		        view.getTree().tree("scrollTo", targetNode.target);
		        view.searchStatus.index +=1;
		        view.searchStatus.inSearching = false;
		        return;
		      } else {
		        var preIndex = currentIndex -1;
		        if (preIndex < 0) {
		          preIndex = 0;
		        }
		        toExpandItem = view.searchStatus.resultList[preIndex];
		        view.searchStatus.index -=1;
		      }
		    }
		    targetNode = view.getTree().tree("find", toExpandItem["id"]);
		    if (targetNode && targetNode.target) {
		      if (targetNode.state != 'open') {
		      view.searchStatus.inSearching = true;
//		      view.searchStatus.index = currentIndex;
	            view.searchStatus.index += 1;
		        if (view.searchStatus.index >= view.searchStatus.resultList.length) {
		          view.searchStatus.index = 0;
		          view.searchStatus.inSearching = false;
		        } else {
			        view.searchStatus.inSearching = true;
			      	view.getTree().tree("expand", targetNode.target);
		        }
		      return;
		      } else {
		        view.searchStatus.index += 1;
		        view.selectNode(view);
		      }
		    }
		  }
		},
			
		queryTreeData : function() {
	  		<c:if test="${not empty view.onQuery}">
			if (this['${view.onQuery}']) {
				this['${view.onQuery}'](this, $(this.getId("treeForm")).serialize());
			}
			</c:if>
		},
		queryGridData: function() {
  		<c:if test="${not empty view.onQuery}">
			if (this['${view.onQuery}']) {
				this['${view.onQuery}'](this, $(this.getId("form")).serialize());
			}
			</c:if>
		},
		
		getGrid: function() {
		  return $(${pageId}.getId("datagrid"));
		},
		
		getPagination: function() {
		  return $(${pageId}.getId("pagination"));
		},
		
	};
	$(function() {
		$(${pageId}.getId("treeButtonArea")).toggle();
		${pageId}.getTree().tree({
			  url: 'getTreeData',
			  queryParams:  ${pageId}.buildTreeFormDataObject(${pageId}, null),
			  onSelect: function(node) {
			    	$(${pageId}.getId("treeSelectedId")).val(node.id);
			    	${pageId}.queryGridData();
			    },
			  onLoadSuccess: function(node, data) {
		          if (${pageId}.searchStatus.inSearching) {
		            ${pageId}.selectNode(${pageId});
		          }
		        },
		        onExpand : function(node) {
		        }
			});		
		<c:if test="${not empty view.onInit}">
		if (${pageId}['${view.onInit}']) {
		  ${pageId}['${view.onInit}'](${pageId}, $(${pageId}.getId("form")).serialize());
		}
		</c:if>

		// ${pageId}.queryTreeData();
	});
	

	$(function() {
		<c:if test="${not empty openerId}">
			${openerId}.dialogs['${fwParam.openerActionId}'] = ${pageId};
			${pageId}.opener = ${openerId}; 
		</c:if>
		$(${pageId}.getId("datagrid")).datagrid(
			{
		        fitColumns : false,
		        striped : true,
		        rownumbers : true,
		        autoRowHeight : false,
				title : "",
				sortName : $(${pageId}.getId("sortName")).val(),
				sortOrder : $(${pageId}.getId("sortOrder")).val(),
				columns : [[ 
	            { field: 'ck', checkbox: true }
<c:if test="${view.columns != null }">
<c:forEach var="instance" items="${view.columns}" varStatus="status">
<c:if test="${instance.toView || instance.pk}" >
	,{ field: '${instance.id}', title: '${instance.label}'
	  	, width: ${(not empty instance.width && instance.width > 0)?instance.width:'150'}
		, sortable: true,resizable : true, toUser: ${instance.toUser}
		, hidden:${!instance.visible}
		<c:choose>
			<c:when test="${not empty instance.onFormat}">
				
				, formatter: ${pageId}.${instance.onFormat}
			</c:when>
			<c:when test="${not empty instance.dictionary}">
				, formatter: function(val,data,index){return got.xssFilter(${pageId}.dictMap['${instance.dictionary}'][val]);}
			</c:when>
			<c:when test="${not empty instance.showColumn}">
				, formatter: function(val,data,index){return got.xssFilter(data['${instance.showColumn}']);}
			</c:when>
			<c:when test="${instance.id == '_FW_ACTIONS'}">
				, sortable:false
			</c:when>
			<c:otherwise>
				, formatter: function(val,data,index){return got.xssFilter(val);}
			</c:otherwise>
		</c:choose>
	}
</c:if>
</c:forEach>
</c:if>
				           ]],
				onSortColumn : function(sort, order) {
					$(${pageId}.getId("sortName")).val(sort);
					$(${pageId}.getId("sortOrder")).val(order);
					${pageId}.queryGridData();
				},
			});
		$(${pageId}.getId("pagination")).pagination({
			total : parseInt($(${pageId}.getId("totalRow")).val()),
			pageSize : parseInt($(${pageId}.getId("pageSize")).val()),
			pageNumber : parseInt($(${pageId}.getId("pageNumber")).val()),
			showPageList : true,
			showRefresh : true,
			onSelectPage : function(pageNumber, pageSize) {
				$(${pageId}.getId("pageNumber")).val(pageNumber);
				$(${pageId}.getId("pageSize")).val(pageSize);
				${pageId}.queryGridData();
			},
			onChangePageSize : function(pageSize) {
			  $(${pageId}.getId("pageSize")).val(pageSize);
			}
		});
		$(${pageId}.getId("gridButtonArea")).toggle();
		$(${pageId}.getId("datagrid")).datagrid("columnMoving");
		
		<c:if test="${not empty view.onInit}">
		if (${pageId}['${view.onInit}']) {
		  ${pageId}['${view.onInit}'](${pageId}, $(${pageId}.getId("form")).serialize());
		}
		</c:if>

		${pageId}.queryGridData();
		
		// cxfw2.buildAllButtons(define, "buttonArea");
		// if (!define.isDialog) {
		// 	define.loadData();
		// }
	});
</script>
</head>
<body id="${pageId}_body" class="easyui-layout">
	
    <div data-options="region:'west',title:'${view.treeTitle }',split:true" style="width:20%;">
	<form id="${pageId}_treeForm" name="treeForm" method="post">
		<input type="hidden" id="${pageId}_treeProject" name="fwCoord.project" value="${view.coord.project }" /> 
		<input type="hidden" id="${pageId}_treeFunction" name="fwCoord.function" value="${view.argument.map['treeFunction'] }" /> 
		<input type="hidden" id="${pageId}_treeView" name="fwCoord.view" value="${view.argument.map['treeView'] }" />
		<input type="hidden" id="${pageId}_treeLang" name="fwCoord.lang" value="${view.coord.lang }" /> 
		<input type="hidden" id="${pageId}_treeUi" name="fwCoord.ui" value="${view.coord.ui }" />
		<div width="95%" height="100%">
			<table style="margin: 10px" width="95%" height="100%">
				<tr>
					<td id="${pageId}_treeButtonArea" style="display:none">
	<jsp:include page="../tree_button_area.jsp" />
					</td>
				</tr>
				<tr>
					<td id="${pageId}_tree"  class="easyui-tree" />
				</tr>
			</table>
		</div>
	</form>
    </div>   
    <div data-options="region:'center',title:'${view.gridTitle }'" style="padding:5px;background:#eee;">
	<form id="${pageId}_form" name="form" action="list" method="post">
		<input type="hidden" id="${pageId}_project" name="fwCoord.project" value="${view.coord.project }" />
		<input type="hidden" id="${pageId}_function" name="fwCoord.function" value="${view.coord.function }" />
		<input type="hidden" id="${pageId}_view" name="fwCoord.view" value="${view.coord.view }" />
		<input type="hidden" id="${pageId}_lang" name="fwCoord.lang" value="${view.coord.lang }" />
		<input type="hidden" id="${pageId}_ui" name="fwCoord.ui" value="${view.coord.ui }" />
		
		<input type="hidden" id="${pageId}_totalRow" name="fwPage.totalRow" value="100" /> 
		<input type="hidden" id="${pageId}_pageSize" name="fwPage.pageSize" value="10" /> 
		<input type="hidden" id="${pageId}_pageNumber" name="fwPage.pageNumber" value="1" />
	
		<input type="hidden" id="${pageId}_sortName" name="fwParam.sortName" value="${fwParam.sortName }" />
		<input type="hidden" id="${pageId}_sortOrder" name="fwParam.sortOrder" value="${fwParam.sortOrder }" />
		
		<input type="hidden" id="${pageId}_treeSelectedId" name="fwParam.selectedTreeNodeId" value="" />
		<input type="hidden" id="${pageId}_treeConnectColumn" name="fwParam.treeConnectColumn" value="${not empty view.argument && not empty view.argument.map['treeConnectColumn']?view.argument.map['treeConnectColumn']:view.argument.map['treeParentIdField'] }" />
		
    
		<div>
			<table style="margin: 10px">
				<tr>
					<td id="${pageId}_gridButtonArea" style="display:none">
<jsp:include page="../grid_button_area.jsp" />
					</td>
				</tr>
			</table>
			<table id="${pageId}_datagrid" width="100%">
				<tbody id="${pageId}_dataArea" width="100%">
				</tbody>
			</table>
			<div id="${pageId}_pagination" class="easyui-pagination"
				style="background: #efefef; border: 1px solid #ccc;"
				data-options="showPageList:false,showRefresh:false"></div>
		</div>
	</form>
    </div>   
</body>
<div id="${pageId}_dialogs" style="display : none"></div>
</html>
