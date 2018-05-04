
<!-- jQuery UI 1.11.4 -->
<script src="${pageContext.request.contextPath}/ui/lib/adminlte2.3.11/plugins/jQueryUI/jquery-ui.min.js"></script>
<!-- Resolve conflict in jQuery UI tooltip with Bootstrap tooltip -->
<script>
	if ($.widget && $.widget.bridge) {
  		$.widget.bridge('uibutton', $.ui.button);
	}
	var eve = {on:function() {}};
	var rangy = {};
</script>
<!-- Bootstrap 3.3.6 -->
<script src="${pageContext.request.contextPath}/ui/lib/adminlte2.3.11/bootstrap/js/bootstrap.min.js"></script>

<link rel="stylesheet" href="${pageContext.request.contextPath}/ui/lib/bootstrap3-dialog-master/dist/css/bootstrap-dialog.min.css" />
<script src="${pageContext.request.contextPath}/ui/lib/bootstrap3-dialog-master/dist/js/bootstrap-dialog.min.js"></script>

<!-- Morris.js charts -->
<script src="${pageContext.request.contextPath}/ui/lib/adminlte2.3.11/plugins/morris/raphael-min.js"></script>
<script src="${pageContext.request.contextPath}/ui/lib/adminlte2.3.11/plugins/morris/morris.min.js"></script>
<!-- Sparkline -->
<script src="${pageContext.request.contextPath}/ui/lib/adminlte2.3.11/plugins/sparkline/jquery.sparkline.min.js"></script>
<!-- jvectormap -->
<script src="${pageContext.request.contextPath}/ui/lib/adminlte2.3.11/plugins/jvectormap/jquery-jvectormap-1.2.2.min.js"></script>
<script src="${pageContext.request.contextPath}/ui/lib/adminlte2.3.11/plugins/jvectormap/jquery-jvectormap-world-mill-en.js"></script>
<!-- jQuery Knob Chart -->
<script src="${pageContext.request.contextPath}/ui/lib/adminlte2.3.11/plugins/knob/jquery.knob.js"></script>
<!-- daterangepicker -->
<script src="${pageContext.request.contextPath}/ui/lib/adminlte2.3.11/plugins/daterangepicker/moment.min.js"></script>
<script src="${pageContext.request.contextPath}/ui/lib/adminlte2.3.11/plugins/daterangepicker/daterangepicker.js"></script>
<!-- datepicker -->
<script src="${pageContext.request.contextPath}/ui/lib/adminlte2.3.11/plugins/datepicker/bootstrap-datepicker.js"></script>
<!-- Bootstrap WYSIHTML5 -->
<script src="${pageContext.request.contextPath}/ui/lib/adminlte2.3.11/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min.js"></script>
<!-- Slimscroll -->
<script src="${pageContext.request.contextPath}/ui/lib/adminlte2.3.11/plugins/slimScroll/jquery.slimscroll.min.js"></script>
<!-- FastClick -->
<script src="${pageContext.request.contextPath}/ui/lib/adminlte2.3.11/plugins/fastclick/fastclick.js"></script>
<!-- AdminLTE App -->
<script src="${pageContext.request.contextPath}/ui/lib/adminlte2.3.11/dist/js/app.js"></script>
