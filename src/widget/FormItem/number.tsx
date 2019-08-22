import React from 'react';
import { InputNumber } from 'antd';
import _ from 'lodash';
import { IControlProps } from '@/widget/controls';

interface INumberProps extends IControlProps {
  onChange?: (form, name, event) => any;
}

/**
 * 数字输入框控件
 */
export default ({
  form,
  name,
  record,
  initialValue,
  normalize,
  rules,
  onChange,
  ...otherProps
}: INumberProps) => {
  const { getFieldDecorator } = form;
  const formFieldOptions: any = {};

  let initVal = initialValue;
  if (record) {
    initVal = record[name];
  }

  // 如果存在初始值
  if (initVal !== null && typeof initVal !== 'undefined') {
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
    formFieldOptions.onChange = event => onChange(form, name, event); // form, value, event
  }

  const props = {
    ...otherProps,
    placeholder: otherProps.placeholder || `请输入`,
  };

  return getFieldDecorator(name, formFieldOptions)(<InputNumber {...props} />);
};
