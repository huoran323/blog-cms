import React from 'react';
import { Checkbox } from 'antd';
import _ from 'lodash';
import { IControlProps } from '@/widget/controls';

const CheckboxGroup = Checkbox.Group;
interface ICheckboxProps extends IControlProps {
  dict?: Array<{ value: string; text: string }>;
  onChange?: (form, name, checkedValue) => any;
}

/**
 * 单选框
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
}: ICheckboxProps) => {
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
    formFieldOptions.onChange = checkedValues => onChange(form, name, checkedValues); // form, value
  }

  return getFieldDecorator(name, formFieldOptions)(
    <CheckboxGroup {...otherProps}>
      {dict.map(dic => (
        <Checkbox key={dic.value} value={dic.value}>
          {dic.text}
        </Checkbox>
      ))}
    </CheckboxGroup>
  );
};
