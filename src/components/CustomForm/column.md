```javascript
type optionType = Array<{ value: string, title: string, children?: Array<{value: string, title: string}> }>;

const column = [{
  label: string | React.ReactNode,    // 列名
  name: string,                       // 唯一标识
  dict?: Array<{ text: string, value: string }>    // 下拉或级联中用到的数据(checkbox、radio使用)
  record?: any[],                     // 作为modal使用时，提供表单控件初始化
  visible: boolean,                   // 是否显示    
  formItem: {
    type: 'number',       // 表单元素类型， 默认为input
    width: 100,           // 表单元素宽度
    rules?: [],           // 表单验证规则
    initialValue?: any,   // 初始值
    normalize?: (...args) => any,     // 初始值normalize函数
    
    // 布局相关
    row?: any,
    col?: any,
    layout?: any,
    
    // cascader
    options?: optionType,
    
    // treeSelect
    treeData?: optionType,
    
    // upload
    maxFileSize?,         // 最大文件大小
    fileTypes?,           // 允许文件类型
    action?,              // 后台地址
    fileName?,            // 上传到后台的文件名
    
    // table
    titleKey: string,                 // 指定回显的字段
    columns: any[],                   // 表格列配置
    loadData?: (...args) => any,      // 请求数据事件

    onChange?: (...args) => any,      // 控件onChange事件
    render: (render, form) => (),     // type为custom时，自定义渲染规则
    ...others,                        // 其他附加属性，会被注入到对应的元素中
  },
  tableItem: {
    width: 100,       // 表格元素宽度
    type: 'oper | default',         // 列类型
    render: (text, record) => (),   // 自定义渲染规则
    ...others,                      // 其他附加属性，会被注入到对应的元素中
  }
}]
```
