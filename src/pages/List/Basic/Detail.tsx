import React from 'react';

const BasicDetail: React.FC<any> = props => {
  return <div>this is BasicDetail, {props.location.pathname}</div>;
};

export default BasicDetail;
