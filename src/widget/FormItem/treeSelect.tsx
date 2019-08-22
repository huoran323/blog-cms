import React, { PureComponent } from 'react';
import { TreeSelect } from 'antd';
import _ from 'lodash';

const { TreeNode } = TreeSelect;
export interface ISelectTree {
  form?: any;
  className?: string;
  style?: React.CSSProperties;
  treeList: any[];
  config?: { key: 'string'; name: 'string' };
}

// 下拉树菜单元件
export class SelectTree extends PureComponent<ISelectTree> {
  static defaultProps = {
    size: 'small',
    allowClear: true,
    showLine: true,
    showSearch: true,
    treeDefaultExpandAll: true,
    config: { key: 'id', name: 'name' },
  };

  state = {
    searchValue: '',
  };

  // 进行搜索
  onSearch = value => {
    this.setState({ searchValue: value });
  };

  // 高亮 searchValue
  highlightText = text => {
    const { searchValue } = this.state;
    if (searchValue !== '' && text.includes(searchValue)) {
      const [before, after] = text.split(searchValue);
      return (
        <span>
          {before}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {after}
        </span>
      );
    }
    return <span>{text}</span>;
  };

  render() {
    const { searchValue } = this.state;
    const { style, treeList, config, ...restProps } = this.props;
    const { name, key } = config;

    // 业务树遍历
    const loop = data =>
      data.map(item => {
        const title = this.highlightText(item[name]);
        if (item.children) {
          return (
            <TreeNode value={`${item[key]}`} title={title} key={`${item[key]}`}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode value={`${item[key]}`} key={`${item[key]}`} title={title} />;
      });

    return (
      <TreeSelect
        searchValue={searchValue}
        onSearch={this.onSearch}
        style={{ ...style, width: '100%' }}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        {...restProps}
      >
        {loop(treeList)}
      </TreeSelect>
    );
  }
}

export default ({
  form,
  name,
  children,
  record,
  initialValue,
  normalize,
  rules,
  onChange,
  treeList,
  ...restProps
}) => {
  const { getFieldDecorator } = form;
  const formFieldOptions = {} as any;

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
    formFieldOptions.onChange = (value, label, extra) => onChange(form, name, value, label, extra); // form, value
  }

  return getFieldDecorator(name, formFieldOptions)(
    <SelectTree treeList={treeList} {...restProps} />
  );
};
