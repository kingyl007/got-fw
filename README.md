# got-fw
a framework for rapid business develop

#### ��Ŀ����
����XML�����ļ��Ŀ��ٿ���ƽ̨�������̶ȵĸ�����ΪĿ�ꡣ

��Ҫ�ص㣺
1. ����XML�Ľ���Ԫ��������ʽ,�봫ͳ�����ݿ�������������Ϣ��ͬ�����Է���Ľ��а汾���ơ��ϲ�������
2. �ο�maven�����˼�룬��project��function��view��ui��lang��ά���궨�������ʾ���ԣ��ֱ�ָʾ��Ŀ�����ܡ����桢UI�����ԣ�����ʵ��һ������ɽ��������л���
3. ������װ��������ǰ�˿���������ּ���·�ߣ��Ӵ�ͳ��JQuery\Easyui�������ͻ��˵�Flex�������µ�React��Vue�����϶�����ͬʱ֧�֣����ҿ�����ʱ�л�����˳�ֿ�������װ�ķ�ʽ��ɹ�����չ����ҵ����صĹ��ܶ������ṩĬ�Ϲ�ͨʵ�ֵĻ���֮�ϣ����������ļ���չ�ķ�ʽ�����ϡ�
4. ��������õ�������֮ǰ���еĿ����ɹ�����������Ϊ������������㣬���踴�ƴ��룬���ſ�ܵ������ƣ�����������Խ��Խ�򵥡�
5. ����ģ�巽ʽ�Ĺ��ܿ�����һ�����͵Ĺ���ֻ����һ�Σ�Ŀǰ�Ѿ�ʵ�ֵĹ��ܣ�
```
	��ͨ����
		������¼�������桢�Ż����б��½�/�༭���桢�б�ѡ���桢�첽�����桢���б��棬
	��ͨ����
		�����б�������½����༭������ɾ�������롢�������й������½�����ɾ��
	�û�����	
		�����û�������ɫ����Ȩ�޹�����־����
```
6. ��������ϵͳ�ļ�����չ���ܣ���������ʱ�������������ϵͳ�ļ��ɹ��ܣ��������ı�����Ҫ�޸��������ݿ�ṹ��ҵ�����̣������޸������ļ��е����ҵ���ӳ�䣬������ɼ��ɡ�
7. ��ť/�����м���Ľ���Ȩ�޿��ƣ�����/�ͻ�/�û����������Ȩ�޿��ƣ�����Ԥ���˿���չ�ĸ�ϸ���ȵ�����Ȩ�޿��ƹ���

#### ����ܹ�
������ʱ�����ǿ���������ֿ�����ܡ��Ѿ�ʵ���˻���JFinal�İ汾��

#### ��Ŀ����

1. ����ͨ��ant�ű���������Ŀ��Ŀǰ�Ѿ�������ʾ����Ŀ(demo)��������Ŀ������<projectRoot>/src/main/webapp/WEB-INF/defineroot/projectsĿ¼�£���demo��ĿΪ��(demo��Ŀ��Ŀ¼��<projectRoot>/src/main/webapp/WEB-INF/defineroot/projects/demo�����³�Ϊ<DemoRoot>��
2. �޸�<DemoRoot>/default.properties�е����ݿ�����,Ŀǰ��Ŀ֧��mysql��oracle������mysql��Ҫָ��catalog��oracle��Ҫָ��schema��
```
jdbc.driverClass=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://192.168.10.71/got_demo?useUnicode=true&characterEncoding=utf-8&generateSimpleParameterMetadata=true&zeroDateTimeBehavior=convertToNull
jdbc.user=root
jdbc.password=258369
catalog=got_demo
schema=
```
3. �ҵ�<DemoRoot>/db/Ŀ¼�¶�Ӧ�����ݿ��ʼ���ű��������ִ�д�����ܻ�������ܻ���������GOT_��ͷ��
4. ��ΪJFinal�ڿ��������¿������ڽ�Jetty�����������������ҵ���Ŀ�е�DemoConfig����Java Application���м��ɣ�Ĭ�϶˿�Ϊ8080��
5. ���������http://localhost:8080���������������ʾ��¼ҳ�棬�ڵ�¼ҳ���������û���/���� admin/nimda����¼�ɹ�����ʾ�����档


#### ��ģ�鿪��˵��

1. ����function�ļ�������·��Ϊ<DemoRoot>/skeleton/function�����Դ�����Ŀ¼�����ౣ�棨���ౣ������ڹ��������з������壩�������豣֤�ļ�����function����Ŀ¼��Ψһ��
```
<?xml version="1.0" encoding="UTF-8"?>
<function xmlns="http://www.got-fw.com/schema/function"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://www.got-fw.com/schema/function http://www.got-fw.com/schema/function/function-1.0.xsd"
	ref="demo_function" title="��ʾ����" defaultView="grid">
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
����table->name�Ǵ�ģ��ʹ�õ����������joins��ָʾҪ������ʾ���������ڵı���ʾ����Ҫ��ʾUSER_ID��Ӧ���û���������������ص�join��Ȼ����showColumn����ָʾ��ʾʹ�õ��ֶ�����
��ܻ��Զ���ȡ���������ֶΣ������ж��壬����ͨ��columns->column���޸�ĳ�ֶε���ʾ���ԣ���ʾ����USER_ID����ʾ��ѡ���ǲ����˹�����ķ�ʽ��DEMO_TYPE���ǲ������ֵ�ķ�ʽ��

2. �޸�main.xml�ļ���������������ڣ�
```
<action id="demo_demo" label="��ʾ����" group="system_manager"
					sortIndex="10">
					<argument function="demo_demo" />
				</action>
```
����argument.function��Ӧ�ľ���function���ļ�����
3. ���������ˢ��ҳ�棬�Ϳ��Կ����¼ӵ�ģ�鹦�ܡ��Ѿ������˻���������ɾ���ġ��顢���롢�������й����ܡ�
