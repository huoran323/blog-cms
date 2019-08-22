import React from 'react';
import { Form, Button, Row, Col } from 'antd';
import { Page, CustomForm } from '@/components';
import { basicForm } from '../form';

const BasicForm: React.FC<any> = props => {
  const { form } = props;

  // 保存提交
  const handleSave = () => {
    form.validateFields((err, values) => {
      if (err) return;
      console.log(values);
    });
  };

  return (
    <Page>
      <CustomForm form={form} formList={basicForm} />

      <Row>
        <Col span={12} offset={6}>
          <p>客户、邀评人默认被分享</p>
          <Button type="primary" onClick={handleSave}>
            保存
          </Button>
        </Col>
      </Row>
    </Page>
  );
};

export default Form.create()(BasicForm);
