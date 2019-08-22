import React from 'react';
import { Radio } from 'antd';
import _ from 'lodash';
import { IControlProps } from '@/widget/controls';

const RadioGroup = Radio.Group;
interface IRadioProps extends IControlProps {
  dict?: Array<{ value: string; text: string }>;
  onChange?: (form, name, event) => any;
  buttonStyle?: 'outline' | 'solid';
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
  buttonStyle,
  ...otherProps
}: IRadioProps) => {
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
    formFieldOptions.onChange = e => onChange(form, name, e); // form, value
  }

  let RadioComp: any = Radio;
  if (buttonStyle === 'solid') {
    RadioComp = Radio.Button;
  }

  return getFieldDecorator(name, formFieldOptions)(
    <RadioGroup {...otherProps}>
      {dict.map(dic => (
        <RadioComp key={dic.value} value={dic.value} title={dic.text}>
          {dic.text}
        </RadioComp>
      ))}
    </RadioGroup>
  );
};
