import React, { PureComponent } from 'react';
import { Popconfirm, Card, Form, Button } from 'antd';
import moment from 'moment';
import { CommonTable } from '@/components';
import _, { isEqual } from 'lodash';
import styles from './index.less';

const FormItem = Form.Item;
interface IState {
  data: any[];
  value: any[];
  loading: boolean;
}

interface IControlledProps {
  dataList?: any[];
  columns?: any[];
  [otherProps: string]: any;
}

class TableControlled extends PureComponent<IControlledProps, IState> {
  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.dataList, preState.value)) {
      return null;
    }

    return {
      data: nextProps.dataList,
      value: nextProps.dataList,
    };
  }

  private index: number = 0;
  private dateFormat: string = 'YYYY-MM-DD';

  constructor(props) {
    super(props);

    this.state = {
      data: props.dataList,
      loading: false,
      /* eslint-disable-next-line react/no-unused-state */
      value: props.dataList,
    };
  }

  /**
   * 根据key获取当前行记录
   * @param key
   * @param newData
   */
  getRowByKey(key, newData?: any[]) {
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  /**
   * 新增行记录
   */
  newMember = () => {
    const { columns } = this.props;
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));

    const fieldMap = {};
    columns.forEach(item => (fieldMap[`${item.dataIndex}`] = ''));

    newData.push({ key: `NEW_TEMP_ID_${this.index}`, ...fieldMap });
    this.index += 1;
    this.setState({ data: newData });
  };

  /**
   * 删除行记录
   * @param key
   */
  remove(key) {
    const { data } = this.state;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
  }

  /**
   * 处理记录值改变
   * @param value
   * @param fieldName
   * @param key
   */
  handleFieldChange(value, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);

    if (target) {
      target[fieldName] = value;
      this.setState({ data: newData });
    }
  }

  renderColumns = () => {
    const { name, columns, form, otherProps } = this.props;
    const { getFieldDecorator } = form;

    const formatColumns = columns.map(item => {
      return {
        ...item,
        key: item.dataIndex,
        render: (text, record, index) => {
          let FieldComp = null;
          let formProps = {
            form,
            initialValue: text,
            name: `${name}[${index}][${item.dataIndex}]`,
            ...otherProps,
          };

          if (item.rules) {
            formProps.rules = item.rules;
          }

          switch (item.type) {
            case 'input':
            case 'textarea': // 多行文本
              formProps = {
                ...formProps,
                onChange: (form, value) =>
                  this.handleFieldChange(value, item.dataIndex, record.key),
              };
              FieldComp = FieldComp = require(`./input`).default(formProps);
              break;
            case 'dateRange': // 日期范围
            case 'datetime': // 日期时间
            case 'date': // 日期
            case 'month': // 月
            case 'time': // 时间
              formProps = {
                ...formProps,
                initialValue: text ? moment(text, this.dateFormat) : null,
                onChange: (form, date, dateString) =>
                  this.handleFieldChange(dateString, item.dataIndex, record.key),
              };
              FieldComp = require(`./date`).default(formProps);
              break;
            case 'plain':
              FieldComp = getFieldDecorator(formProps.name, formProps)(
                <span className="ant-form-text">{text}</span>
              );
              break;
            default:
              formProps = {
                ...formProps,
                initialValue: text,
              };
              FieldComp = require(`./${item.type}`).default(formProps);
          }

          return <FormItem help="">{FieldComp}</FormItem>;
        },
      };
    });

    return [
      ...formatColumns,
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        ),
      },
    ];
  };

  // 渲染表格内容
  renderTable = () => {
    const { loading, data } = this.state;
    const columns = this.renderColumns();

    return (
      <CommonTable
        rowKey="key"
        showScroll={false}
        pagination={false}
        selectType={false}
        loading={loading}
        columns={columns}
        dataSource={data}
      />
    );
  };

  render() {
    const { WrappedComp } = this.props;

    return WrappedComp ? (
      <WrappedComp>
        <div className={styles['edit-table']}>
          {this.renderTable()}
          <Button ghost onClick={this.newMember} type="primary" size="small" icon="plus">
            添加
          </Button>
        </div>
      </WrappedComp>
    ) : (
      <Card
        title={'重要日期'}
        type="inner"
        className={styles['edit-table']}
        extra={<a onClick={this.newMember}>添加</a>}
      >
        {this.renderTable()}
      </Card>
    );
  }
}

interface IProps {
  form;
  record;
  name?;
  columns?: any[];
  titleKey?;
  initialValue?;
  onChange?;
  normalize?;
}

/**
 * TableForm组件
 */
export default ({
  form,
  name,
  columns,
  titleKey,
  initialValue,
  normalize,
  record,
  ...otherProps
}: IProps) => {
  let initVal = initialValue || [];
  if (record) {
    initVal = record[name.toUpperCase()] || record[name];
  }

  // 如果存在初始值
  if (initVal !== null && typeof initVal !== 'undefined') {
    initVal = initVal.map((item, index) => {
      item.key = `old_TEMP_ID_${index}`;
      return item;
    });

    if (_.isFunction(normalize)) {
      initVal = normalize(initVal, record);
    }
  }

  // 如果需要onChange
  if (typeof otherProps.onChange === 'function') {
    otherProps.onChange = (value, rows) => otherProps.onChange(form, value, rows); // form, value
  }

  return (
    <TableControlled name={name} form={form} columns={columns} dataList={initVal} {...otherProps} />
  );
};
