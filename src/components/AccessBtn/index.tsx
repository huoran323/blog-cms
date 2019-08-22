/**
 * 权限功能按钮组件
 */
import React, { PureComponent } from 'react';
import { Button } from 'antd';
import cx from 'classnames';
import styles from './index.less';

interface IProps {
  className?: string;
  accessCollection?: any[]; // 权限集合
  children: React.ReactNode;
  type?: 'ButtonGroup' | 'Button';
}

class AccessBtn extends PureComponent<IProps, { button: any[] }> {
  static defaultProps = {
    type: 'Button',
    accessCollection: [],
  };

  static getDerivedStateFromProps(props) {
    const { accessCollection, children } = props;
    const button = AccessBtn.getButtonTpl(children, accessCollection);

    return { button };
  }

  static getButtonTpl = (children, accessCollection) => {
    const accessCodeList = accessCollection.map(item => item);

    return React.Children.map(children, (child: React.ReactElement<any>) => {
      if (!child) {
        return null;
      }

      if (
        child.props &&
        (child.props['data-code'] && accessCodeList.indexOf(child.props['data-code']) > -1)
      ) {
        return React.cloneElement(child, {
          key: `access-${child.props['data-code']}`,
          size: child.props.size || 'small',
        });
      }
      return null;
    });
  };

  state = {
    button: [],
  };

  componentDidMount() {
    const { children, accessCollection } = this.props;
    const button = AccessBtn.getButtonTpl(children, accessCollection);
    this.setState({ button });
  }

  render() {
    const { type, className } = this.props;
    const { button } = this.state;

    if (type === 'ButtonGroup') {
      return (
        <div className={cx(styles['access-btn'], className)}>
          <Button.Group>{button}</Button.Group>
        </div>
      );
    } else {
      return <div className={cx(styles['access-btn'], className)}>{button}</div>;
    }
  }
}

export default AccessBtn;
