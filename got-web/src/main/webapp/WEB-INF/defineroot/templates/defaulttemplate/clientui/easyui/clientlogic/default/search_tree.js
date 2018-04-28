function(view, data, actionIndex, rowIndex, event) {
	if (view.searchStatus.inSearching) {
		console.info('searching');
		return;
	}
	if ($(view.getId('queryValue')).val() == view.searchStatus.queryValue) {
		if (view.searchStatus.resultList) {
			console.info('select next');
			view.selectNode(view);
			return;
		}
		return;
	}
	var queryValue = $(view.getId('queryValue')).val();
	if (queryValue == null || queryValue == "") {
		return;
	}

	//  
	// var preIndex = view.searchStatus.index;
	// var currentIndex = preIndex + 1;
	// if (currentIndex >= view.searchStatus.resultList.length) {
	// currentIndex = 0;
	// }
	// if (currentIndex >=0 && currentIndex < view.searchStatus.resultList.length
	// - 1) {
	// var preItem = view.searchStatus.resultList[preIndex];
	// var item = view.searchStatus.resultList[currentIndex];
	// var toExpandItem = item;
	// if (item["TARGET"]) {
	// var targetNode = $(view.getId("tree")).tree("find", item["id"]);
	// if (targetNode && targetNode.target) {
	// $(view.getId("tree")).tree("expandTo", targetNode.target);
	// $(view.getId("tree")).tree("scrollTo", targetNode.target);
	// $(view.getId("tree")).tree("select", targetNode.target);
	// view.searchStatus.index = currentIndex;
	// return;
	// } else {
	// toExpandItem = preItem;
	// currentIndex = preIndex;
	// }
	// }
	// targetNode = $(view.getId("tree")).tree("find", toExpandItem["id"]);
	// if (targetNode && targetNode.target) {
	// view.searchStatus.inSearching = true;
	// view.searchStatus.index = currentIndex;
	// $(view.getId("tree")).tree({onExpand: function(node) {
	// if (view.searchStatus.inSearching) {
	//            
	// }
	// },
	// });
	// $(view.getId("tree")).tree("expand", targetNode.target);
	// return;
	// }
	// }
	// if (currentItem != null) {
	// if (currentItem.children && currentItem.children.length &&
	// currentItem.children.length > 0)
	// return;
	// }
	if (data == null) {
		data = $(view.getId("form")).serialize();
	}

	got.ajax({
		cache : true,
		type : "POST",
		url : "queryTreeData",
		dataType : "json",
		data : data,
		async : true,
		error : function(res, ts, e) {
			alert("检索错误:" + ts);
		},
		success : function(returnData) {
			if (returnData == null) {
				alert('检索错误');
				return;
			}
			var loopArr = [];
			var amap = {};
			var addFun = function(nodes, map) {
				if (nodes && nodes.length && nodes.length > 0) {
					for ( var i = 0; i < nodes.length; ++i) {
						// console.info(nodes[i].id);
						// console.warn(nodes[i]);
						map[nodes[i].id] = nodes[i];
						loopArr.push(nodes[i]);
						addFun(nodes[i]["children"], map);
					}
				}
			};
			addFun(returnData, amap);
			console.info(loopArr);
			// $(view.getId("tree")).tree("find", returnData[0][""])
			view.searchStatus.resultList = loopArr;
			view.searchStatus.map = amap;
			view.searchStatus.index = 0;
			view.searchStatus.queryValue = queryValue;
			view.selectNode(view);
			// view.searchStatus.item = returnData[0];
		}
	});
}