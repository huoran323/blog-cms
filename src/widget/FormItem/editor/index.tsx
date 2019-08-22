import React, { Component } from 'react';
import _ from 'lodash';
import { Upload, Dropdown, Icon, Menu, Modal, message } from 'antd';
import BraftEditor from 'braft-editor';
import Table from 'braft-extensions/dist/table';
import { ContentUtils } from 'braft-utils';
import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/table.css';
import projectConfig from '../../../config/projectConfig';

const theme = require('@/config/themeConfig');
const { apiPrefix } = projectConfig;
const normFile = (e) => {
  if (Array.isArray(e)) return e;
  return e && e.fileList;
};

/**
 * 编辑器控件
 * 文档地址: https://www.yuque.com/braft-editor/be/lzwpnr
 * 编辑器首页: https://braft.margox.cn/
 */
interface IProps {
  form: any,
  valueType: 'raw' | 'html',  // 输出内容格式 raw为json html为dom string
  onChange?: any,             // onChange回调 参数为当前编辑器value
  [otherProps: string]: any,  // 其他参数参照文档
}

BraftEditor.use(Table());
class Editor extends Component<IProps, any> {
  static defaultProps = {
    valueType: 'html',
    onChange: () => ({}),
  };

  constructor(props) {
    super(props);

    this.state = {
      showSignature: false,
      signatureList: [],      // 签名列表
      selectedSignature: [],  // 选择的签名
    };
  }

  async componentDidMount() {
    const { value, name, form } = this.props;
    // set editor initial value async
    setTimeout(() => {
      form.setFieldsValue({ [name]: BraftEditor.createEditorState(value) });
    }, 0);
  }

  // 签名选择后事件
  onSignatureSelectChange = (keys, selectedSignature) => this.setState({ selectedSignature });

  // 下拉选择后事件
  onMenuSignatureSelect = async ({ key }) => {
    const { signatureList } = this.state;
    if (key === 'action') return this.setState({ showSignature: true });

    const selectedSignature = signatureList.filter((item, index) => index === Number(key));
    await this.setState({ selectedSignature });
    this.onSignatureSelectConfirm();
  };

  // 签名选择点击确定后事件
  onSignatureSelectConfirm = async () => {
    const { onChange, form, name } = this.props;
    const { selectedSignature } = this.state;
    if (!selectedSignature.length) {
      return this.setState({ showSignature: false });
    }

    const editorState = form.getFieldsValue([name]);
    const content = ContentUtils.insertHTML(editorState[name], selectedSignature[0].signContent);

    onChange(content);
    this.setState({ showSignature: false });
    form.setFieldsValue({ [name]: content });
  };

  // 编辑器内容改变事件
  onChange = async (state) => {
    const { onChange, valueType } = this.props;
    const content = valueType === 'raw' ? state.toRAW() : state.toHTML();

    onChange(content);
  };

  // 处理文本黏贴
  pastedTextHandler = (text, HTML, editorState, editor) => {
    // 在此处来自行处理HTML内容之类的
    const stripedHTMLStringFunc = (HTML) => {
      if (HTML) {
        HTML = HTML.replace(/font-size:(.+?)(pt)/g, ($0, $1, $2) => {
          $1 = parseInt($1, 10);
          $2 = $2.replace('pt', 'px');
          return `font-size: ${$1}${$2}`;
        });

        HTML = HTML.replace(/ptpx/g, 'px');
        return HTML;
      }

      return undefined;
    };

    // 调用insertHTML来将内容插入到编辑器
    editor.setValue(ContentUtils.insertHTML(editorState, stripedHTMLStringFunc(HTML), 'paste'));
    return 'handled' // 一定要return handled来告诉编辑器你自己已经处理了粘贴内容，不需要编辑器来处理
  };

  /**
   * 上传前校验
   * @param file
   */
  handleBeforeUpload = (file, flieList) => {
    const { uploadProps = {} } = this.props;
    const { maxFileSize = 10 } = uploadProps;

    return new Promise((resolve, reject) => {
      if (file.size > maxFileSize * 1024 * 1024) {
        message.error(`请上传大小在 ${maxFileSize}MB 以内的文件`);
        reject(file);
      }

      resolve(file);
    });
  };

  // 渲染额外的控件
  renderExtendControls = () => {
    const { signatureList } = this.state;
    const { form } = this.props;

    const menu = (
      <Menu onClick={this.onMenuSignatureSelect}>
        {
          signatureList.map((item, index) => (
            <Menu.Item key={index}>
              <a>{item.signName}</a>
            </Menu.Item>
          ))
        }
        <Menu.Divider />
        <Menu.Item key="action">签名管理</Menu.Item>
      </Menu>
    );

    return [
      {
        key: 'custom-dropdown',
        type: 'component',
        component: (
          <div className="control-item">
            <Dropdown overlay={menu}>
              <a>插入签名<Icon type="down" /></a>
            </Dropdown>
          </div>
        )
      },
      {
        key: 'antd-upload',
        type: 'component',
        component: (
          <div className="control-item">
            {
              form.getFieldDecorator('accessory', {
                valuePropName: 'fileList',
                getValueFromEvent: normFile,
              })(
                <Upload
                  name="file"
                  action={`${apiPrefix}/common/upload`}
                  showUploadList={false}
                  // beforeUpload={this.handleBeforeUpload}
                >
                  <a>
                    <Icon type="link" style={{ color: theme['@primary-color'] }} />
                    <span color="primary" style={{ marginLeft: 4 }}>添加附件</span>
                  </a>
                </Upload>,
              )
            }
          </div>
        ),
      },
    ]
  };

  // 附件列表
  renderFileList = () => {
    const list = this.props.form.getFieldValue('accessory') || [];
    return (
      list.map((item, index) => (
        <div className="ant-upload-list-item ant-upload-list-item-done" key={item.uid}>
          <div className="ant-upload-list-item-info">
            <i aria-label="图标: paper-clip" className="anticon anticon-paper-clip">
              <svg viewBox="64 64 896 896" className="" data-icon="paper-clip" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false">
                <path d="M779.3 196.6c-94.2-94.2-247.6-94.2-341.7 0l-261 260.8c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0 0 12.7 0l261-260.8c32.4-32.4 75.5-50.2 121.3-50.2s88.9 17.8 121.2 50.2c32.4 32.4 50.2 75.5 50.2 121.2 0 45.8-17.8 88.8-50.2 121.2l-266 265.9-43.1 43.1c-40.3 40.3-105.8 40.3-146.1 0-19.5-19.5-30.2-45.4-30.2-73s10.7-53.5 30.2-73l263.9-263.8c6.7-6.6 15.5-10.3 24.9-10.3h.1c9.4 0 18.1 3.7 24.7 10.3 6.7 6.7 10.3 15.5 10.3 24.9 0 9.3-3.7 18.1-10.3 24.7L372.4 653c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0 0 12.7 0l215.6-215.6c19.9-19.9 30.8-46.3 30.8-74.4s-11-54.6-30.8-74.4c-41.1-41.1-107.9-41-149 0L463 364 224.8 602.1A172.22 172.22 0 0 0 174 724.8c0 46.3 18.1 89.8 50.8 122.5 33.9 33.8 78.3 50.7 122.7 50.7 44.4 0 88.8-16.9 122.6-50.7l309.2-309C824.8 492.7 850 432 850 367.5c.1-64.6-25.1-125.3-70.7-170.9z" />
              </svg>
            </i>
            <a target="_blank" rel="noopener noreferrer" className="ant-upload-list-item-name" title={item.name}>{item.name}</a>
          </div>
          <i aria-label="图标: close" title="删除文件" className="anticon anticon-close" onClick={() => this.deleteFileItem(index)}>
            <svg viewBox="64 64 896 896" className="" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false">
              <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" />
            </svg>
          </i>
        </div>
      ))
    )
  };

  // 附件列表删除
  deleteFileItem = (index) => {
    const { form } = this.props;
    const list = form.getFieldValue('accessory').filter((item, i) => i !== index);
    form.setFieldsValue({ accessory: list });
  };

  render () {
    const { showSignature } = this.state;
    const { excludeExtendKey = [] } = this.props;
    const extendControls: any = this.renderExtendControls().filter(item => excludeExtendKey.indexOf(item.key) === -1);

    return (
      <div className="formEditor">
        {this.renderFileList()}
        <BraftEditor
          onChange={this.onChange}
          contentStyle={{ height: 300 }}
          controlBarStyle={{ backgroundColor: '#f1f1f1' }}
          controls={['font-size', 'text-color', 'bold', 'italic', 'underline', 'strike-through', 'text-align', 'emoji', 'text-indent', 'link', 'hr', 'separator', 'media']}
          extendControls={extendControls}
          media={{
            externals: {
              image: true,
              video: false,
              audio: false,
              embed: false,
            }
          }}
          {...{ handlePastedText: this.pastedTextHandler, ...this.props }}
        />

        {
          showSignature ? <Modal
            width="50%"
            visible={showSignature}
            onOk={this.onSignatureSelectConfirm}
            onCancel={() => this.setState({ showSignature: false })}
          >
            <div>111</div>
          </Modal> : null
        }
      </div>
    )
  }
}

export default ({
  form,
  name,
  rules,
  valueType,
  record,
  initialValue,
  normalize,
  ...otherProps
}) => {
  const { getFieldDecorator } = form;
  const formFieldOptions: any = {};

  let initVal = initialValue;
  if (record) {
    initVal = record[name.toUpperCase()] || record[name];
  }

  // 如果存在初始值
  if (initVal !== null && typeof initVal !== 'undefined') {
    if (_.isFunction(normalize)) {
      formFieldOptions.initialValue = normalize(initVal);
    } else {
      formFieldOptions.initialValue = initVal;
    }
  }
  formFieldOptions.initialValue = BraftEditor.createEditorState(formFieldOptions.initialValue);

  // 如果有rules
  if (rules && rules.length) {
    formFieldOptions.rules = rules;
  }

  const props = {
    form,
    name,
    valueType,
    ...otherProps
  };

  return getFieldDecorator(name, formFieldOptions)(<Editor {...props} />);
};
