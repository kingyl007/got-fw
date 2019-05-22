<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@page import="cn.got.platform.core.model.layout.*"%>
<%@page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %> 
<%
	// TODO filter in list action, construct button group
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
		request.setAttribute("displayActions", finalActions);
		request.setAttribute("otherActions", otherGroupMap);
	}
	String str = ((String)request.getAttribute("openerSelectedData"));
	if (str != null) {
	  str = str.replaceAll("<", "&lt;");
	  request.setAttribute("openerSelectedData", str);
	}
%>
<c:if test="${'1' != showAsDialog}">
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta charset="UTF-8">
	<title>${not empty view.title?view.title:function.title}</title>
<jsp:include page="../header.jsp"></jsp:include>
	<style>
  	  .el-table .info-row {
    		background: #c9e5f5;
      }	
      
      #top {
	      background:#20A0FF;
	      padding:5px;
	      overflow:hidden;
	      vertical-align: middle;
      }
	</style>
</head>
<body>
</c:if>
<div id="${pageId }">
	<div class="block">
		<div id="top">
		<template v-for="act in actions.displayActions">
			<template v-if="act.tag == 'group'">
				<el-input v-if="act.id== 'searchGrp' ||act.id== 'gridSearchGrp'" placeholder="请输入检索内容" 
				size="small" v-model="fwParam.queryValue" @keyup.enter.native="loadData"
				style="width:10%;">
				</el-input>
				&nbsp;&nbsp;
				<el-dropdown :split-button="act.showDefault" size="small" @click="_entry(act.children[0].click, this, null, act.children[0].id, -1, $event)">
				<el-button v-if="!act.showDefault" size="small" :plain="true" :icon="act.icon" :key="act.id">
					{{act.label}}<i class="el-icon-arrow-down el-icon--right"></i>
				</el-button>
				<i v-if="act.showDefault" :class="act.children[0].icon"></i>&nbsp;{{act.showDefault?act.children[0].label:''}}
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item v-for="(subAct,subIndex) in act.children" :key="subAct.id"
					v-if="!act.showDefault || subIndex>0" :command="subAct.id"
					 @click.native="_entry(subAct.click, this, null, subAct.id, -1, $event)">
					<i :class="subAct.icon"></i>&nbsp;{{subAct.label}}</el-dropdown-item>
				</el-dropdown-menu>
				</el-dropdown>
			</template>
			<template v-if="act.tag != 'group'">
				<el-input v-if="act.id== 'searchList'" placeholder="请输入检索内容"
				size="small" v-model="fwParam.queryValue" @keyup.enter.native="loadData"
				style=width:10%;">
				</el-input>
				<el-button :key="act.id" size="small" :plain="true" :icon="act.icon" @click="_entry(act.click, this, null, act.id, -1, $event)">{{act.label}}</el-button>
			</template>
		</template>
		</div>
		<br/>
		<div style="margin-top:15px">	
			<el-table ref="grid" :data="tableData" v-loading="loading" size="mini" fit stripe border :default-sort = "{prop: 'ID', order: 'ascending'}"
			highlight-current-row 
			@selection-change="handleSelectionChange" @sort-change="handleSort" @header-dragend="handleHeaderDragEnd">
				<el-table-column type="index" ></el-table-column>
				<el-table-column type="selection" ></el-table-column>
				<el-table-column v-for="(col,columnIndex) in columns" v-if="col.visible" :width="col.width" :column-key="new String(columnIndex)" :key="col.id" :prop="col.id" :label="col.label" :sortable="col.fromDb?'custom':false" :show-overflow-tooltip="col.id != '_FW_ACTIONS'">
					<template slot-scope="scope">
						<template  v-if="col.id == '_FW_ACTIONS'">
							<el-button v-for="act in actions.otherActions.inList" :key="act.id"
								v-if="_isInListVisible(act, scope)"
								:icon="act.icon" @click="_entry(act.click, this, scope.row, act.id, scope.$index, $event)"
								size="mini">{{act.label}}</el-button>
								
							<el-dropdown v-if="_inListVisibleIndex(scope) > 4">
								<el-button size="mini" icon="el-icon-menu">
									更多<i class="el-icon-arrow-down el-icon--right"></i>
								</el-button>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item v-for="subAct in actions.otherActions.inList" v-if="_isInListMoreVisible(subAct, scope)" :key="subAct.id" :command="subAct.id"
									 @click.native="_entry(subAct.click, this, scope.row, subAct.id, scope.$index, $event)">
									<i :class="subAct.icon"></i>&nbsp;{{subAct.label}}
									</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</template>
						<template v-else-if="col.onFormat != ''">
							{{_format_entry(col.onFormat, col.id, scope.row, scope.$index)}}
						</template>
						<template v-else-if="col.dictionary != ''">
							{{dictMap[col.dictionary][scope.row[col.id]]?dictMap[col.dictionary][scope.row[col.id]]:scope.row[col.id]}}
						</template>
						<template v-else-if="col.showColumn != ''">
							{{scope.row[col.showColumn]}}
						</template>
						<template v-else>
							{{scope.row[col.id]}}
						</template>
					</template>
				</el-table-column>
			</el-table>
			<div align="center">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="fwPage.pageNumber"
					:page-sizes="[5,10, 20, 30, 40]"
					:page-size="fwPage.pageSize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="fwPage.totalRow">
				</el-pagination>
			</div>
		</div>
	</div>
	<footer align="center">
	</footer>
	
<c:if test="${'1' != showAsDialog}">
	<template id="top" v-if="false">
		<span>	
			<el-button type="text" style="color:white">添加</el-button>	
			<el-button type="text" style="color:white">批量删除</el-button>
		</span>		
		<span class="demonstration">显示默认颜色</span>
		<span class="wrapper">
			<el-button type="success">成功按钮</el-button>
			<el-button type="warning">警告按钮</el-button>
			<el-button type="danger">危险按钮</el-button>
			<el-button type="info">信息按钮</el-button>
		</span>
		<span class="demonstration">hover 显示颜色</span>
		<span class="wrapper">
			<el-button :plain="true" type="success">成功按钮</el-button>
			<el-button :plain="true" type="warning">警告按钮</el-button>
			<el-button :plain="true" type="danger">危险按钮</el-button>
			<el-button :plain="true" type="info">信息按钮</el-button>
		</span>
		<el-dropdown split-button type="primary" size="mini">更多菜单
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item>黄金糕</el-dropdown-item>
				<el-dropdown-item>狮子头</el-dropdown-item>
				<el-dropdown-item>螺蛳粉</el-dropdown-item>
				<el-dropdown-item>双皮奶</el-dropdown-item>
				<el-dropdown-item>蚵仔煎</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
	</template>
</c:if>
	<br/>
	<div id="${pageId}_dialogs"></div>
</div>
<c:if test="${'1' == showAsDialog}">
<div class="TAIL_HERE" />
</c:if>
<script>
var vueOptions = {
	el:"#${pageId }",
	data: {
		//表格当前页数据
		tableData: [],
		currentRow : null,
		//多选数组
		multipleSelection: [],
		//===========================================================
		id : '${pageId }',
		loading : false,
		title : '${view.title}',
		opener : got.vues['${openerId}'], // opener vue object
		childId : '${fwParam.openerActionId}', // id for open as dialog
		isInDialog : ${'1' == showAsDialog},
		showDialog : false,
		width : '${view.width}',
		height : '${view.height}',
		dialogs : {},
		//===========================================================
		fwCoord : {
			project : '${view.coord.project }',
			'function' : '${view.coord.function }',
			view : '${view.coord.view }',
			lang : '${view.coord.lang }',
			ui : '${view.coord.ui}',
		},
		fwPage : {
			totalRow : 0,
			pageSize : 10,
			pageNumber : 1,
		},
		fwParam : {
			sortName : '',
			sortOrder : '',
			treeConnectColumn : '${not empty view.argument?view.argument.map['treeConnectColumn']:'' }',
			openerFunction : '${fwParam.openerFunction }',
			openerView : '${fwParam.openerView }',
			openerActionId : '${fwParam.openerActionId }',
			selectedId : '${fwParam.selectedId }',
			queryValue : '${fwParam.queryValue }',
			openerSelectedData : {},
			selectedData : {},
			oldData : {},
			newData : {},
			newListData : [],
			oldListData : [],
		},
		//===========================================================
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
		columns : [
			<c:if test="${view.columns != null }">
				<c:forEach var="col" items="${view.columns}" varStatus="colStatus">
					<c:if test="${col.toUser}" >
						{id:'${col.id}',visible : ${col.visible}, label : '${col.label}',
							fromDb : ${col.fromDb}, dictionary : '${col.dictionary}', showColumn : '${col.showColumn}', 
							onFormat : '${col.onFormat}', width : "${(col.id == '_FW_ACTIONS')?390:col.width}"},
					</c:if>
				</c:forEach>
			</c:if>
		],
		actions : {
			displayActions : [
				<c:if test="${displayActions != null }">
					<c:forEach var="act" items="${displayActions}" varStatus="status">
						{id : '${act.id}', tag : '${act.tag}', icon : '${act.icon}',
							<c:if test="${act.tag=='group' }">
								label : '${act.title}',
								showDefault : ${not empty act.showDefault && act.showDefault},
								children : [
								<c:forEach var="subAct" items="${act.children}" varStatus="subStatus">
									{id : '${subAct.id}', icon : '${subAct.icon}', label : '${subAct.label}', click : '${subAct.click}', enable :  ${not empty subAct.enable && subAct.enable}},
								</c:forEach>
								],
							</c:if>
							<c:if test="${act.tag!='group' }">
								label : '${act.label}',
								click : '${act.click}',
								enable : ${not empty act.enable && act.enable},
							</c:if>
						},
					</c:forEach>
				</c:if>
			],
			otherActions : {
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
							  enable:  ${act.enable}
							}
					</c:forEach>
					              ],
				</c:forEach>
			},
			actionArg: {
				<c:forEach items="${view.actions}" var="act" varStatus="actStatus">
					'${act.id}' : {
					'icon': '${act.icon }',
					'label': '${act.label }',
					'click' : '${act.click }',
					<c:if test="${not empty act.argument}">
						<c:forEach items="${act.argument.map}" var="actarg" varStatus="argStatus">
							'${actarg.key}': '${actarg.value}',
						</c:forEach>
					</c:if>
					},
				</c:forEach>
			},
		},
	},

	methods: {
		handleHeaderDragEnd(newWidth, oldWidth, column, event) {
			console.info(column.columnKey);
			this.columns[parseInt(column.columnKey)].width = newWidth;
		},
		
		handleSort(sortArg) {
			this.fwParam.sortName = sortArg.prop;
			this.fwParam.sortOrder = (sortArg.order == 'descending'?'DESC':'ASC');
			this.loadData();
		},

		//多选响应
		handleSelectionChange: function(val) {
			this.multipleSelection = val;
		},

		//每页显示数据量变更
		handleSizeChange: function(val) {
			this.fwPage.pageSize = val;
			this.loadData();
		},

		//页码变更
		handleCurrentChange: function(val) {
			this.fwPage.pageNumber = val;
			this.loadData();
		},
		
		_isInListVisible : function(action, scope) {
			var rowTotalShowCount = this._inListVisibleIndex(scope);
			return ((action.rowVisibleIndex > 0 && action.rowVisibleIndex < 4) || (action.rowVisibleIndex == 4 && rowTotalShowCount == 4));
		},
		
		_isInListMoreVisible : function(action, scope) {
			var rowTotalShowCount = this._inListVisibleIndex(scope);
			return ((action.rowVisibleIndex > 4 ) || (action.rowVisibleIndex == 4 && rowTotalShowCount > 4));
		},

		_inListVisibleIndex : function(scope) {
			/*
			// 可见，且少于等于3个
			var args = this.actions.actionArg;
			var arg = args[action.id];
			var visible = action.visible && 
			(!arg.hasOwnProperty('showByColumn') || 
					scope.row[arg.showByColumn] == arg.showValue || 
					(arg.hasOwnProperty('showByEmpty') && 
						arg.showByEmpty == '1' && 
						(!scope.row.hasOwnProperty(arg.showByColumn) || scope.row[arg.showByColumn] == null || scope.row[arg.showByColumn] == '')
					));
			if (visible) {
				*/
				var showedCount = 0;
				var actList = this.actions.otherActions.inList;
				var args = this.actions.actionArg;
				$.each(actList, function(index, act) {
					arg = args[act.id];
					var v = act.visible && 
						(scope != null &&
							(!arg.hasOwnProperty('showByColumn') || 
								scope.row[arg.showByColumn] == arg.showValue || 
								(arg.hasOwnProperty('showByEmpty') &&
										arg.showByEmpty == '1' && 
										(!scope.row.hasOwnProperty(arg.showByColumn) || 
											scope.row[arg.showByColumn] == null || 
											scope.row[arg.showByColumn] == ''
										)
								)
							)
						);
					if (v) {
						act.rowVisibleIndex = ++showedCount;
					} else {
						act.rowVisibleIndex = -1;
					}
				});
				$.each(actList, function(index, act) {
					act.rowTotalVisibleIndex = showedCount;
				});
				return showedCount;
				/*
			}
			return -1;
			*/
		},
		//==============================================
		//从服务器读取数据
		loadData: function(){
			<c:if test="${not empty view.onQuery}">
			if (this['${view.onQuery}']) {
				this['${view.onQuery}'](this, null, 'queryList',-1, null);
			}
			</c:if>
		},
		_entry : function(method, view, data, actionIndex, rowIndex, event) {
			if (this[method]) {
				this[method](this, data, actionIndex, rowIndex, event);
			} else {
				console.info('_entry can not find method ' + method);
			}
		},
		
		_format_entry : function(formatter, col, data, rowIndex) {
			if (this[formatter]) {
				return this[formatter](data[col], data, rowIndex);
			} else {
				console.info('_format_entry can not find format ' + formatter);
				return data[col];
			}
		},
		<c:forEach var="item" items="${view.clientLogicMap}" varStatus="status">
			// \/ \/ \/ ${item.key} start \/ \/ \/
			${item.key} : ${item.value.body},
			// /\ /\ /\ ${item.key} end /\ /\ /\
		</c:forEach>
	},
};
// 如果是对话框打开，则用对话框ID创建对象，如果是直接打开，则用pageId创建对象
var vue = null;
<c:if test="${'1' != showAsDialog}">
	vue = new Vue(vueOptions);
	got.vues['${pageId}'] = vue;
	vue.loadData();
</c:if>
if (vueOptions.data.opener) {
	vueOptions.data.opener.dialogs['${fwParam.openerActionId}'] = {'vue':vue, 'opt':vueOptions};
}
</script>
<c:if test="${'1' != showAsDialog}">
	</body>
	</html>
</c:if>