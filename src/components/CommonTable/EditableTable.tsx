import React, { Component, Fragment } from 'react';
import { isEqual } from 'lodash';
import { Popconfirm, Form, Divider } from 'antd';
import { formatColumn, getFieldComp } from '@/utils/util';
import CommonTable from './CommonTable';
import Dict from '@/config/dict';

const FormItem = Form.Item;

interface IProps {
  className?: string;
  columns?: any[];
  children?: React.ReactNode;
  [otherProps: string]: any;
}

class EditableTable extends Component<IProps, { loading: boolean }> {
  static defaultProps = {
    rowKey: 'id',
  };

  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.dataList, preState.value)) {
      return null;
    }
    return {
      data: nextProps.dataList,
      value: nextProps.dataList,
    };
  }

  private rowKey;
  private tableRef: React.RefObject<any> = React.createRef();
  private clickedCancel: boolean = false;

  constructor(props) {
    super(props);

    this.rowKey = typeof props.rowKey === 'function' ? props.rowKey() : props.rowKey;
    this.state = {
      loading: false,
    };
  }

  /**
   * 处理点击，for add
   */
  handleClick = props => {
    const { disabled, onClick } = props;
    if (disabled) return;

    const result = onClick ? onClick() : true;
    if (result) {
      this.tableRef.current.handleFirstPage();
    }
  };

  /**
   * 进入编辑时保存原始数据
   * @param e
   * @param record
   */
  toggleEditable = (e, record) => {
    e.preventDefault();

    record.editable = !record.editable;
    this.tableRef.current.refreshDataSource(record);
  };

  /**
   * 取消编辑
   * @param e
   * @param record
   */
  cancel = (e, record) => {
    e.preventDefault();
    this.clickedCancel = true;

    record.editable = false;
    if (!record.isNew) {
      this.tableRef.current.refreshDataSource(record);
    }

    this.clickedCancel = false;
  };

  /**
   * 删除行记录
   * @param record
   */
  remove = record => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(record[this.rowKey]);
    }
  };

  /**
   * 保存提交
   * @param e
   * @param record
   */
  saveRow = (e, record) => {
    e.persist();
    this.setState({ loading: true });

    const { form, onChange } = this.props;
    if (this.clickedCancel) {
      this.clickedCancel = false;
      return;
    }

    form.validateFields(async (err, values) => {
      if (err) {
        this.setState({ loading: false });
        return;
      }

      if (record[this.rowKey] && !record.isNew) {
        values = { ...values, [this.rowKey]: record[this.rowKey] };
      }

      if (onChange) {
        await onChange(values);
      }
    });

    this.setState({
      loading: false,
    });
  };

  renderColumns = columns => {
    const { form } = this.props;

    const formatColumns = columns.map(item => ({
      ...item,
      dataIndex: item.dataIndex,
      render: (text, record) => {
        if (!record.editable) return formatColumn({ data: item, value: text });

        const { type, dict, dataIndex, formItem } = item;
        const formProps = {
          form,
          type,
          name: dataIndex,
          initialValue: text,
          ...formItem,
        };

        if (dict) {
          formProps.dict = typeof dict === 'string' ? Dict[dict] : dict;
        }
        return <FormItem>{getFieldComp(formProps)}</FormItem>;
      },
    }));

    return [
      ...formatColumns,
      {
        title: '操作',
        dataIndex: 'action',
        width: 100,
        render: (text, record) => {
          if (this.state.loading) {
            return null;
          }

          if (record.editable) {
            if (record.isNew) {
              return (
                <Fragment>
                  <a onClick={e => this.saveRow(e, record)}>保存</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record)}>
                    <a>删除</a>
                  </Popconfirm>
                </Fragment>
              );
            }
            return (
              <Fragment>
                <a onClick={e => this.saveRow(e, record)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record)}>取消</a>
              </Fragment>
            );
          }

          return (
            <Fragment>
              <a onClick={e => this.toggleEditable(e, record)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record)}>
                <a>删除</a>
              </Popconfirm>
            </Fragment>
          );
        },
      },
    ];
  };

  render() {
    const { className, children, columns, ...restProps } = this.props;
    const { loading } = this.state;

    return (
      <div className={className}>
        {React.Children.map(children, (child: React.ReactElement<any>) => {
          return React.cloneElement(child, {
            onClick: () => this.handleClick(child.props),
          });
        })}

        <CommonTable
          {...restProps}
          loading={loading}
          ref={this.tableRef}
          style={{ marginTop: 10 }}
          columns={this.renderColumns(columns)}
        />
      </div>
    );
  }
}

export default Form.create()(EditableTable) as any;
