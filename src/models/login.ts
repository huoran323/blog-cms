import { Reducer } from 'redux';
import { routerRedux } from 'dva';
import { Effect } from '@/models/connect';
import { fetchLogin } from '@/services/global';
import { store } from '@/utils/storage';

export interface ILoginModelState {
  userInfo: any;
}

export interface ILoginModel {
  namespace: 'login';
  state: ILoginModelState;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    updateState: Reducer<any>;
  };
  // subscriptions: { setup: Subscription };
}

const LoginModel: ILoginModel = {
  namespace: 'login',

  state: {
    userInfo: store.get('userInfo') || {},
  },

  effects: {
    // 登录
    *login({ payload }, { call, put }) {
      const { data } = yield call(fetchLogin, payload);

      if (data) {
        const { permit, sysId, token, userInfo } = data;
        store.set('token', { permit, sysId, token });
        store.set('userInfo', userInfo);

        yield put({ type: 'updateState', payload: { userInfo } });
        yield put({ type: 'global/fetchMenu' });
      }
    },

    // 退出登录
    *logout(_, { put }) {
      store.removeAll();

      yield put({ type: 'updateState', payload: { menuList: [], breadcrumbNameMap: {} } });
      yield put(routerRedux.push({ pathname: '/login' }));
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default LoginModel;
