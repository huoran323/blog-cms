import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { isEqual } from 'lodash';
import classNames from 'classnames';
import update from 'immutability-helper';
import { TableProps } from 'antd/es/table/interface';
import { formatColumn } from '@/utils/util';

export interface ICommonTable<T> extends TableProps<T> {
  fetchList?: (params: any, pageNum: number, pageSize: number) => Promise<any>;
  extraParams?: object; // 查询固定参数
  searchParams?: object; // 搜索条件

  defaultPageSize?: number;
  dataHandler?: (data) => any;
  showScroll?: boolean; // 是否显示滚动条
  draggable?: boolean;

  alternateColor?: boolean; // 是否奇偶行不同颜色
  rowSelection?: any;
  selectedRowKeys?: any[]; // 指定选中项的key数组
  selectType?: 'checkbox' | 'radio' | false; // 多选/单选
  onSelect?: (selectedRowKeys: any[], selectedRows: any[]) => any;
}

interface IState {
  loading: boolean;
  current: number;
  pageSize: number;
  total: number;
  dataSource: any[];
  selectedRows: any[];
  selectedRowKeys: any[];
}

class CommonTable<T> extends PureComponent<ICommonTable<any>, IState> {
  static defaultProps = {
    size: 'small',
    rowKey: 'id',
    selectType: 'checkbox',
    bordered: true,
    showScroll: true,
    draggable: false,
    alternateColor: true,
    defaultPageSize: 15,
    selectedRowKeys: [],
  };
  rowKey: string;

  constructor(props) {
    super(props);

    this.rowKey = props.rowKey;
    this.state = {
      loading: false,
      total: 0,
      current: 1,
      pageSize: props.defaultPageSize,
      dataSource: props.dataSource,

      selectedRows: [],
      selectedRowKeys: props.selectedRowKeys,
    };
  }

  componentDidMount() {
    const { current = 1, pageSize } = this.state;
    this.fetchData(current, pageSize);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.selectedRowKeys, nextProps.selectedRowKeys)) {
      this.setState({
        selectedRowKeys: nextProps.selectedRowKeys,
      });
    }

    // 外部传值数据处理
    if (!isEqual(this.props.dataSource, nextProps.dataSource)) {
      this.setState({
        dataSource: nextProps.dataSource,
      });
    }
  }

  componentDidUpdate(prevProps) {
    // 搜索参数变化，重新请求接口
    if (!isEqual(this.props.searchParams, prevProps.searchParams)) {
      this.handleFirstPage();
    }
  }

  /**
   * 刷新数据
   */
  refreshDataSource = data => {
    const { dataSource } = this.state;
    const newDataSource = dataSource.map(item => {
      if (item[this.rowKey] === data[this.rowKey]) {
        return data;
      }
      return item;
    });

    this.setState({ dataSource: newDataSource });
  };

  /**
   * 请求接口，获得列表数据
   * @param pageNum
   * @param pageSize
   * @param sorter
   * @param filter
   */
  fetchData = async (pageNum, pageSize, sorter = {}, filter = {}) => {
    const { loading } = this.state;
    const { fetchList, dataHandler, extraParams, searchParams } = this.props;
    if (loading) return;
    if (typeof fetchList !== 'undefined') {
      const params = { ...searchParams, ...extraParams };

      this.setState({ loading: true });

      try {
        const {
          data: { rows, total },
        } = await fetchList(params, pageNum, pageSize);

        // dataSource 数据处理
        let dataSource = (rows || []).map((item, index) => ({
          ...item,
          index: (pageNum - 1) * pageSize + (index + 1),
        }));
        dataSource = dataHandler ? dataHandler(dataSource) : dataSource;

        this.setState({
          dataSource,
          total: total || rows.length,
          loading: false,
        });
      } catch (e) {
        console.log(e);
        this.setState({ loading: false });
      }
    }
  };

  /**
   * 请求第一页的数据
   */
  handleFirstPage = async () => {
    const { pageSize } = this.state;
    this.onSelectChange([], []);
    await this.fetchData(1, pageSize);
  };

  /**
   * 处理分页大小改变
   * @param current
   * @param pageSize
   */
  handleSizeChange = async (current, pageSize) => {
    await this.setState({ current, pageSize });
    await this.fetchData(current, pageSize);
  };

  /**
   * 表格分页
   * @param pagination
   * @param filters
   * @param sorter
   */
  handleTableChange = async (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;

    await this.setState({ current, pageSize });
    await this.fetchData(current, pageSize, sorter, filters);
  };

  /**
   * 选择事件
   * @param selectedRowKeys
   * @param selectedRows
   */
  onSelectChange = (selectedRowKeys, selectedRows) => {
    const { onSelect, rowKey }: any = this.props;
    const stateRows = this.state.selectedRows;
    let resultRows = [];

    if (selectedRowKeys.length > selectedRows.length) {
      const partialSelectedRowKeys = selectedRows.map(row => row[rowKey]);
      const leftRows = stateRows.filter(
        row =>
          selectedRowKeys.indexOf(row[rowKey]) >= 0 &&
          partialSelectedRowKeys.indexOf(row[rowKey]) < 0
      );
      resultRows = leftRows.concat(selectedRows);
    } else {
      resultRows = selectedRows;
    }
    this.setState({
      selectedRowKeys,
      selectedRows: resultRows,
    });
    if (onSelect) {
      onSelect(selectedRowKeys, resultRows);
    }
  };

  /**
   * 拖拽行
   * @param dragIndex
   * @param hoverIndex
   */
  moveRow = (dragIndex, hoverIndex) => {
    const { dataSource } = this.state;
    const dragRow = dataSource[dragIndex];

    this.setState(
      update(this.state, {
        dataSource: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
        },
      })
    );
  };

  render() {
    const {
      rowKey,
      pagination,
      defaultPageSize,
      selectType,
      rowSelection,
      alternateColor,
      className,
      columns,
      showScroll,
      draggable,
      ...restProps
    } = this.props;
    const { loading, total, current, pageSize, selectedRowKeys, dataSource } = this.state;
    const paging =
      typeof pagination !== 'boolean'
        ? {
            total,
            current,
            pageSize,
            defaultPageSize,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '15', '20', '25'],
            showTotal: total => `共 ${total} 条`,
            onShowSizeChange: (current, size) => this.handleSizeChange(current, size),
            ...pagination,
          }
        : false;

    const selectOptions = {
      type: selectType === 'radio' ? 'radio' : 'checkbox',
      selectedRowKeys,
      onChange: this.onSelectChange,
      ...rowSelection,
    };

    const cls = classNames('common-table', className, {
      'table-row-alternate-color': alternateColor,
    });

    // scroll 滚动条处理
    let scroll = {};
    if (restProps.scroll) {
      scroll = restProps.scroll;
    } else {
      scroll = showScroll ? { x: 1300 } : {};
    }

    // 表格行是否可拖拽
    if (draggable) {
      // @ts-ignore
      restProps.onRow = (record, index) => ({
        index,
        moveRow: this.moveRow,
      });
    }

    return (
      <div className={cls}>
        <Table
          {...restProps}
          scroll={scroll}
          rowKey={rowKey}
          loading={loading}
          pagination={paging}
          dataSource={dataSource}
          columns={formatColumn({ data: columns })}
          onChange={this.handleTableChange}
          rowSelection={selectType ? selectOptions : null}
        />
      </div>
    );
  }
}

export default CommonTable;
