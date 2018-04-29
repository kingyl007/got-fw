# got-fw
a framework for rapid business develop

#### 项目介绍
基于XML描述文件的快速开发平台，以最大程度的复用性为目标。

主要特点：
1. 基于XML的界面元素描述方式,与传统用数据库表保存界面设置信息不同，可以方便的进行版本控制、合并，部署。
2. 参考maven的设计思想，用project、function、view、ui、lang五维坐标定义界面显示特性，分别指示项目、功能、画面、UI、语言，可以实现一参数完成界面特性切换。
3. 基于组装的设计理念，前端可以适配多种技术路线，从传统的JQuery/Easyui、到富客户端的Flex、到最新的React、Vue理论上都可以同时支持，并且可以随时切换。后端充分考虑了组装的方式完成功能扩展，与业务相关的功能都是在提供默认共通实现的基础之上，采用配置文件扩展的方式完成组合。
4. 基于最大复用的设计理念，之前所有的开发成果，都可以做为后续开发的起点，无需复制代码，随着框架的逐步完善，后续开发会越来越简单。
5. 基于模板方式的功能开发，一种类型的功能只开发一次，目前已经实现的功能：
```
	共通界面
		包括登录、主画面、门户、列表、新建/编辑画面、列表选择画面、异步树画面、树列表画面，
	共通操作
		包括列表检索、新建、编辑，批量删除、导入、导出、列管理，树新建、树删除
	用户功能	
		包括用户管理、角色管理、权限管理、日志管理
```
6. 基于现有系统的集成扩展功能，框架在设计时考虑了针对现有系统的集成功能，框架所需的表都不需要修改现有数据库结构及业务流程，仅仅修改配置文件中的相关业务表映射，即可完成集成。
7. 按钮/数据列级别的界面权限控制，部门/客户/用户级别的数据权限控制，并且预留了可扩展的更细粒度的数据权限控制功能

#### 软件架构
框架设计时，考虑可以适配多种开发框架。
后端基于JFinal框架实现。
前端默认实现为Easyui。Vue+ElementUI 已经完成了技术性适配，可以正常显示主页，增、删、改、查，剩余部分功能对标开发。

#### 项目启动

1. 可以通过ant脚本创建新项目，目前已经创建了示例项目(demo)，所有项目保存在[projectRoot]/src/main/webapp/WEB-INF/defineroot/projects目录下，以demo项目为例(demo项目根目录在[projectRoot]/src/main/webapp/WEB-INF/defineroot/projects/demo，以下称为[DemoRoot]：
2. 修改[DemoRoot]/default.properties中的数据库连接,目前项目支持mysql和oracle，其中mysql需要指定catalog，oracle需要指定schema：
```
jdbc.driverClass=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://192.168.10.71/got_demo?useUnicode=true&characterEncoding=utf-8&generateSimpleParameterMetadata=true&zeroDateTimeBehavior=convertToNull
jdbc.user=root
jdbc.password=258369
catalog=got_demo
schema=
```
3. 找到[DemoRoot]/db/目录下对应的数据库初始化脚本，按序号执行创建框架基础表，框架基础表都是以GOT_开头。
4. 因为JFinal在开发环境下可以用内建Jetty服务器启动，所以找到项目中的DemoConfig，以Java Application运行即可，默认端口为8080。
5. 浏览器访问http://localhost:8080，正常情况可以显示登录页面，在登录页面中输入用户名/密码 admin/nimda，登录成功，显示主界面。


#### 新模块开发说明

1. 增加function文件demo_demo.xml，保存路径为[DemoRoot]/skeleton/function，可以创建子目录，分类保存（分类保存仅便于管理，不具有分组意义）。但必需保证文件名在function所有目录下唯一。
```
<?xml version="1.0" encoding="UTF-8"?>
<function xmlns="http://www.got-fw.com/schema/function"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://www.got-fw.com/schema/function http://www.got-fw.com/schema/function/function-1.0.xsd"
	ref="demo_function" title="演示功能" defaultView="grid">
	<table name="DEMO_DEMO" />
	<joins>
		<join name="GOT_USER" type="INNER" alias="U" joinConditions="U.ID=MAIN.USER_ID">
			<columns>
				<column id="USER_NAME" field="NAME" toUser="false" /> 
			</columns>
		</join>
	</joins>
	<columns>
		<column id="ID" editable="false" />
		<column id="USER_ID" showColumn="USER_NAME">
			<valueref function="users" view="select" label="NAME" value="ID"/>
		</column>
		<column id="DEMO_TYPE" dictionary="demo_demo_dic" />
	</columns>
</function>
```
其中table->name是此模块使用的主表表名，joins是指示要关联显示的数据所在的表，如示例中要显示USER_ID对应的用户名，就增加了相关的join表，然后用showColumn属性指示显示使用的字段名。
框架会自动读取表中所有字段，生成列定义，可以通过columns->column中修改某字段的显示属性，如示例中USER_ID的显示和选择是采用了关联表的方式，DEMO_TYPE则是采用了字典的方式。

2. 修改main.xml文件，增加主画面入口：
```
<action id="demo_demo" label="演示功能" group="system_manager"
					sortIndex="10">
					<argument function="demo_demo" />
				</action>
```
其中argument.function对应的就是function的文件名。
3. 在浏览器中刷新页面，就可以看到新加的模块功能。已经具有了基本的增、删、改、查、导入、导出、列管理功能。
