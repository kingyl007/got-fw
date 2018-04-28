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
<link rel="stylesheet" type="text/css" href="${path}/ui/flex/flex3.5/history/history.css" />
<!--  END Browser History required section -->


<title></title>

 <script type="text/javascript">
	var beginTime=new Date().getTime();

</script>
<script src="${path}/ui/flex/flex3.5/AC_OETags.js" language="javascript"></script>
<!--  BEGIN Browser History required section -->
<script src="${path}/ui/flex/flex3.5/history/history.js" language="javascript"></script>
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
<body scroll="no">
<script language="JavaScript" type="text/javascript">
// Version check for the Flash Player that has the ability to start Player Product Install (6.0r65)
var hasProductInstall = DetectFlashVer(6, 0, 65);

// Version check based upon the values defined in globals
var hasRequestedVersion = DetectFlashVer(requiredMajorVersion, requiredMinorVersion, requiredRevision);

var params = ["project=${_project}","function=${_function}","lang=${_lang}"];

 function getUrlPara(paraName){
	var sUrl = location.href;
	var sReg = "(?:\\?|&){1}"+paraName+"=([^&]*)"
	var re=new RegExp(sReg,"gi");
	re.exec(sUrl);
	return RegExp.$1;
}
document.title="";
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
			"src", "${path}/ui/flex/flex3.5/Main.swf",
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
		codebase="${path}/ui/flex/flex3.5/flashplayer/swflash.cab#version=10.0.12.36">
		<param name="movie" value="<%=path %>/ui/flex/flex3.5/Main.swf" />
		<param name="quality" value="high" />
		<param name="bgcolor" value="#869ca7" />
		<param name="allowScriptAccess" value="sameDomain" />
		<embed src="<%=path %>/ui/flex/flex3.5/Main.swf" quality="high" bgcolor="#869ca7"
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
<script src="${path}/ui/flex/flex3.5/history/history.js" language="javascript"></script>
<!-- 动态加载js文件开始 -->
<!-- 
<script src="assets/js/bsp/home/jsloader.js" type="text/javascript" ></script>
 -->
<!-- 动态加载js文件结束 -->
<!--此处用对应项目的FlexAppFrame.html引入的js替换 end-->
  </body>
</html>
