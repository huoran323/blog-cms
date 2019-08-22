import React, { PureComponent } from 'react';
import echarts from 'echarts';

interface IProps {
  style?: React.CSSProperties;
  data: {
    children: any[];
    name: string;
  };
}

class RadialTree extends PureComponent<IProps> {
  static defaultProps = {
    height: 500,
  };

  componentDidMount() {
    const { data } = this.props;
    const myCharts = echarts.init(document.getElementById('hierarchy'));

    myCharts.setOption({
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
      },
      series: [
        {
          type: 'tree',
          data: [data],
          roam: true,
          symbolSize: 5,
          layout: 'radial',

          label: {
            normal: {
              position: 'left',
              verticalAlign: 'middle',
              align: 'right',
              fontSize: 14,
            },
          },
          leaves: {
            label: {
              normal: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left',
              },
            },
          },

          animationDurationUpdate: 550,
          animationEasingUpdate: 750,
        },
      ],
    });
  }

  render() {
    const { style } = this.props;
    return <div id="hierarchy" style={{ height: '380px', width: '100%', ...style }} />;
  }
}

export default RadialTree;
