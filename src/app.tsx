import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import { message } from 'antd';

message.config({ top: 140 });
const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['loading', 'routing', '@@dva', '_persist', 'app.collapsed']
};

/**
 * 引入redux-persist持久化
 */
const persistEnhancer = () => createStore => (reducer, initialState, enhancer) => {
  const store = createStore(persistReducer(persistConfig, reducer), initialState, enhancer);
  const persist = persistStore(store, null);

  return {
    ...store,
    persist,
  }
};

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.error(err.message);
    },
  },
};
