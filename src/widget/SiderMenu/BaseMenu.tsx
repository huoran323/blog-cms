import React, { PureComponent } from 'react';
import { Menu } from 'antd';
import Link from 'umi/link';
import { getIcon, getMenuMatches, urlToList } from '@/utils/menu';
import { interfaceAdd } from '@/services/global';
const { SubMenu } = Menu;

export default class BaseMenu extends PureComponent<any> {
  /**
   * 获得菜单子节点
   */
  getNavMenuItems = menuList => {
    if (!menuList) {
      return [];
    }
    return menuList
      .filter(item => item.name && !item.hideInMenu)
      .map(item => this.getSubMenuOrItem(item))
      .filter(item => item);
  };

  /**
   * 获取 SubMenu 或 MenuItem
   */
  getSubMenuOrItem = item => {
    if (item.children && item.children.some(child => child.name)) {
      const { name } = item;
      return (
        <SubMenu
          className={'sider-base-menu'}
          title={
            item.icon ? (
              <span>
                {getIcon(item.icon)}
                <span>{name}</span>
              </span>
            ) : (
              name
            )
          }
          key={item.path}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   */
  getMenuItemPath = item => {
    const { name } = item;
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    const { location } = this.props;
    return (
      <Link
        to={itemPath}
        target={target}
        onClick={() => this.handleClick(item)}
        replace={itemPath === location.pathname}
      >
        {icon}
        <span>{name}</span>
      </Link>
    );
  };

  // 統計菜單點擊
  handleClick = item => {
    const { menuList } = this.props;
    const { path, name, id, parentId } = item;

    const parentModule = menuList.find(item => item.id === parentId || item.id === id) || {};
    interfaceAdd(path, 'menu', 'pc', name, parentModule.name);
  };

  // 去除多余斜杠
  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  // 获取当前选中的菜单
  getSelectedMenuKeys = pathname => {
    const { flatMenuKeys } = this.props;
    return urlToList(pathname).map(itemPath => getMenuMatches(flatMenuKeys, itemPath).pop());
  };

  render() {
    const {
      mode,
      theme,
      openKeys,
      location: { pathname },
      collapsed,
    } = this.props;
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys(pathname).filter(i => i);
    if (!selectedKeys.length) {
      if (openKeys && openKeys.length) {
        selectedKeys = [openKeys[openKeys.length - 1]];
      } else {
        selectedKeys = ['/'];
      }
    }
    let props = {};
    if (openKeys && !collapsed) {
      props = {
        openKeys: openKeys.length === 0 ? [...selectedKeys] : openKeys,
      };
    }
    const { handleOpenChange, style, menuList } = this.props;

    return (
      <Menu
        key="Menu"
        mode={mode}
        theme={theme}
        inlineIndent={24}
        onOpenChange={handleOpenChange}
        selectedKeys={selectedKeys}
        style={style}
        {...props}
      >
        {this.getNavMenuItems(menuList)}
      </Menu>
    );
  }
}
