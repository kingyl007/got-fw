$('#cc').combobox(
    {
      url : 'combobox_data1.json',
      method : 'get',
      valueField : 'id',
      textField : 'text',
      panelHeight : 'auto',
      multiple : true,
      formatter : function(row) {
        var opts = $(this).combobox('options');
        return '<input type="checkbox" class="combobox-checkbox">'
            + row[opts.textField]
      },
      onLoadSuccess : function() {
        var opts = $(this).combobox('options');
        var target = this;
        var values = $(target).combobox('getValues');
        $.map(values, function(value) {
          var el = opts.finder.getEl(target, value);
          el.find('input.combobox-checkbox')._propAttr('checked', true);
        })
      },
      onSelect : function(row) {
        // console.log(row);
        var opts = $(this).combobox('options');
        var el = opts.finder.getEl(this, row[opts.valueField]);
        el.find('input.combobox-checkbox')._propAttr('checked', true);
        if (!opts.multiple) {
          $($(this).combobox("getData")).each(function(i) {
            var el = opts.finder.getEl(target, this[opts.valueField]);
            el.find('input.combobox-checkbox')._propAttr('checked', false);
          });
        }
      },
      onUnselect : function(row) {
        var opts = $(this).combobox('options');
        var el = opts.finder.getEl(this, row[opts.valueField]);
        el.find('input.combobox-checkbox')._propAttr('checked', false);
      }
    });