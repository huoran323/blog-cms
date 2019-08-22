import React, { Component } from 'react';
import { Empty } from 'antd';
import { Chart, Tooltip, Geom, Coord, Guide, Legend, Label, Axis } from 'bizcharts';
import DataSet from '@antv/data-set';
import projectConfig from '@/config/projectConfig';

const { chartColor } = projectConfig;
const { Html } = Guide;

export interface IPieProps {
  className?: string;
  style?: React.CSSProperties;
  title?: React.ReactNode;
  data: Array<{}>;
  scale?: any;
  isPercent?: boolean;
  transform?: any;
  fieldMapping?: { x: string; y: string };

  // charts props
  height?: number;
  padding?: [number, number, number, number];

  legendProps?: any;
  tooltipProps?: any;
  guideProps?: any;
  labelProps?: any;
  coordProps?: { radius?: number; innerRadius?: number; startAngle?: number; endAngle?: number };
  [otherProps: string]: any;
}

class Pie extends Component<IPieProps> {
  static defaultProps = {
    width: 350,
    height: 400,
    isPercent: true,
    padding: 'auto',
    labelProps: false,
    coordProps: { radius: 0.75, innerRadius: 0.6 },
  };

  private chart: any;

  render() {
    const {
      style,
      className,
      width,
      height,
      padding,
      title,

      data,
      scale,
      transform,
      fieldMapping,
      isPercent,

      coordProps,
      legendProps,
      tooltipProps,
      guideProps,
      labelProps,
      ...restProps
    } = this.props;

    const ds = new DataSet();
    let dv = ds.createView().source(data);

    let isTransformed = false;
    if (transform) {
      isTransformed = true;

      Object.keys(transform).forEach(item => {
        dv = dv.transform({
          type: item,
          ...transform[item],
        });
      });
    }

    // 百分比饼图内部进行转化
    if (isPercent) {
      isTransformed = true;

      dv = dv.transform({
        type: 'percent',
        field: fieldMapping.y,
        dimension: fieldMapping.x,
        as: 'percent',
      });
    }

    const cols = {
      ...scale,
      percent: {
        formatter: val => {
          val = `${(val * 100).toFixed(2)}%`;
          return val;
        },
      },
    };

    if (!data.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    return (
      <div className={className} style={style}>
        {title && <h4 style={{ marginBottom: 16 }}>{title}</h4>}

        <Chart
          scale={cols}
          width={width}
          height={height}
          renderer="svg"
          padding={padding}
          data={isTransformed ? dv : data}
          onGetG2Instance={g2Chart => (this.chart = g2Chart)}
          {...restProps}
        >
          {/* tooltip */}
          <Tooltip
            showTitle={false}
            itemTpl={`<li data-index={index}><span style="background-color:{color}" class="g2-tooltip-marker"></span>{name}: {value}</li>`}
            {...tooltipProps}
          />

          <Axis name="percent" />

          {/* 坐标系组件 */}
          <Coord type="theta" {...coordProps} />

          {/* 几何标记对象 */}
          <Geom
            style={{ lineWidth: 1, stroke: '#fff' }}
            type="intervalStack"
            position="percent"
            color={[fieldMapping.x, chartColor]}
          >
            {labelProps && (
              <Label
                content="percent"
                formatter={(val, item) => {
                  const {
                    point: { name, percent },
                  } = item;
                  return `${name}: ${(percent * 100).toFixed(2)}%`;
                }}
                {...labelProps}
              />
            )}
          </Geom>

          {/* 管理标签 */}
          {guideProps && (
            <Guide>
              <Html
                position={['50%', '50%']}
                alignX="middle"
                alignY="middle"
                html={`<div style="text-align: center;">
                       <div style="font-size: 14px; color: rgba(0, 0, 0, .45)">${guideProps.name}</div>
                       <div style="font-size: 16px; color: #262626; ">${guideProps.total}</div>
                    </div>`}
              />
            </Guide>
          )}

          {/* legend */}
          <Legend
            useHtml={true}
            position="right-center"
            textStyle={{ fill: '#333' }}
            containerTpl={`<div class="g2-legend"><table class="g2-legend-list" style="list-style-type: none; margin: 0; padding: 0;"></table></div>`}
            itemTpl={(value, color, checked, index) => {
              const obj = dv.rows[index];
              const percent = (obj.percent * 100).toFixed(2) + '%';
              // @ts-ignore
              checked = checked ? 'checked' : 'unChecked';

              return `
                  <tr class="g2-legend-list-item item-${index} ${checked}" data-value='${value}' data-color='${color}'>
                    <td style="width: 80px; overflow: hidden; text-overflow: ellipsis; text-align: left;">
                      <i class="g2-legend-marker" style="background-color: ${color}"></i>
                      <span class="g2-legend-text" style="color: #666">${value}</span>
                    </td>
                    <td style="text-align: right; min-width: 60px; color: rgba(0, 0, 0, .45)">
                      ${isNaN(obj.percent) ? 0 : percent}
                    </td>
                    <td style="text-align: right; color: #666; min-width: 50px; font-weight: bold">
                      ${isNaN(obj[fieldMapping.y]) ? 0 : obj[fieldMapping.y]}
                    </td>
                  </tr>
                `;
            }}
            g2-legend-list={{
              border: 'none',
            }}
            g2-legend-marker={{
              width: '7px',
              height: '7px',
              verticalAlign: 'baseline',
            }}
            {...legendProps}
          />
        </Chart>
      </div>
    );
  }
}

export default Pie;
