import { WrappedFormUtils } from 'antd/es/form/Form';

export interface IControlProps {
  name?: string;
  form?: WrappedFormUtils;
  type?: string;
  record?: object;
  initialValue?: any;
  rules?: any[];
  normalize?: (value, prevValue, allValues) => any;
  [otherProps: string]: any;
}
