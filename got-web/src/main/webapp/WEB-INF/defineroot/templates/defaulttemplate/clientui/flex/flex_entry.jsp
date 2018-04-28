<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<%
	response.setHeader("Pragma", "No-cache");
	response.setDateHeader("Expires", 0);
	response.setHeader("Cache-Control", "no-cache");
 %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<!--  BEGIN Browser History required section -->
<link rel="stylesheet" type="text/css" href="history/history.css" />
<!--  END Browser History required section -->


<title></title>

 <script type="text/javascript">
	var beginTime=new Date().getTime();

</script>
<script src="flex/AC_OETags.js" language="javascript"></script>
<!--  BEGIN Browser History required section -->
<script src="history/history.js" language="javascript"></script>
<!--  END Browser History required section -->

<style>
body { margin: 0px; overflow:hidden }
</style>
<script language="JavaScript" type="text/javascript">
var closeWindow = true;

// -----------------------------------------------------------------------------
// Globals
// Major version of Flash required
var requiredMajorVersion = 9;
// Minor version of Flash required
var requiredMinorVersion = 0;
// Minor version of Flash required
var requiredRevision = 28;
</script>
</head>
 <% 
 	String dutyId = request.getParameter("_dutyId");
 	if(dutyId == null){
 		dutyId = "";
 	}else{
 		dutyId = dutyId;
 	}
 %>
<!--  body scroll="no" onbeforeunload="_onbeforeunload();" --> 
<body scroll="no">
<script language="JavaScript" type="text/javascript">
// Version check for the Flash Player that has the ability to start Player Product Install (6.0r65)
var hasProductInstall = DetectFlashVer(6, 0, 65);

// Version check based upon the values defined in globals
var hasRequestedVersion = DetectFlashVer(requiredMajorVersion, requiredMinorVersion, requiredRevision);

var params = [];
<% if(request.getParameter("_w") != null){ %>
params.push('width=<%=request.getParameter("_w") %>');
<% } else { %>
params.push('width=900');
<% } %>

<% if(request.getParameter("_h") != null){ %>
params.push('height=<%=request.getParameter("_h") %>');
<% } else { %>
params.push('height=605');
<% } %>

 function getUrlPara(paraName){
	var sUrl = location.href;
	var sReg = "(?:\\?|&){1}"+paraName+"=([^&]*)"
	var re=new RegExp(sReg,"gi");
	re.exec(sUrl);
	return RegExp.$1;
}

 <%  if(request.getParameter("_t") != null && !"".equals(request.getParameter("_t"))) { %>
 var _title = decodeURI(getUrlPara("_t"));
params.push("title="+_title);
document.title=_title;
<% } else { %>
params.push("title="));
document.title="";
<% } %>
params.push("group="+encodeURIComponent('<%=request.getParameter("_g") %>'));
params.push("module="+encodeURIComponent('<%=request.getParameter("_m") %>'));

if ( hasProductInstall && !hasRequestedVersion ) {
	// DO NOT MODIFY THE FOLLOWING FOUR LINES
	// Location visited after installation is complete if installation is required
	var MMPlayerType = (isIE == true) ? "ActiveX" : "PlugIn";
	var MMredirectURL = window.location;
    document.title = document.title.slice(0, 47) + " - Flash Player Installation";
    var MMdoctitle = document.title;

	AC_FL_RunContent(
		"src", "playerProductInstall",
		"FlashVars", "MMredirectURL="+MMredirectURL+'&MMplayerType='+MMPlayerType+'&MMdoctitle='+"&"+params.join("&"),
		"width", "100%",
		"height", "100%",
		"align", "middle",
		"id", "FlexApp",
		"wmode", "window",
		"quality", "high",
		"bgcolor", "#869ca7",
		"name", "FlexApp",
		"allowScriptAccess","sameDomain",
		"allowFullScreen","true",     
		"type", "application/x-shockwave-flash",
		"pluginspage", "http://www.adobe.com/go/getflashplayer"
	);
} else if (hasRequestedVersion) {
	// if we've detected an acceptable version
	// embed the Flash Content SWF when all tests are passed
	AC_FL_RunContent(
			"src", "flex/Main",
			"width", "100%",
			"height", "100%",
			"align", "middle",
			"id", "FlexApp",
			"wmode", "window",
			"quality", "high",
			"bgcolor", "#869ca7",
			"name", "FlexApp",
			"allowScriptAccess","sameDomain",
			"allowFullScreen","true",     
			"type", "application/x-shockwave-flash",
			"FlashVars", params.join("&"),
			"pluginspage", "http://www.adobe.com/go/getflashplayer"
	);
  } 
  // flash is too old or we can't detect the plugin
  /*else {  
    var alternateContent = 'Alternate HTML content should be placed here. '
  	+ 'This content requires the Adobe Flash Player. '
   	+ '<a href=http://www.adobe.com/go/getflash/>Get Flash</a>';
    document.write(alternateContent);  
  }*/
  // insert non-flash content
</script>
<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" tabIndex="-1"
		id="FlexApp" width="100%" height="100%"
		codebase="/flashplayer/swflash.cab#version=10.0.12.36">
		<param name="movie" value="flex/Main.swf" />
		<param name="quality" value="high" />
		<param name="bgcolor" value="#869ca7" />
		<param name="allowScriptAccess" value="sameDomain" />
		<embed src="flex/Main.swf" quality="high" bgcolor="#869ca7"
			width="100%" height="100%" name="FlexApp" align="middle"
			play="true"
			loop="false"
			quality="high"
			allowScriptAccess="sameDomain"
			allowFullScreen="true"
			type="application/x-shockwave-flash"
			pluginspage="http://www.adobe.com/go/getflashplayer">
		</embed>
</object>
<!--此处用对应项目的FlexAppFrame.html引入的js替换 begin-->
<script src="history/history.js" language="javascript"></script>
<!-- 动态加载js文件开始 -->
<script src="assets/js/bsp/home/jsloader.js" type="text/javascript" ></script>
<!-- 动态加载js文件结束 -->
<!--此处用对应项目的FlexAppFrame.html引入的js替换 end-->
  </body>
</html>
