<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@page import="cn.got.platform.core.model.layout.*"%>
<%@page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%
  // loop all columns 
	FwView view = (FwView) request.getAttribute("view");
	List<FwColumn> validColumns = new ArrayList<FwColumn>();
	List<FwColumn> hiddenColumns = new ArrayList<FwColumn>();
	if (view.getColumns() != null) {
		for (FwColumn col : view.getColumns()) {
			if (col.getVisible()) {
				validColumns.add(col);
			} else {
			    if (col.getToView() || col.isPk()) {
			  		hiddenColumns.add(col);
			    }
			}
		}
	}
	int columnCount = (validColumns.size() > 10?2:1);
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
<body>
</c:if>
<div id="${pageId }" width="100%">
	<div class="block" width="100%">
		<el-form ref="form" :model="fwParam.newData" inline="true" :rules="rules" label-position="right" label-width="100px" size="mini" @submit.native.prevent>
			<el-form-item v-for="(col, colIndex) in columns" v-if="col.visible" :label="col.label" :prop="col.id" :key="col.id">
				<el-switch v-if="col.ui == 'checkbox01'"
				  v-model="fwParam.newData[col.id]" active-value="1" inactive-value="0"
				  active-color="#13ce66"
				  inactive-color="#ff4949">
				</el-switch>
				<template v-else-if="col.dictionary != '' && dictMap.hasOwnProperty(col.dictionary)">
					<el-select v-model="fwParam.newData[col.id]" :placeholder="col.prompt" :disabled="!col.editable"
					 :multiple="col.multiSelect" :allow-create="dictMap[col.dictionary].canInput"
					 style="width: 90%">
					    <el-option
					      v-for="(value, key) in dictMap[col.dictionary]"
					      :key="key"
					      :label="value"
					      :value="key">
					    </el-option>
					</el-select>
				</template>
				<template v-else-if="col.ui == 'datetime' || col.ui == 'date'">
					<el-date-picker
				      v-model="fwParam.newData[col.id]" :placeholder="col.prompt" :disabled="!col.editable"
				      :type="col.ui"
				      :value-format="col.ui == 'datetime'?'yyyy-MM-dd HH:mm:ss':'yyyy-MM-dd'"
				       style="width: 90%;">
					</el-date-picker>
				</template>
				 <el-input v-else v-model="fwParam.newData[col.id]" :placeholder="col.prompt" :disabled="!col.editable"
				  :type="(col.ui != '')?col.ui:'text'" 
				  style="width: 90%;"></el-input>
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
			selectedData : {ID:11},
			oldData : {},
			newData : {},
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
		columns : [
			<c:if test="${view.columns != null }">
				<c:forEach var="col" items="${view.columns}" varStatus="colStatus">
					<c:if test="${col.toUser}" >
						{id:'${col.id}',visible : ${col.visible}, label : '${col.label}',
							fromDb : ${col.fromDb}, dictionary : '${col.dictionary}', showColumn : '${col.showColumn}',
						prompt : '${col.prompt}', editable : ${col.editable}, ui : '${col.ui}', 
						multiSelect : ${col.multiSelect}
						},
					</c:if>
				</c:forEach>
			</c:if>
		],
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