<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ page trimDirectiveWhitespaces="true"%>
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
	if (!"1".equals(request.getAttribute("isDialog"))) {
%>
<%
  }
%>
<!DOCTYPE html>
<html>
<head>
<meta HTTP-EQUIV="pragma" CONTENT="no-cache">
<meta HTTP-EQUIV="Cache-Control" CONTENT="no-cache, must-revalidate">
<meta HTTP-EQUIV="expires" CONTENT="0">
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>${view.title} - ${project.props['project.name'] }</title>
<!-- Tell the browser to be responsive to screen width -->
<meta
	content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
	name="viewport">
<jsp:include page="header.jsp" />

<script type="text/javascript">
if(self != top){
	top.location.href=self.location.href;
}

var ${pageId}={
    <jsp:include page="../default_view_object.jsp" />
    promptAlarms : null,
    isShowAlarmPrompt : true,
    isPlayAlarmSound : true,
    // promptAlarms: []
	queryGridData: function() {
	},
	
	showUrl: function(url) {
		
	},
};

  $(function() {
	<c:if test="${(user!=null && user.args!=null && user.args['lrcAlarmSetting'] != null && (not empty user.args['lrcAlarmSetting']['ALARM_TARGET']))}">
	${pageId}.promptAlarms = '${user.args['lrcAlarmSetting']['ALARM_TARGET']}'.split(',');
	</c:if>
	<c:if test="${user!=null && user.args!=null && user.args['lrcAlarmSetting'] != null}">
		${pageId}.isShowAlarmPrompt = ${user.args['lrcAlarmSetting']['IS_SHOW_ALARM_WINDOW']=='1'?'true':'false'};
		${pageId}.isPlayAlarmSound = ${user.args['lrcAlarmSetting']['IS_PLAY_ALARM_SOUND']=='1'?'true':'false'};
	
	</c:if>
    $("#tab_index_frame").attr("height", $(window).height() - 150);
    $(window).resize(function() {
      $("#tab_index_frame").attr("height", $(window).height() - 150);
    });


    $("a[type='menu']").each(function() {
      $(this).click(function() {
        showPage(this.id, null, $(this).attr("funcTitle"), $(this).attr("url"));
        /*
        $("#mainTitle").html($(this).attr("funcTitle"));
        $("#title1").html($(this).attr("baseTitle"));
        $("#title2").html($(this).attr("funcTitle"));
        $("#fragment-1").attr("src", $(this).attr("url"));
        */
        $("li[type='menuContainer']").each(function() {
          $(this).removeClass('active');
        });
        $(this).parent().addClass("active");
      });
    });		
		<c:if test="${not empty view.onInit}">
		if (${pageId}['${view.onInit}']) {
		  ${pageId}['${view.onInit}'](${pageId}, $(${pageId}.getId("form")).serialize());
		}
		</c:if>

  });
  
  function updateAlarmSetting(isPlayAlarmSound, isLoopAlarmSound, isShowAlarmPrompt, promptAlarms, alarmSoundPath) {
  	console.info(isPlayAlarmSound+"," + isLoopAlarmSound +"," + isShowAlarmPrompt +"," + promptAlarms +"," + alarmSoundPath);
  	${pageId}.isPlayAlarmSound = (isPlayAlarmSound == '1');
  	if (!${pageId}.isPlayAlarmSound) {
  		stopPlayAlarmSound(true);
  	}
  	${pageId}.isShowAlarmPrompt = (isShowAlarmPrompt == '1');
  	if (isLoopAlarmSound == '1') {
  		$(${pageId}.getId('alarm_sound'))[0].setAttribute("loop","");
  	} else {
  		$(${pageId}.getId('alarm_sound'))[0].removeAttribute("loop");
  	}
  	${pageId}.promptAlarms = promptAlarms;
  	if (alarmSoundPath) {
  		$(${pageId}.getId('alarm_sound'))[0].setAttribute("src", alarmSoundPath);
  	}
  }
  
  function clearAllAlarm() {
  	stopPlayAlarmSound(true);
    $('#${pageId }_alarm_container').empty();
    $.each(ALARM_MAP, function(a) {
      if (a && ALARM_MAP[a].count) {
      	ALARM_MAP[a].count = 0;
      }
    });
    recalAlarmCount();
  }

  function showAlarmMsg(url, vehicleNum, opt) {
  	if(${pageId}.isShowAlarmPrompt) {
  		toastr.warning("<a href='#' onclick='showPage(\"" + opt.function + "\", null, \"" + opt.title +"\", \"" + url +"\")'>车辆[" + vehicleNum +"]发生" + opt.title +"</a>", opt.title);
  	}
  }
  
  function stopPlayAlarmSound(forceStop) {
  	if (forceStop) {
  		var sound = $(${pageId}.getId('alarm_sound'))[0];
  		console.info(sound);
  		if (sound) {
  			sound.pause();
  		}
  	}
  }
  
  function playAlarmSound() {
  	if (${pageId}.isPlayAlarmSound) {
	  	var sound = $(${pageId}.getId('alarm_sound'))[0];
	  	if (sound) {
	  		sound.pause();
	  		sound.play();
	  	}
  	}
  }
  
  var ALARM_MAP = {
      'LOWPOWER':{'icon':'glyphicon-flash', 'title':'设备低电报警', 'function':'lowpoweralarm', 'count':0, 'div':null},
      'OVER7DAYS':{'icon':'glyphicon-calendar', 'title':'超7天未回传报警', 'function':'over7day', 'count':0, 'div':null},
      'OVER24HOURS':{'icon':'"glyphicon-time"', 'title':'超24小时未回传报警', 'function':'over24hour', 'count':0, 'div':null},
      'DISMENTAL':{'icon':'glyphicon-wrench', 'title':'设备拆除报警', 'function':'dismantle_alarm_report', 'count':0, 'div':null},
      'OFFLINE':{'icon':'glyphicon-warning-sign', 'title':'设备离线报警', 'function':'abnormal_offline', 'count':0, 'div':null},
      'CROSSPROVINCE':{'icon':'glyphicon-share', 'title':'车辆跨省报警', 'function':'crosscity', 'count':0, 'div':null},
    /*  'CROSSCITY':{'icon':'glyphicon-share', 'title':'车辆跨市报警', 'function':'crosscity', 'count':0, 'div':null},*/
      'INRISKPOI':{'icon':'glyphicon-screenshot', 'title':'风险点停留报警', 'function':'dangerspot_stop', 'count':0, 'div':null},
      'OUTAREA':{'icon':'glyphicon-screenshot', 'title':'出区域报警', 'function':'danger_area_inout', 'count':0, 'div':null},
      'INAREA':{'icon':'glyphicon-screenshot', 'title':'进区域报警', 'function':'danger_area_inout', 'count':0, 'div':null},
      'DEVICES_DIVIDED':{'icon':'glyphicon-screenshot', 'title':'主从分离报警', 'function':'connect_device_divided', 'count':0, 'div':null},
      'BOTH_OFFLINE':{'icon':'glyphicon-screenshot', 'title':'主从同时离线报警', 'function':'connect_device_both_offline', 'count':0, 'div':null},
      'COMBO_ALARM':{'icon':'glyphicon-screenshot', 'title':'风险组合报警', 'function':'combo_alarm', 'count':0, 'div':null},
      
  };
//==MQ Start==
  
  function recalAlarmCount() {
    var totalCount = 0;
    $.each(ALARM_MAP, function(a) {
      if (a && ALARM_MAP[a].count) {
      	totalCount += ALARM_MAP[a].count;
      }
    });
    $('#${pageId }_alarm_total_count').text(totalCount);
    $('#${pageId }_alarm_total_msg').text(totalCount>0?('共'+totalCount+'条报警'):'无报警');
}
  var globalMQ = null;
  var mqMsgHandler = {
  	onAlarm: function(msg) {
  	  // console.info("1_${user.loginId}_${user.customerId} alarm:" + msg);
  	  if (msg) {
  	    var msgs = msg.split('#');
  	    if (msgs.length > 0) {
  	      $.each(msgs, function(i, m) {
  	        if (m) {
  	          if (m.indexOf('*alm,') == 0) {
  	            console.info(m);
  	          	var mp = m.split(',');
  	          	if (mp.length > 2) {
  	          	  if (ALARM_MAP[mp[2]]) {
  	          	  	var vehicleNum = null;
  	          	  	if (mp.length > 3) {
  	          	  		vehicleNum = mp[3];
  	          	  	}
  	          	    var opt = ALARM_MAP[mp[2]];
  	          	    opt.count = opt.count+1;
  	          	    var url = 'getView?fwCoord.project=${project.name}&fwCoord.function='+opt.function+'&fwCoord.lang=${view.coord.lang}&fwCoord.ui=${view.coord.ui}';
  	          	    playAlarmSound();
  	          	    showAlarmMsg(url, vehicleNum, opt);
  	          	    if (opt.div == null) {
  	          	      var content = '<li><a id="main_alarm_'+mp[2]+'" key="'+mp[2]+'" href="#" type="alarmMsg" funcTitle="'+opt.title+'" url="'+url+'" ><i class="fa '+opt.icon+' text-yellow"></i><i id="main_alarm_'+mp[2]+'_text">'+opt.count + '条' + opt.title+'</i></a></li>';
  	          	      $(content).appendTo($('#${pageId }_alarm_container'));
  	          	      $('#main_alarm_'+mp[2]).click(function() {
  	          	        showPage(this.id, null, $(this).attr("funcTitle"), $(this).attr("url"), true);
  	          			var key = $(this).attr("key");
  	          			if (key && ALARM_MAP[key]) {
  	          			  ALARM_MAP[key].count = 0;
  	          			  ALARM_MAP[key].div = null;
  	          			}
  	          			recalAlarmCount();
  	          			$(this).remove();
  	          	      });
  	          	      opt.div = true;
  	          	    } else {
  	          	      $('#main_alarm_'+mp[2]+'_text').text(opt.count + '条' + opt.title);
  	          	    }
  	          	    recalAlarmCount();
  	          	  }
  	          	}
  	          }
  	          
  	        }
  	      });
  	    }
  	  }
  	}
  };
  
  $(function() {
    <c:if test="${not empty user}" >
	    globalMQ = org.activemq.Amq;
	    globalMQ.init(
	     { 
	       uri: 'amq', 
	       logging: true, 
	       timeout: 30, 
	       clientId:(new Date()).getTime().toString() 
	     }
	    );
	    globalMQ.addListener("main_alarmId","topic://CLIENT.TOPIC.MQ_1_${user.loginId}_${user.customerId}", mqMsgHandler.onAlarm);
	    globalMQ.sendMessage("topic://CLIENT.TOPIC.CMD.UP", "*lgn,1,${user.loginId},${user.customerId}#");
  	</c:if>
  	
  		toastr.options = {
	        closeButton: true,  
	        debug: false,  
	        progressBar: false,  
	        positionClass: "toast-top-right",  
	        onclick: null,  
	        showDuration: "300",  
	        hideDuration: "1000",  
	        timeOut: "15000",  
	        extendedTimeOut: "1000",  
	        showEasing: "swing",  
	        hideEasing: "linear",  
	        showMethod: "fadeIn",  
	        hideMethod: "fadeOut"  
    	};
  		
  		toastr.subscribe(function(args) {
  			console.info(args);
  			stopPlayAlarmSound(args.state == 'close');
  		});
	
  });
//==MQ End==

  function backToTop() {
    $("#title1").html("首页");
    $("#title2").html("");
    $("#tab_index_frame").attr("src", "getView?fwCoord.project=${project.name}&fwCoord.function=portal");
  }
  
  function rereshPortal() {
  	if ($("#tab_index_frame")[0] && $("#tab_index_frame")[0].contentWindow && $("#tab_index_frame")[0].contentWindow.updatePortalData) {
  		$("#tab_index_frame")[0].contentWindow.updatePortalData();
  	}
  }

  function showPage(id, title1, title2, url, refreshWhenOpened) {
    var doRefresh = (typeof refreshWhenOpened != 'undefined') && refreshWhenOpened;
    return addTabs({"id":id, "url":url,title:title2,close:true, refresh:doRefresh});
    // $("#tab_index_frame").attr("src",url);
	//  $("#title2").html(title2);
	//  $("#mainTitle").html(title2);

    /*
    $("#title1").html(title1);
    $("#title2").html(title2);
    $("li[class='active']").each(function() {
      $(this).attr("class", "");
    });
    $(obj).parent().attr("class", "active");
    $("#tab_index_frame").attr("src", url);
    */
  }
</script>
</head>
<body class="hold-transition skin-lgreen-light sidebar-mini">
	<form id="${pageId}_form" name="form" action="list" method="post">
		<input type="hidden" id="${pageId}_project" name="fwCoord.project" value="${view.coord.project }" />
		<input type="hidden" id="${pageId}_function" name="fwCoord.function" value="${view.coord.function }" />
		<input type="hidden" id="${pageId}_view" name="fwCoord.view" value="${view.coord.view }" />
		<input type="hidden" id="${pageId}_lang" name="fwCoord.lang" value="${view.coord.lang }" />
		<input type="hidden" id="${pageId}_ui" name="fwCoord.ui" value="${view.coord.ui }" />
	</form>
	<div class="wrapper">

		<header class="main-header">
			<!-- Logo -->
			<a href="#" class="logo"> <!-- mini logo for sidebar mini 50x50 pixels -->
				<span class="logo-mini">${project.props['project.code'] }</span> <!-- logo for regular state and mobile devices -->

				<span class="logo-lg"> <c:if
						test="${not empty project.props['project.logo'] }">
						<img width="147" height="43"
							src="${project.props['project.logo'] }" />
					</c:if>
			</span>
			</a>
			<!-- Header Navbar: style can be found in header.less -->
			<nav class="navbar navbar-static-top">
				<!-- Sidebar toggle button-->
				<a href="#" class="sidebar-toggle" data-toggle="offcanvas"
					role="button"> <span class="sr-only">折叠</span>
				</a> <font size="5" color="#ffffff" style="font-weight: normal;">${project.props['main.title'] }</font>
				<div class="navbar-custom-menu">
					<ul class="nav navbar-nav">
						<!-- Messages: style can be found in dropdown.less-->
						<!-- Notifications: style can be found in dropdown.less -->
						<li class="dropdown notifications-menu"><a href="#"
							class="dropdown-toggle" data-toggle="dropdown"> <i
								class="fa fa-bell-o"></i> <span
								id="${pageId }_alarm_total_count" class="label label-warning">0</span>
						</a>
							<ul class="dropdown-menu">
								<li class="header" id="${pageId }_alarm_total_msg">无报警</li>
								<li>
									<!-- inner menu: contains the actual data -->
									<ul id="${pageId }_alarm_container" class="menu">

									</ul>
								</li>
								<li class="footer"><a href="#" onclick="clearAllAlarm()">全部清除</a></li>
							</ul></li>
						<!-- Tasks: style can be found in dropdown.less -->
						<!-- User Account: style can be found in dropdown.less -->
						<li class="dropdown user user-menu"><a href="#"
							class="dropdown-toggle" data-toggle="dropdown"> <img
								src="${pageContext.request.contextPath}/ui/images/avatars/user_avatar3.jpg"
								class="user-image" alt="User Image"> <span
								class="hidden-xs">${user.loginId }</span>
						</a>
							<ul class="dropdown-menu">
								<!-- User image -->
								<li class="user-header"><img
									src="${pageContext.request.contextPath}/ui/images/avatars/user_avatar3.jpg"
									class="img-circle" alt="User Image">
									<p>
										${user.name } <small>${user.customerName }</small>
									</p></li>
								<!-- Menu Body -->

								<!-- Menu Footer-->
								<li class="user-footer">
									<div class="pull-left">
										<a href="#" class="btn btn-default btn-flat"
											data-toggle="modal"
											data-target="#${pageId }_changePasswordDialog">修改密码</a>
									</div>
									<div class="pull-right">
										<a href="logout?fwCoord.project=${project.name}"
											class="btn btn-default btn-flat">登出</a>
									</div>
								</li>
							</ul></li>
						<!-- Control Sidebar Toggle Button -->
					</ul>
				</div>
			</nav>
		</header>
		<!-- Left side column. contains the logo and sidebar -->
		<aside class="main-sidebar">
			<!-- sidebar: style can be found in sidebar.less -->
			<section class="sidebar">
				<!-- Sidebar user panel -->
				<!-- search form -->
				<!-- /.search form -->
				<!-- sidebar menu: : style can be found in sidebar.less -->
				<ul class="sidebar-menu">
					<li class="header">主菜单</li>
					<li class="active treeview" type="menuContainer"><a id="index"
						href="#" type="menu" baseTitle="主页" funcTitle="工作台"
						url="getView?fwCoord.project=${project.name}&fwCoord.function=portal&fwCoord.lang=${view.coord.lang}&fwCoord.ui=${view.coord.ui}">
							<i class="fa fa-dashboard"></i><span class="header">工作台</span>
					</a></li>
					<c:if test="${displayActions != null }">
						<c:forEach var="act" items="${displayActions}" varStatus="status">
							<c:if test="${act.tag=='group' }">
								<li class="treeview"><a href="#"> <i
										class="fa  ${(not empty act.icon)?act.icon:'fa-desktop'}"></i>
										<span>${act.title }</span> <span class="pull-right-container">
											<i class="fa fa-angle-left pull-right"></i>
									</span>
								</a>
									<ul class="treeview-menu">
										<c:forEach var="subAct" items="${act.children}"
											varStatus="subStatus">
											<li type="menuContainer"><a id="${subAct.id}" href="#"
												type="menu" baseTitle="${act.title }"
												funcTitle="${subAct.label}"
												url="getView?fwCoord.project=${(empty subAct.argument.map['project'])?view.coord.project:subAct.argument.map['project'] }&fwCoord.function=${subAct.argument.map['function']}&fwCoord.view=${subAct.argument.map['view']}&fwCoord.lang=${view.coord.lang}&fwCoord.ui=${view.coord.ui}">
													<i
													class="fa ${(not empty subAct.icon)?subAct.icon:'fa-desktop'}"></i>
													${subAct.label}
											</a></li>
										</c:forEach>
									</ul></li>
							</c:if>
						</c:forEach>
					</c:if>
				</ul>
			</section>
			<!-- /.sidebar -->
		</aside>

		<!-- Content Wrapper. Contains page content -->
		<div class="content-wrapper">
			<!-- Content Header (Page header) 
    <section class="content-header">
      <h1 id="mainTitle">工作台
        <small></small>
      </h1>
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-dashboard"></i> <font id="title1">工作台</font></a></li>
        <li class="active"><font id="title2"></font></li>
      </ol>
    </section>
    -->

			<!-- Main content -->
			<ul class="nav nav-tabs" role="tablist">
				<li id="tab_tab_index" role="presentation" class="active"><a
					href="#tab_index" aria-controls="tab_index" role="tab"
					data-toggle="tab" aria-expanded="false">工作台</a></li>

				<li role="presentation" class="dropdown nav navbar-right"><a
					class="dropdown-toggle" data-toggle="dropdown" href="#"
					role="button" aria-haspopup="true" aria-expanded="false"> <span
						class="caret"></span>
				</a>
					<ul class="dropdown-menu">
						<li><a href="javascript:closeOtherTabs()">关闭其它</a></li>
						<li><a href="javascript:closeAllTab()">全部关闭</a></li>
					</ul></li>
			</ul>
			<div class="tab-content">
				<div role="tabpanel" class="tab-pane active" id="tab_index">
					<iframe id="tab_index_frame" width="100%" frameborder="0"
						marginheight="5" marginwidth="5"
						src="getView?fwCoord.project=${project.name}&fwCoord.function=portal&fwCoord.lang=${view.coord.lang}&fwCoord.ui=${view.coord.ui}"></iframe>
				</div>
			</div>
			<!-- /.content -->
		</div>
		<!-- /.content-wrapper -->

		<!-- Control Sidebar -->
		<!-- /.control-sidebar -->
		<!-- Add the sidebar's background. This div must be placed
       immediately after the control sidebar -->
		<div class="control-sidebar-bg"></div>
	</div>
	<!-- ./wrapper -->

	<script type="text/javascript">
	function postChangePassword() {
		var view = ${pageId};
		console.info('to post');
		if (got.isEmpty($(view.getId('OLD_PASSWORD')).val())) {
			alert('旧密码不能为空，请重新输入');
			return;
		}
		if (got.isEmpty($(view.getId('NEW_PASSWORD')).val())) {
			alert('新密码不能为空，请重新输入');
			return;
		}
		if ($(view.getId('NEW_PASSWORD')).val() != $(view.getId('NEW_PASSWORD2')).val()) {
			alert('两次输入的密码不一致，请重新输入');
			return;
		}
		var postData = view.buildFormDataObject(view, null);
		postData['OLD_PASSWORD'] = $(view.getId('OLD_PASSWORD')).val();
		postData['NEW_PASSWORD'] = $(view.getId('NEW_PASSWORD')).val(); 
		
		got.ajax({
			cache : true,
			type : "POST",
			url : "changePassword",
			dataType : "json",
			data : postData,
			async : false,
			error : function(res, ts, e) {
				alert("更新错误:" + ts);
			},
			success : function(result) {
				if (result.success) {
					$(${pageId}.getId('changePasswordDialog')).modal('hide');
					if (result.errorMsg && result.errorMsg != '') {
						alert("保存成功:" + result.errorMsg);
					} else {
						alert("保存成功");
					}
				} else {
					if (result.validResultMap) {
						// view.dialogs[dialogName].validErrorMap = result.validResultMap;
						// got.doValidate(view.dialogs[dialogName], true);
						// $.remind('错误', '输入错误:' + result.errorMsg, "error", 3000);
					} else {
						alert("错误:" + result.errorMsg);
					}
				}
			}
		});
	}
	
	$(function () {
		var view = ${pageId};
		$(view.getId('changePasswordDialog')).on('hide.bs.modal', function () {
		$(view.getId('OLD_PASSWORD')).val('');
		$(view.getId('NEW_PASSWORD')).val('');
		$(view.getId('NEW_PASSWORD2')).val('');
		})
 	});
</script>
	<div class="modal fade" role="dialog"
		id="${pageId }_alarmSettingDialog" tabindex="-1"
		aria-labelledby="myModalLabel" style="display: none;">
		<div class="modal-dialog">
			<div class="modal-content"></div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary"
					onclick="postChangePassword()">保存</button>
				<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
			</div>
		</div>
	</div>

	<div class="modal fade" role="dialog"
		id="${pageId }_changePasswordDialog" tabindex="-1"
		aria-labelledby="myModalLabel" style="display: none;">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">×</span>
					</button>
					<h4 class="modal-title" id="myModalLabel">修改密码</h4>
				</div>
				<form id="${pageId }_changePasswordForm" action="changePassword"
					method="post">
					<div class="modal-body">
						<div class="form-group">
							<label for="exampleInputPassword1">请输入旧密码</label> <input
								type="password" class="form-control"
								id="${pageId }_OLD_PASSWORD" name="OLD_PASSWORD"
								placeholder="旧密码">
						</div>
						<div class="form-group">
							<label for="exampleInputPassword1">请输入新密码</label> <input
								type="password" class="form-control"
								id="${pageId }_NEW_PASSWORD" name="NEW_PASSWORD"
								placeholder="新密码">
						</div>
						<div class="form-group">
							<label for="exampleInputPassword1">再次输入新密码</label> <input
								type="password" class="form-control"
								id="${pageId }_NEW_PASSWORD2" name="NEW_PASSWORD2"
								placeholder="再次新密码">
						</div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary"
							onclick="postChangePassword()">保存</button>
						<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
					</div>
				</form>
			</div>
		</div>
	</div>

</body>
<div id="${pageId}_dialogs" style="display: none"></div>
</html>
