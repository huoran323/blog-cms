import React from 'react';
import { fetch } from 'dva';
import router from 'umi/router';
import qs from 'querystring';
import { notification } from 'antd';

import projectConfig from '@/config/projectConfig';
import { accessLog, interfaceAdd } from '@/services/global';
import { store } from './storage';

const { apiPrefix } = projectConfig;
const ua = window.navigator.userAgent;
const codeMessage = {
  200: '请求成功',
  201: '新建或修改数据成功。',
  202: '请求进入后台队列',
  204: '删除成功',
  400: '请求失败',
  401: 'token失效',
  403: '禁止访问',
  404: '请求失败',
  406: '请求方式错误',
  408: '请求超时',
  500: '服务器错误',
  502: '网关错误。',
  503: '服务不可用',
  504: '网关超时',
};

// 设置访问日志请求参数
const setLogParams = async (response, accessLogParam) => {
  const { status } = response;

  accessLogParam.userAgent = ua;
  accessLogParam.endTime = Date.now();
  accessLogParam.httpCode = status;

  if (status >= 200 && status < 300) {
    delete accessLogParam.headers;
    delete accessLogParam.reqParams;
    accessLogParam.success = 1;
  } else {
    accessLogParam.success = 0;
    accessLogParam.exceptionType = '其他业务异常';

    const text = response.text();
    accessLogParam.reqResult = await Promise.resolve(text);
  }

  return response;
};

// 检查ajax返回状态
const checkStatus = response => {
  // 返回新token时 重新设置
  const { headers } = response;
  const newToken = headers.get('content-language');
  if (newToken) {
    const token = store.get('token');
    token.token = newToken.split(',')[1];
    store.set('token', token);
  }

  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  /**
   * @type {*|string}
   */
  const errorText = codeMessage[response.status] || response.statusText;
  const error = new Error(errorText);
  error.name = response.status;
  error['response'] = response;
  throw error;
};

// 错误处理
const errorHandler = ({ name, message, response }, isLogInterface) => {
  const status = name;
  const reject = () => Promise.reject(message);

  if (isLogInterface) return;
  if (!response && name !== 'SyntaxError') {
    notification.error({ message: `${codeMessage['400']}` });
    return reject();
  }

  if (status === 401) {
    if (response.url.indexOf('login/token') !== -1) {
      notification.error({ message: '登录失败' });
    } else {
      notification.error({ message: '未登陆或登陆已过期，请重新登录' });
      /* eslint-disable no-underscore-dangle */
      window['g_app']._store.dispatch({ type: 'login/logout' });
    }

    return reject();
  }

  notification.error({
    message: `${message}: ${response['status']}`,
    description: <span style={{ fontSize: 12, wordBreak: 'break-all' }}>{response['url']}</span>,
  });
  // environment should not be used
  if (status === 403) {
    router.push('/exception/403');
  }
  return reject();
};

// fetch超时处理
const Timeout = 100000;
const timeoutFetch = (url, options) => {
  // @ts-ignore
  const fetchPromise = fetch(url, options);
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('请求超时')), Timeout);
  });
  return Promise.race([fetchPromise, timeoutPromise]);
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} options   The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options?) {
  const token = store.get('token');
  const auth = token
    ? {
        'auth.permit': token.permit,
        'auth.sysId': token.sysId,
        'auth.token': token.token,
      }
    : {};

  const defaultOptions = {
    credentials: 'include',
    method: 'GET',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      ...auth,
    },
  };

  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    }
  }

  if (newOptions.method !== 'POST' && newOptions.params) {
    url = `${url}${url.indexOf('?') !== -1 ? '&' : '?'}${qs.stringify(newOptions.params)}`;
  }

  // 请求日志参数
  const userInfo = store.get('userInfo');
  const accessLogParam: any = {
    uri: url,
    service: apiPrefix.slice(1),
    beginTime: Date.now(),
    headers: JSON.stringify(newOptions.headers),
    oaCode: userInfo && userInfo.realName,
    reqParams: newOptions.body,
  };

  return timeoutFetch(url, newOptions)
    .then(response => setLogParams(response, accessLogParam))
    .then(checkStatus)
    .then(response => response.json())
    .catch(e => errorHandler(e, newOptions.isLogInterface))
    .finally(() => {
      // // 调用统计接口
      if (!newOptions.isAddInterface) {
        if (token && token.token) interfaceAdd(url, 'interface', 'pc');
      }

      if (!newOptions.isLogInterface && !newOptions.isAddInterface) {
        // 不能添加return，否则日志接口挂了的话会影响请求接口的返回 -> 测试环境先不请求
        if (process.env.NODE_ENV !== 'development') accessLog(accessLogParam);
      }
    });
}
