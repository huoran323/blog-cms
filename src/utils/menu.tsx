import React from 'react';
import { Icon } from 'antd';
import pathToRegexp from 'path-to-regexp';
import { urlPattern } from './validate';

const routerConfig = require('@/config/routerConfig');
const { appRoutes } = routerConfig;

/**
 * 获取 icon
 * @param icon string
 * @param className
 * @returns {any}
 * @example 'setting', 'http://demo.com/icon.png', <Icon type="setting" />
 */
export const getIcon = (icon, className?) => {
  if (typeof icon === 'string' && urlPattern.test(icon)) {
    return <img src={icon} alt="icon" className={className} />;
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} style={{ fontSize: 14, marginRight: 6 }} />;
  }
  return icon;
};

/**
 * 递归获取菜单中的路由集合
 * @param {IMenuItemProps[]} menus
 * @returns {string[]}
 * @example [{path: '/mail'}, {path: '/customer', children: {path: 'all' }}] => ['/mail', '/customer', '/customer/all']
 */
export const getFlatMenuKeys = (menus): string[] => {
  let keys = [];
  menus.forEach(item => {
    keys.push(item.path);
    if (item.children) {
      keys = keys.concat(getFlatMenuKeys(item.children));
    }
  });
  return keys;
};

/**
 * 基于 path 找出所有匹配的 menuKeys
 * @param {string[]} flatMenuKeys
 * @param {string} path
 * @returns {string[]}
 * @example (['/abc', '/abc/:id', '/abc/:id/info'], '/abc') => ['/abc', '/abc/11', '/abc/11/info']
 */
export const getMenuMatches = (flatMenuKeys: string[], path: string): string[] => {
  return flatMenuKeys.filter(item => {
    if (item) {
      return pathToRegexp(item).test(path);
    }
    return false;
  });
};

/**
 * 将一个 url 拆分成 paths 数组
 * @param {string} url /customer/all
 * @returns {string[]} ['/customer', 'customer/all']
 */
export function urlToList(url: string): string[] {
  const urlList = url.split('/').filter(i => i);
  return urlList.map((_, index) => `/${urlList.slice(0, index + 1).join('/')}`);
}

/**
 * 根据 pathname 获取默认展开的 subMenu
 * @param props
 * @returns {string[]}
 */
export const getDefaultCollapsedSubMenus = props => {
  const {
    location: { pathname },
    menuList,
  } = props;
  const flatMenuKeys = getFlatMenuKeys(menuList);
  return urlToList(pathname)
    .map(item => getMenuMatches(flatMenuKeys, item)[0])
    .filter(item => item);
};

/**
 * 获取面包屑映射
 * @param {Object} menuList 菜单配置
 *
 * [{ path: '/', name: '首页' }, { path: '/customer', name: '客户管理', children: [{ path: '/all', name: '所有客户' }] }]
 *
 * =>
 *
 * {
 *  '/': { path: '/', name: '首页' },
 *  '/all': { path: '/all', name: '所有客户' },
 *  '/customer': { path: '/customer', name: '客户管理', children: [{ path: '/all', name: '所有客户' }]
 * }
 */
export const getBreadcrumbNameMap = menuList => {
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuList);
  return routerMap;
};

/**
 * 过滤需要隐藏的菜单
 * @param menuList
 */
export const filterMenuList = menuList => {
  if (!menuList) {
    return [];
  }
  return menuList.filter(item => item.name && !item.hideInMenu).filter(item => item);
};

/**
 * 合并路由配置
 * @param menuList
 */
export const mergeMenuList = menuList => {
  const merge = (data, config) => {
    data.forEach(item => {
      item.path = item.path || item.url;

      // 匹配的菜单
      const menu = config.find(i => i.path === item.path);
      if (menu) {
        item.name = item.name || menu.name;
        item.icon = item.icon || menu.icon;
      }

      if (menu && item.children && item.children.length) {
        // 合并隐藏菜单
        const hideMenu = menu.routes.filter(item => item.hideInMenu).filter(i => i);

        item.children = [...item.children, ...hideMenu];
        merge(item.children, menu.routes);
      }
    });
  };

  const menuConfig = appRoutes.filter(item => !item.hideInMenu);
  merge(menuList, menuConfig);
  return menuList;
};
