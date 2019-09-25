import React from 'react';
import { Button } from 'antd';
import router from 'umi/router';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Page, DragTable, CommonTable } from '@/components';
import { getList } from '@/services/list';

import { listColumns } from '../columns';

const DraggableTable: React.FC<any> = props => {
  const goDetail = record => {
    router.push({ pathname: `/list/draggable/detail`, search: `id=${record.id}` });
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
    // DndProvider 必须作为顶层节点以提供 context
    <DndProvider backend={HTML5Backend}>
      <Page>
        <CommonTable
          draggable={true}
          selectType={false}
          columns={columns}
          fetchList={getList}
          components={{
            // 覆盖默认的 table 元素
            body: {
              row: DragTable,
            },
          }}
        />
      </Page>
    </DndProvider>
  );
};

export default DraggableTable;
