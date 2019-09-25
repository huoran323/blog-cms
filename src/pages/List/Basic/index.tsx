import React from 'react';
import { Button } from 'antd';
import router from 'umi/router';
import { Page, CommonTable, CommonSearch } from '@/components';
import { getList } from '@/services/list';
import { listColumns } from '../columns';
import { listSearch } from '../search';

const BasicList: React.FC<any> = () => {
  const handleSearch = searchParams => {
    console.log(searchParams);
  };

  const goDetail = record => {
    router.push({ pathname: `/list/basic/${record.id}` });
  };

  const columns = [
    ...listColumns,
    {
      title: '操作',
      width: 100,
      dataIndex: 'operate',
      render: (text, record) => (
        <Button type="link" size="small" onClick={() => goDetail(record)}>
          详情
        </Button>
      ),
    },
  ];

  return (
    <Page>
      <CommonSearch formList={listSearch} handleSearch={handleSearch} />

      <CommonTable selectType={false} fetchList={getList} columns={columns} />
    </Page>
  );
};

export default BasicList;
