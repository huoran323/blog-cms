import request from '../utils/request';
import projectConfig from '@/config/projectConfig';
const { apiPrefix } = projectConfig;

// 登录
export function fetchLogin({ username, password, verification }) {
  return request(`${apiPrefix}/login`, {
    method: 'POST',
    body: {
      params: [{ username, password, verification }],
    },
  });
}

// 获取图片验证码
export function fetchCode() {
  return request(`${apiPrefix}/code`);
}

// 获取菜单接口
export function fetchMenus() {
  return request(`${apiPrefix}/userMenu`);
}

// 获取通知
export function fetchNotices() {
  return request(`${apiPrefix}/notices`);
}

/**
 * 访问日志记录
 * @param service 请求所属的服务模块(服务名)           => "customer"
 * @param uri 请求地址                                => "https://ibm.cmschina.com.cn:8443/mobile/indexApi/getIndexPageData"
 * @param beginTime 请求发起的时间戳                   => 1555988089212
 * @param endTime 请求结束的时间戳                     => 1556988089212
 * @param success 请求结果：0 -> 失败, 1 -> 成功       => false
 * @param oaCode 发起请求的用户                        => "ims_admin"
 * @param exceptionType 异常名                        => "其他业务异常"
 * @param httpCode                                    => 200
 * @param userAgent 发起请求的UA，建议传，便于后续统计  =>
 * @param reqParams 请求参数，建议请求出错时传入        => undefined
 * @param headers 请求头，建议请求出错时传入            => "{"Content-Type": "application/json", "auth.sysid": "1001"}"
 * @param reqResult 返回结果，建议请求出错时传入        => "{"retCode": 333, "retMsg": "error other test"}"
 * @param remark 备注                                 => "Page: SceneReaderShell {"tunnelTime": "3ms"}"
 */
export function accessLog({
  service,
  uri,
  beginTime,
  endTime,
  oaCode,
  exceptionType,
  httpCode,
  userAgent,
  reqParams,
  headers,
  reqResult,
  remark,
  success,
}) {
  return request(`${apiPrefix}/accessLog`, {
    method: 'POST',
    isLogInterface: true,
    body: {
      // source: 请求系统来源，由系统分配
      source: '552ADD4367489A4A28C874894DADA572',
      service, uri, beginTime, endTime, oaCode, exceptionType, httpCode, userAgent, reqParams, headers, reqResult, remark, success
    },
  })
}

/**
 * 接口调用添加
 * @param key
 * @param type interface、menu、page
 * @param liveSource 来源 1-pc 2-app
 * @param moduleName
 * @param parentModuleName
 */
export function interfaceAdd(key, type, liveSource, moduleName?, parentModuleName?) {
  return request(`${apiPrefix}/interfaceAdd`, {
    method: 'POST',
    isAddInterface: 'true',
    body: {
      params: [{ key, type, liveSource, moduleName, parentModuleName }]
    }
  })
}
