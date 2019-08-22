import React from 'react';
import cx from 'classnames';
import { Spin } from 'antd';
import styles from './index.less';

interface IPage {
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const Page: React.FC<IPage> = props => {
  const { children, className, loading, ...restProps } = props;

  return (
    <Spin tip="加载中..." spinning={loading}>
      <div className={cx(className, styles.container)} {...restProps}>
        {children}
      </div>
    </Spin>
  );
};

Page.defaultProps = {
  loading: false,
};

export default Page;
