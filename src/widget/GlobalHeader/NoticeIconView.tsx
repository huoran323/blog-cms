import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useDispatch } from 'dva';
import { message, Tag } from 'antd';
import groupBy from 'lodash/groupBy';
import { formatMessage } from 'umi-plugin-react/locale';
import { fetchNotices } from '@/services/global';

import styles from './index.less';
import NoticeIcon from './components/NoticeIcon';

const NoticeIconView: React.FC<any> = props => {
  const dispatch = useDispatch();
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetchNotices().then(res => {
      setNotices(res.data);
    });
  }, []);

  // 将 notice 按照 type 进行分类
  const getNoticeData = () => {
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];

        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  };

  // 获取未读消息数据
  const getUnreadData = noticeData => {
    const unreadMsg = {};
    Object.entries(noticeData).forEach(([key, value]) => {
      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }
      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };

  // 当前点击 notice 状态更改
  const changeReadState = clickedItem => {
    const { id } = clickedItem;
    dispatch({
      type: 'global/changeNoticeReadState',
      payload: id,
    });
  };

  // 清空对应状态的 notice
  const onNoticeClear = type => {
    message.success(
      `${formatMessage({ id: 'component.noticeIcon.cleared' })} ${formatMessage({
        id: `component.globalHeader.${type}`,
      })}`
    );
  };

  // notice 弹窗状态更改
  const onNoticeVisibleChange = () => {};

  const noticeData = getNoticeData();
  const unreadMsg = getUnreadData(noticeData);
  const unreadCount = Object.values(unreadMsg).reduce((prev, curr) => {
    // @ts-ignore
    return prev + curr;
  }, 0);

  return (
    <NoticeIcon
      clearClose
      className={styles.action}
      count={unreadCount}
      onClear={onNoticeClear}
      onItemClick={changeReadState}
      onPopupVisibleChange={onNoticeVisibleChange}
      onViewMore={() => message.info('Click on view more')}
      locale={{
        emptyText: formatMessage({ id: 'widget.noticeIcon.empty' }),
        clear: formatMessage({ id: 'widget.noticeIcon.clear' }),
        viewMore: formatMessage({ id: 'widget.noticeIcon.view-more' }),
        notification: formatMessage({ id: 'widget.globalHeader.notification' }),
        message: formatMessage({ id: 'widget.globalHeader.message' }),
        event: formatMessage({ id: 'widget.globalHeader.event' }),
      }}
    >
      <NoticeIcon.Tab
        showViewMore
        title="notification"
        count={unreadMsg['notification']}
        list={noticeData['notification']}
        emptyText={formatMessage({ id: 'widget.globalHeader.notification.empty' })}
        emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
      />
      <NoticeIcon.Tab
        showViewMore
        title="message"
        count={unreadMsg['message']}
        list={noticeData['message']}
        emptyText={formatMessage({ id: 'widget.globalHeader.message.empty' })}
        emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
      />
      <NoticeIcon.Tab
        showViewMore
        title="event"
        count={unreadMsg['event']}
        list={noticeData['event']}
        emptyText={formatMessage({ id: 'widget.globalHeader.event.empty' })}
        emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
      />
    </NoticeIcon>
  );
};

export default NoticeIconView;
