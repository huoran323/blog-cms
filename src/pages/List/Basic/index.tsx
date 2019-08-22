import React from 'react';
import { Page, CommonTable, CommonSearch } from '@/components';
import { getList } from '@/services/list';
import { listColumns } from '../columns';
import { listSearch } from '../search';

const BasicList: React.FC<any> = () => {
  const handleSearch = searchParams => {
    console.log(searchParams);
  };

  return (
    <Page>
      <CommonSearch formList={listSearch} handleSearch={handleSearch} />

      <CommonTable selectType={false} fetchList={getList} columns={listColumns} />
    </Page>
  );
};

export default BasicList;
