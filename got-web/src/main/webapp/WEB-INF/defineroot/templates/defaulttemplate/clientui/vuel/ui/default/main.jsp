<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@page import="cn.got.platform.core.model.layout.*"%>
<%@page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
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
		/*
		for (int i = 0; i < finalActions.size(); ++i) {
			if (finalActions.get(i) instanceof FwGroup) {
				group = (FwGroup)(finalActions.get(i));
				if (group.getChildren().size() == 1) {
					finalActions.remove(i);
					finalActions.add(i, group.getChildren().get(0));
				}
			}
		}
		*/
	}
	request.setAttribute("displayActions", finalActions);
	request.setAttribute("otherActions", otherGroupMap);
}
%>

<c:if test="${'1' != showAsDialog}">
	<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	<html>
	<head>
	<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<meta charset="UTF-8">
		<title>${view.title} - ${project.props['project.name'] }</title>
		<style>
		  .grid-content {
		    min-height: 36px;
		  }
		  
		  .el-header, .el-footer {
		    background-color: #B3C0D1;
		    color: #333;
		    line-height: 60px;
		  }
		  
		  .el-aside {
		    color: #333;
		    text-align: left;
		    line-height: 430px;
		  }
		  
		  .el-main {
		    text-align: center;
		    line-height: 165px;
		  }
		  
		  body > .el-container {
		  }
		  
		</style>
		<jsp:include page="../header.jsp"></jsp:include>
	</head>
<body>
</c:if>
	<div id="${pageId }">
		<el-container height="100%">
		  <el-header style="background: #438eb9; color: #fff;">
<el-row>
  <el-col :span="8"><div style="vertical-align: middle;">
	<c:if
		test="${not empty project.props['project.logo'] }">
		<img width="147" height="43" align="middle" 
			src="${pageContext.request.contextPath}/${project.props['project.logo'] }" />
	</c:if>
	${empty project.props['project.logo']?'<i class="fa fa-key"></i>':'' } <font id="${pageId}_title" style="color: #fff; font-size: x-large;">${empty project.props['main.title']?project.props['project.name']:project.props['main.title'] }</font>
  </div></el-col>
  <el-col :span="8"><div class="grid-content bg-purple-light"></div></el-col>
  <el-col :span="8">
	  <div  style="text-align: right; vertical-align: middle;height: 60px;">
		<span><small>欢迎,</small>${user.name }</span>
		<el-dropdown>
			<i style="color: #fff;" class="el-icon-setting"></i>
			<el-dropdown-menu slot="dropdown">
			<el-dropdown-item><i class="ace-icon fa fa-user"></i> 修改密码</el-dropdown-item>
			<el-dropdown-item><i class="ace-icon fa fa-power-off"></i> 退出</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
	  </div>
  </el-col>
</el-row>
		</el-header>
		  <el-container :style="{height: mainArea.height + 'px' , border: '1px solid #eee'}">
			<el-aside :width="isCollapse?'65px':'200px'" style="background-color:#545c64; color:#fff">
				<p><p>
				<el-menu default-active="1" class="el-menu-vertical-demo" mode="vertical" :collapse="isCollapse" @select="onMenuSelected"
				  background-color="#545c64"
				  text-color="#fff"
				  active-text-color="#ffd04b">
					<template v-for="act in actions.displayActions">
						<el-menu-item v-if="act.tag !='group'" :key="act.id" :index="act.id">
							<i :class="act.icon" style="color:#fff">&nbsp;</i>
							<span slot="title">{{act.label}}</span>
						</el-menu-item>
						<el-menu-item v-else-if="act.tag == 'group' && act.children.length == 1 && act.label == act.children[0].label"  
							:key="act.children[0].id" :index="act.children[0].id">
							<i :class="act.children[0].icon" style="color:#fff">&nbsp;</i>
							<span slot="title">{{act.children[0].label}}</span>
						</el-menu-item>
						 <el-submenu v-else-if="act.tag == 'group' && act.children.length > 0" :index="act.id">
						    <template slot="title"><i :class="act.icon" style="color:#fff">&nbsp;</i><span>{{act.label}}</span></template>
						    <el-menu-item v-for="subAct in act.children" :key="subAct.id" :index="subAct.id" style="font-size:11px;">
							    <i :class="subAct.icon" style="color:#fff">&nbsp;</i>
							    <span slot="title">{{subAct.label}}</span>
						    </el-menu-item>
						 </el-submenu>
					</template>
				</el-menu>
				<div width="100%" style="text-align: center;">
				<i :class="isCollapse?'el-icon-d-arrow-right':'el-icon-d-arrow-left'" @click="isCollapse=!isCollapse"></i>
				</div>
			</el-aside>
		    <el-main style="padding:0px; padding-left:10px;" height="100%">
			 <el-tabs :value="currentTab" height="100%" @tab-remove="onTabClose">
			    <el-tab-pane v-for="(tab,tabIndex) in tabs" :key="tab.id" :label="tab.label" :name="tab.id" height="100%" :closable="tabIndex > 0">
					<iframe id="tab_index_frame" width="98%" :height="(mainArea.height - 60) + 'px'" frameborder="0" marginheight="0" marginwidth="0" :src="tab.url"></iframe>
				</el-tab-pane>
			  </el-tabs>
			</el-main>
		  </el-container>
		</el-container>
	</div>
	<div id="${pageId}_dialogs"></div>
<script>
var vue = new Vue({
	el:"#${pageId }",
	data: {
		isCollapse : false,
		//表格当前页数据
		tableData: [],
		currentRow : null,
		//多选数组
		multipleSelection: [],
		tabs : [{id:'portal', label:'工作台', url:'getView?fwCoord.project=${project.name}&fwCoord.function=portal'},
		        ],
		currentTab : 'portal',
		
		//===========================================================
		id : '${pageId }',
		loading : false,
		title : '${view.title}',
		opener : <c:if test="${not empty openerId}">vue_${openerId}</c:if>${empty openerId?'null':''}, // opener vue object
		childId : '${fwParam.openerActionId}', // id for open as dialog
		isInDialog : ${'1' == showAsDialog},
		showDialog : false,
		width : '${width}',
		height : '${height}',
		mainArea : {
			width: 800,
			height:600,
		},
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
			sortName : '${fwParam.sortName }',
			sortOrder : '${fwParam.sortOrder }',
			treeConnectColumn : '${not empty view.argument?view.argument.map['treeConnectColumn']:'' }',
			openerFunction : '${fwParam.openerFunction }',
			openerView : '${fwParam.openerView }',
			openerActionId : '${fwParam.openerActionId }',
			selectedId : '${fwParam.selectedId }',
			queryValue : '${fwParam.queryValue }',
			openerSelectedData : {},
			selectedData : {ID:11},
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
						{id:'${col.id}',visible : ${col.visible}, label : '${col.label}', fromDb : ${col.fromDb}, dictionary : '${col.dictionary}', showColumn : '${col.showColumn}'},
					</c:if>
				</c:forEach>
			</c:if>
		],
		actions : {
			displayActions : [
				<c:if test="${displayActions != null }">
					<c:forEach var="act" items="${displayActions}" varStatus="status">
						{id : '${act.id}', tag : '${act.tag}', icon : "${not empty act.icon?act.icon:'fa fa-desktop'}",
							<c:if test="${act.tag=='group' }">
								label : '${act.title}',
								showDefault : ${not empty act.showDefault && act.showDefault},
								children : [
								<c:forEach var="subAct" items="${act.children}" varStatus="subStatus">
									{id : '${subAct.id}', icon : "${not empty subAct.icon?subAct.icon:'fa fa-desktop'}", label : '${subAct.label}', click : '${subAct.click}', enable :  ${not empty subAct.enable && subAct.enable}},
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
							  enable:  ${act.enable},
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
	mounted: function () {
		var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight; //浏览器高度
		this.mainArea.height = h - 80;
		console.info(h);
	},
	updated: function () {
		var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight; //浏览器高度
		this.mainArea.height = h - 80;
		console.info('updated:' + h);
	},

	methods: {
		onTabClose : function(id, $event) {
			console.info(id);
			console.info(event);
			if (event.shiftKey) {
				for (var i = this.tabs.length - 1; i > 0; --i) {
					if (this.tabs[i].id == id) {
						continue;
					} else {
						this.tabs.splice(i, 1);
					}
				}
				this.currentTab = id;
			} else if (event.ctrlKey) {
				while(this.tabs.length > 1) {
					this.tabs.pop();
				}
				this.currentTab = this.tabs[0].id;
			} else {
				for (var i = this.tabs.length - 1; i > 0; --i) {
					if (this.tabs[i].id == id) {
						this.tabs.splice(i, 1);
						if (this.currentTab == id) {
							this.currentTab = this.tabs[i-1].id;
						}
						break;
					} else {
						continue;
					}
				}
				
			}
			got.clearSelect();
		},
		onMenuSelected : function(id, idPath) {
			console.info(id +',' + idPath);
			var found = false;
			var vue = this;
			$.each(this.tabs, function(index, tab) {
				if (tab.id == id) {
					vue.currentTab = id;
					found = true;
					return false;
				}
			});
			if (!found) {
				var arg = this.actions.actionArg[id];
				var url = null;
				if (arg.hasOwnProperty('url') && arg.url) {
					url = arg.url;
				} else {
					url = 'getView?fwCoord.project='+
							(arg.hasOwnProperty('project')?arg['project']:this.fwCoord.project)+
							'&fwCoord.function='+(arg.hasOwnProperty('function')?arg['function']:'')+
							'&fwCoord.lang='+this.fwCoord.lang+
							'&fwCoord.ui='+this.fwCoord.ui+
							'&fwCoord.action='+id+
							'&'+(arg.hasOwnProperty('queryString')?arg['queryString']:'')+'&';
				}
				this.tabs.push({'id':id,'label':this.actions.actionArg[id].label, 'url':url});
				this.currentTab = id;
			}
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
			// 可见且（没有showByColumn属性 或 有此属性，且
			var arg = this.actions.actionArg[action.id];
			return action.visible && 
			(!arg.hasOwnProperty('showByColumn') || 
				scope.row[arg.showByColumn] == arg.showValue || 
				(arg.hasOwnProperty('showByEmpty') && 
					arg.showByEmpty == '1' && 
					(!scope.row.hasOwnProperty(arg.showByColumn) || scope.row[arg.showByColumn] == null || scope.row[arg.showByColumn] == '')
				));
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
				console.info('can not find method ' + method);
			}
		},
		
		<c:forEach var="item" items="${view.clientLogicMap}" varStatus="status">
			// \/ \/ \/ ${item.key} start \/ \/ \/
			${item.key} : ${item.value.body},
			// /\ /\ /\ ${item.key} end /\ /\ /\
		</c:forEach>
	},
});
//载入数据
vue.loadData();
// Vue.config.lang = 'en';
var vue_${pageId } = vue;
</script>
</body>
</html>