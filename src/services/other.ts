import request from '../utils/request';
import projectConfig from '@/config/projectConfig';
const { apiPrefix } = projectConfig;

// 获取树列表数据
export function getTreeList() {
  return request(`${apiPrefix}/treeList`);
}
