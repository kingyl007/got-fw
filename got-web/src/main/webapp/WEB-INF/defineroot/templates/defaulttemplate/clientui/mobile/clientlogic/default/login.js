function(view, data, actionIndex, rowIndex, event) {
	if (got.doValidate(view, true) && view.validate()) {
		document.forms[0].submit();
	}
}