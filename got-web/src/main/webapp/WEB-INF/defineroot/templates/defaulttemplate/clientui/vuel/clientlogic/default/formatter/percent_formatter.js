function(val,data,index) {
	if (val) {
	  var intValue = parseFloat(val);
	  if (intValue != null) {
	    return parseInt(intValue * 100) + '%';
	  }
	}
  return "";
}