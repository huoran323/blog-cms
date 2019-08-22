import React, { PureComponent } from 'react';
import cx from 'classnames';
import { Badge, Icon, Tabs, Spin } from 'antd';

import HeaderDropdown from './HeaderDropdown';
import List, { INoticeIconData, NoticeIconTab } from './NoticeList';
import styles from './index.less';

const { TabPane } = Tabs;

interface INoticeIcon {
  count?: number;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
  clearClose?: boolean;
  popupVisible?: boolean;
  onClear?: (tabName: string) => void;
  onTabChange?: (tabTitle: string) => void;
  onPopupVisibleChange?: (visible: boolean) => void;
  onViewMore?: (tabProps: INoticeIcon, e: MouseEvent) => void;
  onItemClick?: (item: INoticeIconData, tabProps: INoticeIcon) => void;
  locale?: {
    emptyText: string;
    clear: string;
    viewMore: string;
    [key: string]: string;
  };
}

class NoticeIcon extends PureComponent<INoticeIcon, any> {
  public static Tab: typeof NoticeIconTab = TabPane;
  static defaultProps = {
    loading: false,
    clearClose: false,
    locale: {
      emptyText: 'No notifications',
      clear: 'Clear',
      viewMore: 'More',
    },
    emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
  };

  state = {
    visible: false,
  };

  private popover = React.createRef<any>();

  // item 点击
  onItemClick = (item, tabProps) => {
    const { onItemClick } = this.props;
    const { clickClose } = item;
    onItemClick(item, tabProps);
    if (clickClose) {
      // @ts-ignore
      this.popover.click();
    }
  };

  // 清空通知
  onClear = name => {
    const { onClear, clearClose } = this.props;
    onClear(name);
    if (clearClose) {
      // @ts-ignore
      this.popover.click();
    }
  };

  // tab 切换
  onTabChange = tabType => {
    const { onTabChange } = this.props;
    if (onTabChange) {
      onTabChange(tabType);
    }
  };

  // 查看更多
  onViewMore = (tabProps, event) => {
    const { onViewMore } = this.props;
    onViewMore(tabProps, event);
  };

  // 显示状态更改
  handleVisibleChange = visible => {
    const { onPopupVisibleChange } = this.props;
    this.setState({ visible });

    if (onPopupVisibleChange) {
      onPopupVisibleChange(visible);
    }
  };

  // 生成 notification 弹窗
  getNotificationBox() {
    const { children, loading, locale } = this.props;
    if (!children) return null;

    const panes = React.Children.map(children, (child: any) => {
      const { list, title, count, emptyText, emptyImage, showClear, showViewMore } = child.props;
      const len = list && list.length ? list.length : 0;
      const msgCount = count || count === 0 ? count : len;
      const localeTitle = locale[title] || title;
      const tabTitle = msgCount > 0 ? `${localeTitle} (${msgCount})` : localeTitle;

      return (
        <TabPane tab={tabTitle} key={title}>
          <List
            data={list}
            locale={locale}
            title={title}
            emptyText={emptyText}
            showClear={showClear}
            emptyImage={emptyImage}
            showViewMore={showViewMore}
            onClear={() => this.onClear(title)}
            onClick={item => this.onItemClick(item, child.props)}
            onViewMore={event => this.onViewMore(child.props, event)}
          />
        </TabPane>
      );
    });

    return (
      <Spin spinning={loading} delay={0}>
        <Tabs className={styles.tabs} onChange={this.onTabChange}>
          {panes}
        </Tabs>
      </Spin>
    );
  }

  render() {
    const { visible } = this.state;
    const { className, count, popupVisible } = this.props;

    const notificationBox = this.getNotificationBox();
    const trigger = (
      <span className={cx(className, styles.noticeButton, { opened: visible })}>
        <Badge count={count} style={{ boxShadow: 'none' }}>
          <Icon type="bell" className={styles.icon} />
        </Badge>
      </span>
    );

    if (!notificationBox) {
      return trigger;
    }

    const popoverProps = {};
    if ('popupVisible' in this.props) {
      // @ts-ignore
      popoverProps.visible = popupVisible;
    }

    return (
      <HeaderDropdown
        ref={this.popover}
        visible={visible}
        trigger={['click']}
        placement="bottomRight"
        overlay={notificationBox}
        overlayClassName={styles.popover}
        onVisibleChange={this.handleVisibleChange}
        {...popoverProps}
      >
        {trigger}
      </HeaderDropdown>
    );
  }
}

export default NoticeIcon;
