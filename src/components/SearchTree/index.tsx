import React, { useState } from 'react';
import cx from 'classnames';
import { Tree, Input, Switch, Tooltip } from 'antd';
import { ContextMenuTrigger } from 'react-contextmenu';
import { convertArrayToTree } from '@/utils/util';
import styles from './index.less';

const TreeNode = Tree.TreeNode;
const Search = Input.Search;
export interface ISearchTree {
  className?: string;
  style?: React.CSSProperties;
  treeList: any[];
  config?: { key: string; name: string };
  hasRemoteSearch?: boolean;
}

const SearchTree: React.FC<ISearchTree> = props => {
  const { style, className, treeList, config, hasRemoteSearch, ...restProps } = props;
  const treeData = convertArrayToTree(treeList);

  const [state, setState] = useState({
    switchVal: false,
    expandedKeys: ['7'],
    selectedKeys: [],
    searchValue: '', // 搜索关键字
    autoExpandParent: true, // 是否自动展开父节点
  });

  // switch状态改变
  const handleSwitchChange = checked => {
    setState({
      ...state,
      switchVal: checked,
    });
  };

  // 展开/收起节点时触发
  const handleExpand = expandedKeys => {
    setState({
      ...state,
      expandedKeys,
      autoExpandParent: false,
    });
  };

  // 搜索关键字发生改变时触发
  const onChange = e => {
    const { value } = e.target;
    const { switchVal } = state;

    if (hasRemoteSearch && switchVal) {
      const { dispatch, modelFunc } = this.props;
      dispatch({ type: modelFunc, search: value, [config.key]: '', isSearch: true });
      setState({ ...state, searchValue: value });
    } else {
      const expandedKeys = value
        ? treeList
            .filter(item => {
              return (item[config.name] || '').indexOf(value) !== -1;
            })
            .map(item => item[config.key])
            .map(item => `${item}`)
        : [];

      setState({
        ...state,
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      });
    }
  };

  // 选择节点
  const handleCheck = (checkedKeys, checkEvent) => {
    const { handleCheck } = this.props;
    const { checkedNodes, node, checked } = checkEvent;
    if (handleCheck) handleCheck(checkedKeys, { checkedNodes, node, checked });
  };

  // 点击树节点触发
  const handleSelect = (selectedKeys, { node }) => {
    const { handleSelect } = this.props;
    this.setState({ selectedKeys }, () => {
      if (!handleSelect) return;
      if (node.props['dataRef']) handleSelect(selectedKeys, { node });
    });
  };

  // 搜索文本高亮
  const highlightText = (text = '') => {
    const { searchValue } = state;
    if (searchValue !== '' && (text || '').includes(searchValue)) {
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

  // 迭代列表
  const loopList = list => {
    return list.map(item => {
      const { key, name } = config;
      let title = highlightText(item[name]);

      if (item.children) {
        title = <ContextMenuTrigger id="parent_identifier">{title}</ContextMenuTrigger>;
        return (
          <TreeNode key={item[key]} dataRef={item} title={title}>
            {loopList(item.children || [])}
          </TreeNode>
        );
      }

      title = <ContextMenuTrigger id="child_identifier">{title}</ContextMenuTrigger>;
      return <TreeNode key={item[key]} dataRef={item} title={title} />;
    });
  };

  const { switchVal, selectedKeys, expandedKeys } = state;
  const treeProps = {
    showLine: true,
    selectedKeys,
    expandedKeys,
    onExpand: handleExpand,
    onSelect: handleSelect,
    onCheck: handleCheck,
    ...restProps,
  };

  return (
    <div className={cx(className, styles.searchTree)} style={style}>
      <div className="row-between" style={{ marginBottom: 8 }}>
        <Search placeholder="请输入关键词" onChange={onChange} />
        {hasRemoteSearch && (
          <Tooltip title={switchVal ? '后台搜索' : '前台搜索'}>
            <Switch checked={switchVal} style={{ marginLeft: 8 }} onChange={handleSwitchChange} />
          </Tooltip>
        )}
      </div>

      <Tree {...treeProps}>{loopList(treeData)}</Tree>
    </div>
  );
};

SearchTree.defaultProps = {
  hasRemoteSearch: false,
  config: { key: 'id', name: 'name' },
};

export default SearchTree;
