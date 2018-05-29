package cn.got.platform.demo.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.jfinal.aop.Clear;

import cn.got.platform.fw.jfinal.plugin.task.GotTaskPlugin;
import cn.got.platform.fw.jfinal.web.GotBaseController;
import cn.got.platform.fw.jfinal.web.handler.flex.GotMessageService;
import cn.got.util.raw.Util;

/**
 * @author kingyl007(kingyl007@163.com)
 * @since 1.0 Mar 28, 2017 11:23:35 AM <br>
 */
public class DemoController extends GotBaseController {

  @Clear
  public void listProp() {
    List<Map<String, Object>> resultList = new ArrayList<Map<String, Object>>();
    Map<String, Object> map = null;
    for (Map.Entry<Object, Object> entry : System.getProperties().entrySet()) {
      map = new HashMap<String, Object>();
      map.put("key", entry.getKey());
      map.put("value", entry.getValue());
      resultList.add(map);
    }
    renderJson(resultList);
  }

  @Clear
  public void addTopic() {
    String front = getPara("frontKey");
    String back = getPara("backTopic");
    if (!Util.isEmpty(front)) {
      String topic = "CLIENT.TOPIC." + front;
      if (!Util.isEmpty(back)) {
        topic = back;
      }
      GotMessageService.initDestination(front, topic);
      renderText("OK:" + front + "->" + topic);
    }
    else {
      renderText("Empty");
    }
  }

  public void rescheduleTask() {
    String key = getPara("key");
    String cron = getPara("cron");
    boolean enable = getParaToBoolean("enable");
    GotTaskPlugin.rescheduleTask(key, cron, enable);
    renderText("OK");
  }
}
