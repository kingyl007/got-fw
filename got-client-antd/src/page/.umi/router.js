import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';


let Router = require('dva/router').routerRedux.ConnectedRouter;

let routes = [
  {
    "path": "/fw/role_right/role_right.html",
    "exact": true,
    "component": dynamic({ loader: () => import('../fw/role_right/role_right.js') })
  },
  {
    "path": "/testForm1.html",
    "exact": true,
    "component": dynamic({ loader: () => import('../testForm1.js') })
  },
  {
    "path": "/testMap.html",
    "exact": true,
    "component": dynamic({ loader: () => import('../testMap.js') })
  },
  {
    "path": "/testMobile.html",
    "exact": true,
    "component": dynamic({ loader: () => import('../testMobile.js') })
  },
  {
    "path": "/testModal.html",
    "exact": true,
    "component": dynamic({ loader: () => import('../testModal.js') })
  },
  {
    "path": "/testTree.html",
    "exact": true,
    "component": dynamic({ loader: () => import('../testTree.js') })
  },
  {
    "path": "/fw/main/main.html",
    "exact": true,
    "component": dynamic({ loader: () => import('../fw/main/main.js') })
  },
  {
    "path": "/fw/map/mapPage.html",
    "exact": true,
    "component": dynamic({ loader: () => import('../fw/map/mapPage.js') })
  },
  {
    "path": "/fw/role_right/right_list.html",
    "exact": true,
    "component": dynamic({ loader: () => import('../fw/role_right/right_list.js') })
  },
  {
    "path": "/fw.html",
    "exact": true,
    "component": dynamic({ loader: () => import('../fw/index.js') })
  },
  {
    "path": "/fw/tree/tree.html",
    "exact": true,
    "component": dynamic({ loader: () => import('../fw/tree/tree.js') })
  },
  {
    "path": "/projects/demo/edit_demo.html",
    "exact": true,
    "component": dynamic({ loader: () => import('../projects/demo/edit_demo.js') })
  },
  {
    "path": "/fw/login/login.html",
    "exact": true,
    "component": dynamic({ loader: () => import('../fw/login/login.js') })
  },
  {
    "path": "/fw/edit/edit.html",
    "exact": true,
    "component": dynamic({ loader: () => import('../fw/edit/edit.js') })
  },
  {
    "path": "/fw/grid/grid.html",
    "exact": true,
    "component": dynamic({ loader: () => import('../fw/grid/grid.js') })
  },
  {
    "path": "/fw/create/create.html",
    "exact": true,
    "component": dynamic({ loader: () => import('../fw/create/create.js') })
  },
  {
    "path": "/fw/detail/detail.html",
    "exact": true,
    "component": dynamic({ loader: () => import('../fw/detail/detail.js') })
  },
  {
    "path": "/testForm.html",
    "exact": true,
    "component": dynamic({ loader: () => import('../testForm.js') })
  },
  {
    "component": () => React.createElement(require('E:/project/got-fw.git/got-client-antd/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/page', hasRoutesInConfig: false })
  }
];
window.g_plugins.applyForEach('patchRoutes', { initialValue: routes });

export default function() {
  return (
<Router history={window.g_history}>
      { renderRoutes(routes, {}) }
    </Router>
  );
}
