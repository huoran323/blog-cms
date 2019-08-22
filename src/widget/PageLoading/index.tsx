import React from 'react';
import cx from 'classnames';
import styles from './index.less';

interface ILoaderProps {
  spinning?: boolean;
  fullScreen?: boolean;
}

const PageLoading: React.FC<ILoaderProps> = props => {
  const { spinning = true, fullScreen = false } = props;

  return (
    <div
      className={cx(styles.loader, {
        [styles.hidden]: !spinning,
        [styles.fullScreen]: fullScreen,
      })}
    >
      <div className={styles.wrapper}>
        <div className={styles.inner} />
        <div className={styles.text}>加载中...</div>
      </div>
    </div>
  );
};

export default PageLoading;
