import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { getVisitChart } from '@/services/dashboard';
import BarLine from '@/components/Charts/BarLine';

const VisitChart: React.FC<any> = props => {
  const [state, setState] = useState({
    loading: true,
    chartData: [],
  });

  // 请求访问量数据
  useEffect(() => {
    getVisitChart().then(res => {
      setState({ ...state, loading: false, chartData: res.data });
    });
  }, []);

  const { loading, chartData } = state;
  return (
    <Card title="访问量" loading={loading} headStyle={{ padding: '12px 24px' }}>
      <BarLine
        height={330}
        data={chartData}
        axisList={[{ name: 'time' }, { name: 'value' }]}
        legendProps={{
          position: 'top-right',
        }}
        geomList={[
          {
            type: 'area',
            position: 'time*value',
            color: [
              'type',
              [
                'l (90) 0:rgba(0, 146, 255, 1) 1:rgba(0, 146, 255, 0.1)',
                'l (90) 0:rgba(0, 268, 0, 1) 1:rgba(0, 268, 0, 0.1)',
              ],
            ],
            shape: 'smooth',
          },
        ]}
        transform={{
          rename: {
            map: {
              uv: '浏览量(PV)',
              pv: '访客量(UV)',
            },
          },
          fold: {
            fields: ['浏览量(PV)', '访客量(UV)'],
            key: 'type',
            value: 'value',
          },
        }}
      />
    </Card>
  );
};

export default VisitChart;
