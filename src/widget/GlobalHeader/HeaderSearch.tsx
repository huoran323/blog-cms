import React, { PureComponent } from 'react';
import { Input, AutoComplete, Icon } from 'antd';
import { Debounce, Bind } from 'lodash-decorators';
import cx from 'classnames';
import styles from './index.less';

interface IHeaderSearchProps {
  className?: string;
  style?: React.CSSProperties;
  open?: boolean;
  defaultOpen?: boolean;
  placeholder?: string;
  dataSource: string[];
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onPressEnter?: (value: string) => void;
  onVisibleChange?: (visible: boolean) => void;
}

class HeaderSearch extends PureComponent<IHeaderSearchProps, any> {
  static defaultProps = {
    dataSource: [],
    defaultOpen: false,
    onPressEnter: () => ({}),
    onVisibleChange: () => ({}),
  };

  static getDerivedStateFromProps(props) {
    if ('open' in props) {
      return {
        searchMode: props.open,
      };
    }
    return null;
  }

  private input: Input;
  private timeout: NodeJS.Timer | null = null;

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      searchMode: props.defaultOpen,
    };
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  onKeyDown = e => {
    if (e.key === 'Enter') {
      const { onPressEnter } = this.props;
      const { value } = this.state;
      this.timeout = setTimeout(() => {
        onPressEnter(value); // Fix duplicate onPressEnter
      }, 0);
    }
  };

  onChange = value => {
    const { onSearch, onChange } = this.props;
    this.setState({ value });
    if (onSearch) {
      onSearch(value);
    }
    if (onChange) {
      onChange(value);
    }
  };

  enterSearchMode = () => {
    const { onVisibleChange } = this.props;
    onVisibleChange(true);
    this.setState({ searchMode: true }, () => {
      const { searchMode } = this.state;
      if (searchMode) {
        this.input.focus();
      }
    });
  };

  leaveSearchMode = () => {
    this.setState({
      searchMode: false,
      value: '',
    });
  };

  // NOTE: 不能小于500，如果长按某键，第一次触发auto repeat的间隔是500ms，小于500会导致触发2次
  @Bind()
  @Debounce(500, {
    leading: true,
    trailing: false,
  })
  debouncePressEnter() {
    const { onPressEnter } = this.props;
    const { value } = this.state;
    onPressEnter(value);
  }

  render() {
    const { className, placeholder, open, ...restProps } = this.props;
    const { searchMode, value } = this.state;
    const inputClass = cx(styles.input, { [styles.show]: searchMode });

    // @ts-ignore
    delete restProps.defaultOpen; // for rc-select not affected

    return (
      <div
        className={cx(className, styles.headerSearch)}
        onClick={this.enterSearchMode}
        onTransitionEnd={({ propertyName }) => {
          if (propertyName === 'width' && !searchMode) {
            const { onVisibleChange } = this.props;
            onVisibleChange(searchMode);
          }
        }}
      >
        <Icon type="search" key="Icon" />
        <AutoComplete
          key="AutoComplete"
          {...restProps}
          className={inputClass}
          value={value}
          onChange={this.onChange}
        >
          <Input
            ref={node => (this.input = node)}
            aria-label={placeholder}
            placeholder={placeholder}
            onKeyDown={this.onKeyDown}
            onBlur={this.leaveSearchMode}
          />
        </AutoComplete>
      </div>
    );
  }
}

export default HeaderSearch;
