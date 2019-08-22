/**
 * 顶层节点 level 默认为0
 *
 * id: 主键
 * name: 名称
 * parentId: 父id
 * level: 层级
 * seq: 在当前层级下的顺序
 * remark: 备注
 * @type {*[]}
 */
const treeList = [
  { id: '1', name: 'xxx有限责任公司', parentId: '0' },
  { id: '2', name: '产品研发部', parentId: '1' },
  { id: '3', name: '销售部', parentId: '1' },
  { id: '4', name: '财务部', parentId: '1' },
  { id: '5', name: 'HR人事部', parentId: '1' },
  { id: '6', name: '市场部', parentId: '1' },
  { id: '7', name: '研发-前端', parentId: '2' },
  { id: '8', name: '研发-后端', parentId: '2' },
  { id: '9', name: 'UI设计', parentId: '2' },
  { id: '10', name: '产品经理', parentId: '2' },
  { id: '11', name: '销售一部', parentId: '3' },
  { id: '12', name: '销售二部', parentId: '3' },
];

export default {
  [`GET /api/treeList`](req, res) {
    res.status(200).json({
      code: 200,
      data: treeList,
      message: '请求成功',
    });
  },
};
