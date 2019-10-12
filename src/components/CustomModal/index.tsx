import React, { Component } from 'react';
import _ from 'lodash';
import cx from 'classnames';
import { Button, Form, Modal, Row } from 'antd';
import styles from './index.less';

interface IProps {
  className?: string;
  loading?: boolean;
  full?: boolean; // 是否全屏展示
  visible: boolean; // 弹窗状态
  record?: any; // 当前行记录
  modalOpts?: object;
  renderContent?: any;
  onCancel?: () => void;
  onSubmit?: (values, record) => void;
  title: string | React.ReactNode; // 弹窗标题
  children: string | React.ReactNode; // 弹窗内容
  [otherProps: string]: any;
}

interface IState {
  visible: boolean;
  loading: boolean;
}

class CustomModal extends Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
      loading: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('visible' in nextProps) {
      this.setState({
        visible: nextProps.visible,
      });
    }
  }

  /**
   * 关闭弹窗
   */
  closeModal = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
      return;
    }
    this.setState({ visible: false });
  };

  /**
   * 提交事件
   */
  onSubmit = () => {
    const { record, onSubmit, form, okConfirm } = this.props;
    form.validateFieldsAndScroll(async (error, values) => {
      if (error) return;

      const onOk = async () => {
        this.setState({ loading: true });
        await onSubmit(values, record);
        this.setState({ loading: false });
      };

      if (okConfirm) {
        return Modal.confirm({
          content: '是否确认该操作?',
          onOk,
        });
      }
      onOk();
    });
  };

  // 渲染form内容
  renderContent = formOpts => {
    const { children, renderContent } = this.props;
    if (renderContent) return renderContent(formOpts);

    return React.Children.map(children, (child: React.ReactElement<any>) => {
      const element = React.cloneElement(child, {
        key: `modal-${child.props.title}`,
        ...formOpts,
      });

      if (child.props.wrapped) {
        return React.cloneElement(child.props.wrapped, { children: element });
      } else {
        return element;
      }
    });
  };

  render() {
    const {
      form,
      title,
      full,
      record,
      className,
      onCancel,
      onSubmit,
      modalOpts,
      ...restProps
    } = this.props;
    const { visible, loading } = this.state;

    const prefixCls = cx(className, styles['modal-form'], full && styles['full-modal']);
    const modalProps = {
      visible,
      width: 1000,
      className: prefixCls,
      destroyOnClose: true,
      onCancel: this.closeModal,
      title: restProps.renderTitle || (!_.isEmpty(record) ? `编辑${title}` : `新增${title}`),
      footer: [
        onCancel && (
          <Button key="cancel" htmlType="button" onClick={this.closeModal}>
            取消
          </Button>
        ),
        onSubmit && (
          <Button
            key="submit"
            type="primary"
            htmlType="button"
            onClick={this.onSubmit}
            loading={loading}
          >
            确定
          </Button>
        ),
      ],
      ...modalOpts,
      ...restProps,
    };

    const formOpts = { form, record };
    return <Modal {...modalProps}>{this.renderContent(formOpts)}</Modal>;
  }
}

// mapPropsToFields return的值可以设置到表单上面
export default Form.create()(CustomModal) as any;
