import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { Page } from '@/components';

import CountCard from './components/CountCard';
import VisitChart from './components/VisitChart';
import SaleTypeChart from './components/SaleTypeChart';
import WeatherChart from './components/WeatherChart';
import { getCountData } from '@/services/dashboard';

const DashBoard: React.FC<any> = () => {
  const [state, setState] = useState({
    loading: true,
    countData: {},
  });

  // 请求统计数据
  useEffect(() => {
    getCountData().then(res => {
      setState({ ...state, loading: false, countData: res.data });
    });
  }, []);

  const { countData, loading } = state;
  return (
    <Page style={{ backgroundColor: 'transparent' }}>
      <Row gutter={16}>
        {Object.keys(countData).map(item => (
          <Col span={6} key={item}>
            <CountCard loading={loading} data={countData[item]} />
          </Col>
        ))}
      </Row>

      <Row style={{ margin: '16px -8px' }} gutter={16} type="flex">
        <Col span={12}>
          <VisitChart />
        </Col>

        <Col span={12}>
          <SaleTypeChart />
        </Col>
      </Row>

      <WeatherChart />
    </Page>
  );
};

export default DashBoard;
