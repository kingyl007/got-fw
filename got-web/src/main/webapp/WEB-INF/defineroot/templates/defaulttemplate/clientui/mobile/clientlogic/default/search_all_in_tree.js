function(view, data, actionIndex, rowIndex, event) {
	var queryStr = $(view.getId("queryValue")).val();
	if (queryStr) {
		$(view.getId("tempTree")).show();
		$(view.getId("tree")).hide();
	} else {
		$(view.getId("tempTree")).hide();
		$(view.getId("tree")).show();
	}
}