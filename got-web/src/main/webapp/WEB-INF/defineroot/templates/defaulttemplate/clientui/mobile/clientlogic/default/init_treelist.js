var postData = cxfw2.buildDefinePostObject(define, true);
postData["searchKey"] = [ "*", define.listByTreeField ];
postData["searchCondition"] = [ $(define.geteid("searchCondition")).val(),
    $(define.geteid("treeSelectedId")).val() ];
got.ajax({
  cache : true,
  type : "POST",
  url : "getData",
  dataType : "json",
  traditional : true,
  data : postData,
  async : false,
  error : function(res, ts, e) {
    alert("检索错误:" + ts);
  },
  success : function(returnData) {
    // if (returnData.success) {
    // var realResult = returnData.result;
    if (returnData == null) {
      alert('检索错误');
      return;
    }
    define.data = returnData;
    var list = returnData.data;// realResult.list;
    var opts = '';
    var trs = '';
    var cd = null;
    var listButtons = [];
    var columns = define.pageDefine.columnList;
    var value;
    for (var i = 0; i < list.length; i++) {
      opts = "";
      // opts = '<td class="center"></td>';
      // for (var j = 0; j < columns.length; ++j) {
      // cd = columns[j];
      // value = list[i][cd.field];
      // opts = opts + '<td class="center">' + value + '</td>'
      // }
      // opts = opts + '<td class="center">';
      var actions = define.pageDefine.actionList;
      if (actions) {
        for (var k = 0; k < actions.length; ++k) {
          if (actions[k].group == "inList") {
            var action = cxfw2.buildButton(actions[k], define, k, i);
            listButtons.push(define.geteid(actions[k].id + "_" + i));
            opts = opts + action;
          }
        }
      }
      list[i].actions = opts;
      // opts = opts + '</td>';
      // trs = trs + '<tr>' + opts + '</tr>';
    }

    // $(define.geteid("dataArea")).html(trs);
    $(define.geteid("datagrid")).datagrid({
      data : list
    });
    for (var i = 0; i < listButtons.length; ++i) {
      $(listButtons[i]).linkbutton();
    }
    var p = returnData.page;
    $(define.geteid("sortName")).val(p.sortName);
    $(define.geteid("sortOrder")).val(p.sortOrder);
    $(define.geteid("total")).val(p.total);
    $(define.geteid("pageSize")).val(p.pageSize);
    $(define.geteid("pageNumber")).val(p.pageNumber);
    $(define.geteid("pagination")).pagination({
      total : p.total,
      pageSize : p.pageSize,
      pageNumber : p.pageNumber
    });

    $(
        "tr[class='datagrid-header-row'] td[field='"
            + $(define.geteid("sortName")).val() + "'] div").addClass(
        "datagrid-sort-" + $(define.geteid("sortOrder")).val());
    $(define.geteid("datagrid")).datagrid('doCellTip', {
      onlyShowInterrupt : true,
      position : 'bottom'
    });
  }
});