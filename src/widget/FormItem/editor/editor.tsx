import React, { useRef } from 'react';
import BraftEditor from 'braft-editor';
import Table from 'braft-extensions/dist/table';
import MaxLength from 'braft-extensions/dist/max-length';
import { ContentUtils } from 'braft-utils';
import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/table.css';
import 'braft-extensions/dist/code-highlighter.css';

import previewControls from './controls/preview';

// 表格扩展
BraftEditor.use(Table());

// 输入字数限制扩展
BraftEditor.use(
  MaxLength({
    defaultValue: 10000,
  })
);

interface IBraftEditorProps {
  form?: any;
  valueType?: 'raw' | 'html';
  onChange?: (content) => void;
  value?: any;
}

const MyBraftEditor: React.FC<IBraftEditorProps> = props => {
  const editorRef = useRef();
  const { form, valueType, onChange, ...restProps } = props;

  // 处理文本黏贴
  const handlePastedText = (text, HTML, editorState, editor) => {
    // 在此处来自行处理HTML内容之类的
    const stripedHTMLStringFunc = HTML => {
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
    return 'handled'; // 一定要return handled来告诉编辑器你自己已经处理了粘贴内容，不需要编辑器来处理
  };

  // 编辑器内容改变事件
  const handleChange = async state => {
    const content = valueType === 'raw' ? state.toRAW() : state.toHTML();
    if (onChange) {
      onChange(content);
    }
  };

  return (
    <BraftEditor
      ref={editorRef}
      onChange={handleChange}
      contentStyle={{ height: 300 }}
      controlBarStyle={{ backgroundColor: '#f1f1f1' }}
      handlePastedText={handlePastedText}
      controls={[
        'font-size',
        'text-color',
        'bold',
        'italic',
        'underline',
        'strike-through',
        'text-align',
        'emoji',
        'text-indent',
        'link',
        'hr',
        'separator',
        'media',
      ]}
      media={{
        externals: {
          image: true,
          video: false,
          audio: false,
          embed: false,
        },
      }}
      extendControls={[previewControls(editorRef)]}
      {...restProps}
    />
  );
};

MyBraftEditor.defaultProps = {
  valueType: 'html',
};

export default MyBraftEditor;
