import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Button } from 'antd';
import { ConnectProps } from '@/models/connect';
import { CustomForm } from '@/components';
import projectConfig from '@/config/projectConfig';
import { fetchCode } from '@/services/global';

import { loginForm } from './form';
import styles from './styles.less';

interface IProps extends ConnectProps {
  loading: boolean;
  form: any;
}

// @ts-ignore
@connect(({ loading }) => ({
  loading: loading.effects['login/login'],
}))
class Login extends PureComponent<IProps> {
  state = {
    captureImg: '',
  };

  componentDidMount() {
    this.getCaptureImage();
  }

  // 获取图片验证码
  getCaptureImage = async () => {
    const { data } = await fetchCode();
    if (data) {
      this.setState({ captureImg: `data:image/jpg;base64,${data}` });
    }
  };

  // 进行登录
  handleLogin = () => {
    const {
      dispatch,
      form: { validateFieldsAndScroll },
    } = this.props;

    validateFieldsAndScroll(async (errors, values) => {
      if (errors) return;

      try {
        await dispatch({ type: 'login/login', payload: values });
      } catch (e) {
        this.getCaptureImage();
      }
    });
  };

  render() {
    const { captureImg } = this.state;
    const { loading, form } = this.props;

    return (
      <div className={styles.form}>
        <img
          alt="logo"
          className={styles.logo}
          src={projectConfig.logo}
          style={{ background: '#fff', borderRadius: '24%' }}
        />
        <h3 className={styles.title}>{projectConfig.title}</h3>

        <CustomForm
          form={form}
          formList={loginForm(captureImg, this.getCaptureImage, this.handleLogin)}
        />
        <Button
          type="primary"
          htmlType="button"
          block={true}
          onClick={this.handleLogin}
          loading={loading}
        >
          登录
        </Button>
      </div>
    );
  }
}

export default Form.create()(Login);
