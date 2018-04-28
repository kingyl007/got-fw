function(view, data, actionIndex, rowIndex, event) {
	if (got.doValidate(view, true) && view.validate()) {
		if (!view.passwordFromCookie && $(view.getId('remember_password')).attr('checked')) {
			got.setCookie($(view.getId('project')).val() + '_login_userid', $(view.getId('USER_ACCOUNT')).textbox('getValue'), 7);
			got.setCookie($(view.getId('project')).val() + '_login_password', $(view.getId('PASSWORD')).textbox('getValue'), 7);
		}
		if (!$(view.getId('remember_password')).attr('checked')) {
			got.delCookie($(view.getId('project')).val() + '_login_userid');
			got.delCookie($(view.getId('project')).val() + '_login_password');
		}
		document.forms[0].submit();
	}
}