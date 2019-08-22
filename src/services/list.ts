import request from '../utils/request';
import projectConfig from '@/config/projectConfig';
const { apiPrefix } = projectConfig;

/**
 * 获取列表数据
 * @param params
 * @param pageNum
 * @param pageSize
 */
export function getList(params, pageNum, pageSize) {
  return request(`${apiPrefix}/list`, {
    params: {
      ...params,
      pageNum,
      pageSize,
    },
  });
}
