function(vue, data, actionIndex, rowIndex, event) {
	var view = this;
	view.loading = true;
	view.$http.post('getGridData',{fwCoord:view.fwCoord, fwPage:view.fwPage, fwParam:view.fwParam},{emulateJSON: true}).then(function(res){
		view.loading = false;
		view.tableData = res.data.data;
		view.fwPage = res.data.page;
		var selectedRows = [];
		$.each(view.tableData, function(index, row) {
			if (row["FW_SELECTED"]) {
				console.info(view.id);
				selectedRows.push(row);
			}
		});
		view.$nextTick(function() {
			view.$refs.grid.clearSelection();
			$.each(selectedRows, function(index, row) {
				view.$refs.grid.toggleRowSelection(row, true);
			})
		});
	},function(e){
		view.loading = false;
			console.log(e);
			view.$message({
  			type: 'error',
  			showClose: true,
        title: '提示',
        message: '检索错误',
      });
	});
}