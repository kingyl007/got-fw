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
</head>
<body>
	</c:if> 

<div id="container"></div>
<script type="text/babel">
let value = "demo1";
let buttonName = "submit";
let inputStyle = {
"backgroundColor":"yellow",
"color":"red"
};

const Button = antd.Button;

ReactDOM.render(
<div>

<Button type="primary">Primary</Button>
<Button>Default</Button>
<Button type="dashed">Dashed</Button>
<Button type="danger">Danger</Button>
<input type="text" style={inputStyle} defaultValue={value}/> 
<button>{buttonName}</button>

</div>,
container
)
</script>

	<c:if test="${'1' != showAsDialog}">
</body>
</html>
	</c:if>