import React from 'react';
import { Modal } from 'antd';
import { ExtendControlType } from 'braft-editor';
import { confirm } from '@/widget/CommonModal';

const PreviewModal: React.FC<any> = props => {
  const { html, close, ...restProps } = props;
  return (
    <Modal {...restProps} onCancel={close} onOk={close}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Modal>
  );
};

const previewControls = (editor): ExtendControlType => ({
  key: 'custom-button',
  type: 'button',
  text: '预览',
  onClick: () => {
    // 判断是否为空，editor.current.getValue().isEmpty()
    const html = editor.current.getValue().toHTML();
    confirm({ html }, PreviewModal);
  },
});

export default previewControls;
