import React, { PureComponent } from 'react';
import { Tag, Icon } from 'antd';
import ClassNames from 'classnames';
import { isEqual } from 'lodash';

import Option from './TagSelectOption';
import styles from './index.less';

const CheckableTag = Tag.CheckableTag;

export interface ITagSelectProps {
  className?: string;
  style?: object;
  value?: number[] | string[];
  defaultValue?: number[] | string[];
  onChange?: (value: number[] | string[]) => any;
  expandable?: boolean;
  hideCheckAll?: boolean;
  multiple: boolean;
}

class TagSelect extends PureComponent<ITagSelectProps, any> {
  static Option: typeof Option;

  static defaultProps = {
    className: '',
    expandable: false,
    hideCheckAll: false,
    multiple: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      expand: false,
      value: props.value || props.defaultValue || []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.value, this.props.value)) {
      this.setState({ value: nextProps.value })
    }
  }

  /**
   * 处理点击事件
   * @param value
   */
  onChange = (value) => {
    const { onChange } = this.props;
    if (!('value' in this.props)) {
      this.setState({ value });
    }
    if (onChange) {
      onChange(value);
    }
  };

  /**
   * 选择全部
   * @param checked
   */
  onSelectAll = (checked) => {
    let checkedTags = [];
    if (checked) {
      checkedTags = this.getAllTags();
    }
    this.onChange(checkedTags);
  };

  /**
   * 获取全部已选择标签
   */
  getAllTags() {
    let { children } = this.props;
    children = React.Children.toArray(children);
    const checkedTags = children
      // @ts-ignore
      .filter((children) => this.isTagSelectOption(children))
      .map((child) => child.props.value);
    return checkedTags || [];
  }

  /**
   * 判断是否是TagSelectOption
   * @param node
   */
  isTagSelectOption = (node) => {
    return (
      node &&
      node.type &&
      (node.type.isTagSelectOption ||
        node.type.displayName === 'TagSelectOption')
    );
  };

  /**
   * 展开收起状态
   */
  handleExpand = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };

  /**
   * 处理选择标签
   * @param value
   * @param checked
   */
  handleTagChange = (value, checked) => {
    const { multiple } = this.props;
    const { value: StateValue } = this.state;
    let checkedTags = [...StateValue];

    if (multiple) {
      const index = checkedTags.indexOf(value);
      if (checked && index === -1) {
        checkedTags.push(value);
      } else if (!checked && index > -1) {
        checkedTags.splice(index, 1);
      }
    } else {
      checkedTags = checked ? [value] : [];
    }

    this.onChange(checkedTags);
  };

  render() {
    const { className, style, expandable, hideCheckAll, children } = this.props;
    const { value, expand } = this.state;

    const checkedAll = this.getAllTags().length === value.length;

    const cls = ClassNames(styles.tagSelect, className, {
      [styles.hasExpandTag]: expandable,
      [styles.expanded]: expand
    });

    return (
      <div className={cls} style={style}>
        {hideCheckAll ? null : (
          <CheckableTag
            checked={checkedAll}
            key="tag-select-__all__"
            onChange={this.onSelectAll}
          >
            全部
          </CheckableTag>
        )}
        {value &&
        React.Children.map(children, (child: React.ReactElement<any>) => {
          if (this.isTagSelectOption(child)) {
            return React.cloneElement(child, {
              key: `tag-select-${child.props.value}`,
              value: child.props.value,
              checked: value.indexOf(child.props.value) > -1,
              onChange: this.handleTagChange
            });
          }
          return child;
        })}
        {expandable && (
          <a className={styles.trigger} onClick={this.handleExpand}>
            {expand ? '收起' : '展开'} <Icon type={expand ? 'up' : 'down'} />
          </a>
        )}
      </div>
    );
  }
}

TagSelect.Option = Option;

export default TagSelect;
