function(val,data,index) {
	if (val) {
	  var dateValue = got.toDate(val);
	  if (dateValue != null) {
	    if (dateValue.format) {
	      return dateValue.format('yyyy-MM-dd');
	    }
	    return dateValue;
	  }
	}
  return "";
}