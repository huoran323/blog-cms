import React from 'react';
import { DatePicker, TimePicker } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { IControlProps } from '@/widget/controls';

const { MonthPicker, RangePicker }: any = DatePicker;
export interface IDateProps extends IControlProps {
  format?: string;
  onChange?: (form, date, dateString) => any;
}

/**
 * 日期，时间元件
 */
export default ({
  name,
  form,
  type,
  record,
  initialValue,
  rules,
  format,
  onChange,
  normalize,
  ...otherProps
}: IDateProps) => {
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
      if (_.isArray(initVal)) {
        formFieldOptions.initialValue = initVal.map(item =>
          moment.isMoment(item) ? item : moment(item)
        );
      } else {
        formFieldOptions.initialValue = moment.isMoment(initVal) ? initVal : moment(initVal);
      }
    }
  }

  // 如果有rules
  if (rules && rules.length) {
    formFieldOptions.rules = rules;
  }

  // 如果需要onChange
  if (typeof onChange === 'function') {
    formFieldOptions.onChange = (date, dateString) => onChange(form, date, dateString);
  }

  const props: any = {
    ...otherProps,
  };

  let Component: any = DatePicker;
  switch (type) {
    case 'datetime':
      if (!props.showTime) {
        props.showTime = true;
      }
      break;
    case 'dateRange':
      Component = RangePicker;
      break;
    case 'month':
      Component = MonthPicker;
      break;
    case 'time':
      Component = TimePicker;
      break;
    default:
  }

  if (type === 'month') {
    props.format = 'YYYY-MM';
  } else if (type === 'datetime') {
    props.format = 'YYYY-MM-DD HH:mm:ss';
  } else if (type === 'time') {
    props.format = 'HH:mm:ss';
  } else {
    props.format = 'YYYY-MM-DD';
  }

  if (format) {
    props.format = format;
  }

  return getFieldDecorator(name, formFieldOptions)(<Component {...props} locale={locale} />);
};
