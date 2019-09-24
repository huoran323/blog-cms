import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Button, Form, Icon, Row, Col } from 'antd';
import { WrappedFormUtils } from 'antd/es/form/Form';
import { getFieldComp } from '@/utils/util';
import Dict from '@/config/dict';
import styles from './index.less';

const FormItem = Form.Item;
const startDateFormat = 'YYYY-MM-DD 00:00';
const endDateFormat = 'YYYY-MM-DD 23:59';

interface IProps {
  form?: WrappedFormUtils;
  style?: React.CSSProperties;
  record?: any; // 值会映射到表单
  columnNumber?: number; // 一行放几个 formItem
  showResetBtn?: boolean; // 是否展示重置按钮
  handleSearch: (values) => void; // 进行搜索
  formList: Array<{
    name: string;
    label: string;
    type: string;
    col?: number;
    options?: any[];
    formItem?: {
      disabled?: boolean;
      placeholder?: string | string[];
      [otherProps: string]: any;
    };
  }>; // form列表
}

const CommonSearch: React.FC<IProps> = props => {
  const [state, setState] = useState({
    expandForm: true,
    searchParams: {},
  });

  useEffect(() => {
    const { form, record = {} } = props;
    form.setFieldsValue(record);
  }, []);

  /**
   * 格式化提交的数据
   * 如果需要自定义 search 配置需要填写 transform
   * 如果是日期选择 默认 dateFormat
   * 如果是日期选择范围 解析key 格式:xxx_1(必须) 最终替换为xx_1和xx_2 默认dateFormat
   * 如果是时间选择 转为时间戳
   */
  const formatSubmitValues = values => {
    const formDict = _.keyBy(props.formList, 'name');

    const data = {};
    Object.keys(values).forEach(key => {
      const sourceItem = formDict[key] as any;
      const value = values[key];

      data[key] = value;
      if (sourceItem.transform) {
        data[key] = sourceItem.transform(value);
      }

      if (sourceItem.type === 'date') {
        data[key] = value.format(startDateFormat);
      }

      if (sourceItem.type === 'dateRange') {
        const [startTime, endTime] = value;
        if (!startTime || !endTime) return;
        data[key] = [startTime.format(startDateFormat), endTime.format(endDateFormat)];
      }

      if (sourceItem.type === 'datetime' || sourceItem.type === 'time') {
        data[key] = value.unix();
      }

      if (sourceItem.type === 'month') {
        data[key] = value.month() + 1;
      }
    });

    return {
      ...data,
      // 强制刷新
      _refresh_time: new Date().getTime(),
    };
  };

  // 触发搜索事件 如果新旧参数不变直接return
  const triggerSearch = values => {
    const { handleSearch } = props;
    setState(prevState => ({ ...prevState, searchParams: values }));

    if (handleSearch) {
      props.handleSearch(values);
    }
  };

  /**
   * 重置查询
   */
  const handleReset = () => {
    const { form } = props;
    form.resetFields();
    const formData = form.getFieldsValue();

    triggerSearch(formatSubmitValues(formData));
  };

  /**
   * 提交搜索
   */
  const handleSubmit = e => {
    const event = e || window.event;
    event.preventDefault();
    event.stopPropagation();
    const {
      form: { validateFields },
    } = props;

    validateFields((err, values) => {
      if (err) return;
      triggerSearch(formatSubmitValues(values));
    });
  };

  /**
   * 切换展开与收起
   */
  const toggleForm = () => {
    const { expandForm } = state;
    setState(prevState => ({ ...prevState, expandForm: !expandForm }));
  };

  /**
   * 渲染 formItem
   * @param item
   * @private
   */
  const _renderFormItem = item => {
    const { form } = props;
    const { formItem, ...restProps } = item;

    const formProps = {
      form,
      ...restProps,
      ...formItem,
      width: item.width || '100%',
      dict: typeof item.dict === 'string' ? Dict[item.dict] : item.dict,
    };
    return getFieldComp(formProps);
  };

  const { expandForm } = state;
  const { formList, showResetBtn, columnNumber, style } = props;

  const formListLength = formList.length;
  const showCount = expandForm ? columnNumber : formListLength;
  const lineLength = columnNumber + 1; // 一行有多少个col 因为相关操作按钮占一个col 所以 + 1
  const span = 24 / lineLength;
  const isOneLine = formListLength <= columnNumber;
  let buttonFormItemWidth = (lineLength - (showCount % lineLength)) * span; // 按钮所占一行的长度

  // 不展开时，支持自定义span
  if (isOneLine)
    buttonFormItemWidth = 24 - formList.reduce((prev, curr) => prev + (curr.col || span), 0);

  return (
    <div className={styles.searchWrap} style={style}>
      <Form layout="inline" onSubmit={handleSubmit}>
        <Row type="flex" align="middle" gutter={{ md: 4, lg: 12, xl: 24 }}>
          {formList.map((item, index) => (
            <Col
              key={item.name}
              span={isOneLine ? item.col || span : span}
              style={{ display: index < showCount ? 'block' : 'none' }}
            >
              <FormItem label={item.label}>{_renderFormItem(item)}</FormItem>
            </Col>
          ))}

          <Col span={buttonFormItemWidth} className={styles.submitBtn}>
            <Button type="primary" htmlType="submit" size="small" style={{ marginRight: 10 }}>
              查询
            </Button>

            {showResetBtn && (
              <Button size="small" className={styles.reset} onClick={handleReset}>
                重置
              </Button>
            )}

            {!isOneLine ? (
              <a onClick={toggleForm} className={styles.toggleForm}>
                {expandForm ? '展开' : '收起'}
                <Icon style={{ marginLeft: 8 }} type={expandForm ? 'down' : 'up'} />
              </a>
            ) : null}
          </Col>
        </Row>
      </Form>
    </div>
  );
};

CommonSearch.defaultProps = {
  columnNumber: 3,
  showResetBtn: true,
};

export default Form.create()(CommonSearch) as any;
