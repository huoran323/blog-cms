import Mock from 'mockjs';

const { Random } = Mock;
const captureImg = [
  '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',
];

/**
 * 获取验证码
 * @param req
 * @param res
 */
function code(req, res) {
  res.status(200).json({
    code: 200,
    msg: '请求成功',
    data: Random.pick(captureImg),
  });
}

/**
 * 进行登录
 * @param req
 * @param res
 */
function login(req, res) {
  const { username = 'yutiy' } = req.body;

  res.status(200).json({
    code: 200,
    msg: '请求成功',
    data: {
      sysId: 1001,
      permit: 'nGdeacZmW3E1XM9Wi5alwcMUCKeVDZ',
      token: `${username}_token`,
      userInfo: {
        userId: '291153',
        name: username,
        realName: '凌小路',
        phone: '18682332253',
        email: '494657028@qq.com',
        avatar: 'https://source.unsplash.com/300x300',
        roles: ['superAdmin'],
        permissions: [],
      },
    },
  });
}

/**
 * 消息通知
 * @param req
 * @param res
 */
const count = Random.integer(1, 20);

let noticeList = [];
for (let i = 0; i < count; i++) {
  noticeList.push({
    id: `notice_list_${i}`,
    avatar: 'https://source.unsplash.com/300x300',
    title: Random.cname(),
    extra: Random.cword(3),
    read: Random.boolean(),
    status: Random.pick(['processing', 'doing', 'urgent']),
    type: Random.pick(['notification', 'message', 'event']),
    datetime: Random.datetime('yyyy-mm-dd HH:mm:ss'),
  });
}

function notices(req, res) {
  res.status(200).json({
    code: 200,
    msg: '请求成功',
    data: noticeList,
  });
}

module.exports = {
  [`GET /api/code`]: code,
  [`POST /api/login`]: login,
  [`GET /api/notices`]: notices,
};
