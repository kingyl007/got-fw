<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
<style type="text/css">
body,html,.map {
	width: 100%;
	height: 100%;
	overflow: hidden;
	margin: 0;
	font-family: "微软雅黑";
}
</style>
<script type="text/javascript"
	src="http://api.map.baidu.com/api?v=2.0&ak=u2vZ9fT7lIzbgGkBTlFQu4Y6"></script>
<%
  if (!"1".equals(request.getAttribute("showAsDialog"))) {
%>
<jsp:include page="../header.jsp"></jsp:include>
<%
  }
%>
<title>地图展示</title>
</head>
<body>
<a id="btn" href="#" class="easyui-linkbutton" style="position:fixed;display:none; z-index:99; left:10px; top:20px;" data-options="iconCls:'icon-search', onClick:function() {$('#win').panel('open');$('#btn').hide();}" >easyui</a> 
	<div id="targetTreeWin" class="easyui-window" title="车辆列表"
		style="width: 300px; height: 500px; left: 10px; top: 10px;"
		data-options="iconCls:'icon-save',modal:false,closable:false,collapsible:true,minimizable:false,maximizable:false,
		onBeforeCollapse:function(){var opts = $(this).window('options');console.info(opts.width);opts.fwOldWidth = opts.width; opts.width='100px';$(this).window(opts);return true;},
		onExpand:function(){var opts = $(this).window('options');console.warn('**' + opts.fwOldWidth);opts.width=opts.fwOldWidth;$(this).window(opts);}">
		Window Content
		<ul id="targetTree" class="easyui-tree" data-options="checkbox:true,onClick: function(node){$(this).tree('update', {target:node.target, text:'ABC+', iconCls:'icon-save'});}">
			<li><span>Folder</span>
				<ul>
					<li><span>Sub Folder 1</span>
						<ul>
							<li><span><a href="#">File 11</a></span></li>
							<li><span>File 12</span></li>
							<li><span>File 13</span></li>
						</ul></li>
					<li><span>File 2</span></li>
					<li><span>File 3</span></li>
				</ul></li>
			<li><span>File21</span></li>
		</ul>
	</div>
	<div id="map_canvas" class="map"></div>
</body>
</html>
<script type="text/javascript">
	// 百度地图API功能
	var map = new BMap.Map("map_canvas"); // 创建Map实例
	map.centerAndZoom(new BMap.Point(120, 36), 11); // 初始化地图,设置中心点坐标和地图级别
	map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
	map.setCurrentCity("青岛"); // 设置地图显示的城市 此项是必须设置的
	map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
</script>
