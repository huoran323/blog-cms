import React from 'react';
import { Tag } from 'antd';

const { CheckableTag } = Tag;

interface ITagSelectOption {
  children?: React.ReactNode;
  checked?: boolean;
  value: number | string;
  onChange?: (value: string | number, state: boolean) => void;
}

const TagSelectOption: React.SFC<ITagSelectOption> = props => {
  const { checked, children, value, onChange } = props;

  return (
    <CheckableTag checked={checked} key={value} onChange={checked => onChange(value, checked)}>
      {children}
    </CheckableTag>
  );
};

export default TagSelectOption;
