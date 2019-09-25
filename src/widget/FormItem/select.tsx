import React, { useState, useEffect, PureComponent } from 'react';
import { Select, Spin } from 'antd';
import _ from 'lodash';
import request from '@/utils/request';
import { IControlProps } from '@/widget/controls';

const { OptGroup, Option } = Select;
interface ISelectProps extends IControlProps {
  hasAll?: boolean; // 是否显示全部
  remoteUrl?: string; // 远程搜索地址
  showSearch?: boolean; // 是否开启远程搜索
  onChange?: (form, name, value) => any;
  onSearch?: (value) => any;
  dict: Array<{ text: string; value: string; children?: Array<{ text: string; value: string }> }>;
}

class SelectControl extends PureComponent<any> {
  currentValue = null;
  state = {
    dict: this.props.dict,
  };

  componentDidMount() {
    if (this.props.remoteUrl) {
      this.fetchData();
    }
  }

  fetchData = _.debounce(async (value = '') => {
    const { remoteUrl, showSearch } = this.props;

    this.currentValue = value;
    const url = showSearch ? `${remoteUrl}?keyword=${value}` : remoteUrl;

    const result = await request(url);
    if (this.currentValue === value) {
      this.setState({ dict: result.data });
    }
  }, 300);

  render() {
    const { dict } = this.state;
    const { group, showSearch, remoteUrl } = this.props;

    let extraProps: any = {};
    if (showSearch && remoteUrl) {
      extraProps.onSearch = this.fetchData;
    }

    return (
      <Select {...this.props} {...extraProps} style={{ width: '100%' }}>
        {group
          ? dict.map(dic => (
              <OptGroup label={dic.text} key={dic.value}>
                {dic.children.map(subItem => (
                  <Option value={String(subItem.value)} key={subItem.value}>
                    {subItem.text}
                  </Option>
                ))}
              </OptGroup>
            ))
          : dict.map(dic => (
              <Option key={dic.value} value={dic.value} title={dic.text}>
                {dic.text}
              </Option>
            ))}
      </Select>
    );
  }
}

/**
 * 下拉菜单元件
 */
export default ({
  form,
  name,
  dict = [],
  record,
  initialValue,
  rules,
  onChange,
  normalize,
  ...otherProps
}: ISelectProps) => {
  const { getFieldDecorator } = form;
  const formFieldOptions: any = {};

  // 初始值处理
  let initVal = initialValue;
  if (record) {
    initVal = record[name];
  }

  // 格式化初始值
  if (initVal !== null && typeof initVal !== 'undefined') {
    if (Array.isArray(initVal)) {
      initVal = initVal.map(item => `${item}`);
    } else {
      initVal = `${initVal}`;
    }

    if (_.isFunction(normalize)) {
      formFieldOptions.initialValue = normalize(initVal);
    } else {
      formFieldOptions.initialValue = initVal;
    }
  }

  // 如果有rules
  if (rules && rules.length) {
    formFieldOptions.rules = rules;
  }

  // 如果需要onChange
  if (typeof onChange === 'function') {
    formFieldOptions.onChange = value => {
      onChange(form, name, value);
    };
  }

  const props: any = {
    dict,
    allowClear: true,
    filterOption: false, // 是否根据输入项进行筛选
    ...otherProps,
    placeholder: otherProps.placeholder || `请选择`,
  };

  return getFieldDecorator(name, formFieldOptions)(<SelectControl {...props} />);
};
