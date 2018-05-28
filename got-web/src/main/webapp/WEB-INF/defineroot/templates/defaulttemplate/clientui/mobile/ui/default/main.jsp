<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@page import="cn.got.platform.core.model.layout.*"%>
<%@page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html lang="zh">
<head>
<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
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
</script>
</head>
<body>
    <div class="easyui-navpanel">
        <header>
            <div class="m-toolbar">
                <div class="m-title">${project.props['project.name'] }</div>
                <div class="m-left">
                    <a href="#" class="easyui-linkbutton m-back" data-options="plain:true,outline:true,back:true">返回</a>
                </div>
            </div>
        </header>
        <div class="easyui-tabs" data-options="tabHeight:60,fit:true,tabPosition:'bottom',border:false,pill:true,narrow:true,justified:true">
            <div style="padding:0px">
                <div class="panel-header tt-inner">
                    <i class="fa fa-home" style="font-size: x-large;"></i>报表
                </div>
                <!-- getView?fwCoord.project=${project.name}&fwCoord.function=portal -->
                <iframe id="tab_report_frame" style="height: inherit;" width="100%" frameborder="0" marginheight="0" marginwidth="0" src="getView?fwCoord.project=${project.name}&fwCoord.function=portal&fwCoord.lang=${view.coord.lang}&fwCoord.ui=${view.coord.ui}"></iframe>
            </div>
            <div style="padding:10px">
                <div class="panel-header tt-inner">
                    <i class="fa fa-car" style="font-size: x-large;"></i>定位
                </div>
                <iframe id="tab_location_frame" width="95%" frameborder="0" marginheight="0" marginwidth="0" src=""></iframe>
            </div>
            <div style="padding:10px">
                <div class="panel-header tt-inner">
                    <i class="fa fa-bell" style="font-size: x-large;"></i>报警
                </div>
                <iframe id="tab_alarm_frame" width="95%" frameborder="0" marginheight="0" marginwidth="0" src=""></iframe>
            </div>
            <div style="padding:10px">
                <div class="panel-header tt-inner">
                    <i class="fa fa-tasks" style="font-size: x-large;"></i>任务
                </div>
                <iframe id="tab_task_frame" width="95%" frameborder="0" marginheight="0" marginwidth="0" src=""></iframe>
            </div>
        </div>
    </div>
    <style scoped>
       .tt-inner{
            display:inline-block;
            line-height:12px;
            padding-top:5px;
        }
        p{
            line-height:150%;
        }
    </style>
</body>  
</html>