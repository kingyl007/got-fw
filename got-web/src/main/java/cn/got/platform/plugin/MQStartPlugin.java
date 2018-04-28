/**
Copyright (c) 2015-2017, Warrior (kingyl007@163.com).

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */
package cn.got.platform.plugin;

import javax.jms.Connection;
import javax.jms.DeliveryMode;
import javax.jms.JMSException;
import javax.jms.MessageProducer;
import javax.jms.Session;
import javax.jms.Topic;

import org.apache.activemq.ActiveMQConnectionFactory;

import com.jfinal.kit.Prop;
import com.jfinal.kit.PropKit;
import com.jfinal.plugin.IPlugin;

/**
 * 通知 UserMonitor：FlexMapper已经重启，需要UserMonitor将所有在线的MQFlex客户端向FlexMapper注册，
 * 参照DemoController.addTopic方法 这样Flex才能正常转发MQ消息到客户端
 * 
 * @author kingyl007(kingyl007@163.com)
 */
public class MQStartPlugin implements IPlugin {

  private ActiveMQConnectionFactory connectionFactory;

  public Connection                 connection = null;

  public Session                    session    = null;

  private MessageProducer           producer   = null;

  @Override
  public boolean start() {
    Prop prop = PropKit.use("jms.properties");
    connectionFactory = new ActiveMQConnectionFactory(
        prop.get("jms.common.context.Context.PROVIDER_URL"));
    // 设置用户名和密码.
    connectionFactory.setUserName(prop.get("jms.common.context.userName"));
    connectionFactory.setPassword(prop.get("jms.common.context.password"));
    try {
      connection = connectionFactory.createConnection();
      connection.start();
      session = connection.createSession(false, Session.CLIENT_ACKNOWLEDGE);
      Topic destination = session.createTopic(prop.get("topic.ClientCommon"));
      // 创建消息生产者
      producer = session.createProducer(destination);
      producer.setDeliveryMode(DeliveryMode.NON_PERSISTENT);
      producer.send(session.createTextMessage("*MapperStart#"));
      return true;
    }
    catch (JMSException e) {
      e.printStackTrace();
    }
    return false;
  }

  @Override
  public boolean stop() {
    if (producer != null) {
      try {
        producer.close();
      }
      catch (JMSException e) {
        e.printStackTrace();
      }
    }
    if (session != null) {
      try {
        session.close();
      }
      catch (JMSException e) {
        e.printStackTrace();
      }
    }
    if (connection != null) {
      try {
        connection.close();
      }
      catch (JMSException e) {
        e.printStackTrace();
      }
    }
    return true;
  }

}
