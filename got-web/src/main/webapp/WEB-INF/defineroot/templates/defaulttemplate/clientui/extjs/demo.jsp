<%@ page language="java" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
    <title></title>
    <!--ExtJs框架开始-->
    <script type="text/javascript" src="/cxfw2/ui/extjs/ext-all.js"></script>
    <script type="text/javascript" src="/cxfw2/ui/extjs/locale/ext-lang-zh_CN.js"></script>
    <link rel="stylesheet" type="text/css" href="/cxfw2/ui/extjs/resources/css/ext-all.css" />
    <style type="text/css">
        .loginicon
        {
            background-image: url(image/login.gif) !important;
        }
    </style>
    <!--ExtJs框架结束-->
    <script type="text/javascript">
        Ext.onReady(function () {
            //初始化标签中的Ext:Qtip属性。
            Ext.QuickTips.init();
            Ext.form.Field.prototype.msgTarget = 'side';
            //提交按钮处理方法
            var btnsubmitclick = function () {
                if (form.getForm().isValid()) {
                    //通常发送到服务器端获取返回值再进行处理，我们在以后的教程中再讲解表单与服务器的交互问题。
                    Ext.Ajax.request({
	                  url: 'demo',
	                  method: 'post',
	                  params: { id: 1 },
	                  success: function (response, options) {
	                      for (i in options) {
	                          alert('options参数:[' + i + "] [" +  + options[i] +"]");
	                      }
	                     //  var responseJson = Ext.util.JSON.decode(response.responseText);
	                      alert(response.responseText);
	                      Ext.Msg.alert("提示", "登陆成功!");
	                  },
	                  failure: function () {
	                      alert('系统出错，请联系管理人员！');
	                  }
	              });
                }
            }
            //重置按钮"点击时"处理方法
            var btnresetclick = function () {
                form.getForm().reset();
            }
            //提交按钮
            var btnsubmit = new Ext.Button({
                text: '提 交',
                handler: btnsubmitclick
            });
            //重置按钮
            var btnreset = new Ext.Button({
                text: '重 置',
                handler: btnresetclick
            });
            //用户名input
            var txtusername = new Ext.form.TextField({
                width: 300,
                allowBlank: false,
                maxLength: 20,
                name: 'username',
                fieldLabel: '用户名',
                blankText: '请输入用户名',
                maxLengthText: '用户名不能超过20个字符'
            });
            //密码input
            var txtpassword = new Ext.form.TextField({
                width: 300,
                allowBlank: false,
                maxLength: 20,
                inputType: 'password',
                name: 'password',
                fieldLabel: '密　码',
                blankText: '请输入密码',
                maxLengthText: '密码不能超过20个字符'
            });
            //验证码input
            var txtcheckcode = new Ext.form.TextField({
                fieldLabel: '验证码',
                id: 'checkcode',
                allowBlank: false,
                width: 150,
                blankText: '请输入验证码！',
                maxLength: 4,
                maxLengthText: '验证码不能超过4个字符!'
            });
            //表单
            var form = new Ext.form.FormPanel({
                url: '******',
                labelAlign: 'right',
                labelWidth: 45,
                frame: true,
                cls: 'loginform',
                buttonAlign: 'center',
                bodyStyle: 'padding:6px 0px 0px 15px',
                items: [txtusername, txtpassword, txtcheckcode],
                buttons: [btnsubmit, btnreset]
            });
            //窗体
            var win = new Ext.Window({
                title: '用户登陆',
                iconCls: 'loginicon',
                plain: true,
                width: 350,
                height: 174,
                resizable: false,
                shadow: true,
                modal: true,
                closable: false,
                animCollapse: true,
                items: form
            });
            win.show();
            //创建验证码
            var checkcode = Ext.getDom('checkcode');
            var checkimage = Ext.get(checkcode.parentNode);
            checkimage.createChild({
                tag: 'img',
                src: 'image/checkcode.gif',
                align: 'absbottom',
                style: 'padding-left:23px;cursor:pointer;'
            });
        });
    </script>
</head>
<body>
<!--
说明：
(1)88行，iconCls: 'loginicon':给窗体加上小图标，样式在第12行定义。
(2)Ext.getDom('checkcode')：根据ID获取Dom。
(3)Ext.get(checkcode.parentNode)：根据Dom获取父节点。
(4)checkimage.createChild()：创建子节点，标签为<img src='image/checkcode.gif'..../>。
(5)form.getForm().isValid()：校验表单的验证项是否全部通过。
(6)form.getForm().reset()：重置表单。
-->
</body>
</html>