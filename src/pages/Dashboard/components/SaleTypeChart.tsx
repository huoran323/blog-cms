import React, { useEffect, useState, Fragment } from 'react';
import { Card, Radio, Dropdown, Icon, Menu } from 'antd';
import { Pie } from '@/components/Charts';
import { getSaleTypeChart } from '@/services/dashboard';

const SaleTypeChart: React.FC<any> = props => {
  const [state, setState] = useState({
    loading: true,
    salesType: 'all',
    chartData: [],
  });

  // 请求销售分类数据
  useEffect(() => {
    getSaleTypeChart().then(res => {
      const chartData = res.data.map(item => ({
        all: item.offline + item.online,
        ...item,
      }));

      setState({ ...state, chartData, loading: false });
    });
  }, []);

  // 处理类型改变
  const handleChangeSalesType = e => {
    setState({
      ...state,
      salesType: e.target.value,
    });
  };

  const { loading, salesType, chartData } = state;
  const total = chartData.reduce((prev, curr) => {
    return prev + curr[salesType];
  }, 0);
  return (
    <Card
      bordered={false}
      loading={loading}
      title="销售类别占比"
      bodyStyle={{ padding: 24 }}
      extra={
        <Fragment>
          <Radio.Group
            value={salesType}
            onChange={handleChangeSalesType}
            style={{ marginRight: 12 }}
          >
            <Radio.Button value="all">全部渠道</Radio.Button>
            <Radio.Button value="online">线上</Radio.Button>
            <Radio.Button value="offline">门店</Radio.Button>
          </Radio.Group>

          <Dropdown
            placement="bottomRight"
            overlay={
              <Menu>
                <Menu.Item>操作一</Menu.Item>
                <Menu.Item>操作二</Menu.Item>
              </Menu>
            }
          >
            <Icon type="ellipsis" />
          </Dropdown>
        </Fragment>
      }
    >
      <Pie
        title="销售额"
        height={270}
        data={chartData}
        style={{ padding: '8px 0' }}
        fieldMapping={{ x: 'name', y: salesType }}
        guideProps={{ name: '销售额', total: `${total}元` }}
      />
    </Card>
  );
};

export default SaleTypeChart;
