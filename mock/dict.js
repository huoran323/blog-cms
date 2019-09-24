import Mock from 'mockjs';

/**
 * 获取目标公开字典
 * @param req
 * @param res
 */
const data = [
  { text: '公开', value: '1' },
  { text: '部分公开', value: '2' },
  { text: '不公开', value: '3' },
];
function getSharedDict(req, res) {
  const { keyword } = req.query;
  res.status(200).json({
    code: 200,
    msg: '请求成功',
    data: keyword ? data.filter(item => item.text.indexOf(keyword) !== -1) : data,
  });
}

module.exports = {
  [`GET /api/dict/200001`]: getSharedDict,
};
