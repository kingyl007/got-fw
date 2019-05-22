function(val,data,index) {
	if (val) {
	  var dateValue = got.toDate(val);
	  if (dateValue != null) {
	    if (dateValue.format) {
	      console.info("4");
	      return dateValue.format('yyyy-MM-dd hh:mm:ss');
	    }
	    return dateValue;
	  }
	}
  return "";
}