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

<a href="http://www.got-fw.com">got-fw.com</a>

 */
package cn.got.platform.demo.web;

import java.net.URLEncoder;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import cn.got.platform.fw.jfinal.web.GotBaseController;
import cn.got.platform.fw.jfinal.wechat.WeChatPlugin;
import cn.got.util.raw.Util;

import com.jfinal.aop.Clear;
import com.jfinal.kit.PropKit;

/**
 * @author kingyl007(kingyl007@163.com)
 * @since 1.0 2017年10月10日 下午3:57:10 <br>
 */
@Clear
public class WechatController extends GotBaseController {

  private final Logger log = LoggerFactory.getLogger(getClass());

  public void index() {
    if ("test".equalsIgnoreCase(getPara("auto"))) {
      authRedirect(
          "/wx/fakeAuth?appid={APPID}&redirect_uri={REDIRECT_URI}&response_type=code&scope={SCOPE}&state={STATE}#wechat_redirect",
          "test");
    }
    else {
      authRedirect(PropKit.get("wechat.auth.url"), getPara("auto"));
    }
  }

  private void authRedirect(String authUrl, String state) {
    // if parameter have auto
    // auto=1: direct redirect to call login
    // auto is null or 0: redirct to login view
    if (PropKit.getBoolean("wechat.auth")) {
      String auto = state;
      //      String auto = getPara("auto");
      //      String authUrl = PropKit.get("wechat.auth.url");
      // https://open.weixin.qq.com/connect/oauth2/authorize?appid={APPID}&redirect_uri={REDIRECT_URI}&response_type=code&scope={SCOPE}&state={STATE}#wechat_redirect
      authUrl = authUrl.replaceAll("\\{APPID\\}", PropKit.get("wechat.appid"));
      authUrl = authUrl.replaceAll("\\{SCOPE\\}", "snsapi_base");
      String path = "";
      if (Util.isEmpty(auto)) {
        auto = "0";
      }
      if (Util.equalString(auto, "0")) {
        path = "/wx/toLoginView";
      }
      else {
        path = "/wx/directLogin";
      }
      String redirectUrl = PropKit.get("wechat.auth.redirect.root") + path;
      System.out.print("Jump to wechat auth2:" + redirectUrl);
      try {
        redirectUrl = URLEncoder.encode(redirectUrl, "UTF-8");
        System.out.println(" and encoded to " + redirectUrl);
      }
      catch (Exception ex) {
        System.out.println();
        ex.printStackTrace();
      }
      //    URLEncoder.encode("", enc)
      authUrl = authUrl.replaceAll("\\{STATE\\}", auto);
      authUrl = authUrl.replaceAll("\\{REDIRECT_URI\\}", redirectUrl);
      System.out.println("to access:" + authUrl);
      redirect(authUrl);
    }
    else {
      relativeRedirect("../index.jsp");
    }

  }

  public void toLoginView() {
    String code = getPara("code");
    String state = getPara("state");
    Map<String, String> queryMap = splitQueryString(
        getRequest().getQueryString());
    if (Util.isEmpty(code)) {
      code = queryMap.get("code");
    }
    if (Util.isEmpty(state)) {
      state = queryMap.get("state");
    }
    log.info("toLoginView code:{}, state:{}, querystr:{}", code, state,
        getRequest().getQueryString());
    log.info("toLoginView code:{}, state:{}, querystr:{}", getPara("code"),
        getPara("state"), getRequest().getQueryString());
    String path = "../fw/getView?fwCoord.project="
        + PropKit.get("wechat.auth.redirect.project") + "&fwCoord.function="
        + PropKit.get("wechat.auth.redirect.loginFunction") + "&fwCoord.view="
        + PropKit.get("wechat.auth.redirect.loginView") + "&code=" + code
        + "&state=" + state + "&";
    relativeRedirect(path);
  }

  public void directLogin() {
    String code = getPara("code");
    String state = getPara("state");
    Map<String, String> queryMap = splitQueryString(
        getRequest().getQueryString());
    if (Util.isEmpty(code)) {
      code = queryMap.get("code");
    }
    if (Util.isEmpty(state)) {
      state = queryMap.get("state");
    }
    log.info("directLogin code:{}, state:{}, querystr:{}", code, state,
        getRequest().getQueryString());
    String path = "../fw/login?fwCoord.project="
        + PropKit.get("wechat.auth.redirect.project") + "&fwCoord.function="
        + PropKit.get("wechat.auth.redirect.loginFunction") + "&code=" + code
        + "&state=" + state + "&";
    relativeRedirect(path);

  }

  //  public void test() {
  //    authRedirect("wx/fakeAuth", "test");
  //  }

  public void fakeAuth() {
    String url = getPara("redirect_uri");
    if (url.indexOf("?") <= 0) {
      url += "?";
    }
    else {
      if (!url.endsWith("&")) {
        url += "&";
      }
    }
    url += ("state=" + getPara("state") + "&code=FAKECODE");
    redirect(url);
  }

  public void access_token() {
    renderJson(
        "{\"access_token\":\"V253lMTyEkW7FuI0oQPoS-W_hJYUxqR8P1bmBd-nklo2MJrKzjLK39pdob6L4oad3InLjK8vC2sCIFYIRCiTJfMoHShgoCLgpGqzqL5_RH4\",\"expires_in\":7200,\"refresh_token\":\"TSfoE8dk5ksEYQt4LwjSXQe0A-Mb-lhjxpEcw_gF7vpTlBOOUCJLKorLmPBvjF4-0fR2hOvOY3yJw65MakTXrLd5_RtoaiGUNLiOKvUzG2s\",\"openid\":\"oTOnpw9bdOLRAKQDDioI2ZNmDqKg\",\"scope\":\"snsapi_base\"}");
  }

  public void currentAccessToken() {
    renderText(WeChatPlugin.getAccessToken());
  }

  //  public void wechatVarify() {
  //    String[] arr = new String[3];
  //    arr[0] = (getPara("nonce"));
  //    arr[1] = (getPara("timestamp"));
  //    arr[2] = (PropKit.get("wechat.token"));
  //    for (int i = 0; i < arr.length; ++i) {
  //      if (arr[i] == null) {
  //        arr[i] = Util.asString(i);
  //      }
  //    }
  //    Arrays.sort(arr);
  //    String serverSignature = DigestUtils.shaHex(Util.join("", arr));
  //    System.out.println(serverSignature);
  //    if (serverSignature.equalsIgnoreCase(getPara("signature"))) {
  //      renderText(getPara("echostr"));
  //    }
  //    else {
  //      renderText("not Varified");
  //    }
  //  }
}
