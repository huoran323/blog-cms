import React, { PureComponent } from 'react';
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import loginBg from '../assets/login_bg.jpg';

const loginStyle = {
  width: '100%',
  height: '100%',
  background: `transparent url(${loginBg}) center center no-repeat`,
  backgroundSize: 'cover',
};

class UserLayout extends PureComponent<{ children: React.ReactNode }> {
  render() {
    const { children } = this.props;

    return (
      <ConfigProvider locale={zh_CN}>
        <div style={loginStyle}>{children}</div>
      </ConfigProvider>
    );
  }
}

export default UserLayout;
