<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@page import="cn.got.platform.core.model.*"%>
<%@page import="cn.got.platform.core.model.layout.*"%>
<%@page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>

<%
  String basePath = request.getScheme() + "://"
					+ request.getServerName() + ":" + request.getServerPort()
					+ "/";
			String democlientPath = basePath + "client/";
			String demoerpPath = basePath + "erp/";
			String demomanagerPath = basePath + "manager/";
			String demooaPath = basePath + "oa/";
%>

<!DOCTYPE html>
<html lang="zh">
<head>
<base target="_self" />
<title>${view.title} - ${project.props['project.name'] }</title>
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
	List<FwObject> finalActions = new ArrayList<FwObject>();
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
	Collections.sort(finalActions);
	request.setAttribute("displayActions", finalActions);
	request.setAttribute("otherActions", otherGroupMap);
}
	if (!"1".equals(request.getAttribute("isDialog"))) {
%>
<jsp:include page="../main_header.jsp"></jsp:include>
<%
	}
%>
<script type="text/javascript">
if(self != top){
	top.location.href=self.location.href;
}

var ${pageId}={
    <jsp:include page="../default_view_object.jsp" />
    
	queryGridData: function() {
	},
	
	showUrl: function(url) {
		
	},
}

  $(function() {
    //define.
    try {
      ace.settings.check('navbar', 'fixed')
    } catch (e) {
    }
    try {
      ace.settings.check('main-container', 'fixed')
    } catch (e) {
    }
    try {
      ace.settings.check('sidebar', 'fixed')
    } catch (e) {
    }

    $("#tab_index_frame").attr("height", $(window).height() - 170);
    console.info($(window).height());
    $(window).resize(function() {
      $("#tab_index_frame").attr("height", $(window).height() - 170);
    });

    $("a[type='menu']").each(function() {
      $(this).click(function() {
          showPage(this.id, null, $(this).attr("funcTitle"), $(this).attr("url"));
        /*
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
	<c:if test="${view.argument != null && view.argument.map['autoExtend'] != null}">
		$("#group_${view.argument.map['autoExtend']}").click();
	</c:if>
	<c:if test="${view.argument != null && view.argument.map['autoOpen'] != null}">
		$("#act_${view.argument.map['autoOpen']}").click();
	</c:if>
  });

  function backToTop() {
    $("#title1").html("首页");
    $("#title2").html("");
    $("#tab_index_frame").attr("src", "getView?fwCoord.project=${project.name}&fwCoord.function=portal");
  }

  function showPage(id, title1, title2, url) {
    addTabs({"id":id, "url":url,title:title2,close:true});
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
  
  function updateTodo() {
	var postData = ${pageId}.buildFormDataObject(${pageId}, null);
	postData["fwCoord.function"] = "todo";
	postData["fwCoord.view"] = "grid";
	postData["fwParam.queryType"] = "main";
	got.ajax({
		cache : true,
		type : "POST",
		url : "getExtendData",
		dataType : "json",
		data : postData,
		async : true,
		autoRedirect : true,
		error : function(res, ts, e) {
			console.error("检索错误:" + ts);
		},
		success : function(returnData) {
			if (returnData == null || !returnData.success) {
				if (returnData.errorMsg) {
					console.info(returnData.errorMsg);
				} else {
					console.info('检索错误');
				}
				return;
			}
			var totalCount = 0;
			$('.todoItem').each(function(){
				$(this).remove();
			});
			$.each(returnData.resultData['_FW_TODO'], function(i, item) {
				var liStr = '<li class="todoItem"><a href="javascript:showPage(\''+item['FUNCTION_ID'] +'\',null,\''+item['FUNCTION_NAME']+'\',\'getView?fwParam.workFlowQueryType=10&fwCoord.function='+item['FUNCTION_ID']+'&${view.coord.defaultQueryString}\')">' + 
				'<div class="clearfix">' + 
				'	<span class="pull-left"> <i class="btn btn-xs btn-primary fa fa-user"></i> '+ item['FUNCTION_NAME']+' </span> <span class="pull-right badge badge-info">'+item['TODO_COUNT']+'</span> ' +
				'</div> </a> </li>';
				$('.todoHeader').after(liStr);
				totalCount += parseInt(item['TODO_COUNT']);
			});
			$('.todoCount').each(function(){$(this).html(totalCount)});
			console.log(returnData.resultData);
		}
	});
  }
  
  $(function() {
	// start todo load 
	updateTodo();
	setInterval(updateTodo, 60000);
  });
  

   var requestFullScreen = function(element) {
     var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
      if (requestMethod) {
           requestMethod.call(element);
       } else if (typeof window.ActiveXObject !== "undefined") {
           var wscript = new ActiveXObject("WScript.Shell");
           if (wscript !== null) {
               wscript.SendKeys("{F11}");
           }
       }
   };

   document.onkeydown=function(event){
     var e = event || window.event || arguments.callee.caller.arguments[0];
     if(e && e.keyCode==27){ // 按 Esc 
       //要做的事情
      }
     if(e && e.keyCode==122){ // 按 F11 
        //要做的事情
        requestFullScreen($(".tab-pane.active").find('iframe')[0]);
        $(".tab-pane.active").find('iframe')[0].height = screen.height + 'px';
        if(e.preventDefault){
            e.preventDefault();//
        }else{
            window.event.returnValue = false;//IE
          //注意：这个地方是无法用return false代替的 
          //return false只能取消元素
        }
       }      
      if(e && e.keyCode==13){ // enter 键
        //要做的事情
     }
   }; 
</script>
</head>

<body class="no-skin">
	<form id="${pageId}_form" name="form" action="list" method="post">
		<input type="hidden" id="${pageId}_project" name="fwCoord.project" value="${view.coord.project }" />
		<input type="hidden" id="${pageId}_function" name="fwCoord.function" value="${view.coord.function }" />
		<input type="hidden" id="${pageId}_view" name="fwCoord.view" value="${view.coord.view }" />
		<input type="hidden" id="${pageId}_lang" name="fwCoord.lang" value="${view.coord.lang }" />
		<input type="hidden" id="${pageId}_ui" name="fwCoord.ui" value="${view.coord.ui }" />
	</form>
	<!-- #section:basics/navbar.layout -->
	<div id="navbar" class="navbar navbar-default">
		<div class="navbar-container" id="navbar-container">
			<!-- #section:basics/sidebar.mobile.toggle -->
			<button type="button" class="navbar-toggle menu-toggler pull-left"
				id="menu-toggler">
				<span class="sr-only">Toggle sidebar</span> <span class="icon-bar"></span>
				<span class="icon-bar"></span> <span class="icon-bar"></span>
			</button>

			<!-- /section:basics/sidebar.mobile.toggle -->
			<div class="navbar-header pull-left">
				<!-- #section:basics/navbar.layout.brand -->
				<a href="#" class="navbar-brand"> <small> <c:if
						test="${not empty project.props['project.logo'] }">
						<img width="147" height="43"
							src="${pageContext.request.contextPath}/${project.props['project.logo'] }" />
					</c:if>
					${empty project.props['project.logo']?'<i class="fa fa-key"></i>':'' }&nbsp; <font id="${pageId}_title">${empty project.props['main.title']?project.props['project.name']:project.props['main.title'] }</font>
				</small>
				</a>
				<!-- /section:basics/navbar.layout.brand -->
				<!-- #section:basics/navbar.toggle -->
				<!-- /section:basics/navbar.toggle -->
			</div>

			<!-- #section:basics/navbar.dropdown -->
			<div class="navbar-buttons navbar-header pull-right"
				role="navigation">
				<ul class="nav ace-nav">
				
					<li class="green">
						<a data-toggle="dropdown" class="dropdown-toggle" href="#"> 
							<i class="ace-icon fa fa-tasks icon-animated-bell"></i> 
							<span class="todoCount badge badge-success">0</span>
						</a>
						<ul class="dropdown-menu-right dropdown-navbar navbar-pink dropdown-menu dropdown-caret dropdown-close">
							<li class="dropdown-header todoHeader"> <i class="ace-icon fa fa-exclamation-triangle"></i> <span class="todoCount">0</span> 待办事项 </li>
							<li class="todoItem"><a href="#">
									<div class="clearfix">
										<span class="pull-left"> <i class="btn btn-xs btn-primary fa fa-user"></i> New
											Comments
										</span> <span class="pull-right badge badge-info">+12</span>
									</div>
								</a>
							</li>
							<li class="dropdown-footer"><a href="javascript:showPage('todo','','待办事项','getView?fwParam.queryType=0&fwCoord.function=todo&${view.coord.defaultQueryString}')"> 查看全部待办事项 <i class="ace-icon fa fa-arrow-right"></i> </a></li>
						</ul>
					</li>
				<!-- 
					<li class="purple">
						<a data-toggle="dropdown" class="dropdown-toggle" href="#"> 
							<i class="ace-icon fa fa-bell icon-animated-bell"></i> 
							<span id="${pageId}_alarm_count" class="badge badge-important">999</span>
						</a>
						<ul class="dropdown-menu-right dropdown-navbar navbar-pink dropdown-menu dropdown-caret dropdown-close">
							<li class="dropdown-header"> <i class="ace-icon fa fa-exclamation-triangle"></i> 8 通知事项 </li>
							<li><a href="#">
									<div class="clearfix">
										<span class="pull-left"> <i
											class="btn btn-xs no-hover btn-pink fa fa-comment"></i> New
											Comments
										</span> <span class="pull-right badge badge-info">+12</span>
									</div>
								</a>
							</li>
							<li><a href="#"> <i class="btn btn-xs btn-primary fa fa-user"></i> Bob just signed up as an editor ... </a></li>
							<li><a href="#">
									<div class="clearfix">
										<span class="pull-left"> <i
											class="btn btn-xs no-hover btn-success fa fa-shopping-cart"></i>
											New Orders
										</span> <span class="pull-right badge badge-success">+8</span>
									</div>
								</a>
							</li>
							<li><a href="#">
									<div class="clearfix">
										<span class="pull-left"> <i class="btn btn-xs no-hover btn-info fa fa-twitter"></i> Followers </span> <span class="pull-right badge badge-info">+11</span>
									</div>
								  </a>
							</li>
							<li class="dropdown-footer"><a href="#"> 查看全部通知 <i class="ace-icon fa fa-arrow-right"></i> </a></li>
						</ul>
					</li>
				 -->
					
				<!-- 
					<li class="green">
						<a data-toggle="dropdown" class="dropdown-toggle" href="#"> 
							<i class="ace-icon fa fa-envelope icon-animated-vertical"></i> <span class="badge badge-success">999</span>
						</a>

						<ul class="dropdown-menu-right dropdown-navbar dropdown-menu dropdown-caret dropdown-close">
							<li class="dropdown-header"><i class="ace-icon fa fa-envelope-o"></i> 5 站内信</li>

							<li class="dropdown-content">
								<ul class="dropdown-menu dropdown-navbar">
									<li>
										<a href="#"> 
											<img src="${pageContext.request.contextPath}/ui/common/avatars/avatar.png" class="msg-photo" alt="Alex's Avatar" /> 
											<span class="msg-body"> <span class="msg-title"> <span class="blue">Alex:</span> Ciao sociis natoque penatibus et auctor ... </span> 
											<span class="msg-time"> <i class="ace-icon fa fa-clock-o"></i> <span>a moment ago</span></span>
										</span>
										</a>
									</li>

									<li>
										<a href="#"> 
											<img src="${pageContext.request.contextPath}/ui/common/avatars/avatar3.png" class="msg-photo" alt="Susan's Avatar" /> 
											<span class="msg-body"> <span class="msg-title"><span class="blue">Susan:</span>Vestibulum id ligula porta felis euismod ...</span>
											<span class="msg-time"> <i class="ace-icon fa fa-clock-o"></i> <span>20 minutes ago</span></span>
											</span>
										</a>
									</li>

									<li>
										<a href="#">
											<img src="${pageContext.request.contextPath}/ui/common/avatars/avatar4.png" class="msg-photo" alt="Bob's Avatar" />
											<span class="msg-body"> <span class="msg-title"> <span class="blue">Bob:</span> Nullam quis risus eget urna mollis ornare ... </span> 
											<span class="msg-time"> <i class="ace-icon fa fa-clock-o"></i> <span>3:15 pm</span></span>
											</span>
										</a>
									</li>

									<li>
										<a href="#"> 
											<img src="${pageContext.request.contextPath}/ui/common/avatars/avatar2.png" class="msg-photo" alt="Kate's Avatar" /> 
											<span class="msg-body"> <span class="msg-title"> <span class="blue">Kate:</span> Ciao sociis natoque eget urna mollis ornare ... </span> 
											<span class="msg-time"> <i class="ace-icon fa fa-clock-o"></i> <span>1:33 pm</span></span>
											</span>
										</a>
									</li>

									<li>
										<a href="#"> 
											<img src="${pageContext.request.contextPath}/ui/common/avatars/avatar5.png" class="msg-photo" alt="Fred's Avatar" /> 
											<span class="msg-body"> <span class="msg-title"> <span class="blue">Fred:</span> Vestibulum id penatibus et auctor ... </span> 
											<span class="msg-time"> <i class="ace-icon fa fa-clock-o"></i> <span>10:09 am</span></span>
											</span>
										</a>
									</li>
								</ul>
							</li>

							<li class="dropdown-footer">
								<a href="inbox.html"> 查看全部站内信 <i class="ace-icon fa fa-arrow-right"></i></a>
							</li>
						</ul>
					</li>
				 -->
					<!-- #section:basics/navbar.user_menu -->
					<li class="light-blue">
						<a data-toggle="dropdown" href="#" class="dropdown-toggle"> 
							<img class="nav-user-photo" src="${pageContext.request.contextPath}/ui/images/avatars/user.jpg" alt="Jason's Photo" /> 
							<span class="user-info"> <small>欢迎,</small>${user.name }</span> 
							<i class="ace-icon fa fa-caret-down"></i>
						</a>
						<ul class="user-menu dropdown-menu-right dropdown-menu dropdown-yellow dropdown-caret dropdown-close">
							<li><a href="#" data-toggle="modal" data-target="#${pageId }_componentVersionDialog"> <i class="ace-icon fa fa-cog"></i>版本:<%=cn.got.platform.fw.jfinal.core.GotConst.getVersion() %></a></li>
							<!-- 
							<li><a href="#"> <i class="ace-icon fa fa-cog"></i> 系统设置 </a></li>
							 -->
							<li><a href="#" data-toggle="modal" data-target="#${pageId }_changePasswordDialog"><i class="ace-icon fa fa-user"></i> 修改密码</a></li>
							<li class="divider"></li>
							<li><a href="logout?fwCoord.project=${project.name}"> <i class="ace-icon fa fa-power-off"></i>退出</a></li>
						</ul>
					</li>
					<!-- /section:basics/navbar.user_menu -->
				</ul>
			</div>
			<!-- /section:basics/navbar.dropdown -->
		</div>
		<!-- /.navbar-container -->
	</div>

	<!-- /section:basics/navbar.layout -->
	<div class="main-container" id="main-container">

		<!-- #section:basics/sidebar -->
		<div id="sidebar" class="sidebar responsive">
			<div class="sidebar-shortcuts" id="sidebar-shortcuts">
		<!-- 
				<div class="sidebar-shortcuts-large" id="sidebar-shortcuts-large">
					<button class="btn btn-success" onclick="javascript:window.open('<%=democlientPath%>')">
						<i class="ace-icon fa fa-signal"></i>
					</button>
					<button class="btn btn-info" onclick="javascript:window.open('<%=demoerpPath%>')">
						<i class="ace-icon fa fa-pencil"></i>
					</button>
					<button class="btn btn-warning" onclick="javascript:window.open('<%=demooaPath%>')">
						<i class="ace-icon fa fa-users"></i>
					</button>
					<button class="btn btn-danger" onclick="javascript:window.open('<%=demomanagerPath%>')">
						<i class="ace-icon fa fa-cogs"></i>
					</button>
				</div>
		 -->

					<!-- #section:basics/sidebar.layout.shortcuts -->
					<!-- /section:basics/sidebar.layout.shortcuts -->
					<!-- 
				<div class="sidebar-shortcuts-mini" id="sidebar-shortcuts-mini">
					<span class="btn btn-success" onclick="javascript:window.open('<%=democlientPath%>')"></span> 
					<span class="btn btn-info" onclick="javascript:window.open('<%=demoerpPath%>')"></span> 
					<span class="btn btn-warning" onclick="javascript:window.open('<%=demooaPath%>')"></span> 
					<span class="btn btn-danger" onclick="javascript:window.open('<%=demomanagerPath%>')"></span>
				</div>
					 -->
			</div>
			<!-- /.sidebar-shortcuts -->

			<ul class="nav nav-list" id="${pageId}_mainButtonArea">
				<li class="active" type="menuContainer" >
					<a id="index" href="#" type="menu" baseTitle="主页" funcTitle="工作台" url="getView?fwCoord.project=${project.name}&fwCoord.function=portal&fwCoord.lang=${view.coord.lang}&fwCoord.ui=${view.coord.ui}">
					 <i class="menu-icon fa fa-tachometer"></i>首页 
					</a><b class="arrow"></b>
				</li>
<c:if test="${displayActions != null }">
	<c:forEach var="act" items="${displayActions}" varStatus="status">
		<c:if test="${act.tag=='group' }">
			<c:if test="${fn:length(act.children) > 1 || act.children[0].label != act.title }">
				<li class="">
					<a id="group_${act.id }" href="#" class="dropdown-toggle"><i class="menu-icon fa ${(not empty act.icon)?act.icon:'fa-desktop'} "></i>
					<span class="menu-text">${act.title } </span><b class="arrow fa fa-angle-down"></b>
					</a><b class="arrow"></b>
					<ul class="submenu">
					<c:forEach var="subAct" items="${act.children}" varStatus="subStatus">
						<li type="menuContainer" class="">
						<c:if test="${not empty subAct.argument.map['url'] }">
							<a id="act_${subAct.id}" href="#" type="menu" baseTitle="${act.title }" funcTitle="${subAct.label}" url="${subAct.argument.map['url'] }" >
						</c:if>
						<c:if test="${empty subAct.argument.map['url'] }">
							<a id="act_${subAct.id}" href="#" type="menu" baseTitle="${act.title }" funcTitle="${subAct.label}" url="getView?fwCoord.project=${empty subAct.argument.map['project']?view.coord.project:subAct.argument.map['project'] }&fwCoord.function=${subAct.argument.map['function']}&fwCoord.lang=${view.coord.lang}&fwCoord.ui=${view.coord.ui}&fwCoord.action=${subAct.id}&${subAct.argument.map['queryString']}&" >
						</c:if>
								<i class="menu-icon fa fa-caret-right"></i><i class="fa ${(not empty subAct.icon)?subAct.icon:'fa-desktop'} "></i> ${subAct.label }
							</a><b class="arrow"></b>
						</li>
					</c:forEach>
					</ul>
				</li>  
			</c:if>
			<c:if test="${fn:length(act.children) == 1 && act.children[0].label == act.title && not empty act.children[0].argument.map['url']}">
				<li class="" type="menuContainer" >
					<a id="act_${act.children[0].id}" href="#" type="menu" baseTitle="${act.title }" funcTitle="${act.title }" url="${subAct.argument.map['url'] }">
					 <i class="menu-icon fa ${(not empty subAct.icon)?subAct.icon:'fa-desktop'}"></i>${act.title }
					</a><b class="arrow"></b>
				</li>
			</c:if>
			<c:if test="${fn:length(act.children) == 1 && act.children[0].label == act.title && empty act.children[0].argument.map['url']}">
				<li class="" type="menuContainer" >
					<a id="act_${act.children[0].id}" href="#" type="menu" baseTitle="${act.title }" funcTitle="${act.title }" url="getView?fwCoord.project=${empty act.children[0].argument.map['project']?view.coord.project:act.children[0].argument.map['project'] }&fwCoord.function=${act.children[0].argument.map['function']}&fwCoord.lang=${view.coord.lang}&fwCoord.ui=${view.coord.ui}&fwCoord.action=${act.children[0].id}&${act.children[0].argument.map['queryString']}&">
					 <i class="menu-icon fa ${(not empty subAct.icon)?subAct.icon:'fa-desktop'}"></i>${act.title }
					</a><b class="arrow"></b>
				</li>
			</c:if>
		</c:if>
	</c:forEach>
</c:if>						
			</ul>
			<!-- /.nav-list -->

			<!-- #section:basics/sidebar.layout.minimize -->
			<div class="sidebar-toggle sidebar-collapse" id="sidebar-collapse">
				<i class="ace-icon fa fa-angle-double-left"
					data-icon1="ace-icon fa fa-angle-double-left"
					data-icon2="ace-icon fa fa-angle-double-right"></i>
			</div>

			<!-- /section:basics/sidebar.layout.minimize -->
			<script type="text/javascript">
		        try {
		          ace.settings.check('sidebar', 'collapsed')
		        } catch (e) {
		        }
		    </script>
		</div>

		<!-- /section:basics/sidebar -->
	  <div class="main-content">
		<div class="page-content">
	    <div class="row">
	     <div class="col-xs-12" style="padding-left:5px;">
	      <ul class="nav nav-tabs" role="tablist">
	       <li id="tab_tab_index" role="presentation" class="active">
	       		<a href="#tab_index" aria-controls="tab_index" role="tab" data-toggle="tab" aria-expanded="false">工作台</a>
	       	</li>
	       	
			<li role="presentation" class="dropdown nav navbar-right">
	        <a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
	          <span class="caret"></span>
	        </a>
	        <ul class="dropdown-menu">
	          <li><a href="javascript:closeOtherTabs()">关闭其它</a></li>
	          <li><a href="javascript:closeAllTab()">全部关闭</a></li>
	        </ul>
	      	</li>
	       	
	      </ul>
	      <div class="tab-content">
	       <div role="tabpanel" class="tab-pane active" id="tab_index">
             <iframe id="tab_index_frame" width="95%" frameborder="0" marginheight="0" marginwidth="0" src="getView?fwCoord.project=${project.name}&fwCoord.function=portal"></iframe>
	       </div>
	      </div>
	     </div>
	    </div>
	   </div>
	  </div>
		<!-- /.main-content -->
		<!--  
		<div class="footer">
			<div class="footer-inner">
				<div class="footer-content">
					<span class="bigger-120"> XXXX软件有限公司 &copy; 2014-2015 </span>&nbsp; &nbsp; 
					<span class="action-buttons"> 
						<a href="#"><i class="ace-icon fa fa-twitter-square light-blue bigger-150"></i></a> 
						<a href="#"> <i class="ace-icon fa fa-facebook-square text-primary bigger-150"></i></a> 
						<a href="#"> <i class="ace-icon fa fa-rss-square orange bigger-150"></i></a>
					</span>
				</div>
			</div>
		</div>
-->
		<a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse"> 
			<i class="ace-icon fa fa-angle-double-up icon-only bigger-110"></i>
		</a>
	</div>
	<!-- /.main-container -->

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

	<div class="modal fade" role="dialog"
		id="${pageId }_componentVersionDialog" tabindex="-1"
		aria-labelledby="myModalLabel" style="display: none;">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">×</span>
					</button>
					<h4 class="modal-title" id="myModalLabel">组件版本</h4>
				</div>
				<div class="modal-body">
					<div class="form-group">
						<label>Main:&nbsp; </label><%=cn.got.platform.fw.jfinal.core.GotConst.getVersion() %>
					</div>
					<div class="form-group">
						<label>Framework Core:&nbsp; </label><%=cn.got.platform.fw.jfinal.core.GotConst.getVersion("gotplatform-core") %>
					</div>
					<div class="form-group">
						<label>Framework Business:&nbsp; </label><%=cn.got.platform.fw.jfinal.core.GotConst.getVersion("gotplatform-fw") %>
					</div>
					<div class="form-group">
						<label>Framework Biz JFinal:&nbsp; </label><%=cn.got.platform.fw.jfinal.core.GotConst.getVersion("gotplatform-fw-jfinal") %>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
				</div>
			</div>
		</div>
	</div>
</body>
</html>