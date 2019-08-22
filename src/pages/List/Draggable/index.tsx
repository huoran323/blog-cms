import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Page, DragTable, CommonTable } from '@/components';
import { getList } from '@/services/list';

import { listColumns } from '../columns';

const DraggableTable: React.FC<any> = props => {
  return (
    // DndProvider 必须作为顶层节点以提供 context
    <DndProvider backend={HTML5Backend}>
      <Page>
        <CommonTable
          draggable={true}
          selectType={false}
          columns={listColumns}
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
