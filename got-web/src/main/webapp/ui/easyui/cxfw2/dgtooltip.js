/**
 * Created with JetBrains WebStorm. User: cao.guanghui Date: 13-6-26 Time:
 * 下午11:27 To change this template use File | Settings | File Templates.
 */
$
    .extend(
        $.fn.datagrid.methods,
        {
          /**
           * 开打提示功能（基于1.3.3版本）
           * 
           * @param {}
           *          jq
           * @param {}
           *          params 提示消息框的样式
           * @return {}
           */
          doCellTip : function(jq, params) {
            function showTip(showParams, td, e, dg) {
              // 无文本，不提示。
              if ($(td).text() == "")
                return;

              params = params || {};
              var options = dg.data('datagrid');
              showParams.content = '<div class="tipcontent" style="max-width:300px;">'
                  + showParams.content + '</div>';
              $(td).tooltip({
                content : showParams.content,
                trackMouse : true,
                position : params.position,
                onHide : function() {
                  $(this).tooltip('destroy');
                },
                onShow : function() {
                  var tip = $(this).tooltip('tip');
                  if (showParams.tipStyler) {
                    tip.css(showParams.tipStyler);
                  }
                  if (showParams.contentStyler) {
                    tip.find('div.tipcontent').css(showParams.contentStyler);
                  }
                }
              }).tooltip('show');

            }
            ;
            return jq
                .each(function() {
                  var grid = $(this);
                  var options = $(this).data('datagrid');
                  if (!options.tooltip) {
                    var panel = grid.datagrid('getPanel').panel('panel');
                    panel
                        .find('.datagrid-body')
                        .each(
                            function() {
                              var delegateEle = $(this).find(
                                  '> div.datagrid-body-inner').length ? $(this)
                                  .find('> div.datagrid-body-inner')[0] : this;
                              $(delegateEle)
                                  .undelegate('td', 'mouseover')
                                  .undelegate('td', 'mouseout')
                                  .undelegate('td', 'mousemove')
                                  .delegate(
                                      'td[field]',
                                      {
                                        'mouseover' : function(e) {
                                          if($(this).attr('field')===undefined || $(this).attr('field') == '_FW_ACTIONS')
                                            return;
                                          var that = this;
                                          var setField = null;
                                          if (params.specialShowFields
                                              && params.specialShowFields.sort) {
                                            for (var i = 0; i < params.specialShowFields.length; i++) {
                                              if (params.specialShowFields[i].field == $(
                                                  this).attr('field')) {
                                                setField = params.specialShowFields[i];
                                              }
                                            }
                                          }
                                          if (setField == null) {
                                            options.factContent = $(this).find(
                                                '>div').clone().css({
                                              'margin-left' : '-5000px',
                                              'width' : 'auto',
                                              'display' : 'inline',
                                              'position' : 'absolute'
                                            }).appendTo('body');
                                            var factContentWidth = options.factContent
                                                .width();
                                            params.content = $(this).text();
                                            if (params.onlyShowInterrupt) {
                                              if (factContentWidth > $(this)
                                                  .width()) {
                                                showTip(params, this, e, grid);
                                              }
                                            } else {
                                              showTip(params, this, e, grid);
                                            }
                                          } else {
                                            panel
                                                .find('.datagrid-body')
                                                .each(
                                                    function() {
                                                      var trs = $(this)
                                                          .find(
                                                              'tr[datagrid-row-index="'
                                                                  + $(that)
                                                                      .parent()
                                                                      .attr(
                                                                          'datagrid-row-index')
                                                                  + '"]');
                                                      trs
                                                          .each(function() {
                                                            var td = $(this)
                                                                .find(
                                                                    '> td[field="'
                                                                        + setField.showField
                                                                        + '"]');
                                                            if (td.length) {
                                                              params.content = td
                                                                  .text();
                                                            }
                                                          });
                                                    });
                                            showTip(params, this, e, grid);
                                          }
                                        },
                                        'mouseout' : function(e) {
                                          if (options.factContent) {
                                            options.factContent.remove();
                                            options.factContent = null;
                                          }
                                        }
                                      });
                            });
                  }
                });
          },
          /**
           * 关闭消息提示功能（基于1.3.3版本）
           * 
           * @param {}
           *          jq
           * @return {}
           */
          cancelCellTip : function(jq) {
            return jq.each(function() {
              var data = $(this).data('datagrid');
              if (data.factContent) {
                data.factContent.remove();
                data.factContent = null;
              }
              var panel = $(this).datagrid('getPanel').panel('panel');
              panel.find('.datagrid-body').undelegate('td', 'mouseover')
                  .undelegate('td', 'mouseout').undelegate('td', 'mousemove')
            });
          }
        });