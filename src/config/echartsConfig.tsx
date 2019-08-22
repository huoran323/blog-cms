import { formatNum } from '@/utils/util';
const constantsColor = '#fff';

const axisCommon = (type?) => ({
  axisLine: {
    show: true,
    lineStyle: {
      color: '#61738C',
    },
  },
  axisTick: {
    show: false,
    lineStyle: {
      color: '#61738C',
    },
  },
  axisLabel: {
    show: true,
    textStyle: {
      color: '#61738C',
      opacity: 0.3,
    },
    formatter(value) {
      return type === 'value' ? formatNum(value) : value
    },
  },
  splitLine: {
    show: false,
    lineStyle: {
      color: [
        '#61738C',
      ],
      opacity: 0.3,
    },
  },
  splitArea: {
    show: false,
    areaStyle: {
      color: [
        'rgba(250, 250, 250, 0.05)',
        'rgba(200, 200, 200, 0.02)',
      ],
    },
  },
});

const theme = {
  // 调色盘颜色列表，如果系列没有设置颜色，则会依次循环从该列表中取颜色作为系列颜色
  color: [
    '#2ec7c9',
    '#b6a2de',
    '#5ab1ef',
    '#ffb980',
    '#d87a80',
    '#8d98b3',
    '#e5cf0d',
    '#97b552',
    '#95706d',
    '#dc69aa',
    '#07a2a4',
    '#9a7fd1',
    '#588dd5',
    '#f5994e',
    '#c05050',
    '#59678c',
    '#c9ab00',
    '#7eb00a',
    '#6f5553',
    '#c14089',
  ],

  // 背景色 -> 透明
  backgroundColor: 'transparent',

  // 全局的字体样式
  textStyle: {
    color: constantsColor,
    fontSize: 12,
  },

  // 标题 -> 主标题与副标题
  title: {
    itemGap: 8,
    textStyle: {
      color: constantsColor,
    },
    subtextStyle: {
      color: constantsColor,
    },
  },

  // 图例组件 -> 文字颜色
  legend: {
    icon: 'circle',
    itemGap: 20,
    itemWidth: 10,
    textStyle: {
      fontSize: 12,
      color: constantsColor,
    },
  },

  // 网格
  grid: {
    left: '3%',
    right: '3%',
    bottom: '14%',
    containLabel: true,
  },

  // 线图
  line: {
    min: 'dataMin',
    max: 'dataMax',
    boundaryGap: ['5%', '5%'],
    itemStyle: {
      borderWidth: 1,
    },
    lineStyle: {
      width: 2,
      type: 'solid',
    },
    showSymbol: false,
    symbol: 'circle',
    smooth: true,
  },

  // 柱状图
  bar: {
    itemStyle: {
      normal: {
        borderWidth: 0,
        borderColor: constantsColor,
      },
      emphasis: {
        borderWidth: 0,
        borderColor: constantsColor,
      },
    },
  },

  // 饼图
  pie: {
    itemStyle: {
      normal: {
        borderWidth: 0,
        borderColor: constantsColor,
      },
      emphasis: {
        borderWidth: 0,
        borderColor: constantsColor,
      },
    },
  },

  // 类目轴
  categoryAxis: axisCommon(),

  // 数值型坐标轴
  valueAxis: axisCommon('value'),

  // 对数型坐标轴
  logAxis: axisCommon(),

  // 时间型坐标轴
  timeAxis: axisCommon(),

  // 工具栏
  toolbox: {
    iconStyle: {
      normal: {
        borderColor: constantsColor,
      },
      emphasis: {
        borderColor: '#999',
      },
    },
  },

  // 提示框组件
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, .2)',
    textStyle: {
      fontSize: '12px',
      color: '#fff',
    },
    axisPointer: {
      lineStyle: {
        color: '#ccc',
        width: 1,
      },
      crossStyle: {
        color: '#ccc',
        width: 1,
      },
    },
  },

  // 时间轴
  timeline: {
    lineStyle: {
      color: '#87f7cf',
      width: 1,
    },
    itemStyle: {
      normal: {
        color: '#87f7cf',
        borderWidth: 1,
      },
      emphasis: {
        color: '#f7f494',
      },
    },
    controlStyle: {
      normal: {
        color: '#87f7cf',
        borderColor: '#87f7cf',
        borderWidth: 0.5,
      },
      emphasis: {
        color: '#87f7cf',
        borderColor: '#87f7cf',
        borderWidth: 0.5,
      },
    },
    checkpointStyle: {
      color: '#fc97af',
      borderColor: 'rgba(252, 151, 175, 0.3)',
    },
    label: {
      normal: {
        textStyle: {
          color: '#87f7cf',
        },
      },
      emphasis: {
        textStyle: {
          color: '#87f7cf',
        },
      },
    },
  },

  // 视觉映射器
  visualMap: {
    color: ['#fc97af', '#87f7cf'],
  },

  // 用于区域缩放
  dataZoom: [
    {
      backgroundColor: '#494D60',
      type: 'slider',
      dataBackground: {
        lineStyle: {
          color: '#2AA0F1',
        },
      },
      fillerColor: 'rgba(30,225,246,0.2)',
      borderColor: '#ccc',
      start: 30,
      end: 70,
      left: 'center',
      bottom: '10px',
      right: 'auto',
    },
    {
      type: 'inside',
      borderColor: '#ccc',
      start: 30,
      end: 70,
    },
  ],

  // 图标标注
  markPoint: {
    label: {
      normal: {
        textStyle: {
          color: constantsColor,
        },
      },
      emphasis: {
        textStyle: {
          color: constantsColor,
        },
      },
    },
  },
};

export default theme;
