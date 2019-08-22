import React from 'react';
import { Input } from 'antd';
import _ from 'lodash';
import { IControlProps } from '@/widget/controls';

const { TextArea, Password, Search } = Input;
interface IInputProps extends IControlProps {
  onChange?: (form, name, event) => any;
  type?: 'input' | 'password' | 'search' | 'textarea';
}

/**
 * 文本框元件
 */
export default ({
  form,
  name,
  record,
  initialValue,
  normalize,
  rules,
  onChange,
  type = 'input',
  ...otherProps
}: IInputProps) => {
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
    formFieldOptions.onChange = e => onChange(form, name, e); // form, name, event
  }

  let Comp = null;
  switch (type) {
    case 'password':
      Comp = Password;
      break;
    case 'textarea':
      Comp = TextArea;
      break;
    case 'search':
      Comp = Search;
      break;
    default:
      Comp = Input;
  }

  const props = {
    autosize: { minRows: 4, maxRows: 8 },
    ...otherProps,
    placeholder: otherProps.placeholder || `请输入`,
  };

  return getFieldDecorator(name, formFieldOptions)(<Comp {...props} />);
};
