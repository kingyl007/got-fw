<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html>
<html lang="zh">
<head>
<title>${pageId}</title>
<%
	if (!"1".equals(request.getAttribute("isDialog"))) {
%>
	<jsp:include page="../header.jsp"></jsp:include>
<%
	}
%>
<script type="text/javascript">
	var ${pageId}=cxfw2.initDefineObject('${pageId}', ${pageDefine});
	
	$(function() {
	  	var define = ${pageId};

	  	// 树节点主键对应列
	  	define.idField = "CUSTOMER_ID";
	  	// 树节点上级对应列
	  	define.parentIdField = "PARENT_ID";
	  	// 树节点显示的数据，可以指定多个，合并显示
	  	define.treeLabelField = "CUSTOMER_NAME";
	  	
	  	//在树上选择时，影响的列表中的检索列
	  	define.listByTreeField="PARENT_ID";

		// tree
		$(define.geteid("tree")).tree({
		  url: 'getEasyuiTreeData',
		  queryParams:  cxfw2.buildDefinePostObject(define, false),
		  onLoadSuccess: function(node, data) {} ,
		  onLoadError: function(arguments) {},
		  onSelect: function(node) {
		    $(define.geteid("treeSelectedId")).val(node.id);
		    define.loadData();
		    },
		});
		
		// datagrid
		var pageColumns = new Array();
		pageColumns.push({
			field : 'ck',
			checkbox : true
		});
		if (define.pd.columnList) {
		  var columns = define.pd.columnList;
		  var tbcol = null;
			for (var i = 0; i < columns.length; ++i) {
			  tbcol = {
						field : columns[i].field,
						title : (columns[i].label?columns[i].label:columns[i].field),
						width : 50,
						sortable : true,
						hidden : (columns[i].visible!=null && !columns[i].visible), 
						formatter : define.handlers[columns[i].id +"_formatter"],
					};
			  if (!columns[i].isVisible) {
			    // tbcol.hidden = true;
			  }
			  if (columns[i].dictionary && !tbcol.formatter) {
			    tbcol.formatter = define.dictionaryFormatter;
			  }
			  if (tbcol.formatter == null) {
			    tbcol.formatter = define.defaultFormatter;
			  }
				pageColumns.push(tbcol);
			}
			pageColumns.push({
				field : 'actions',
				title : '操作',
				width : 150,
				height : 30,
				sortable : false,
			});
		}
		$(define.geteid("datagrid")).datagrid(
			{
			  	striped : true,
				title : define.pd.title,
				sortName : $(define.geteid("sortName")).val(),
				sortOrder : $(define.geteid("sortOrder")).val(),
				columns : [ pageColumns ],
				onSortColumn : function(sort, order) {
          showLoading('#${pageId}_datagrid');
					$(define.geteid("sortName")).val(sort);
					$(define.geteid("sortOrder")).val(order);
					define.loadData();
				},
			});
		$(define.geteid("pagination")).pagination({
			total : parseInt($(define.geteid("total")).val()),
			pageSize : parseInt($(define.geteid("pageSize")).val()),
			pageNumber : parseInt($(define.geteid("pageNumber")).val()),
			onSelectPage : function(pageNumber, pageSize) {
        showLoading('#${pageId}_datagrid');
				$(define.geteid("pageNumber")).val(pageNumber);
				$(define.geteid("pageSize")).val(pageSize);
				define.loadData();
			}
		});
		cxfw2.buildAllButtons(define, "buttonArea", "treeButtonArea");
		/*
		if (define.pd.actionList) {
		  	var actions = define.pd.actionList; 
			for (var i = 0; i < actions.length; ++i) {
			  	if (actions[i].group != "inList") {
					var action = cxfw2.buildButton(actions[i], define, i);
					if (actions[i].group =="tree") {
						$(action).appendTo($(define.geteid("treeButtonArea")));
					} else {
					  $(action).appendTo($(define.geteid("buttonArea")));
					} 
					$(define.geteid(actions[i].id)).linkbutton();
			  	}
			}
		}
		*/		
		<c:if test="${not empty view.onInit}">
		if (${pageId}['${view.onInit}']) {
		  ${pageId}['${view.onInit}'](${pageId}, $(${pageId}.getId("form")).serialize());
		}
		</c:if>

		if (!define.isDialog) {
			define.loadData();
		}
	});
</script>
</head>
<body id="${pageId}_body">
	<div>
		<table style="margin: 10px">
			<tr>
				<td id="${pageId}_treeButtonArea"></td>
			</tr>
		</table>
		<div id="cc" class="easyui-layout" style="height:500px;">   
		    <div data-options="region:'west',title:'',split:true" style="width:300px;">
			<div id="${pageId}_tree"  class="easyui-tree"></div>
			<input type="hidden" id="${pageId}_treeSelectedId" name="treeSelectedId" value="" /> 
		    </div>   
		    <div data-options="region:'center',title:''" style="padding:5px;background:#eee;">
				<form id="${pageId}_form" name="form" action="list" method="post">
					<input type="hidden" id="${pageId}_sortName" name="sortName" value="" /> 
					<input type="hidden" id="${pageId}_sortOrder" name="sortOrder" value="" />
					<input type="hidden" id="${pageId}_total" name="total" value="100" /> 
					<input type="hidden" id="${pageId}_pageSize" name="pageSize" value="10" />
					<input type="hidden" id="${pageId}_pageNumber" name="pageNumber" value="1" />
					<div>
						<table style="margin: 10px">
							<tr>
								<td id="${pageId}_buttonArea"></td>
							</tr>
						</table>
						<table id="${pageId}_datagrid">
							<tbody id="${pageId}_dataArea">
							</tbody>
						</table>
						<div id="${pageId}_pagination" class="easyui-pagination"
							style="background: #efefef; border: 1px solid #ccc;"
							data-options="showPageList:false,showRefresh:false">
						</div>
					</div>
				</form>			    
		    </div>   
		</div>  
	</div>
</body>
<div id="${pageId}_dialogs" style="display : none"></div>
</html>
