import React, { Component } from 'react';
import _ from 'lodash';
import BraftEditor from 'braft-editor';
import MyBraftEditor from './editor';

interface IEditorProps {
  form: any;
  valueType: 'raw' | 'html'; // 输出内容格式 raw为json html为dom string
  onChange?: any; // onChange回调 参数为当前编辑器value
  [otherProps: string]: any; // 其他参数参照文档
}

export default ({
  form,
  name,
  rules,
  valueType,
  record,
  initialValue,
  normalize,
  ...otherProps
}: IEditorProps) => {
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
  formFieldOptions.initialValue = BraftEditor.createEditorState(formFieldOptions.initialValue);

  // 如果有rules
  if (rules && rules.length) {
    formFieldOptions.rules = rules;
  }

  const props = {
    form,
    name,
    valueType,
    ...otherProps,
  };

  return getFieldDecorator(name, formFieldOptions)(MyBraftEditor(props));
};
