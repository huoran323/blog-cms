import React, { Component, Fragment } from 'react';
import _ from 'lodash';
import { Upload, message, Icon, Modal } from 'antd';
import projectConfig from '@/config/projectConfig';
import { IControlProps } from '@/widget/controls';

const { apiPrefix } = projectConfig;
interface IUploadProps extends IControlProps {
  onChange?;
  fileTypes?: string[]; // 允许文件类型
  maxFileSize?: number; // 最大文件大小
  action?: string; // 后台地址
  fileName?: string | string[]; // 上传到后台的文件名
  showOnly?: boolean; // 如果只做展示 不展示相关操作
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/**
 * Upload组件, 输入输出值已做处理
 */
class UploadControlled extends Component<any, any> {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  // 上传
  handleChange = ({ fileList }) => {
    const { onChange } = this.props;
    fileList = fileList.map(file => {
      if (file.response) {
        file = {
          ...file.response,
          status: 'done',
          name: file.name,
          id: file.uid,
        };
      }
      return file;
    });
    onChange(fileList);
  };

  /**
   * 上传前校验
   * @param file
   */
  handleBeforeUpload = (file): Promise<any> => {
    const { maxFileSize, fileTypes } = this.props;

    return new Promise((resolve, reject) => {
      if (file.size > maxFileSize * 1024 * 1024) {
        message.error(`请上传大小在 ${maxFileSize}MB 以内的文件`);
        reject(file);
      }

      if (fileTypes.every(type => file.name.toLowerCase().indexOf(type.toLowerCase()) === -1)) {
        message.error(`请上传符合要求的文件`);
        reject(file);
      }

      resolve(file);
    });
  };

  render() {
    const { previewVisible, previewImage } = this.state;
    const { maxFileSize, maxFile, fileTypes, showOnly, value = [], ...restProps } = this.props;
    const fileList = value.map(item => ({
      status: 'done',
      uid: item.id,
      ...item,
    }));

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    return (
      <Fragment>
        <Upload
          {...restProps}
          fileList={fileList}
          onChange={this.handleChange}
          beforeUpload={this.handleBeforeUpload}
        >
          {fileList.length >= maxFile ? null : uploadButton}
        </Upload>

        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Fragment>
    );
  }
}

const defaultFileTypes = [
  'rar',
  'bmp',
  'jpg',
  'jpeg',
  'gif',
  'png',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'vsd',
  'pdf',
  'txt',
  'mpp',
  'xml',
  'htm',
  'html',
  'xhtml',
  'wav',
  'mp3',
];
export default ({
  form,
  name,
  initialValue,
  record,
  normalize,
  rules,
  ...otherProps
}: IUploadProps) => {
  const formFieldOptions: any = { initialValue };
  // 如果有rules
  if (rules && rules.length) {
    formFieldOptions.rules = rules;
  }

  // 初始值处理
  let initVal = initialValue;
  if (record) {
    initVal = record[name];
  }

  // 格式化初始值
  if (initVal !== null && typeof initVal !== 'undefined') {
    if (_.isFunction(normalize)) {
      formFieldOptions.initialValue = normalize(initVal);
    } else {
      formFieldOptions.initialValue = initVal;
    }
  }

  const uploadProps: any = {
    maxFile: 5,
    multiple: true,
    maxFileSize: 10,
    fileName: 'file', // 上传到后台的文件名
    listType: 'picture-card',
    fileTypes: defaultFileTypes,
    action: `${apiPrefix}/common/upload`,
    ...otherProps,
  };

  const Component = <UploadControlled {...uploadProps} />;
  if (form) return form.getFieldDecorator(name, formFieldOptions)(Component);
  return React.cloneElement(Component, { value: initialValue });
};
