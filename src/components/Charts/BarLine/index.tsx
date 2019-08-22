import React, { PureComponent } from 'react';
import { Empty } from 'antd';
import DataSet from '@antv/data-set';
import { Chart, Axis, Tooltip, Geom, Legend, Label, AxisProps, TooltipProps } from 'bizcharts';
import projectConfig from '@/config/projectConfig';

const { chartColor } = projectConfig;

interface IBarLineProps {
  data: Array<{}>;
  axisList: AxisProps[];
  geomList: any[];
  tooltipProps?: TooltipProps;
  legendProps?: any;
  transform?: any;

  height?: number;
  title?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  padding?: [number, number, number, number];

  [otherProps: string]: any;
}

class BarLine extends PureComponent<IBarLineProps> {
  static defaultProps = {
    height: 400,
    padding: [40, 'auto', 40, 'auto'],
  };
  private chartIns: any;

  // 获取组件实例
  getG2Instance = chart => {
    this.chartIns = chart;
  };

  render() {
    const {
      data,
      axisList,
      geomList,
      transform,
      legendProps,
      tooltipProps,

      style,
      className,
      title,
      height,
      padding,
      ...restProps
    } = this.props;

    const ds = new DataSet();
    let dv = ds.createView().source(data);

    if (transform) {
      Object.keys(transform).forEach(item => {
        dv = dv.transform({
          type: item,
          ...transform[item],
        });
      });
    }

    // legend 自定义事件处理
    if (legendProps && legendProps.onClick) {
      const event = legendProps.onClick;
      // @ts-ignore
      legendProps.onClick = ev => event(ev, this.chartIns);
    }

    if (!data.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    return (
      <div className={className} style={{ ...style, height }}>
        {title && <h4 style={{ marginBottom: 16 }}>{title}</h4>}
        <Chart
          forceFit
          renderer="svg"
          padding={padding}
          data={transform ? dv : data}
          height={title ? height - 41 : height}
          onGetG2Instance={this.getG2Instance}
          {...restProps}
        >
          <Tooltip {...tooltipProps} />
          <Legend textStyle={{ fill: '#333' }} {...legendProps} />

          {axisList.map(item => (
            <Axis key={item.name} {...item} />
          ))}
          {geomList.map(item => {
            if (!item.color) item.color = [chartColor];
            return (
              <Geom key={`${item.type}.${item.position}`} {...item}>
                {item.labelProps ? <Label {...item.labelProps} /> : null}
              </Geom>
            );
          })}
        </Chart>
      </div>
    );
  }
}

export default BarLine;
