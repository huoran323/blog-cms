/**
 * 面包屑导航组件
 */
import React from 'react';
import { Breadcrumb, Icon } from 'antd';
import Link from 'umi/link';
import PathToRegexp from 'path-to-regexp';
import { formatMessage } from 'umi-plugin-react/locale';
import projectConfig from '@/config/projectConfig';
import { urlToList } from '@/utils/menu';
import styles from './index.less';
import { ConnectProps } from '@/models/connect';

export interface IBreadcrumbProps extends ConnectProps {
  breadcrumbList?: Array<{ title: React.ReactNode; href?: string }>;
  breadcrumbSeparator?: React.ReactNode;
  itemRender?: (menuItem) => React.ReactNode;
  breadcrumbNameMap?: object;
  home?: React.ReactNode;
  showIcon?: boolean; // 是否展示 icon 图标
  routes?: any[];
  params?: any;
}

export const renderItemLocal = item => {
  if (item.locale) {
    return projectConfig.menu.disableLocal
      ? item.name
      : formatMessage({ id: item.locale, defaultMessage: item.name });
  }
  return item.name;
};

export const getBreadcrumb = (breadcrumbNameMap, url) => {
  let breadcrumb = breadcrumbNameMap[url];
  if (!breadcrumb) {
    Object.keys(breadcrumbNameMap).forEach(item => {
      if (PathToRegexp(item).test(url)) {
        breadcrumb = breadcrumbNameMap[item];
      }
    });
  }
  return breadcrumb || {};
};

class CusBreadcrumb extends React.PureComponent<IBreadcrumbProps, any> {
  static defaultProps = {
    breadcrumbSeparator: '/',
  };

  constructor(props) {
    super(props);
  }

  /**
   * 渲染Breadcrumb 子节点
   * @param route
   * @param params
   * @param routes
   * @param paths
   */
  itemRender = (route, params, routes, paths) => {
    const last = routes.indexOf(route) === routes.length - 1;

    if (route.path === '/') {
      return <Link to={paths.join('/')}>{route.breadcrumbName}</Link>;
    }

    return last || !route.component ? (
      <span>{route.breadcrumbName}</span>
    ) : (
      <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
    );
  };

  conversionFromLocation = (location, breadcrumbNameMap) => {
    const { breadcrumbSeparator, home, itemRender, showIcon } = this.props;
    const pathSnippets = urlToList(location.pathname);

    // Loop data mosaic routing
    const extraBreadcrumbItems = pathSnippets.map((url, index) => {
      const currentBreadcrumb = getBreadcrumb(breadcrumbNameMap, url);
      if (currentBreadcrumb.inherited) {
        return null;
      }

      const isLinkable = index !== pathSnippets.length - 1 && currentBreadcrumb.component;
      const name = itemRender ? itemRender(currentBreadcrumb) : renderItemLocal(currentBreadcrumb);
      return currentBreadcrumb.name && !currentBreadcrumb.hideInBreadcrumb ? (
        <Breadcrumb.Item key={url}>
          {showIcon && currentBreadcrumb.icon && <Icon type={currentBreadcrumb.icon} />}
          {isLinkable ? <Link to={url}>{name}</Link> : <span>{name}</span>}
        </Breadcrumb.Item>
      ) : null;
    });

    // Add home breadcrumbs to your head
    extraBreadcrumbItems.unshift(
      <Breadcrumb.Item key="home">
        {showIcon && <Icon type="home" />}
        <Link to="/">{home || '首页'}</Link>
      </Breadcrumb.Item>
    );

    return <Breadcrumb separator={breadcrumbSeparator}>{extraBreadcrumbItems}</Breadcrumb>;
  };

  render() {
    const {
      location,
      routes,
      params,
      breadcrumbList,
      breadcrumbSeparator,
      itemRender,
      breadcrumbNameMap,
    } = this.props;

    let content = null;
    // 根据 breadCrumbList 生成面包屑
    if (breadcrumbList && breadcrumbList.length) {
      content = (
        <Breadcrumb separator={breadcrumbSeparator}>
          {breadcrumbList.map(item => {
            const title = itemRender ? itemRender(item) : item.title;
            return (
              // @ts-ignore
              <Breadcrumb.Item key={title}>
                {item.href ? <Link to={item.href}>{title}</Link> : <span>{title}</span>}
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>
      );
    }

    // 如果传入 routes 和 params 属性
    if (routes && params) {
      content = (
        <Breadcrumb
          routes={routes.filter(route => route.breadcrumbName)}
          params={params}
          itemRender={this.itemRender}
          separator={breadcrumbSeparator}
        />
      );
    }

    // 根据 location 生成面包屑
    if (location && location.pathname) {
      content = this.conversionFromLocation(location, breadcrumbNameMap);
    }

    return <div className={styles.breadcrumb}>{content}</div>;
  }
}

export default CusBreadcrumb;
