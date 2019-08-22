import Dict from '@/config/dict';

// 状态类型
const STATUS_TYPE = [
  { text: '正在计算', value: '1' },
  { text: '成功', value: '2' },
  { text: '失败', value: '3' },
];

// 分类标签
const CATEGORY_TYPE = [
  { text: '分类1', value: '1' },
  { text: '分类2', value: '2' },
  { text: '分类3', value: '3' },
  { text: '分类4', value: '4' },
  { text: '分类5', value: '5' },
  { text: '分类6', value: '6' },
  { text: '分类7', value: '7' },
  { text: '分类8', value: '8' },
];

export const listColumns = [
  { title: '头像', dataIndex: 'avatar', width: 100 },
  { title: '姓名', dataIndex: 'name', width: 100 },
  {
    title: '性别',
    dataIndex: 'sex',
    width: 100,
    type: 'select',
    dict: 'SEX_TYPE',
    filters: Dict['SEX_TYPE'],
    filtered: true,
    onFilter: (value, record) => value.indexOf(record.sex) !== -1,
  },
  { title: '电话', dataIndex: 'phone', width: 100 },
  { title: '状态', dataIndex: 'status', width: 100, type: 'select', dict: STATUS_TYPE },
  {
    title: '分类',
    dataIndex: 'category',
    width: 100,
    type: 'select',
    dict: CATEGORY_TYPE,
    formItem: { mode: 'tags' },
  },
  { title: '描述', dataIndex: 'desc', width: 100, sorter: (a, b) => a.desc.length - b.desc.length },
  { title: '创建时间', dataIndex: 'createTime', width: 100, formatTime: true },
  { title: '更新时间', dataIndex: 'updateTime', width: 100, formatTime: true },
];
