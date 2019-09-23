import React, { useEffect, useState } from 'react';
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
  hasAll,
  remoteUrl,
  showSearch,
  ...otherProps
}: ISelectProps) {
  const { getFieldDecorator } = form;
  const formFieldOptions: any = {};

  let lastFetchId = 0;
  const [isFetching, setFetching] = useState(false);
  const [selectDict, setDict] = useState(dict);

  // 异步请求字典数据
  useEffect(() => {
    if (remoteUrl) {
      fetchData();
    }
  }, [remoteUrl]);

  const fetchData = _.throttle((value = '') => {
    setFetching(true);

    const url = showSearch ? `${remoteUrl}?keyword=${value}` : remoteUrl;
    request(url).then(res => {
      setDict(res.data);
      setFetching(false);
    });
  }, 800);

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
      form.setFieldsValue({ name: value });
    };
  }

  const props: any = {
    showSearch,
    allowClear: true,
    ...otherProps,
    placeholder: otherProps.placeholder || `请选择`,
  };

  return getFieldDecorator(name, formFieldOptions)(
    <Select
      {...props}
      style={{ width: '100%' }}
      onSearch={fetchData}
      notFoundContent={isFetching ? <Spin size="small" /> : null}
    >
      {props.group
        ? selectDict.map(dic => (
            <OptGroup label={dic.text} key={dic.value}>
              {dic.children.map(subItem => {
                return (
                  <Option value={String(subItem.value)} key={subItem.value}>
                    {subItem.text}
                  </Option>
                );
              })}
            </OptGroup>
          ))
        : selectDict.map(dic => (
            <Option key={dic.value} value={dic.value} title={dic.text}>
              {dic.text}
            </Option>
          ))}
    </Select>
  );
}
