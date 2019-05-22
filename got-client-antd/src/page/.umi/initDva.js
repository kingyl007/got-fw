import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'fwGlobalModel', ...(require('E:/project/got-fw.git/got-client-antd/src/model/fw/fwGlobalModel.js').default) });
app.model({ namespace: 'createModel', ...(require('E:/project/got-fw.git/got-client-antd/src/model/fw/pages/createModel.js').default) });
app.model({ namespace: 'editModel', ...(require('E:/project/got-fw.git/got-client-antd/src/model/fw/pages/editModel.js').default) });
app.model({ namespace: 'gridModel', ...(require('E:/project/got-fw.git/got-client-antd/src/model/fw/pages/gridModel.js').default) });
app.model({ namespace: 'loginModel', ...(require('E:/project/got-fw.git/got-client-antd/src/model/fw/pages/loginModel.js').default) });
app.model({ namespace: 'treeModel', ...(require('E:/project/got-fw.git/got-client-antd/src/model/fw/pages/treeModel.js').default) });
