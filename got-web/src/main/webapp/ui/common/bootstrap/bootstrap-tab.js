var addTabs = function(options) {
  // id
  // title
  // close
  // content
  // url
  // var rand = Math.random().toString();
  // var id = rand.substring(rand.indexOf('.') + 1);
  // var url = window.location.protocol + '//' + window.location.host;
  // options.url = url + options.url;
	mainHeight = $(window).height() - 170;
  id = "tab_" + options.id;
  $(".active").removeClass("active");
  // 如果TAB不存在，创建一个新的TAB
  if (!$("#" + id)[0]) {
    // 固定TAB中IFRAME高度
    
    // 创建新TAB的title
    title = '<li type="dynamicTab" role="presentation" id="tab_' + id + '"><a href="#' + id
        + '" aria-controls="' + id + '" role="tab" data-toggle="tab">'
        + options.title;
    // 是否允许关闭
    if (options.close) {
      title += ' <i class="glyphicon glyphicon-remove " tabclose="' + id
          + '"></i>';
    }
    title += '</a></li>';
    // 是否指定TAB内容
    if (options.content) {
      content = '<div type="dynamicTab" role="tabpanel" class="tab-pane" id="' + id + '">'
          + options.content + '</div>';
    } else {// 没有内容，使用IFRAME打开链接
      content = '<div type="dynamicTab" role="tabpanel" class="tab-pane" id="'
          + id
          + '"><iframe id="'
          + id + "_frame"
          + '" src="'
          + options.url
          + '" width="100%" height="'
          + mainHeight
          + '" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="yes" allowtransparency="yes"></iframe></div>';
    }
    // 加入TABS
    $(".nav-tabs").append(title);
    $(".tab-content").append(content);
  } else {
    if (options.refresh) {
      if (options.content) {
        // do nothing
      } else {
        if (options.url) {
          $('#' + id +"_frame").attr('src', options.url);
        } else {
          $('#' + id +"_frame").attr('src', $('#' + id +"_frame").attr('src'));
        }
      }
    }
  }
  // 激活TAB
  $("#tab_" + id).addClass('active');
  $("#" + id).addClass("active");
  return id;
};

var closeOtherTabs = function() {
  $("[type='dynamicTab']").each(function() {
  	if (!$(this).hasClass('active')) {
  		$(this).remove();
  	}
  });
};

var closeAllTab = function() {
  $(".active").removeClass("active");
  $("#tab_tab_index").addClass('active');
  $("#tab_index").addClass("active");
  $("[type='dynamicTab']").each(function() {
    // console.info(this.id);
    // closeTab(this.id);
    $(this).remove();
  });
};
var closeTab = function(id) {
  // 如果关闭的是当前激活的TAB，激活他的前一个TAB
  if ($("#tab_" + id).hasClass('active')) {
    $("#tab_" + id).prev().addClass('active');
    $("#" + id).prev().addClass('active');
  }
  // 关闭TAB
  $("#tab_" + id).remove();
  $("#" + id).remove();
};
$(function() {
  mainHeight = $(document.body).height() - 45;
  $('.main-left,.main-right').height(mainHeight);
  $("[addtabs]").click(function() {
    addTabs({
      id : $(this).attr("id"),
      title : $(this).attr('title'),
      close : true
    });
  });

  $(".nav-tabs").on("click", "[tabclose]", function(e) {
    id = $(this).attr("tabclose");
    closeTab(id);
  });
});