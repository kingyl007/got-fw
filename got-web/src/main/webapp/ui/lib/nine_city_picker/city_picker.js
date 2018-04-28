$.fn.showcityall=function(options){
	var i_i=0,i_i1=0;
	var str="";
	var _this=this,objss=null;
	var htmlpo='<div class="provinceCity" style="display: none;z-index:99999;">'		
		+ '<div class="tabs clearfix" id="showcityall_tab" style="width:304px;padding-left:0px;"><ul class=""><li><a  class="current" tb="hotCity"> '
		+' 常用省市</a></li>	<li><a  tb="province" class="">省份</a></li><li><a tb="city" id="city" class="">城市</a></li><li>'
		+ '<a  tb="county" id="county" class="">区县</a></li></ul></div><div class="con" >		'				
		+ ' <div class="province invis" style="display: block;"><div class="list">	'
		+ '<ul id="constents"><li><a style="background: none repeat scroll 0% 0% transparent; border: 0px none;" href="javascript:onclick=viewCities(0);" id="120000" class="current">天津</a></li>'
		+ '</ul></div></div></div>	</div>';
	options = $.extend({  
                position  :"bottom",       //right,top,bottom,center
                offset :0,      //even line class name         
                hover:"hover",     //mouse hover class name  
                click:"click"  
            },options);  
	$(this).focus(function(){
		$('.provinceCity').remove();
		$("body").append(htmlpo);
		var offset = $(_this).offset(); 
		if(options.position=='right'){
		
		$('.provinceCity').css({left:offset.left +$(_this).width(),top:offset.top+options.offset});
			}else if(options.position=='center'){
		$('.provinceCity').css({left:offset.left- ($('.provinceCity').width()- $(_this).width())/2,top:offset.top+$(_this).height()+options.offset});
			}else{
		$('.provinceCity').css({left:offset.left,top:offset.top+$(_this).height()+options.offset});		
				}
		$(".provinceCity").show();     
		$("#showcityall_tab ul li").css("cursor", "pointer");
		objss=$("#showcityall_tab ul li a").first();
		$("#showcityall_tab ul li a").click(function(){
			if($(this).attr("tb")=='county' || $(this).attr("tb")=='city'){
				
				return false;
				}
			str='';
			    $(objss).removeClass("current");
			    $(this).addClass("current");
			    //点击标题读内容
				if($(this).attr("tb")=='hotCity'){
					 getarea(1,this,'hotcity');
				}else{
					getarea(86,this,'province');
				}
				objss=this;
			
			});
			getarea(1,this,'hotcity');
			$("body").click(function(e){
					e=window.event?window.event:e;
					
		            var sskk=$('.provinceCity').offset();
					//alert(e.offsetHeight +"  ||  "+ sskk.top);
					//alert(sskk);
					if(sskk != "null" && sskk != null){
					if(e.x > sskk.left + $('.provinceCity').width() || e.x < sskk.left ){
						str="";
						$("body").unbind("click");	
						$('.provinceCity').remove();	
					    return false;
					}}
						
				
					
		});	

		});
			
		//点击标题读内容
	var getarea=function (idssdd,obj,typel)
	{
        var parentVal = $(obj).text();
		var htmls="";
		var item;
		var id_ss;
		 if(typel == "province"){
			 for(var i=0;i<provices.length;i++){
					htmls +='<li><a tags="'+provices[i][1]+'" tts="'+provices[i][1]+'">'+provices[i][0]+'</a></li>';
					}
		 }
		 else if(typel == "city"){
			 for(var i=0;i<cities.length;i++){
				   if(parentVal == cities[i][1]){
					   htmls +='<li><a tags="'+cities[i][1]+'" tts="'+cities[i][1]+'">'+cities[i][0]+'</a></li>';
				   }
				}
		 }else  if(typel == "area"){
			 for(var i=0;i<areas.length;i++){
				   if(parentVal == areas[i][1]){
					htmls +='<li><a tags="'+areas[i][1]+'" tts="'+areas[i][1]+'">'+areas[i][0]+'</a></li>';
				   }
					}
		 }else{
			
			 for(var i=0;i<hotcitys.length;i++){
				   htmls +='<li><a tags="'+hotcitys[i][1]+'" tts="'+hotcitys[i][1]+'">'+hotcitys[i][0]+'</a></li>';
			}
		 }
			$('#constents').html(htmls);
			$('#constents li').css("cursor", "pointer");
			$('#constents li a').click(function(){
			
				//alert( $(objss).attr("tb"));
				 $(objss).removeClass("current");
				  if($(objss).attr("tb")=="hotCity" ){
					     if($(this).attr("tts") ==86){
						 $(objss).parent().next().next().children("a").addClass("current");
						 objss=$(objss).parent().next().next().children("a");
						 }else{
						  $(objss).parent().next().next().next().children("a").addClass("current");
						  objss=$(objss).parent().next().next().next().children("a"); 
						 }
					 	 id_ss=$(this).attr("tags");
					  }else if($(objss).attr("tb")=='province')
					  {
						 $(objss).parent().next().children("a").addClass("current");
						 objss=$(obj).parent().next().children("a");
					 }else if($(objss).attr("tb")=='city'){
						 $(objss).parent().next().children("a").addClass("current");
						 objss=$(objss).parent().next().children("a");
						 
					 }else{
							 $(objss).parent().next().children("a").addClass("current");
						     objss=$(objss).parent().next().children("a"); 
							 $('.provinceCity').remove();	
							 
					 }
				if(str==""){
					str+=$(this).text();
					}else if("" != $(this).text()){
					str+="-"+$(this).text();	
						}
				 $(_this).val(str);
				
				 id_ss=$(this).attr("tags");
				 if($('.provinceCity').length ==0){
					 str="";
					 }
				 if(typel == "city"){
					 getarea(id_ss,this,'area');
				 }else if(typel == "hotcity" && $(this).attr("tts") !=86) {
					 getarea(id_ss,this,'area');
				 }else if(typel != "area") {
					 getarea(id_ss,this,'city');
				 }
				 if(typel == "area"){  //选完之后做change事件
					 var this_val = $(_this).val();
					 var this_agrs = this_val.split('-');
					 if(this_agrs.length < 3){     //处理选择城市自动添加省份
						 var ctlength = cities.length;
						 var pro_nm = "";
						 for(var c=0;c < ctlength; c++){
							 if(this_agrs[0]==cities[c][0]){
								 pro_nm = cities[c][1];
								 break;
							 }
						 }
						 $(_this).val(pro_nm+"-"+this_val);
					 }
					 $(_this).change();
				 }
				});
				
			}  //点击标题读内容结束
	}