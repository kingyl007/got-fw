<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@page import="cn.got.platform.core.model.layout.*"%>
<%@page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
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
</head>
<body
</c:if>
<div id="${pageId }" width="100%">
	<div class="block" width="100%">
		<el-form ref="form" :model="fwParam.newData" :rules="rules" label-position="right" label-width="100px" size="mini" @submit.native.prevent>
			 <el-form-item label="">
			<div class="el-transfer">
				<div class="el-transfer-panel">
					<p class="el-transfer-panel__header">
						待选列<span> ({{leftChecked.length}}/{{unSelectedColumns.length}})</span>
					</p>
					<div class="el-transfer-panel__body">
					<el-checkbox-group ref="leftList" class="el-transfer-panel__list" v-model="leftChecked" @change.native="leftChange">
						<draggable v-model="unSelectedColumns" :options="{group:'columns', filter:'.is-disabled'}" style="min-height: 100px;width: 100%;">
						 <el-checkbox
							class="el-transfer-panel__item"
							:label="item.label"
							:disabled="item.disabled"
							:key="item.id"
							v-for="item in unSelectedColumns">{{item.label}}
						</el-checkbox>
						</draggable>
					</el-checkbox-group>
					</div>
				</div>
				<div class="el-transfer__buttons">
					<el-button
						type="primary"
						:class="['el-transfer__button']"
						@click.native="moveToLeft"
						:disabled="rightChecked.length === 0">
						<i class="el-icon-arrow-left"></i>
					</el-button>
					<el-button
						type="primary"
						:class="['el-transfer__button']"
						@click.native="moveToRight"
						:disabled="leftChecked.length === 0">
						<i class="el-icon-arrow-right"></i>
					</el-button>
				</div>
				<div class="el-transfer-panel">
					<p class="el-transfer-panel__header">
						已选列<span> ({{rightChecked.length}}/{{selectedColumns.length}})</span>
					</p>
					<div class="el-transfer-panel__body">
					<el-checkbox-group ref="rightList" class="el-transfer-panel__list" v-model="rightChecked" @change.native="rightChange">
						<draggable v-model="selectedColumns" :options="{group:'columns', filter:'.is-disabled'}" style="min-height: 100px;width: 100%;">
						 <el-checkbox
							class="el-transfer-panel__item"
							:label="item.label"
							:disabled="item.disabled"
							:key="item.id"
							v-for="item in selectedColumns">{{item.label}}
						</el-checkbox>
						</draggable>
					</el-checkbox-group>
					</div>
				</div>
			</div>
			</el-form-item>
			<el-form-item>
				<template v-if="!isInDialog">
					<el-button v-for="act in actions.displayActions" :key="act.id" type="primary" :icon="act.icon" @click="_entry(act.click, this, fwParam.newData, act.id, 0, $event)">{{act.label}}</el-button>
				</template>
			</el-form-item>
		</el-form>
	</div>
	<div id="${pageId}_dialogs"></div>
</div>
<c:if test="${'1' == showAsDialog}">
<div class="TAIL_HERE" />
</c:if>
<script>
var vueOptions = {
	el:"#${pageId }",
	data: {
		backValidMap : {
			<c:forEach var="col" items="${validColumns}" varStatus="status">
				'${col.id}' : null,
			</c:forEach>
		},
		
		rules : {
			<c:forEach var="col" items="${validColumns}" varStatus="status">
				'${col.id}' : [
						{ required: ${col.editable && col.required}, message: '请输入${col.label}', trigger: 'blur' },
						{ msg:null, validator: function(rule, val,callback) {
							if (rule.msg != null && rule.msg != '') {
								callback(new Error(rule.msg));
							} else {
								callback();
							}
						}, trigger: 'blur' }
				               ],
			</c:forEach>
		},
		leftChecked : [],
		rightChecked : [],
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
			sortName : '${fwParam.sortName }',
			sortOrder : '${fwParam.sortOrder }',
			treeConnectColumn : '${not empty view.argument?view.argument.map['treeConnectColumn']:'' }',
			openerFunction : '${fwParam.openerFunction }',
			openerView : '${fwParam.openerView }',
			openerActionId : '${fwParam.openerActionId }',
			selectedId : '${fwParam.selectedId }',
			queryValue : '${fwParam.queryValue }',
			openerSelectedData : {},
			selectedData : {},
			oldData : {'ID':0},
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
				 		// '' : '${dictItem.label}', /*default value*/
					 	</c:if>
					  </c:forEach>
						 },
		// /\ /\ /\ ${dict.key} end /\ /\ /\ 
					</c:forEach>
				},
		columns : [],
		selectedColumns : [],
		unSelectedColumns : [],
		actions : {
			displayActions : [
				<c:if test="${view.actions != null }">
					<c:forEach var="act" items="${view.actions}" varStatus="status">
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
							<c:if test="${act.tag!='group' && act.visible}">
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
	
	computed : {
		leftAllChecked : function() {
			var allChecked = true;
			
		},
		rightAllChecked : function() {
			
		}
	},

	methods: {
		
		moveRows : function(fromArr, fromChecked, toArr, toChecked) {
			var insertAfter = toArr.length;
			if (toChecked.length > 0) {
				var toCheckLabel = toChecked[toChecked.length - 1];
				$.each(toArr, function(index, col) {
					if (col.label == toCheckLabel) {
						insertAfter = index + 1;
						return false;
					}
				});
			}
			var fromCheckMap = {};
			$.each(fromChecked, function(index, label) {
				fromCheckMap[label] = index;
			});
			var col = null;
			for (var i = fromArr.length - 1; i >= 0; --i) {
				col = fromArr[i];
				if (fromCheckMap[col.label] >= 0) {
					toArr.splice(insertAfter, 0, col);
					fromArr.splice(i, 1);
				}
			}
			fromChecked.splice(0, fromChecked.length);
		},
		
		moveToLeft : function() {
			this.moveRows(this.selectedColumns, this.rightChecked, this.unSelectedColumns, this.leftChecked);
		},
		
		moveToRight : function() {
			this.moveRows(this.unSelectedColumns, this.leftChecked, this.selectedColumns, this.rightChecked);
		},
		leftChange : function(newVal) {
			// console.info(this.leftChecked);
		},
		rightChange : function(newVal) {
			// console.info(this.rightChecked);
		},
		
		//==============================================
		//从服务器读取数据
		loadData: function(){
			<c:if test="${not empty view.onInit}">
			if (this['${view.onInit}']) {
				this['${view.onInit}'](this, null, 'init',-1, null);
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
};
// 如果是直接打开，则直接创建vue对象，如果是对话框打开，则要在打开对话框方法中创建vue对象
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
