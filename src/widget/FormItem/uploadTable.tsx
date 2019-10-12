import React, { Component } from 'react';
import _ from 'lodash';
import { Card, Upload, Button, message } from 'antd';
import { CommonTable } from '@/components';
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

// status dict
const statusDict = {
  done: '成功',
  uploading: '上传中',
  error: '失败',
};

/**
 * Upload组件, 输入输出值已做处理
 */
class UploadControlled extends Component<any, any> {
  columns = [
    { title: '文件名', dataIndex: 'fileUrl' },
    { title: '上传状态', dataIndex: 'status', render: value => statusDict[value] },
    { title: '文件大小', dataIndex: 'fileSize' },
    { title: '上传时间', dataIndex: 'createTime' },
  ];

  state = {
    selectedRowKeys: [],
  };

  // 上传
  handleChange = ({ fileList }) => {
    const { onChange } = this.props;
    fileList = fileList.map(file => {
      if (file.response) {
        const data = _.get(file, 'response.data[0]', {});
        file = {
          id: file.uid,
          fileUrl: data.path,
          fileSize: data.size,
          newFile: true,
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

  /**
   * 处理删除
   */
  handleRemove = () => {
    const { selectedRowKeys } = this.state;
    const { onChange, value } = this.props;
    if (!selectedRowKeys.length) {
      return message.warning('请先选择');
    }

    const fileList = value.filter(item => selectedRowKeys.indexOf(item.id) === -1);
    this.setState({ selectedRowKeys: [] });
    onChange(fileList);
  };

  /**
   * 处理行选择
   * @param selectedRowKeys
   * @param selectedRows
   */
  onSelectChange = (selectedRowKeys, selectedRows) => {
    selectedRows = selectedRows.filter(item => selectedRowKeys.indexOf(item.uid) !== -1);
    this.setState({ selectedRowKeys, selectedRows });
  };

  // 下载
  download = () => {
    const { selectedRowKeys } = this.state;
    if (!selectedRowKeys.length) {
      return message.warning('请先选择');
    }
    window.open(`${apiPrefix}/common/download?${JSON.stringify(this.state.selectedRowKeys)}`);
  };

  render() {
    const { selectedRowKeys } = this.state;
    const { maxFileSize, fileTypes, showOnly, value = [], ...restProps } = this.props;

    const fileList = value.map(item => ({
      status: 'done',
      uid: item.id,
      ...item,
    }));
    const selectOptions = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <Card
        type="inner"
        title="相关附件"
        className="common-card"
        extra={
          <Upload
            showUploadList={false}
            fileList={fileList}
            onChange={this.handleChange}
            beforeUpload={this.handleBeforeUpload}
            {...restProps}
          >
            {!showOnly ? <a color="primary">选择文件上传</a> : null}
          </Upload>
        }
      >
        <div className="tips">
          <p>注意事项:</p>
          <ol style={{ listStyle: 'decimal', paddingLeft: 10 }}>
            <li>支持最大上传文件为 {maxFileSize}MB！</li>
            <li>
              目前支持的附件后缀格式为：{fileTypes.join('、')}，如需其他格式支持，请联系管理员！
            </li>
          </ol>
        </div>

        <div className="btn-group">
          {!showOnly ? (
            <Button type="primary" size="small" onClick={this.handleRemove}>
              删除
            </Button>
          ) : null}
          <Button type="primary" size="small" onClick={this.download}>
            批量下载
          </Button>
        </div>

        <CommonTable
          rowKey="uid"
          size="small"
          bordered={true}
          rowSelection={selectOptions}
          columns={this.columns}
          dataSource={fileList}
        />
      </Card>
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
export default ({ form, name, initialValue, rules, ...otherProps }: IUploadProps) => {
  const formFieldOptions: any = { initialValue };
  // 如果有rules
  if (rules && rules.length) {
    formFieldOptions.rules = rules;
  }

  const uploadProps: any = {
    multiple: true,
    maxFileSize: 10,
    listType: 'text',
    fileName: 'file', // 上传到后台的文件名
    fileTypes: defaultFileTypes,
    action: `${apiPrefix}/common/upload`,
    ...otherProps,
  };

  const Component = <UploadControlled {...uploadProps} />;
  if (form) return form.getFieldDecorator(name, formFieldOptions)(Component);
  return React.cloneElement(Component, { value: initialValue });
};
