import Mock from 'mockjs';
const { Random } = Mock;

/**
 * 从一个数组中随机取出 count 个元素
 * @param arr
 * @param count
 * @returns {*}
 */
function getRandomArrayElements(arr, count) {
  const shuffled = arr.slice(0);
  let i = arr.length;
  const min = i - count;

  let temp;
  let index;

  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }

  return shuffled.slice(min);
}

// 列表总数
const totalCount = Random.integer(1, 100);
function generateFakeList(count) {
  const list = [];

  for (let i = 0; i < count; i += 1) {
    let data = Mock.mock({
      id: `fake_list_${i}`,
      name: Random.cname(),
      sex: Random.pick([0, 1]),
      phone: /^1[3875]\d{9}$/,
      avatar: 'http://lorempixel.com/300/300/',
      status: Random.pick([1, 2, 3]),
      category: getRandomArrayElements(
        ['1', '2', '3', '4', '5', '6', '7', '8'],
        Random.integer(1, 5)
      ).sort(),
      'desc|1': [
        '那是一种内在的东西， 他们到达不了，也无法触及的',
        '希望是一个好东西，也许是最好的，好东西是不会消亡的',
        '生命就像一盒巧克力，结果往往出人意料',
        '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
        '那时候我只会想自己想要什么，从不想自己拥有什么',
      ],
      createTime: Random.datetime('yyyy-mm-dd HH:mm:ss'),
      updateTime: Random.datetime('yyyy-mm-dd HH:mm:ss'),
    });

    list.push(data);
  }

  return list;
}
let sourceData = generateFakeList(totalCount);

/**
 * 生成分页列表数据
 * @param req
 * @param res
 */
function getFakeList(req, res) {
  const { pageSize = 10, pageNum = 1 } = req.query;
  const length = sourceData.length;

  const startPos = (pageNum - 1) * pageSize;
  let endPos = pageNum * pageSize;
  if (endPos > length) {
    endPos = length;
  }

  res.status(200).json({
    code: 200,
    msg: '请求成功',
    data: {
      total: length,
      rows: sourceData.slice(startPos, endPos),
    },
  });
}

function postFakeList(req, res) {
  const { body, params, method } = req;
  const { id } = params;

  switch (method) {
    case 'DELETE':
      sourceData = sourceData.filter(item => item.id !== id);
      res.status(204).json({
        code: 204,
        msg: '操作成功',
        data: null,
      });
      break;
    case 'PUT':
      let currData = [];
      sourceData.forEach(item => {
        if (item.id === id) {
          currData = Object.assign(item, body);
        }
      });
      res.status(200).json({
        code: 200,
        msg: '操作成功',
        data: currData,
      });
      break;
    case 'POST':
      sourceData.push({
        body,
        id: `fake-list-${sourceData.length}`,
        createTime: Random.datetime('yyyy-mm-dd HH:mm:ss'),
      });
      res.status(201).json({
        code: 201,
        msg: '操作成功',
        data: null,
      });
      break;
    default:
  }
}

module.exports = {
  [`GET /api/list`]: getFakeList,
  [`POST /api/list`]: postFakeList,
  [`DELETE /api/list/:id`]: postFakeList,
  [`PUT /api/list/:id`]: postFakeList,
};
