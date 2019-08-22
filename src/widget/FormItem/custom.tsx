import React from 'react';
import _ from 'lodash';

/**
 * 自定义表单元件,
 * 在column中如果需要用form控制
 *
 * (return form.getFieldDecorator('xxx')(
 *     // ...
 * );
 */
export default ({
  name,
  Component,
  form,
  initialValue,
  record,
  rules,
  normalize,
  ...otherProps
}) => {
  const formProps: any = {};
  const { getFieldDecorator } = form;

  let initVal = initialValue;
  if (record) {
    initVal = record[name.toUpperCase()] || record[name];
  }

  // 如果存在初始值
  if (initVal !== null && typeof initVal !== 'undefined') {
    if (_.isFunction(normalize)) {
      formProps.initialValue = normalize(initVal, record);
    } else {
      formProps.initialValue = initVal;
    }
  }

  // 如果有rules
  if (rules && rules.length) {
    formProps.rules = rules;
  }

  // 如果需要onChange
  const { onChange } = otherProps;
  if (typeof onChange === 'function') {
    formProps.onChange = value => onChange(form, name, value); // form, value
  }

  const Comp = React.cloneElement(Component, { form, record, ...otherProps });
  return getFieldDecorator(name, formProps)(Comp);
};
