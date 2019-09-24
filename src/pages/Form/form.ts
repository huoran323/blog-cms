import { getTextRequire, getRequire } from '@/utils/validate';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};

export const basicForm = [
  {
    name: 'title',
    label: '标题',
    type: 'input',
    layout,
    formItem: {
      placeholder: '给目标起个名字',
      rules: [getTextRequire()],
    },
  },
  {
    name: 'date',
    label: '截止日期',
    type: 'dateRange',
    layout,
    formItem: {
      placeholder: ['开始日期', '介绍日期'],
    },
  },
  {
    name: 'goal',
    label: '目标描述',
    type: 'textarea',
    layout,
    formItem: {
      placeholder: '请输入你的阶段性工作目标',
      rules: [getTextRequire()],
    },
  },
  {
    name: 'content',
    label: '内容',
    type: 'editor',
    layout,
    formItem: {
      placeholder: '请输入',
      extendControlKey: ['uploader'],
      rules: [
        {
          required: true,
          validator: (_, value, callback) => {
            if (value.isEmpty()) {
              callback('请输入内容');
            } else {
              callback();
            }
          },
        },
      ],
    },
  },
  {
    name: 'customer',
    label: '客户',
    type: 'mentions',
    layout,
    formItem: {
      dict: [
        { text: 'afc163', value: 'afc163' },
        { text: 'zombiej', value: 'zombiej' },
        { text: 'yesmeck', value: 'yesmeck' },
      ],
    },
  },
  {
    name: 'invites',
    label: '邀评人',
    type: 'mentions',
    layout,
    formItem: {
      dict: [
        { text: 'afc163', value: 'afc163' },
        { text: 'zombiej', value: 'zombiej' },
        { text: 'yesmeck', value: 'yesmeck' },
      ],
    },
  },
  { name: 'weight', label: '权重', type: 'number', layout },
  {
    name: 'public',
    label: '目标公开',
    type: 'radio',
    layout,
    formItem: {
      dict: [
        { text: '公开', value: '1' },
        { text: '部分公开', value: '2' },
        { text: '不公开', value: '3' },
      ],
    },
  },
  {
    name: 'shared',
    label: '',
    type: 'select',
    layout: {
      labelCol: { span: 0 },
      wrapperCol: { span: 12, offset: 6 },
    },
    visible: { public: '2' },
    formItem: {
      showSearch: true,
      showArrow: false,
      remoteUrl: '/api/dict/200001',
    },
  },
];
