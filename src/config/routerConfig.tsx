/**
 * hideInMenu: 在侧边菜单栏隐藏
 * showTabNav: 是否展示在标签导航中
 * multiple: 不同参数是否开启多个标签页
 * shouldCache: 是否缓存(默认会缓存)
 */
const appRoutes = [
  {
    path: '/',
    name: '首页',
    icon: 'nav_home_nor',
    component: './Dashboard',
  },

  {
    path: '/list',
    name: '列表页',
    icon: 'table',
    routes: [
      {
        path: '/list/basic',
        name: '基础列表',
        component: './List/Basic',
      },
      {
        path: '/list/basic/:id',
        name: '列表详情',
        hideInMenu: true,
        component: './List/Basic/Detail',
      },
      {
        path: '/list/draggable',
        name: '拖拽列表',
        component: './List/Draggable',
      },
      {
        path: '/list/draggable/detail',
        name: '拖拽列表详情',
        hideInMenu: true,
        multiple: true,
        component: './List/Draggable/Detail',
      },
      {
        path: '/list/editable',
        name: '编辑列表',
        component: './List/Editable',
      },
    ],
  },

  {
    path: '/form',
    icon: 'form',
    name: '表单页',
    routes: [
      {
        path: '/form/basic',
        name: '基础表单',
        component: './Form/Basic',
      },
      {
        path: '/form/advanced',
        name: '高级表单',
        component: './Form/Advanced',
      },
    ],
  },

  {
    path: '/editor',
    name: '编辑器',
    icon: 'highlight',
    routes: [
      {
        path: '/editor/braft',
        name: 'braft-editor',
        component: './Editor/Braft',
      },
    ],
  },

  {
    path: '/exception',
    name: '异常页',
    icon: 'warning',
    routes: [
      {
        path: '/exception/403',
        name: '403',
        component: './Exception/403',
      },
      {
        path: '/exception/404',
        name: '404',
        component: './Exception/404',
      },
      {
        path: '/exception/500',
        name: '500',
        component: './Exception/500',
      },
    ],
  },
];

module.exports = {
  appRoutes,
  routerList: [
    // login
    {
      path: '/login',
      component: '../layouts/UserLayout',
      hideInMenu: true,
      routes: [{ path: '/login', component: './Login' }],
    },

    // app
    {
      path: '/',
      component: '../layouts/BasicLayout',
      Routes: ['src/pages/Authorized'],
      routes: appRoutes,
    },
  ],
};
