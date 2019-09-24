import React, { useState, useEffect } from 'react';
import { Mentions } from 'antd';
import _ from 'lodash';
import debounce from 'lodash/debounce';
import { IControlProps } from '@/widget/controls';

const { Option } = Mentions;
interface IMentionsProps extends Partial<IControlProps> {
  onChange?: (form, name, value) => any;
}

interface IMentionsControlProps {
  fetchList?: (key) => Promise<any>;
  dict?: Array<{ text: string; value: string }>;
  [otherProps: string]: any;
}

const MentionsControlled: React.FC<IMentionsControlProps> = props => {
  const { fetchList, dict, ...restProps } = props;
  const [state, setState] = useState({
    data: dict || [],
    search: '',
    loading: false,
  });

  // 请求数据
  useEffect(() => {
    if (fetchList) {
      fetchData(state.search);
    }
  }, [state.search]);

  // 处理搜索
  const onSearch = search => {
    setState({
      ...state,
      search,
      loading: true,
      data: [],
    });
  };

  // 请求数据
  const fetchData = debounce(key => {
    if (!key) {
      setState({ ...state, data: [] });
      return;
    }

    fetchList(key).then(res => {
      const { search } = state;
      if (key !== search) {
        return;
      }

      setState({
        ...state,
        loading: false,
        data: res.data,
      });
    });
  }, 800);

  const { data, loading } = state;
  if (fetchList) {
    // @ts-ignore
    restProps.onSearch = onSearch;
  }

  return (
    <Mentions loading={loading} {...restProps}>
      {data.map(item => (
        <Option key={item.value} value={item.value}>
          {item.text}
        </Option>
      ))}
    </Mentions>
  );
};

export default ({
  form,
  name,
  record,
  initialValue,
  normalize,
  rules,
  onChange,
  ...otherProps
}: IMentionsProps) => {
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
    formFieldOptions.onChange = text => onChange(form, name, text); // form, name, value
  }

  const props = {
    ...otherProps,
    placeholder: otherProps.placeholder || `请输入`,
  };

  return getFieldDecorator(name, formFieldOptions)(MentionsControlled(props));
};
