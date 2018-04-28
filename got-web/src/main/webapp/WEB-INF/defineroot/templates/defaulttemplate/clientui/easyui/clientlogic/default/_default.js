function(view, data, actionIndex, rowIndex, event) {
	var msg = 'TEST '
	    + "this is default \"implements, \nparamentr:define.pageDefine.title="
	    + view.title + "\n";
	if ("undefined" == typeof actionIndex) {
		msg = msg + "actionIndex not defined\n";
	} else {
		msg = msg + "actionIndex=" + actionIndex + "\n";
	}
	if ("undefined" == typeof rowIndex) {
		msg = msg + "rowIndex not defined\n";

	} else {
		msg = msg + "rowIndex=" + rowIndex;
	}
	alert(msg);
}