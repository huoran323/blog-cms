import React from 'react';
import { Page, EditableTable } from '@/components';
import { getList } from '@/services/list';
import { listColumns } from '@/pages/List/columns';
import { Button } from 'antd';

const EditableList: React.FC<any> = props => {
  const handleAdd = (...text) => {
    console.log(text);
    return true;
  };

  return (
    <Page>
      <EditableTable fetchList={getList} columns={listColumns}>
        <Button type="primary" icon="plus" onClick={handleAdd}>
          新增
        </Button>
      </EditableTable>
    </Page>
  );
};

export default EditableList;
