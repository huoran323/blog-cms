import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Ellipsis } from '@/widget';
import Dict from '@/config/dict';

/**
 * 获取字典对象
 * @param dict
 */
export function getDictMap(dict) {
  const dictMap = {};
  dict.forEach(item => (dictMap[item.value] = item.text));
  return dictMap;
}

/**
 * 转换列表某一条数据的详情显示项，由 value -> text
 * @param propVal 待转换的属性值
 * @param dictName 待转换的字典名称
 * @returns {any}
 * @example dictKeyToValue(item.sex, 'SEX_TYPE')
 */
export function dictKeyToValue(propVal, dictName) {
  const dict = Dict[dictName];
  const dictMap = getDictMap(dict);

  if (Array.isArray(propVal)) {
    return propVal.map(item => dictMap[item]).join(',');
  } else {
    return dictMap[`${propVal}`];
  }
}

/**
 * 获取控件
 * @param props
 * @returns {any}
 */
export function getFieldComp(props) {
  let FieldComp = null;

  const { type = 'input' } = props;
  switch (type) {
    case 'dateRange': // 日期范围
    case 'datetime': // 日期时间
    case 'date': // 日期
    case 'month': // 月
    case 'time': // 时间
      FieldComp = require(`../widget/FormItem/date`).default(props);
      break;
    case 'input': // 输入框
    case 'password': // 密码框
    case 'search': // 搜索框
    case 'textarea': // 多行文本
      FieldComp = require(`../widget/FormItem/input`).default(props);
      break;
    case 'plain':
      FieldComp = <span>{props.Component || props.name}</span>;
      break;
    default:
      FieldComp = require(`../widget/FormItem/${type}`).default(props);
  }

  return FieldComp;
}

/**
 * 格式化文本
 * @param item
 * @param text
 * @param option
 * @returns {any}
 */
export const formatText = (item, text, option) => {
  const options = {
    format: 'YYYY-MM-DD',
    defaultValue: '--',
    tooltip: true,
    lines: 1,
    ...option,
  };

  if (item.dict) {
    if (typeof item.dict === 'string') {
      text = dictKeyToValue(text, item.dict);
    } else {
      const dictMap = getDictMap(item.dict);
      text = Array.isArray(text) ? text.map(item => dictMap[item]).join(',') : dictMap[text];
    }

    return text === null || typeof text === 'undefined' ? (
      <span title={options.defaultValue} style={{ cursor: 'pointer' }}>
          {options.defaultValue}
        </span>
    ) : (
      <Ellipsis {...options}>{text}</Ellipsis>
    )
  }

  if (!item.dict) {
    if (text === null || typeof text === 'undefined') {
      return options.defaultValue;
    }

    if (item.formatTime) text = moment(text).format(options.format);
    return <Ellipsis {...options}>{text}</Ellipsis>;
  }
};

/**
 * 格式化表格columns
 * @param params
 * @param option
 */
export function formatColumn(params, option?) {
  const { data, value } = params;

  if (Array.isArray(data)) {
    return data.map(item => {
      if (!item.render) {
        item.render = text => formatText(item, text, option);
      }

      return item;
    });
  } else {
    return formatText(data, value, option);
  }
}

/**
 * 将数组转换成树
 * @param arr
 * @param option
 */
export const convertArrayToTree = (arr: any[], option?) => {
  const originArr = arr.map(item => ({ ...item }));
  const options = {
    id: 'id',
    rootId: '0',
    parentId: 'parentId',
    children: 'children',
    ...option,
  };

  const arrayById = _.keyBy(originArr, options.id);
  const groupByParents = originArr.reduce((prev, item) => {
    let parentId = item[options.parentId];
    if (!parentId || !arrayById[parentId]) {
      parentId = options.rootId;
    }

    if (parentId && prev[parentId]) {
      prev[parentId].push(item);
      return prev;
    }

    prev[parentId] = [item];
    return prev;
  }, {});

  const rootNodes = groupByParents[options.rootId];
  const createTree = nodes => {
    const tree = [];
    if (nodes) {
      nodes.forEach(node => {
        const childNode = groupByParents[node[options.id]];
        if (childNode) {
          node[options.children] = createTree(childNode);
        }
        tree.push(node);
      });
    }
    return tree;
  };

  return createTree(rootNodes);
};

/**
 * 图表Y轴格式化 百万 千万 亿
 * @param value
 * @returns {string}
 */
export function formatNum(value) {
  const million = 10 ** 6; // 百万
  const millions = 10 ** 7; // 千万
  const hundredMillion = 10 ** 8; // 亿

  if (value >= hundredMillion) {
    return (value / hundredMillion).toFixed(2) + '亿';
  }

  if (value >= millions && value < hundredMillion) {
    return (value / millions).toFixed(2) + '千万';
  }

  if (value >= million && value < millions) {
    return (value / million).toFixed(2) + '百万';
  }

  return value.toFixed(2);
}

/**
 * 格式化数值
 * @param num
 * @param n 需要保留的位数
 * @returns {*}
 */
export function formatAmount(num, n?) {
  if (typeof num === 'undefined' || num === null)
    return { amount: '--', unit: '元', amountUnit: '--元' };

  num = parseFloat(num);

  // 判断需要保留的位数
  const m = n !== undefined && n !== null ? n : 2;

  const integer = parseInt(num, 10);
  const len = String(integer).length;
  let amount = '0.00';
  let unit = '元';

  if (len < 5) {
    amount = num.toFixed(m);
    unit = '元';
  }

  if (len >= 5 && len <= 8) {
    num = num / Math.pow(10, 4);
    amount = num.toFixed(m);
    unit = '万';
  }

  if (len >= 9) {
    num = num / Math.pow(10, 8);
    amount = num.toFixed(m);
    unit = '亿';
  }

  return { amount, unit, amountUnit: `${amount}${unit}` };
}

/**
 * 事件绑定
 * @param target
 * @param eventType
 * @param callback
 * @returns {{remove(): void}}
 */
export const eventListen = (target, eventType, callback) => {
  if (target.addEventListener) {
    target.addEventListener(eventType, callback, false);
    return {
      remove() {
        target.removeEventListener(eventType, callback, false);
      },
    };
  } else if (target.attachEvent) {
    target.attachEvent('on' + eventType, callback);
    return {
      remove() {
        target.detachEvent('on' + eventType, callback);
      },
    };
  }
};
