import React from 'react';
import { Icon } from 'antd';
import { getTextRequire } from '@/utils/validate';

const fullLayout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};

export const loginForm = (captureImg, getCaptureImage, handleLogin) => [
  {
    name: 'username',
    label: '用户名',
    layout: fullLayout,
    formItem: {
      initialValue: 'ims_admin',
      rules: [getTextRequire()],
      prefix: <Icon type="user" />,
      onPressEnter: handleLogin,
    },
  },
  {
    name: 'password',
    label: '密码',
    type: 'password',
    layout: fullLayout,
    formItem: {
      initialValue: '753951',
      rules: [getTextRequire()],
      prefix: <Icon type="lock" />,
      onPressEnter: handleLogin,
    },
  },
  {
    name: 'verification',
    label: '验证码',
    layout: fullLayout,
    formItem: {
      rules: [getTextRequire()],
      prefix: <Icon type="message" />,
      addonAfter: (
        <img
          style={{ width: '100%', height: 26 }}
          src={captureImg}
          onClick={getCaptureImage}
          alt="capture"
        />
      ),
      onPressEnter: handleLogin,
    },
  },
];
