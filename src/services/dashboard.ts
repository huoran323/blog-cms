import request from '../utils/request';
import projectConfig from '@/config/projectConfig';
const { apiPrefix } = projectConfig;

// 获取访问量数据
export function getCountData() {
  return request(`${apiPrefix}/chart/count`);
}

// 获取访问量数据
export function getVisitChart() {
  return request(`${apiPrefix}/chart/visit`);
}

// 获取销售类型图表数据
export function getSaleTypeChart() {
  return request(`${apiPrefix}/chart/sale_type`);
}

// 获取天气图表数据
export function getWeatherChart() {
  return request(`${apiPrefix}/chart/weather`);
}
