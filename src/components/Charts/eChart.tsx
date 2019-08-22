import React, { PureComponent } from 'react';
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import themes from '@/config/echartsConfig';

interface IProps {
  events?: any;
  style?: React.CSSProperties;
  getOption: object;
}

class Chart extends PureComponent<IProps> {
  constructor(props) {
    super(props);
    this.registerTheme();
  }

  // 注册主题
  registerTheme = () => {
    const theme = themes;
    echarts.registerTheme('chart', theme);
  };

  render() {
    const { style, getOption } = this.props;

    return (
      <ReactEcharts
        theme="chart"
        notMerge={true}
        lazyUpdate={true}
        option={getOption}
        style={{ width: '100%', ...style }}
      />
    );
  }
}

export default Chart;
