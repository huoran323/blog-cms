import React from 'react';
import { Card, Icon, Tooltip } from 'antd';

export interface ICountCard {
  loading: boolean;
  data: any;
}

const CountCard: React.FC<ICountCard> = props => {
  const { loading, data } = props;

  if (!data) return null;
  return (
    <Card loading={loading} bodyStyle={{ textAlign: 'center' }}>
      <Icon type={data.icon} theme="twoTone" twoToneColor="#eb2f96" />
      <h3 style={{ fontSize: 28, margin: '8px 0 4px', color: '#515a6e' }}>{data.num}</h3>
      <div style={{ color: '#808695', fontSize: 12 }}>{data.desc}</div>

      {data.change && (
        <div
          style={{ marginTop: 10, fontSize: 14, color: data.change > 0 ? '#ed4014' : '#19be6b' }}
        >
          <Icon type={data.change > 0 ? 'up' : 'down'} style={{ fontWeight: 500 }} />
          <span style={{ marginLeft: 4 }}>{Math.abs(data.change)}%</span>
        </div>
      )}

      {data.member && (
        <div style={{ display: 'inline-block', marginTop: 2 }}>
          {data.member.map((item, index) => (
            <Tooltip key={index} title={item.name}>
              <span
                style={{
                  display: 'inline-block',
                  width: 24,
                  height: 24,
                  marginLeft: index === 0 ? 0 : -8,
                  border: '1px solid #fff',
                  borderRadius: 12,
                  overflow: 'hidden',
                }}
              >
                <img src={item.img} alt="avatar" style={{ width: '100%' }} />
              </span>
            </Tooltip>
          ))}
        </div>
      )}
    </Card>
  );
};

export default CountCard;
