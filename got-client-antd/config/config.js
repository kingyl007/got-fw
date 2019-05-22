export default {
    singular: true,
    outputPath: "../got-web/src/main/webapp/ui/antd/clientui",
    base: "ui/antd/clientui/",
    publicPath: "../../",
    exportStatic: {
      htmlSuffix: true,
    },
    plugins: [
      ['umi-plugin-react', {
            antd: true,
            dva: true,
            dynamicImport:true,
      }],
    ],
    "theme": {
      "primary-color": "#436BF7",
    },
    //*
    "proxy": {
      "/": {
        "target": "http://localhost:8080/",
        // "changeOrigin": true,
        bypass: function(req, res, proxyOptions) {
          const parts = ['.html','.css','.js','.ico','.png','.jpg','.mp3']
          const excludes = ['jquery-1.10.2.min.js','got.js','base.css','login.css','bgd_pic.jpg','bgl_pic.jpg','logo.png','user.png','password.png','LOGO.png','logo_ddb.png'];
          if (parts.some(p=> req.url.indexOf(p) >= 0)) {
            if (excludes.every(p=>req.url.indexOf(p)<0)) {
              console.log('Skipping proxy for browser request.', req.url);
              return req.url;
            }
          }
        }
      }
    },
    //*/
};