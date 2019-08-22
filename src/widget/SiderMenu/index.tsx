import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import { Link } from 'umi';
import classNames from 'classnames';
import { ConnectProps } from '@/models/connect';
import projectConfig from '@/config/projectConfig';
import { getFlatMenuKeys, getDefaultCollapsedSubMenus } from '@/utils/menu';

import styles from './index.less';
import BaseMenu from './BaseMenu';

const { Sider } = Layout;

export interface ISiderMenu extends ConnectProps {
  theme?: 'dark' | 'light';
  menuList: any[];
  collapsed?: boolean;
  onCollapse?: (collapsed) => void;
}

class SiderMenuWrapper extends PureComponent<ISiderMenu, { openKeys: string[] }> {
  static getDerivedStateFromProps(props, state) {
    const { pathname } = state;
    if (props.location.pathname !== pathname) {
      return {
        pathname: props.location.pathname,
        openKeys: getDefaultCollapsedSubMenus(props),
      };
    }
    return null;
  }

  state = {
    openKeys: getDefaultCollapsedSubMenus(this.props),
  };

  isMainMenu = key => {
    const { menuList } = this.props;
    return menuList.some(item => {
      if (key) {
        return item.key === key || item.path === key;
      }
      return false;
    });
  };

  handleOpenChange = openKeys => {
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({ openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys] });
  };

  render() {
    const { openKeys } = this.state;
    const { theme, collapsed, onCollapse, menuList } = this.props;
    const flatMenuKeys = getFlatMenuKeys(menuList);
    const defaultProps = collapsed ? {} : { openKeys };

    const siderClassName = classNames(styles.sider, {
      [styles.light]: theme === 'light',
    });

    return (
      <Sider
        trigger={null}
        collapsible={true}
        collapsed={collapsed}
        breakpoint="lg"
        width={256}
        onCollapse={onCollapse}
        className={siderClassName}
      >
        <div className={styles.logo} id="logo">
          <Link to="/">
            <img src={projectConfig.logo} alt="logo" />
            <h1>{projectConfig.title}</h1>
          </Link>
        </div>

        <BaseMenu
          {...this.props}
          flatMenuKeys={flatMenuKeys}
          mode="inline"
          handleOpenChange={this.handleOpenChange}
          onOpenChange={this.handleOpenChange}
          style={{ padding: '12px 0', width: '100%' }}
          {...defaultProps}
        />
      </Sider>
    );
  }
}

export default SiderMenuWrapper;
