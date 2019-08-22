import moment from 'moment';
import Mock from 'mockjs';
const { Random } = Mock;

// 统计数据
const countData = {
  visit: {
    num: '16.8k',
    desc: '总访问人数',
    icon: 'home',
    member: [1, 2, 3, 4, 5, 6].map(item => ({
      name: Random.cname(),
      img: 'http://lorempixel.com/300/300/',
    })),
  },
  click: {
    num: '2.1k',
    icon: 'smile',
    desc: '点击量（近30天）',
    change: 110.5,
  },
  reach: {
    num: '726.0',
    icon: 'heart',
    desc: '到达量（近30天）',
    change: -15.5,
  },
  rate: {
    num: '28.8%',
    icon: 'check-circle',
    desc: '转化率（近30天）',
    change: 65.8,
  },
};

// 访问量、访客数数据
// ------------------------------------------------
const visitData = [];
const beginDay = new Date().getTime();

for (let i = 0; i < 15; i += 1) {
  visitData.push({
    time: moment(new Date(beginDay - 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    pv: Random.integer(150, 400),
    uv: Random.integer(10, 120),
  });
}

// 销售额类别占比数据
// ------------------------------
const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const saleTypeData = [
  {
    name: '家用电器',
    online: 244,
    offline: 99,
  },
  {
    name: '食用酒水',
    online: 321,
    offline: 188,
  },
  {
    name: '个护健康',
    online: 311,
    offline: 344,
  },
  {
    name: '服饰箱包',
    online: 311,
    offline: 344,
  },
  {
    name: '母婴产品',
    online: 41,
    offline: 121,
  },
  {
    name: '服饰箱包',
    online: 66,
    offline: 255,
  },
  {
    name: '其他',
    online: 111,
    offline: 65,
  },
];

// 天气数据
// ------------------------------------------
const rainfallList = [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3];
const evaporationList = [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3];
const temperatureList = [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2];
const weatherData = month.map((item, index) => ({
  month: item,
  rainfall: rainfallList[index],
  evaporation: evaporationList[index],
  temperature: temperatureList[index],
}));

export default {
  'GET /api/chart/count': (req, res) => {
    res.status(200).send({
      code: 200,
      msg: '操作成功',
      data: countData,
    });
  },

  'GET /api/chart/visit': (req, res) => {
    res.status(200).send({
      code: 200,
      msg: '操作成功',
      data: visitData,
    });
  },

  'GET /api/chart/sale_type': (req, res) => {
    res.status(200).send({
      code: 200,
      msg: '操作成功',
      data: saleTypeData,
    });
  },

  'GET /api/chart/weather': (req, res) => {
    res.status(200).send({
      code: 200,
      msg: '操作成功',
      data: weatherData,
    });
  },
};
