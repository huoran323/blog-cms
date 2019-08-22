import React from 'react';
import cx from 'classnames';
import { Button } from 'antd';

import typeConfig from './typeConfig';
import styles from './index.less';

interface IExceptionProps {
  className?: string;
  style?: React.CSSProperties;
  actions?: React.ReactNode;
  type?: '403' | '404' | '500';
  redirect?: string;
  linkElement?: string | React.ReactNode;
}

const Exception: React.FC<IExceptionProps> = props => {
  const { type, className, actions, linkElement, redirect, ...restProps } = props;
  const pageType = type in typeConfig ? type : '404';
  const clsString = cx(styles.exception, className);

  const config = typeConfig[pageType];
  return (
    <div className={clsString} {...restProps}>
      <div className={styles.imgBlock}>
        <div className={styles.imgEle} style={{ backgroundImage: `url(${config.img})` }} />
      </div>

      <div className={styles.content}>
        <h1>{config.title}</h1>
        <div className={styles.desc}>{config.desc}</div>
        <div className={styles.actions}>
          {actions ||
            React.createElement(
              linkElement as any,
              {
                to: redirect,
                href: redirect,
              },
              <Button type="primary">{config.backText}</Button>
            )}
        </div>
      </div>
    </div>
  );
};

Exception.defaultProps = {
  linkElement: 'a',
  redirect: '/',
};

export default Exception;
