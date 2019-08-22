import logo from '../assets/logo.png';

// 图表颜色配置
const chartColor = [
  '#7db3ff',
  '#49457c',
  '#ff9763',
  '#fed2d0',
  '#6f7fd9',
  '#a1dab5',
  '#2e7987',
  '#ffda8c',
  '#ff7c78',
  '#b76262',
];

export default {
  logo,
  chartColor,
  apiPrefix: '/api',
  menu: {
    disableLocal: false,
  },

  title: 'react-umi-antd',
  company: '友点科技',

  // Your custom iconfont Symbol script Url
  // eg：//at.alicdn.com/t/font_1039637_btcrd5co4w.js
  // 注意：如果需要图标多色，Iconfont 图标项目里要进行批量去色处理
  // Usage: https://github.com/ant-design/ant-design-pro/pull/3517
  iconFontUrl: '',
};
