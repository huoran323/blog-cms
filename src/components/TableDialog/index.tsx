import React, { Component, Fragment } from 'react';
import _ from 'lodash';
import { Modal, Popover, Icon, Tabs } from 'antd';
import { CommonSearch, CommonTable } from '@/components';
import { formatColumn } from '@/utils/util';
import styles from './index.less';

const TabPane = Tabs.TabPane;
class RenderContent extends Component<any, any> {
  private tableRef: React.RefObject<any> = React.createRef();

  constructor(props) {
    super(props);

    const { selectedRowKeys, selectedRow } = props.selectConf;
    this.state = {
      selectedRowKeys,
      selectedRow,
    };
  }

  /**
   * 进行搜索
   */
  handleSearch = values => {
    this.tableRef.current.setState(
      {
        searchParams: values,
      },
      this.tableRef.current.handleFirstPage
    );
  };

  /**
   * 表格选择
   * @param selectedRowKeys
   * @param selectedRow
   */
  handleSelect = (selectedRowKeys, selectedRow) => {
    const { handleSelect, tabItem } = this.props;
    handleSelect(selectedRowKeys, selectedRow, tabItem.key);
  };

  render() {
    const { fetchList, searchGroup, columns, columnNumber = 2, ...otherProps } = this.props.tabItem;
    const extraProps = _.omit(otherProps, 'key');

    return (
      <Fragment>
        {searchGroup && (
          <CommonSearch
            usePage={false}
            handleSearch={this.handleSearch}
            columnNumber={columnNumber}
            formList={searchGroup}
            {...extraProps}
          />
        )}

        <CommonTable
          defaultPageSize={10}
          showScroll={false}
          ref={this.tableRef}
          fetchList={fetchList}
          columns={formatColumn(columns)}
          onSelect={this.handleSelect}
          {...extraProps}
        />
      </Fragment>
    );
  }
}

interface IProps {
  onChange: any;
  children: React.ReactElement;
  title?: string | React.ReactNode;
  withType?: 'modal' | 'popover';
  normalize?: any;
  tabList: Array<{
    columns: any[];
    searchGroup?: object;
    fetchList: any;
    key: string;
    tabName?: string | React.ReactNode;
    [otherProps: string]: any;
  }>;
  isQuickSubmit?: boolean; // 快捷提交
  [otherProps: string]: any;
}

class TableDialog extends Component<IProps, any> {
  static defaultProps = {
    title: '选择分组',
    withType: 'modal',
    placement: 'bottom',
  };

  constructor(props) {
    super(props);

    const selectOpts = {};
    props.tabList.forEach(item => {
      selectOpts[item.key] = {
        selectedRowKeys: item.selectedRowKeys || [],
        selectedRow: item.selectedRow || [],
      };
    });

    this.state = {
      visible: false,
      selectOpts,
    };
  }

  /**
   * 弹窗状态改变
   */
  handleVisibleChange = visible => this.setState({ visible });

  /**
   * 接收子组件回调
   * @param selectedRowKeys
   * @param selectedRow
   * @param tabKey
   */
  handleSelect = async (selectedRowKeys, selectedRow, tabKey) => {
    const { selectOpts } = this.state;
    const { isQuickSubmit } = this.props;

    selectOpts[tabKey] = { selectedRowKeys, selectedRow };
    await this.setState(selectOpts);
    if (isQuickSubmit) this.handleSubmit(true);
  };

  /**
   * 包装children click事件 -> 进行更一步的操作
   * @param fn
   * @param event
   */
  handleClick = (fn, event?) => {
    if (event) event.stopPropagation();

    const { visible } = this.state;
    const result = fn ? fn() : true;
    if (result) this.handleVisibleChange(!visible);
  };

  /**
   * 提交事件
   */
  handleSubmit = (shouldOpen?) => {
    const { onChange, normalize } = this.props;
    const { selectOpts, visible } = this.state;
    if (!shouldOpen) this.handleVisibleChange(!visible);

    let returnData = selectOpts;
    if (normalize) returnData = normalize(returnData);
    onChange(returnData);
  };

  /**
   * 模态框形态
   * @param content
   */
  renderWithModal = content => {
    const { children, title, disabled } = this.props;
    const { visible } = this.state;

    return (
      <Fragment>
        {React.Children.map(children, (child: React.ReactElement<any>) => {
          return React.cloneElement(child, {
            onClick: disabled ? () => null : () => this.handleClick(child.props.onClick),
          });
        })}

        <Modal
          title={title}
          visible={visible}
          width={800}
          onCancel={() => this.handleVisibleChange(false)}
          onOk={() => this.handleSubmit(false)}
        >
          {content}
        </Modal>
      </Fragment>
    );
  };

  /**
   * popover形态
   * @param content
   */
  renderWithPopover = content => {
    const { children, title, disabled, placement, ...otherProps } = this.props;
    const { getPopContainer } = otherProps;
    const { visible } = this.state;
    const wrapContent = <Fragment>{content}</Fragment>;

    return (
      <Popover
        content={wrapContent}
        title={
          <div className="flex">
            <span>{title}</span>
            <Icon type="close" onClick={() => this.handleVisibleChange(false)} />
          </div>
        }
        trigger="click"
        placement={placement}
        visible={disabled ? false : visible}
        getPopupContainer={getPopContainer}
        overlayStyle={{ width: 800 }}
        onVisibleChange={this.handleVisibleChange}
        overlayClassName={styles.popover}
        {...otherProps}
      >
        {React.Children.map(children, (child: React.ReactElement<any>) => {
          return React.cloneElement(child, {
            onClick: event => this.handleClick(child.props.onClick, event),
          });
        })}
      </Popover>
    );
  };

  render() {
    const { selectOpts } = this.state;
    const { withType, tabList } = this.props;

    let content = null;
    if (tabList.length > 1) {
      content = (
        <Tabs>
          {tabList.map(item => (
            <TabPane tab={item.tabName} key={item.key}>
              <RenderContent
                tabItem={item}
                selectConf={selectOpts[item.key]}
                handleSelect={this.handleSelect}
              />
            </TabPane>
          ))}
        </Tabs>
      );
    } else {
      const tabItem = tabList[0];
      content = (
        <RenderContent
          tabItem={tabItem}
          selectConf={selectOpts[tabItem.key]}
          handleSelect={this.handleSelect}
        />
      );
    }

    return withType === 'modal' ? this.renderWithModal(content) : this.renderWithPopover(content);
  }
}

export default TableDialog;
