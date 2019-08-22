import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { BarLine } from '@/components/Charts';
import { getWeatherChart } from '@/services/dashboard';

const WeatherChart: React.FC<any> = () => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  // 请求天气图表数据
  useEffect(() => {
    getWeatherChart().then(({ data }) => {
      setChartData(data);
      setLoading(false);
    });
  }, []);

  return (
    <Card bordered={false} loading={loading} style={{ marginTop: 16 }}>
      <BarLine
        data={chartData}
        transform={{
          rename: {
            map: {
              rainfall: '降雨量(mm)',
              evaporation: '蒸发量(mm)',
              temperature: '温度(°C)',
            },
          },
          fold: {
            key: 'type',
            value: 'value',
            fields: ['降雨量(mm)', '蒸发量(mm)'],
          },
        }}
        axisList={[
          { name: 'month' },
          { name: 'value' },
          { name: '温度(°C)', title: true, label: { formatter: val => `${val}°C` } },
        ]}
        geomList={[
          {
            type: 'interval',
            position: 'month*value',
            color: [
              'type',
              value => {
                if (value === '降雨量(mm)') {
                  return '#2b6cbb';
                }
                if (value === '蒸发量(mm)') {
                  return '#41a2fc';
                }
              },
            ],
          },
          { type: 'line', position: 'month*温度(°C)', color: '#fad248' },
          { type: 'point', position: 'month*温度(°C)', color: '#fadacc' },
        ]}
        legendProps={{
          position: 'top',
          custom: true,
          items: [
            { value: '降雨量(mm)', marker: { symbol: 'square', fill: '#3182bd', radius: 5 } },
            { value: '蒸发量(mm)', marker: { symbol: 'square', fill: '#41a2fc', radius: 5 } },
            {
              value: '温度(°C)',
              marker: { symbol: 'hyphen', stroke: '#fad248', radius: 5, lineWidth: 3 },
            },
          ],
          onClick: (ev, chartIns) => {
            const {
              item: { value },
              checked,
            } = ev;
            const geoms = chartIns.getAllGeoms();

            geoms.forEach(geom => {
              if (geom.getYScale().field === value && value === '温度(°C)') {
                if (checked) {
                  geom.show();
                } else {
                  geom.hide();
                }
              } else if (geom.getYScale().field === 'value' && value !== '温度(°C)') {
                geom.getShapes().map(shape => {
                  if (shape._cfg.origin._origin.type === value) {
                    shape._cfg.visible = !shape._cfg.visible;
                  }
                  shape.get('canvas').draw();
                  return shape;
                });
              }
            });
          },
        }}
      />
    </Card>
  );
};

export default WeatherChart;
