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
	List<Object> finalActions = new ArrayList<Object>();
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
						if (!finalActions.contains(group)) {
							finalActions.add(group);
						}
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
				} else {
					finalActions.add(act);
				}
			}
		}
		
		for (int i = 0; i < finalActions.size(); ++i) {
			if (finalActions.get(i) instanceof FwGroup) {
				group = (FwGroup)(finalActions.get(i));
				if (group.getChildren().size() == 1) {
					finalActions.remove(i);
					finalActions.add(i, group.getChildren().get(0));
				}
			}
		}
	}
	request.setAttribute("treeActions", finalActions);
	request.setAttribute("inTreeActions", otherGroupMap);
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
				this['${view.onQuery}'](this, $(this.getId("form")).serialize());
			}
			</c:if>
		},
		
	};
	$(function() {
		$(${pageId}.getId("treeButtonArea")).toggle();
		${pageId}.getTree().tree({
			  url: 'getTreeData',
			  queryParams:  ${pageId}.buildTreeFormDataObject(${pageId}, null),
			  onSelect: function(node) {
			    	$(${pageId}.getId("treeSelectedId")).val(node.id);
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
</script>
</head>
<body id="${pageId}_body">
<form id="${pageId}_treeForm" name="treeForm" method="post" width="90%" height="100%">
	<input type="hidden" id="${pageId}_treeProject" name="fwCoord.project" value="${view.coord.project }" /> 
	<input type="hidden" id="${pageId}_treeFunction" name="fwCoord.function" value="${view.coord.function }" /> 
	<input type="hidden" id="${pageId}_treeView" name="fwCoord.view" value="${view.coord.view }" />
	<input type="hidden" id="${pageId}_treeLang" name="fwCoord.lang" value="${view.coord.lang }" /> 
	<input type="hidden" id="${pageId}_treeUi" name="fwCoord.ui" value="${view.coord.ui }" />
	<input type="hidden" id="${pageId}_treeSelectedId" name="fwParam.treeSelectedNodeId" value="" />
	<input type="hidden" id="${pageId}_treeConnectColumn" name="fwParam.treeConnectColumn" value="${not empty view.argument && not empty view.argument.map['treeConnectColumn']?view.argument.map['treeConnectColumn']:view.argument.map['treeParentIdField'] }" />
	<div width="100%" height="100%">
		<table style="margin: 10px" width="99%" height="100%">
			<tr>
				<td id="${pageId}_treeButtonArea" style="display:none">
<jsp:include page="../tree_button_area.jsp" />
				</td>
			</tr>
		</table>
		<div class="easyui-panel" width="100%" height="600">
			<div id="${pageId}_tree"  class="easyui-tree" width="100%" height="100%"/>
		</div>
		<div id="${pageId}_tempTree"  class="easyui-tree" style="display: none;"/>
	</div>
</form>
</body>
<div id="${pageId}_dialogs" style="display : none"></div>
</html>
