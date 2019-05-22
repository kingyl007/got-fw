import * as got from '../../../got';

export default function formatter(text, record, index, column, view) {
  	if (text) {
	  var dateValue = got.toDate(text);
	  if (dateValue != null) {
	    if (dateValue.format) {
	      return dateValue.format('yyyy-MM-dd hh:mm:ss');
	    }
	    return dateValue;
	  }
	}
  return "";
}