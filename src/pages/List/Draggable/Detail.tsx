import React from 'react';

const DraggableDetail: React.FC<any> = props => {
  return (
    <div>
      this is draggable detail, {props.location.pathname} {props.location.search}
    </div>
  );
};

export default DraggableDetail;
