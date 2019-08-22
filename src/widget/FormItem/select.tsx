import React from 'react';
import { Select } from 'antd';
import _ from 'lodash';
import { IControlProps } from '@/widget/controls';

const { OptGroup, Option } = Select;
interface ISelectProps extends IControlProps {
  dict: Array<{ text: string; value: string; children?: Array<{ text: string; value: string }> }>;
  onChange?: (form, name, value) => any;
}

/**
 * 下拉菜单元件
 */
export default ({
  form,
  name,
  dict,
  record,
  initialValue,
  rules,
  onChange,
  normalize,
  ...otherProps
}: ISelectProps) => {
  const { getFieldDecorator } = form;
  const formFieldOptions: any = {};

  let initVal = initialValue;
  if (record) {
    initVal = record[name];
  }

  // 如果存在初始值
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
    formFieldOptions.onChange = value => onChange(form, name, value); // form, value
  }

  const props: any = {
    allowClear: true,
    ...otherProps,
    placeholder: otherProps.placeholder || `请选择`,
  };

  return getFieldDecorator(name, formFieldOptions)(
    <Select {...props} style={{ width: '100%' }}>
      {props.group
        ? dict.map(dic => (
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
        : dict.map(dic => (
            <Option key={dic.value} value={dic.value} title={dic.text}>
              {dic.text}
            </Option>
          ))}
    </Select>
  );
};
