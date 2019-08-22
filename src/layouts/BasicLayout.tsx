import React, { PureComponent, Fragment } from 'react';
import { Layout, BackTop } from 'antd';
import { connect } from 'dva';
import { Helmet } from 'react-helmet';
import projectConfig from '@/config/projectConfig';
import { ConnectProps, ConnectState } from '@/models/connect';
import { PageLoading, GlobalHeader, SiderMenu, TagsNav } from '@/widget';

interface IBasicLayoutProps extends ConnectProps {
  theme: 'dark' | 'light';
  userInfo: any;
  menuList: any[];
  collapsed?: boolean;
  breadcrumbNameMap: any[];
}

class BasicLayout extends PureComponent<IBasicLayoutProps> {
  state = {
    loading: true,
  };

  componentDidMount(): void {
    this.setState({ loading: false });
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  // 折叠菜单
  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;

    dispatch({
      type: 'global/changeCollapsed',
      collapsed,
    });
  };

  render() {
    const { loading } = this.state;
    const { children, location, theme, collapsed, menuList, ...restProps } = this.props;
    const layoutStyle = { paddingLeft: collapsed ? '80px' : '256px' };

    if (loading) return <PageLoading />;
    return (
      <Fragment>
        <Helmet>
          <title>{projectConfig.title}</title>
          <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="keyword" content="react, umi, antd" />
        </Helmet>

        <Layout id="mainContainer">
          <BackTop target={() => document.getElementById('mainContainer')} />
          <SiderMenu location={location} theme={theme} collapsed={collapsed} menuList={menuList} />

          <Layout style={{ minHeight: '100vh', ...layoutStyle }}>
            <GlobalHeader
              location={location}
              collapsed={collapsed}
              onCollapse={this.handleMenuCollapse}
              {...restProps}
            />
            <TagsNav children={children} />
          </Layout>
        </Layout>
      </Fragment>
    );
  }
}

export default connect(({ global, login }: ConnectState) => ({
  ...global,
  userInfo: login.userInfo,
}))(BasicLayout);
