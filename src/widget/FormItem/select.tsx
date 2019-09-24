import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
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

/**
 * 下拉菜单元件
 */
export default function SelectControl({
  form,
  name,
  dict = [],
  record,
  initialValue,
  rules,
  onChange,
  normalize,
  remoteUrl,
  showSearch,
  ...otherProps
}: ISelectProps) {
  const { getFieldDecorator } = form;
  const formFieldOptions: any = {};
  const [selectDict, setDict] = useState(dict);

  // 异步请求字典数据
  useEffect(() => {
    if (remoteUrl) {
      fetchData();
    }
  }, []);

  let currentValue;
  const fetchData = _.debounce(async (value = '') => {
    currentValue = value;
    const url = showSearch ? `${remoteUrl}?keyword=${value}` : remoteUrl;

    const result = await request(url);
    if (currentValue === value) {
      setDict(result.data);
    }
  }, 300);

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
    showSearch,
    allowClear: true,
    filterOption: false, // 是否根据输入项进行筛选
    ...otherProps,
    placeholder: otherProps.placeholder || `请选择`,
  };

  if (props.showSearch && remoteUrl) {
    props.onSearch = fetchData;
  }

  const options = props.group
    ? selectDict.map(dic => (
        <OptGroup label={dic.text} key={dic.value}>
          {dic.children.map(subItem => (
            <Option value={String(subItem.value)} key={subItem.value}>
              {subItem.text}
            </Option>
          ))}
        </OptGroup>
      ))
    : selectDict.map(dic => (
        <Option key={dic.value} value={dic.value} title={dic.text}>
          {dic.text}
        </Option>
      ));

  return getFieldDecorator(name, formFieldOptions)(
    <Select {...props} style={{ width: '100%' }}>
      {options}
    </Select>
  );
}
