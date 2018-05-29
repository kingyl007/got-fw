package cn.got.platform.demo;

import cn.got.platform.fw.jfinal.core.GotConfig;

import com.jfinal.config.Constants;
import com.jfinal.core.JFinal;
import com.jfinal.kit.PathKit;
import com.jfinal.kit.PropKit;

/**
 * @author kingyl007(kingyl007@163.com)
 * @since 1.0 Jul 26, 2016 1:19:48 PM <br>
 */
public class DemoConfig extends GotConfig {

  @Override
  public void configConstant(Constants me) {
    super.configConstant(me);
    me.setDevMode(PropKit.getBoolean("debug.on"));
    setDevMode(me.getDevMode());
    me.setBaseDownloadPath(PropKit.get("got.file.download.root"));
    me.setBaseUploadPath(PropKit.get("got.file.upload.root"));
  }

  public static void main(String[] args) {
    if (args != null && args.length > 3) {
      PathKit.setWebRootPath(args[0]);
      JFinal.start(args[0], Integer.valueOf(args[1]), args[2],
          Integer.valueOf(args[3]));
    }
    else {
      JFinal.start("src/main/webapp", 8080, "/", 5);
    }
  }

}
