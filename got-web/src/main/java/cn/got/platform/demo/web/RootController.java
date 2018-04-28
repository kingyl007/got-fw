package cn.got.platform.demo.web;

import java.util.Arrays;

import org.apache.commons.codec.digest.DigestUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import cn.got.platform.fw.jfinal.core.GotConfig;
import cn.got.platform.fw.jfinal.web.GotBaseController;
import cn.got.util.raw.Util;

import com.jfinal.aop.Clear;
import com.jfinal.kit.HttpKit;
import com.jfinal.kit.PropKit;

@Clear
public class RootController extends GotBaseController {

  private final Logger log = LoggerFactory.getLogger(getClass());

  public void index() {
    String msg = HttpKit.readData(getRequest());
    System.out.println(msg);
    String nonce = getPara("nonce");
    String timestamp = getPara("timestamp");
    String signature = getPara("signature");
    String echostr = getPara("echostr");
    String openId = getPara("openid");
    if (!Util.isEmpty(nonce) && !Util.isEmpty(timestamp) && !Util.isEmpty(signature)) {

      String[] arr = new String[3];
      arr[0] = (nonce);
      arr[1] = (timestamp);
      arr[2] = (PropKit.get("wechat.token"));
      for (int i = 0; i < arr.length; ++i) {
        if (arr[i] == null) {
          arr[i] = Util.asString(i);
        }
      }
      Arrays.sort(arr);
      String serverSignature = DigestUtils.shaHex(Util.join("", arr));
      System.out.println(serverSignature);
      if (serverSignature.equalsIgnoreCase(signature)) {
        if (!Util.isEmpty(echostr)) {
          renderText(echostr);
        }
        else if (!Util.isEmpty(openId)) {
          //          System.out.println("Put session id:" + this.getSession().getId() +",ip:" + HttpUtil.getRemoteAddress(getRequest()));
          //          this.setSessionAttr(IBizService.KEY_WECHAT_OPENID, openId);
          renderText(openId);
        }

      }
      else {
        renderText("not Varified");
      }
    }
    else {
      redirect("/index.jsp");
    }
  }

  public void setDevMode() {
    GotConfig.setDevMode(getParaToBoolean("devMode"));
    log.info("Set system dev mode to :{}", getParaToBoolean("devMode"));
  }
}
