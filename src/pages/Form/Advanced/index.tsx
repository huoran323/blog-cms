import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { Page, SearchTree } from '@/components';
import { getTreeList } from '@/services/other';
import { convertArrayToTree } from '@/utils/util';

const AdvancedList: React.FC<any> = props => {
  const [state, setState] = useState({
    loading: true,
    treeList: [],
  });

  // 请求树列表数据
  useEffect(() => {
    getTreeList().then(res => {
      setState({
        ...state,
        loading: false,
        treeList: res.data,
      });
    });
  }, []);

  const { loading, treeList } = state;
  return (
    <Page loading={loading}>
      <Row gutter={16}>
        <Col span={8}>
          <SearchTree hasRemoteSearch treeList={treeList} />
        </Col>

        <Col span={16}>1111</Col>
      </Row>
    </Page>
  );
};

export default AdvancedList;
