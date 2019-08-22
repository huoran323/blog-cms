import { formatMessage } from 'umi-plugin-react/locale';
import { ValidationRule } from 'antd/lib/form/Form';
import { every, get as depGet } from 'lodash';
import request from './request';

/**
 * 必填校验
 * @param {bool} isRequire 是否必填
 */
export const getRequire = (isRequire: boolean = true): ValidationRule => {
  return {
    required: isRequire,
    message: formatMessage({ id: 'validation.require' }),
  };
};

/**
 * 文字必填
 * @param {boolean} isRequire 是否必填
 */
export const getTextRequire = (isRequire: boolean = true): ValidationRule => {
  return {
    required: isRequire,
    whitespace: true,
    message: formatMessage({ id: 'validation.require' }),
  };
};

/**
 * 日期必填
 * @param {boolean} isRange 是否是rangePicker
 * @param {boolean} isRequire 是否必填
 */
export const getDateRequire = (
  isRange: boolean = false,
  isRequire: boolean = true
): ValidationRule => {
  return {
    type: isRange ? 'array' : 'object',
    required: isRequire,
    message: formatMessage({ id: 'validation.date' }),
  };
};

/**
 * 校验复杂类型的数据是否为空
 * @param {array<string>} checkProps
 * @example getObjRequire('project.key')
 */
export const getObjRequire = (...checkProps: string[]): ValidationRule => {
  return {
    validator: (rule, value, callback) => {
      if (value) {
        const isValid = every(checkProps, prop => {
          const v = depGet(value, prop);
          if (typeof v === 'number') {
            return true;
          }
          return !!v;
        });
        if (isValid) {
          callback();
        }
      }
      callback(formatMessage({ id: 'validation.require' }));
    },
  };
};

/**
 * 字符串最大长度
 * @param {number} max 最大值
 */
export const getMaxLength = (max: number): ValidationRule => {
  return {
    max,
    message: formatMessage({ id: 'validation.max' }, { max }),
  };
};

/**
 * 字符串最小长度
 * @param {number} min 最小值
 */
export const getMinLength = (min: number): ValidationRule => {
  return {
    min,
    message: formatMessage({ id: 'validation.min' }, { min }),
  };
};

/**
 * 字符串长度范围
 * @param min {number} 最小长度
 * @param max {number} 最大长度
 */
export const getRangeLength = (min: number, max: number): ValidationRule[] => {
  return [getMinLength(min), getMaxLength(max)];
};

/**
 * 数值最小值
 * @param {number} min 数值最小值
 */
export const getMinValue = (min: number): ValidationRule => {
  return {
    validator: (rule, value, callback) => {
      if (value && value < min) {
        callback(formatMessage({ id: 'validation.min-value' }, { min }));
      }
      callback();
    },
  };
};

/**
 * 数值最大值
 * @param {number} max 最大值
 */
export const getMaxValue = (max: number): ValidationRule => {
  return {
    type: 'number',
    max,
    message: formatMessage({ id: 'validation.max-value' }, { max }),
  };
};

/**
 * 数值总位数
 * @param {number} max 最大的数字位数
 */
export const getMaxValueLength = (max: number): object => {
  return {
    validator: (rule, value, callback) => {
      if (value && `${value}`.length > max) {
        callback(formatMessage({ id: 'validation.max-value-length' }, { max }));
      }
      callback();
    },
  };
};

/**
 * 数值范围
 * @param min {number} 最小值
 * @param max {number} 最大值
 */
export const getRangeValue = (min: number, max: number): ValidationRule[] => {
  return [getMinValue(min), getMaxValue(max)];
};

/**
 * 手机号码校验
 * @param type 号码规则 中国、其他
 */
export const getPhone = (type?: 'mobile' | 'telephone' | 'phone'): ValidationRule => {
  let pattern;
  switch (type) {
    case 'mobile':
      pattern = /^0?1[3|4|5|7|8|9]\d{9}$/;
      break;
    case 'telephone':
      pattern = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
      break;
    case 'phone':
      pattern = /(^(0?1[3|4|5|7|8|9]\d{9}$)|(^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$))/;
      break;
    default:
      pattern = /^0?1[3|4|5|7|8|9]\d{9}$/;
      break;
  }
  return {
    pattern,
    message: formatMessage({ id: 'validation.phone' }),
  };
};

/**
 * 邮箱规则
 */
export const getEmail = (): ValidationRule => {
  return {
    pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
    message: formatMessage({ id: 'validation.email' }),
  };
};

/**
 * TODO: 功能待完善
 * 远程校验
 * @param {string} url 校验地址, true -> 通过, false -> 失败
 * @param {string} message 校验不通过的提示消息
 */
export const getRemoteRule = (
  url: string,
  message: string = formatMessage({ id: 'validation.remote' })
): ValidationRule => {
  return {
    validator(rule, value, callback) {
      if (!value) {
        callback();
        return;
      }
      request(url, {}).then(rep => {
        if (rep) {
          callback();
        } else {
          callback(message);
        }
      });
    },
  };
};

/**
 * 邮编验证 暂时只限制为数字
 */
export const getPost = (): ValidationRule => {
  return {
    pattern: /^\d{6}$/,
    message: formatMessage({ id: 'validation.post' }),
  };
};

/**
 * url验证
 * @param path
 * @returns {object}
 */
export const urlPattern = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/gi;
export const getUrl = (path: string): ValidationRule => {
  return {
    pattern: urlPattern,
    message: formatMessage({ id: 'validation.url' }),
  };
};
