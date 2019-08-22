import React from 'react';
import { Cascader } from 'antd';
import _ from 'lodash';
import { IControlProps } from '@/widget/controls';

interface ICascadeProps extends IControlProps {
  onChange?: (form, name, value, selectedOptions) => any;
}

/**
 * 级联表单元件
 */
export default ({
  name,
  form,
  record,
  normalize,
  initialValue,
  rules,
  onChange,
  ...otherProps
}: ICascadeProps) => {
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
    formFieldOptions.onChange = (value, selectedOptions) =>
      onChange(form, name, value, selectedOptions); // form, name, value, selectedOptions
  }

  const props: any = {
    ...otherProps,
    placeholder: otherProps.placeholder || `请选择`,
  };

  return getFieldDecorator(name, formFieldOptions)(<Cascader {...props} />);
};
