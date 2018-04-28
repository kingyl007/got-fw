// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.format = function(fmt) { // author: meizz
  var o = {
    "M+" : this.getMonth() + 1, // 月份
    "d+" : this.getDate(), // 日
    "h+" : this.getHours(), // 小时
    "m+" : this.getMinutes(), // 分
    "s+" : this.getSeconds(), // 秒
    "q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
    "S" : this.getMilliseconds()
  // 毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
        .substr(4 - RegExp.$1.length));
  for ( var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
          : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

var cxfw2 = {
		
		
  initDefineObject : function(id, define) {
    define.id = define.fwid;
    define.project = define.fwpj;
    define["function"] = define.fwfu;
    define.page = define.fwpg;
    define.ui = define.fwui;
    define.lang = define.fwlg;
    define.pageDefine = define.fwpd;
    define.selectedData = define.fwsd;
    define.newData = define.fwnd;
    define.isDialog = define.fwdia;
    fwobj.push(id, define);
    define.actionMap = cxfw2.buildActionMap(define);
    define.columnMap = cxfw2.buildColumnMap(define);
    cxfw2.initDefineFunctions(define);
    return define;
  },
  initArgument : function(define, actionIndex) {
    var args = {};
    if (define.pd.argument) {
      $.each(define.pd.argument.args, function(key, value) {
        args[key] = value;
      });
    }
    if ("undefined" != typeof actionIndex) {
      if (define.pd.actionList[actionIndex].argument) {
        $.each(define.pd.actionList[actionIndex].argument.args, function(key,
            value) {
          args[key] = value;
        });
      }
    }
    return args;
  },
  isSame : function(obj1, obj2) {
    var obj1Empty = cxfw2.isEmpty(obj1);
    var obj2Empty = cxfw2.isEmpty(obj2);
    if (obj1Empty && obj2Empty) {
      return true;
    }
    return obj1 == obj2;
  },

  isEmpty : function(obj) {
    return obj == null || obj == "";
  },
  dateStrToDate : function(dateStr) {
    var resultDate = new Date();
    var dtParts = dateStr.split(" ");
    if (dtParts.length > 0) {
      // have time
      var dateStr = dtParts[0].replace(/\\/g, '-');
      dateStr = dateStr.replace(/\//g, '-');
      var dateParts = dateStr.split('-');
      if (dateParts.length > 2) {
        if (dateParts[2] > 31) {
          resultDate.setFullYear(dateParts[2], dateParts[0] - 1, dateParts[1]);
        } else {
          resultDate.setFullYear(dateParts[0], dateParts[1] - 1, dateParts[2]);
        }
      }
      if (dtParts.length > 1) {
        var timeStr = dtParts[1].replace('.', ':');
        var timeParts = timeStr.split(':');
        if (timeParts.length > 0) {
          resultDate.setHours(timeParts[0], 0, 0, 0);
          if (timeParts.length > 1) {
            resultDate.setMinutes(timeParts[1], 0, 0);
            if (timeParts.length > 2) {
              resultDate.setSeconds(timeParts[2], 0);
              if (timeParts.length > 3) {
                resultDate.setMilliseconds(timeParts[3]);
              }
            }
          }
        }
      } else {
        resultDate.setHours(0, 0, 0, 0);
      }
    }
    return resultDate;
  },

  buildDefineGetParam : function(define, withSearchPageSort, page) {
    return cxfw2.parseParam(cxfw2.buildDefinePostObject(define,
        withSearchPageSort, page));
  },

  buildDefinePostObject : function(define, withSearchPageSort, page) {
    var obj = {
      fwid : define.fwid,
      fwpj : define.fwpj,
      fwfu : define.fwfu,
      fwpg : page ? page : define.fwpg,
      fwui : define.fwui,
      fwlg : define.fwlg
    };
    if (withSearchPageSort) {
      obj.searchCondition = $(define.geteid("searchCondition")).val();
      obj.sortName = $(define.geteid("sortName")).val();
      obj.sortOrder = $(define.geteid("sortOrder")).val();
      obj.total = $(define.geteid("total")).val();
      obj.pageSize = $(define.geteid("pageSize")).val();
      obj.pageNumber = $(define.geteid("pageNumber")).val();
    }
    return obj;
  },

  parseParam : function(param, key) {
    var paramStr = "";
    if (param instanceof String || param instanceof Number
        || param instanceof Boolean) {
      paramStr += "&" + key + "=" + encodeURIComponent(param);
    } else {
      $.each(param, function(i) {
        var k = key == null ? i : key
            + (param instanceof Array ? "[" + i + "]" : "." + i);
        paramStr += '&' + cxfw2.parseParam(this, k);
      });
    }
    return paramStr.substr(1);
  },

  checkFormItemValue : function(define, col) {
    if (col.ui == "easyui-datebox") {
      return $(define.geteid(col.id)).datebox("isValid");
    } else if (col.ui == "easyui-datetimebox") {
      return $(define.geteid(col.id)).datetimebox("isValid");
    } else if (col.ui == "checkbox01") {
      return true;
    } else {
      if (col.dictionary && define.pageDefine.dictionary[col.dictionary]) {
        return $(define.geteid(col.id)).combobox("isValid");
      } else if (col.showId) {
        if (col.valueRef) {
          return $(define.geteid(col.id)).combogrid("isValid");
        } else {
          return $(define.geteid(col.id)).combobox("isValid");
        }
      } else {
        return $(define.geteid(col.id)).textbox("isValid");
      }
    }
  },
  getFormItemValue : function(define, col) {
    if ($(define.geteid(col.id)).length == 0) {
      return define.data[col.field];
    }
    if (col.ui == "easyui-datebox") {
      return cxfw2.dateStrToDate($(define.geteid(col.id)).datebox("getValue"))
          .getTime();
    } else if (col.ui == "easyui-datetimebox") {
      return cxfw2.dateStrToDate(
          $(define.geteid(col.id)).datetimebox("getValue")).getTime();
    } else if (col.ui == "checkbox01") {
      if ($(define.geteid(col.id)).attr("checked")) {
        return 1;
      } else {
        return 0;
      }
    } else {
      if (col.dictionary && define.pageDefine.dictionary[col.dictionary]) {
        return $(define.geteid(col.id)).combobox("getValue");
      } else if (col.showId) {
        if (col.valueRef) {
          // TODO create
          // use showId to create default list
          if ($(define.geteid(col.id)).combogrid("grid")
              .datagrid("getSelected")) {
            return $(define.geteid(col.id)).combogrid("grid").datagrid(
                "getSelected")[col.valueRef.valueField];
          } else {
            return null;
          }
        } else {
          return $(define.geteid(col.id)).combobox("getValue");
        }
      } else {
        return $(define.geteid(col.id)).val();
      }
    }
  },
  setFormItemValue : function(define, col, val, data) {
    if (!val) {
      val = "";
    }
    if (define && col) {
      if (col.ui == "easyui-datebox") {
        $(define.geteid(col.id)).datebox({
          value : val ? new Date(val).format("yyyy-MM-dd") : ""
        });
        $(define.geteid(col.id)).datebox("validate");
      } else if (col.ui == "easyui-datetimebox") {
        $(define.geteid(col.id)).datetimebox({
          value : val ? new Date(val).format("yyyy-MM-dd hh:mm:ss") : ""
        });
        $(define.geteid(col.id)).datetimebox("validate");
      } else if (col.ui == "checkbox01") {
        $(define.geteid(col.id)).attr("checked", val == "1");
      } else {
        if (col.dictionary && define.pageDefine.dictionary[col.dictionary]) {
          $(define.geteid(col.id)).combobox({
            value : val
          });
          $(define.geteid(col.id)).combobox("validate");
        } else if (col.showId) {
          if (col.valueRef) {
            // var tempDataList = [ {} ];
            // tempDataList[0][col.valueRef.valueField] = val;
            // tempDataList[0][col.valueRef.labelField] = data[col.showId];
            $(define.geteid(col.id)).combogrid({
              // data : tempDataList,
              value : val,
            // editable : true
            });
            $(define.geteid(col.id)).combogrid("validate");
          } else {
            $(define.geteid(col.id)).combobox({
              editable : false,
              readonly : true,
              hasDownArrow : false,
              valueField : 'value',
              textField : 'label',
              data : [ {
                value : val,
                label : data[col.showId]
              } ],
              value : val,
              panelHeight : 22,
            });
            $(define.geteid(col.id)).combobox("validate");
          }
        } else {
          $(define.geteid(col.id)).textbox({
            value : val
          });
          $(define.geteid(col.id)).textbox("validate");
        }
      }
    }
  },

  convertFormItem : function(define, col) {
    $(define.geteid(col.id)).css("width", "100%");
    if (col.ui == "easyui-datebox") {
      $(define.geteid(col.id)).datebox({
        required : col.required,
        readonly : !col.editable,
      // formatter: function(date){ return date.format('yyyy-MM-dd');},
      // parser: function(dateStr){ return new
      // Date(Date.parse(dateStr.replace(/-/g,"/")));}
      });
    } else if (col.ui == "easyui-datetimebox") {
      $(define.geteid(col.id)).datetimebox({
        required : col.required,
        readonly : !col.editable,
      // formatter: function(date){ return date.format('yyyy-MM-dd hh:mm:ss');},
      // parser: function(dateStr){ return new
      // Date(Date.parse(dateStr.replace(/-/g,"/")));}
      });
    } else if (col.ui == "checkbox01") {
      // 
    } else {
      if (col.dictionary && define.pageDefine.dictionary[col.dictionary]) {
        var dictionaryCount = define.pageDefine.dictionary[col.dictionary].length;
        $(define.geteid(col.id)).combobox({
          required : col.required,
          readonly : !col.editable,
          editable : false,
          selectOnNavigation : true,
          valueField : 'value',
          textField : 'label',
          data : define.pageDefine.dictionary[col.dictionary],
          panelHeight : 22 * 5,
        });
      } else if (col.showId) {
        if (col.valueRef) {
          var str = "";
          var comboColumns = [];
          var refColumns = col.valueRef.pageType.columnList;
          var tbcol;
          for (var i = 0; i < refColumns.length; ++i) {
            comboColumns.push(cxfw2.buildGridColumn(define, refColumns[i]));
            if (refColumns[i].showId) {
              comboColumns[comboColumns.length - 1].formatter = eval("(function(val,data,index) { " + 
                " return data['"+refColumns[i].showId+"']; " + 
              "})");
            }
          }
          var refDefineObj = cxfw2.buildDefinePostObject(define, false);
          refDefineObj.fwfu = col.valueRef["function"];
          refDefineObj.fwpg = col.valueRef["page"];
          var url = "getEasyuiRefData?"
              + cxfw2.buildDefineGetParam(refDefineObj, false);
          $(define.geteid(col.id))
              .combogrid(
                  {
                    editable : col.editable,
                    mode : "remote",
                    url : url,
                    delay : 800,
                    required : col.required,
                    readonly : !col.editable,
                    idField : col.valueRef.valueField,
                    textField : col.valueRef.labelField,
                    panelWidth : 450,
                    panelHeight : 240,
                    pagination : true,
                    columns : [ comboColumns ],
                    pageSize : 10,// 每页显示的记录条数，默认为10
                    fitColumns : true,
                    striped : true,
                    fit : true,
                    pageList : [ 5, 10 ],// 可以设置每页记录条数的列表
                    onLoadSuccess : function(data) {
                      if (define.data) {
                        var exists = false;
                        $
                            .each(
                                data.rows,
                                function(key, rowData) {
                                  if (rowData[col.valueRef.valueField] == define.data[col.field]) {
                                    exists = true;
                                  }
                                });
                        if (!exists) {
                          var so = {};
                          so[col.valueRef.valueField] = define.data[col.field];
                          so[col.valueRef.labelField] = define.data[col.showId];
                          data.rows.splice(0, 0, so);
                          $(define.geteid(col.id)).combogrid("grid").datagrid(
                              "loadData", data);
                        }
                      }
                    },
                    onSelect : function(rowIndex, rowData) {
                      // TODO if have other refer value set same time
                      // alert(rowIndex);
                      if (col.valueRef && col.valueRef.otherRefs) {
                        var selectMap = {};
                        $.each(col.valueRef.otherRefs, function(key, val) {
                          selectMap[key] = rowData[val];
//                          if (!selectMap[key]) {
//                            selectMap[key] = val;
//                          }
                        });
                        $.each(col.valueRef.otherRefs, function(key, val) {
                          cxfw2.setFormItemValue(define, define.columnMap[key],
                              rowData[val], selectMap);
                        });
                      }
                    }
                  });
        } else {
          $(define.geteid(col.id)).combobox({
            editable : false,
            readonly : !col.editable,
            valueField : 'value',
            textField : 'label',
            data : [],
            panelHeight : 22 * 5,
          });
        }
      } else {
        $(define.geteid(col.id)).textbox({
          required : col.required,
          readonly : !col.editable,
          type : 'text',
          missingMessage : '该输入项为必输项',
        });
        // $.parser.parse(define.geteid(col.id));
      }
    }
  },
  buildFormItem : function(define, col, trStart, trStop, width) {
    var str = '';
    if (trStart) {
      str = '<tr class="trEdit">';
    }
    str = str + '<td class="tdEdit" nowrap>' + (col.label ? col.label : col.field)
        + ':</td>';
    str = str + '<td nowrap width="' + width + '%">';
    if (col.ui == "checkbox01") {
      str = str + '<input type="checkbox" ';
      str = str + 'value = "1" ';
    } else {
      str = str + '<input type="text" ';
    }
    str = str + 'id="' + define.id + '_' + col.id + '" ';
    str = str + 'name="' + (col.field ? col.field : col.id) + '" ';
    // str = str + 'column="' + '20' + '" ';
    // str = str + 'value="' + '' + '" ';
    // str = str + 'class="' + (col.ui ? col.ui : 'easyui-validatebox') + '" ';
    // str = str + 'data-options="'
    // + (col.required ? 'required: true' : 'required: false') + '" ';
    str = str + '/>';
    if (col.required) {
      str = str + '<span class="required">*</span>';
    }
    str = str + '</td>';
    if (trStop) {
      str = str + '</tr>';
    }
    return str;
  },
  commonSetFormValues : function(define, returnData) {
    var columns = define.pageDefine.columnList;
    var value;
    var cd;
    for (var j = 0; j < columns.length; ++j) {
      cd = columns[j];
      value = returnData[cd.field];
      cxfw2.setFormItemValue(define, cd, value, returnData);
    }
  },
  commonSaveForm : function(define, oldData, saveUrl, successProc, failProc) {
    // var oldData = define.editDialog.data;
    var refData = {};
    var newData = {};
    var newValue;
    var columns = define.pageDefine.columnList;
    var diffStr = "";
    // TODO valid input data
    for (var i = 0; i < columns.length; ++i) {
      if (columns[i].pk) {
        refData[columns[i].field] = oldData[columns[i].field];
      }
      newValue = cxfw2.getFormItemValue(define, columns[i]);
      if (!cxfw2.isSame(newValue, oldData[columns[i].field])) {
        newData[columns[i].field] = newValue;
        if (oldData[columns[i].field] != null) {
          refData[columns[i].field] = oldData[columns[i].field];
        }
        diffStr = diffStr + "\r\n" + columns[i].id + " "
            + oldData[columns[i].field] + "->" + newData[columns[i].field];
      }
    }
    // alert(define.id + diffStr);
    postData = cxfw2.buildDefinePostObject(define, true);
    postData.fwsd = refData;
    postData.fwnd = newData;
    postData.fwdia = true;
    $.ajax({
      cache : true,
      type : "POST",
      url : saveUrl ? saveUrl : "update",
      dataType : "text",
      data : postData,
      async : false,
      error : function(res, ts, e) {
        hideLoading();
        failProc(ts);
      },
      success : function(errorMsg) {
        if (errorMsg) {
          failProc(errorMsg);
        } else {
          successProc(errorMsg);
        }
        // return errorMsg;
      }
    });
  },
  buildGridColumn : function(define, col) {
    tbcol = {
      field : col.field,
      title : (col.label ? col.label : col.field),
      width : 50,
      sortable : true,
      resizable : true,
      hidden : (col.visible != null && !col.visible),
      editor : {
        type : 'numberbox',
        options : {
          precision : 2
        }
      },
    };
    if (col.formatter || col.dictionary || col.showId) {
      tbcol.formatter = define.handlers[col.id + "_formatter"];
      if (col.dictionary && !tbcol.formatter) {
        tbcol.formatter = define.dictionaryFormatter;
      }
    }
    // tbcol.editor = {type: "text"};
    // if (tbcol.formatter == null) {
    // tbcol.formatter = define.defaultFormatter;
    // }
    return tbcol;
  },

  buildSearchBox : function(define, act) {
    var str = "";
    str = str + '<input type="text" id="' + define.id // +'_' + act.id
        + '_searchCondition" name="searchCondition" value="" ';
    if (act.enable) {
      str = str + 'onkeyUp="' + define.id + '.handlers.' + act.id
          + '_enter(event)' + '"';
    }
    str = str + '/>';
    return str;
  },

  buildButton : function(act, define, actionIndex, dataIndex) {
    if (!act.visible) {
      return "";
    }
    if (!dataIndex) {
      dataIndex = 0;
    }
    var str = '';
    if (act.id == "searchList" || act.id == "searchTree") {
      str = str + cxfw2.buildSearchBox(define, act);
    }
    str = str + '<a class="easyui-linkbutton" ';
    str = str + 'id="' + define.id + "_" + act.id;
    if (act.group == "inList") {
      str = str + '_' + dataIndex;
    }
    str = str + '" ';
    if (act.icon) {
      str = str + 'iconCls="' + act.icon + '" ';
    }
    str = str + 'data-options="plain:true" ';
    if (act.enable) {
      str = str + 'href="javascript:' + define.id + '.handlers.' + act.id
          + '_click(' + define.id + ', ' + actionIndex;
      if (act.group == "inList") {
        str = str + ', ' + dataIndex;
      }
      str = str + ')"';
    }
    str = str + '>' + act.label + '</a>';
    return str;
  },
  buildAllHandlers : function(define) {
    var str = "";
    if (define) {
      // str = str + '<script>' + define.id +'_handlers =';
      str = str + '({\n';
      if (define.pageDefine.init) {
        str = str + 'init : function(define) { \n';
        str = str + define.pageDefine.init;
        str = str + '\n},\n';
      }
      if (define.pageDefine.eventList) {
        var events = define.pageDefine.eventList;
        var act;
        for (var i = 0; i < events.length; ++i) {
          str = str + events[i].id + ' : ';
          str = str + events[i].logic;
          str = str + ',\n';
        }
      }
      if (define.pageDefine.actionList) {
        var actions = define.pageDefine.actionList;
        var act;
        for (var i = 0; i < actions.length; ++i) {
          if ("undefined" == typeof actions[i].visible) {
            actions[i].visible = true;
          }
          if ("undefined" == typeof actions[i].enable) {
            actions[i].enable = true;
          }
          if (actions[i].click) {
            str = str + actions[i].id + '_click : function(define, actionIndex';
            if (actions[i].group == "inList") {
              str = str + ', rowIndex';
            }
            str = str + ') { \n';
            str = str + actions[i].click;
            str = str + '\n},\n';
          }
          if (actions[i].id.indexOf("earch") >= 0) {
            str = str + actions[i].id + '_enter : function(event) { \n';
            str = str + 'if (event.keyCode==13) { \n';
            // str = str + 'alert(1);\n';
            str = str + define.id + ".handlers." + actions[i].id + '_click('
                + define.id + ', ' + i + ');\n';
            str = str + "}\n";
            str = str + '\n},\n';

          }
        }
      }
      if (define.pageDefine.columnList) {
        var cols = define.pageDefine.columnList;
        for (var i = 0; i < cols.length; ++i) {
          if (cols[i].formatter || cols[i].dictionary || cols[i].showId) {
            str = str + cols[i].id
                + '_formatter : function(val, data, index) {\n';
            if (cols[i].formatter) {
              str = str + cols[i].formatter;
            } else if (cols[i].dictionary) {
              // TODO 多选时，按逗号分割后，分别查Map再拼装
              str = str + 'return ' + define.id + '.dictmap["'
                  + cols[i].dictionary + '"][val];';
            } else if (cols[i].showId) {
              str = str + 'return data["' + cols[i].showId + '"];';
            }
            str = str + '\n}, \n';
          }
        }
      }
      str = str + '}) ';
      // str = str + '</script>';
      // alert(str);
      return str;
    }

  },

  buildAllButtons : function(define, area, treeArea) {
    if ("undefined" == typeof treeArea) {
      var treeArea = area;
    }
    var targetArea = area;
    if (define.pd.actionList) {
      var builtActionGroups = {};
      var actions = define.pd.actionList;
      for (var i = 0; i < actions.length; ++i) {
        if (!actions[i].visible) {
          continue;
        }
        if (actions[i].group && actions[i].group.indexOf("tree") >= 0) {
          targetArea = treeArea;
        } else {
          targetArea = area;
        }
        if (actions[i].group != "inList") {
          if (!define.isDialog || actions[i].group != "notInDialog") {
            var needBuildButton = true;
            if (actions[i].group) {
              if (builtActionGroups[actions[i].group]) {
                continue;
              } else {
                var agl = define.pd.actionGroupList;
                if (agl && agl.length > 0) {
                  var groupName = null;
                  var showDefault = false;
                  for (var gi = 0; gi < agl.length; ++gi) {
                    if (agl[gi].id == actions[i].group) {
                      groupName = agl[gi].title;
                      showDefault = agl[gi].showDefault;
                      break;
                    }
                  }
                  if (groupName == null) {
                    // builtActionGroups[actions[i].group] = true;
                  } else {
                    var addedActions = [];
                    var bgStr = '';
                    if (actions[i].id == "searchList"
                        || actions[i].id == "searchTree") {
                      bgStr = bgStr + cxfw2.buildSearchBox(define, actions[i]);
                    }

                    if (!showDefault) {
                      bgStr = bgStr + '<a id="' + define.id + '_ag_'
                          + actions[i].group + '" href="#">' + groupName
                          + '</a>';
                    } else {
                      bgStr = bgStr + '<a id="' + define.id + '_'
                          + actions[i].id + '" href="#" ';
                      if (actions[i].enable) {
                        bgStr = bgStr + 'onclick="javascript:' + define.id
                            + '.handlers.' + actions[i].id + '_click('
                            + define.id + ', ' + i + ')"';
                      }
                      bgStr = bgStr + '>' + actions[i].label + '</a>';
                    }
                    bgStr = bgStr + '<div id="' + define.id + '_ag_'
                        + actions[i].group + '_mm" >';
                    var k = i;
                    if (showDefault) {
                      k++;
                    }
                    for (; k < actions.length; ++k) {
                      if (actions[k].group == actions[i].group) {
                        addedActions.push(k);
                        bgStr = bgStr + '<div id="' + define.id + '_'
                            + actions[k].id + '" ';
                        bgStr = bgStr + 'onclick="javascript:' + define.id
                            + '.handlers.' + actions[k].id + '_click('
                            + define.id + ', ' + k + ')">' + actions[k].label
                            + '</div>';
                      }
                    }
                    bgStr = bgStr + '</div>';
                    $(bgStr).appendTo($(define.geteid(targetArea)));
                    if (!showDefault) {
                      $(define.geteid("ag_" + actions[i].group)).menubutton({
                        iconCls : actions[i].icon,
                        menu : define.geteid("ag_" + actions[i].group + "_mm"),
                      });
                    } else {
                      $(define.geteid(actions[i].id)).splitbutton({
                        iconCls : actions[i].icon,
                        menu : define.geteid("ag_" + actions[i].group + "_mm"),
                      });
                    }
                    $
                        .each(addedActions,
                            function(index, val) {
                              if (actions[val].icon) {
                                $(
                                    define.geteid("ag_" + actions[i].group
                                        + "_mm")).menu("setIcon", {
                                  target : $(define.geteid(actions[val].id)),
                                  iconCls : actions[val].icon
                                });
                              }
                              if (!actions[val].visible) {
                                $(
                                    define.geteid("ag_" + actions[i].group
                                        + "_mm")).menu("hideItem",
                                    $(define.geteid(actions[val].id)));
                              } else {
                                if (!actions[val].enable) {
                                  $(
                                      define.geteid("ag_" + actions[i].group
                                          + "_mm")).menu("disableItem",
                                      $(define.geteid(actions[val].id)));
                                }
                              }
                            });
                    needBuildButton = false;
                    builtActionGroups[actions[i].group] = true;
                  }
                }
              }
            }
            // if action is in group, check if group is build? not build then
            // build
            if (needBuildButton) {
              var action = cxfw2.buildButton(actions[i], define, i);
              $(action).appendTo($(define.geteid(targetArea)));
              $(define.geteid(actions[i].id)).linkbutton({
                disabled : !actions[i].enable
              });
            }
          }
        }
      }
    }
  },

  buildColumnMap : function(define) {
    var map = {};
    if (define && define.pd && define.pd.columnList) {
      $.each(define.pd.columnList, function(idx, col) {
        map[col.id] = col;
      });
    }
    return map;
  },

  buildActionMap : function(define) {
    var map = {};
    if (define && define.pd && define.pd.actionList) {
      $.each(define.pd.actionList, function(idx, act) {
        map[act.id] = act;
      });
    }
    return map;
  },

  buildDictMap : function(define) {
    var map = {};
    if (define && define.pageDefine && define.pageDefine.dictionary) {
      var list;
      $.each(define.pageDefine.dictionary, function(key, list) {
        map[key] = {};
        $(list).each(function(index, data) {
          map[key][data.value] = data.label;
        });
      });
    }
    return map;
  },

  buildMenu : function(define) {

  },

  initDefineFunctions : function(d) {
    d.handlers = eval(cxfw2.buildAllHandlers(d));
    d.dictmap = cxfw2.buildDictMap(d);
    d.geteid = function(id) {
      return "#" + this.id + "_" + id;
    };

    d.defaultFormatter = function(val, data, index) {
      if (val == null) {
        return "";
      }
      return val;
    };

    d.dictionaryFormatter = function(val, data, index) {
      var define = this;
      if (define.pageDefine && define.pageDefine.columnList[index - 1]) {
        var col = define.pageDefine.columnList[index - 1];
        if (define.dictmap && define.dictmap[col.dictionary]) {
          return define.dictmap[col.dictionary][val];
        }
      }
      return val;
    };

    d.loadData = function() {
      var define = this;
      if (define.handlers["init"]) {
        define.handlers["init"](define);
      }
    };
  }
};

if ("undefined" == typeof fwobj) {
  var fwobj = {
    d : null,
    pd : null,
    id : null,
    parents : [],
    parentIds : [],
    // pages: {},
    pop : function() {
      d = this.parents.pop();
      pd = d.pageDefine;
      id = this.parentIds.pop();
    },
    push : function(id, define) {
      this[id] = define;
      if (this.d) {
        this.parents.push(fwobj.d);
      }

      this.d = define;
      this.pd = this.d.pageDefine;
      this.d.pd = this.d.pageDefine;
      if (this.id) {
        this.parentIds.push(id);
      }
      this.id = id;
    },
    geteid : function(id) {
      return "#" + fwobj.id + "_" + id;
    }
  };
}
var fwojb = fwobj;
