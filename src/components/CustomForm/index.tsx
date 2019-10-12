import React from 'react';
import { Form, Row, Col, Button } from 'antd';
import _ from 'lodash';
import cx from 'classnames';
import { getFieldComp } from '@/utils/util';
import Dict from '@/config/dict';
import styles from './index.less';

const FormItem = Form.Item;
const PlainComp = ({ className, children }: { className: string; children: React.ReactNode }) => (
  <div className={className}>{children}</div>
);

interface IProps {
  formList: any[]; // 控件列表
  type?: 'grid' | 'inline'; // 布局类型
  rows?: object; // Row配置
  cols?: object; // Col配置
  appendTo?: any; // 表单弹出框处理方案
  className?: string;
  formItemLayout?: any;
  wrapped?: React.ReactElement; // 包裹组件类型

  loading?: boolean; // 加载状态
  children?: React.ReactNode; // 额外表单项
  handleSubmit?: (values, record) => void; // 提交方法
  footer?: React.ReactNode | boolean; // 页脚属性

  /**
   * 使用record数据对表单进行赋值，时间类型初始值需要转换成moment类型
   */
  record?: object;
  [otherProps: string]: any;
}

const CustomForm: React.FC<IProps> = props => {
  const {
    form,
    record,
    formList,
    className,
    type,
    rows,
    cols,
    width,
    appendTo,
    loading,
    footer,
    children,
    formItemLayout,
    ...otherProps
  } = props;

  /**
   * 重置表单
   */
  const onReset = () => {
    this.props.form.resetFields();
  };

  /**
   * 表单提交
   * @param e
   */
  const onSubmit = e => {
    e.preventDefault();
    const { form, record, handleSubmit } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        handleSubmit(values, record);
      }
    });
  };

  const cls = cx(styles['custom-form'], className, {
    [styles['form-inline']]: type === 'inline',
    [styles['form-grid']]: type === 'grid',
  });

  const ComponentRow = type === 'inline' ? PlainComp : Row;
  const ComponentCol = type === 'inline' ? PlainComp : Col;

  let getPopupContainer = null;
  if (appendTo) {
    if (_.isFunction(appendTo)) {
      getPopupContainer = appendTo;
    } else if (appendTo === true) {
      getPopupContainer = triggerNode => triggerNode.parentNode;
    } else {
      getPopupContainer = () => appendTo;
    }
  }

  const formFields = formList.filter(item => item.name);
  return (
    <Form
      className={cls}
      {...otherProps}
      onSubmit={onSubmit}
      {...(type === 'inline' && { layout: 'inline' })}
    >
      <ComponentRow className={styles['row-item']} {...rows}>
        {formFields.map((field, i) => {
          // 判断动态表单项的显示与隐藏
          let visible = field.visible || true;
          if (field.visible) {
            const fieldsValue = form.getFieldsValue(Object.keys(field.visible));
            Object.keys(field.visible).forEach(item => {
              if (!_.isEqual(field.visible[item], fieldsValue[item])) {
                visible = false;
              }
            });
          }

          if (!visible) return null;

          // 传入个性化的列大小，改变这个值可以改变每行元素的个数
          let col = { ...cols };
          if (type === 'grid' && field.col) {
            col = field.col;
          } else if (type !== 'grid') {
            col = {};
          }

          let layout = { ...formItemLayout };
          if (type === 'grid' && field.layout) {
            layout = {
              ...formItemLayout,
              ...field.layout,
            };
          } else if (type !== 'grid') {
            layout = {};
          }

          // 构造formProps
          const fieldType = field.type || 'input';
          const formProps = {
            form,
            record,
            name: field.name,
            label: field.label,
            type: fieldType,
            ...field.formItem,
          };

          if (type === 'inline') {
            formProps.style = {
              width: formProps.width || width[fieldType],
            };
          }
          if (getPopupContainer) {
            formProps.getPopupContainer = getPopupContainer;
          }
          if (formProps.dict) {
            formProps.dict =
              typeof formProps.dict === 'string' ? Dict[formProps.dict] : formProps.dict;
          }

          return (
            <ComponentCol key={`col-${i}`} className={styles['col-item']} {...col}>
              <FormItem {...layout} colon={field.colon} label={field.label}>
                {getFieldComp(formProps)}
              </FormItem>
            </ComponentCol>
          );
        })}

        {children}

        {footer && (
          <ComponentCol className={cx(styles['form-btn'], styles['col-item'])} {...cols}>
            <Button title="提交" type="primary" htmlType="submit" loading={loading}>
              提交
            </Button>
            <Button title="重置" htmlType="button" onClick={onReset}>
              重置
            </Button>
          </ComponentCol>
        )}
      </ComponentRow>
    </Form>
  );
};

CustomForm.defaultProps = {
  type: 'grid',
  loading: false,
  formItemLayout: {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  },

  rows: {
    // 当type为grid时，指定每两个元素的间隔
    gutter: 8,
  },

  cols: {
    // 当type为grid时，指定每行元素个数
    xs: 24,
    md: 24,
    xl: 24,
  },

  // 内联元素默认宽
  width: {
    date: 140,
    month: 140,
    dataRange: 280,
    datetime: 140,
    select: 140,
    treeSelect: 140,
    cascade: 140,
    default: 140,
  },
};

export default CustomForm;
