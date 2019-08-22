import React from 'react';
import { connect } from 'dva';
import { Menu, Icon, Avatar, Spin } from 'antd';
import { ConnectProps, ConnectState } from '@/models/connect';
import { FormattedMessage } from 'umi-plugin-react/locale';

import HeaderDropdown from './components/HeaderDropdown';
import styles from './index.less';

export interface IAccountProps extends ConnectProps {
  userInfo?: any;
}

const Account: React.FC<IAccountProps> = props => {
  const { userInfo, dispatch } = props;

  const onMenuClick = ({ key }) => {
    if (key === 'logout') {
      dispatch({ type: 'global/logout' });
    }
  };

  const menu = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="userinfo">
        <Icon type="setting" />
        <FormattedMessage
          id="widget.globalHeader.account.settings"
          defaultMessage="account settings"
        />
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <Icon type="logout" />
        <FormattedMessage id="widget.globalHeader.account.logout" defaultMessage="logout" />
      </Menu.Item>
    </Menu>
  );

  return userInfo.name ? (
    <HeaderDropdown overlay={menu}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={userInfo.avatar} alt="avatar" />
        <span className={styles.name}>{userInfo.name}</span>
      </span>
    </HeaderDropdown>
  ) : (
    <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
  );
};

export default connect(({ login }: ConnectState) => ({
  userInfo: login.userInfo,
}))(Account);
