import React from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';

interface IProps {
  children: any;
  menuList: any[];
  route: {
    path: string;
    name: string;
  };
}

const Authorized: React.FC<IProps> = props => {
  const { children, route, menuList = [] } = props;

  const isMatch = menuList.findIndex(item => item.path === route.path);
  if (isMatch === -1) {
    router.push('/login');
  }

  return React.cloneElement(children);
};

export default connect(({ global }: ConnectState) => ({
  menuList: global.menuList,
}))(Authorized);
