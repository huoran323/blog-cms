import React, { PureComponent } from 'react';
import cx from 'classnames';
import { Icon } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { SiderTheme } from 'antd/es/Layout/Sider';
import Debounce from 'lodash-decorators/debounce';
import { ConnectProps } from '@/models/connect';

import Breadcrumb from '../Breadcrumb';
import HeaderSearch from './HeaderSearch';
import NoticeIconView from './NoticeIconView';
import FullScreen from '../FullScreen';
import Account from './Account';
import SelectLang from './SelectLang';
import styles from './index.less';

interface IGlobalProps extends ConnectProps {
  theme?: SiderTheme;
  hasNotices?: boolean;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

class GlobalHeader extends PureComponent<IGlobalProps> {
  static defaultProps = {
    collapsed: false,
    hasNotices: true,
  };

  componentWillUnmount() {
    // @ts-ignore
    this.triggerResizeEvent.cancel();
  }

  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  // 切换collapsed
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  render() {
    const { location, collapsed, theme, hasNotices, ...restProps } = this.props;

    let className = styles.header;
    if (theme === 'dark') {
      className = `${styles.header} ${styles.dark}`;
    }

    return (
      <div className={className}>
        <div className={cx('row-center', styles.operate)}>
          <span className={styles.trigger} onClick={this.toggle}>
            <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
          </span>

          <Breadcrumb showIcon={true} location={location} {...restProps} />
        </div>

        <div className={styles.content}>
          <HeaderSearch
            className={`${styles.action} ${styles.search}`}
            placeholder={formatMessage({ id: 'widget.globalHeader.search' })}
            dataSource={[]}
            onSearch={value => {
              console.log('input', value); // eslint-disable-line
            }}
            onPressEnter={value => {
              console.log('enter', value); // eslint-disable-line
            }}
          />

          {hasNotices && <NoticeIconView />}
          <FullScreen />
          <Account />

          <SelectLang className={styles.action} />
        </div>
      </div>
    );
  }
}

export default GlobalHeader;
