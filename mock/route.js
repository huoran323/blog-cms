const routes = [
  {
    id: '1',
    name: '首页',
    path: '/',
    icon: 'dashboard',
  },

  {
    id: '2',
    path: '/list',
    name: '列表页',
    icon: 'table',
    children: [
      {
        id: '21',
        parentId: '2',
        path: '/list/basic',
        name: '基础列表',
        component: './List/Basic',
      },
      {
        id: '22',
        parentId: '2',
        path: '/list/draggable',
        name: '拖拽列表',
        component: './List/Draggable',
      },
      {
        id: '23',
        parentId: '2',
        path: '/list/editable',
        name: '编辑列表',
        component: './List/Editable',
      },
    ],
  },

  {
    id: '3',
    path: '/form',
    icon: 'form',
    name: '表单页',
    children: [
      {
        id: '31',
        parentId: '3',
        path: '/form/basic',
        name: '基础表单',
        component: './Form/Basic',
      },
      {
        id: '32',
        parentId: '3',
        path: '/form/advanced',
        name: '高级表单',
        component: './Form/Advanced',
      },
    ],
  },

  {
    id: '4',
    path: '/editor',
    name: '编辑器',
    icon: 'highlight',
    children: [
      {
        id: '41',
        parentId: '4',
        path: '/editor/braft',
        name: 'braft-editor',
        component: './Editor/Braft',
      },
    ],
  },

  {
    id: '5',
    path: '/exception',
    name: '异常页',
    icon: 'warning',
    children: [
      {
        id: '51',
        path: '/exception/403',
        name: '403',
        component: './Exception/403',
      },
      {
        id: '52',
        path: '/exception/404',
        name: '404',
        component: './Exception/404',
      },
      {
        id: '53',
        path: '/exception/500',
        name: '500',
        component: './Exception/500',
      },
    ],
  },
];

module.exports = {
  [`GET /api/userMenu`](req, res) {
    res.status(200).json({
      code: 200,
      data: routes,
      message: '请求成功',
    });
  },
};
