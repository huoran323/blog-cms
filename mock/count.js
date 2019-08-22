// 访问统计
function accessLog(req, res) {
  res.status(200).json({
    code: 200,
    msg: '请求成功',
    data: null,
  });
}

// 接口调用
function interfaceAdd(req, res) {
  res.status(200).json({
    code: 200,
    msg: '请求成功',
    data: null,
  });
}

module.exports = {
  [`POST /api/login`]: accessLog,
  [`POST /api/interfaceAdd`]: interfaceAdd,
};
