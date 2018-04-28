function(vue, data, actionIndex, rowIndex, event) {
	var view = this;
	var dialogView = null;
	var rows = got.removeNoUseData(data);
	if (rows == null) {
		dialogView.$message({
			type: 'error',
			showClose: true,
      title: '提示',
      message: '请选择要删除的数据！',
    });
		return false;
	}
	var cols = view.columns;
	var colStr = "";
	$.each(cols, function(i, col) {
		if (col.visible && rows.hasOwnProperty(col.id) && rows[col.id]) {
			colStr += (col.label +':' + rows[col.id] +'\r\n');
		}
	});
	 view.$confirm("确认要删除选中的数据吗？\r\n" + colStr)
   .then(function() {
  	 view.fwParam.newListData = [rows];
   	view.loading = true;
   	view.$http.post('deleteData',{fwCoord:view.fwCoord, fwPage:view.fwPage, fwParam:view.fwParam},{emulateJSON: true}).then(function(res){
   	view.loading = false;
   		if (res.data.success) {
   			view.showDialog = false;
     		view.$message({
     			type: 'success',
    			showClose: true,
          title: '提示',
          message: '删除成功',
         });
     		view.loadData();
   		} else {
     		view.$message({
     			type: 'success',
    			showClose: true,
          title: '提示',
           message: '删除错误:' + res.data.errorMsg,
         });
   		}
   	},function(){
   		view.loading = false;
   		view.$message({
   			type: 'success',
  			showClose: true,
        title: '提示',
         message: '删除错误',
       });
   	});
   }).catch(function(){});
}