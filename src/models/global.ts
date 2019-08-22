import { Reducer } from 'redux';
import { routerRedux } from 'dva';
import { fetchMenus } from '@/services/global';
import { store } from '@/utils/storage';
import { getBreadcrumbNameMap, mergeMenuList } from '@/utils/menu';
import { Effect } from '@/models/connect';
const routerConfig = require('@/config/routerConfig');

export interface IGlobalModelState {
  theme: 'dark' | 'light';
  collapsed: boolean;
  menuList: any[];
  breadcrumbNameMap: any[];
}

export interface IGlobalModel {
  namespace: 'global';
  state: IGlobalModelState;
  effects: {
    fetchMenu: Effect;
    logout: Effect;
  };
  reducers: {
    changeCollapsed: Reducer<any>;
    updateState: Reducer<any>;
  };
}

const GlobalModal: IGlobalModel = {
  namespace: 'global',

  state: {
    theme: 'dark',
    collapsed: false,

    menuList: store.get('menuList') || [], // 菜单列表
    breadcrumbNameMap: store.get('breadcrumbNameMap') || {},
  },

  effects: {
    // 当前用户及菜单数据
    *fetchMenu(payload, { call, put }) {
      const { code, data } = yield call(fetchMenus, payload);

      if (code === 200) {
        const menuList = mergeMenuList(data);

        const breadcrumbNameMap = getBreadcrumbNameMap([...menuList, ...routerConfig.appRoutes]);
        store.set('menuList', menuList);
        store.set('breadcrumbNameMap', breadcrumbNameMap);
        yield put({
          type: 'updateState',
          payload: {
            menuList,
            breadcrumbNameMap,
          },
        });
        yield put(routerRedux.push({ pathname: '/' }));
      }
    },

    // 退出登录
    *logout(_, { put }) {
      store.removeAll();
      yield put(routerRedux.push({ pathname: '/login' }));
    },
  },

  reducers: {
    changeCollapsed(state, { collapsed }) {
      return { ...state, collapsed };
    },

    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};

export default GlobalModal;
