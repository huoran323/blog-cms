/**
 * 基础字典类
 */
class BaseDict {
  // 公共类型
  static COMMON_TYPE = [{ text: '否', value: '0' }, { text: '是', value: '1' }];

  // 性别类型
  static SEX_TYPE = [{ text: '女', value: '0' }, { text: '男', value: '1' }];

  // 学历类型
  static EDUCATION_TYPE = [
    { text: '初中及以下', value: '1' },
    { text: '高中/中专', value: '2' },
    { text: '大专/本科', value: '3' },
    { text: '硕士及以上', value: '4' },
  ];

  // 婚姻状况
  static MARRIAGE_TYPE = [
    { text: '未婚', value: '0' },
    { text: '已婚', value: '1' },
    { text: '离异', value: '2' },
    { text: '未知', value: '-' },
  ];

  // 证件类型
  static IDENTITY_TYPE = [
    { text: '身份证', value: '0' },
    { text: '中国护照', value: '1' },
    { text: '军官证', value: '2' },
    { text: '士兵证', value: '3' },
    { text: '回乡证', value: '4' },
    { text: '户口本', value: '5' },
    { text: '外籍护照', value: '6' },
    { text: '其他', value: '7' },
    { text: '文职', value: '8' },
    { text: '警官', value: '9' },
    { text: '离休证', value: 'H' },
    { text: '香港居民身份证', value: 'I' },
    { text: '文职退休证', value: 'G' },
    { text: '军官退休证', value: 'F' },
    { text: '警官退休证', value: 'E' },
    { text: '台胞证', value: 'D' },
    { text: '社保卡', value: 'C' },
    { text: '居住证', value: 'B' },
    { text: '港澳通行证', value: 'A' },
    { text: '港澳台居民居住证', value: 'L' },
    { text: '国外人永久居留证', value: 'J' },
    { text: '澳门居民身份证', value: 'K' },
  ];

  // 审核状态
  static REVIEW_STATUS = [
    { text: '待审核', value: '1' },
    { text: '审核通过', value: '2' },
    { text: '审核不通过', value: '3' },
  ];
}

// 客户相关字典
export class OtherDict {
  // 企业性质
  static COMPANY_NATURE = [
    { text: '一般公司', value: '0' },
    { text: '事业单位及社团', value: '1' },
    { text: '上市公司', value: '2' },
    { text: '合资外资企业', value: '3' },
    { text: '投资公司', value: '4' },
    { text: '财务公司', value: '5' },
    { text: '大中型国企', value: '6' },
    { text: '个人独资企业', value: '7' },
    { text: '家族企业', value: '8' },
    { text: '合伙企业', value: '9' },
    { text: '存在隐匿名股东企业', value: 'a' },
  ];

  // 行业细分
  static TRADE_TYPE = [
    { text: '农、林、牧、渔业', value: '1' },
    { text: '采掘业', value: '2' },
    { text: '制造业', value: '3' },
    { text: '仓储、物流、交通运输', value: '6' },
    { text: '计算机软件、IT行业', value: '7' },
    { text: '金融机构（含银行/保险/信托/证券/期货等）', value: '10' },
    { text: '房地产（含房地产开发、建筑、装修）', value: '11' },
    { text: '公共事业（邮政、电力、电信、供水、水利、煤气、天然气等）', value: '14' },
    { text: '科研、教育（含研究员/工程师/教师/学生/培训人员等）', value: '16' },
    { text: '医疗卫生机构（含医生/护士/护工等）', value: '17' },
    { text: '体育、演艺（运动员、演艺人员等）', value: '18' },
    { text: '党群机关/政府机关/事业单位人员/军事机关人员', value: '20' },
    { text: '典当、拍卖、艺术品收藏', value: '26' },
    { text: '商贸、加工、零售（含废品回购）', value: '28' },
    {
      text: '餐饮、娱乐、旅游服务业（含酒店/影视娱乐/夜总会/洗浴中心/酒吧/旅行社等）',
      value: '29',
    },
    { text: '博彩、彩票', value: '31' },
    { text: '自由职业者（律师/会计师/精算师/作家/画家等）', value: '33' },
    { text: '新闻出版广告机构', value: '34' },
    { text: '宗教', value: '35' },
    { text: '其他', value: '99' },
  ];
}

// 类混合
function mix(...mixins) {
  // 深拷贝
  function copyProperties(target, source) {
    for (const key of Reflect.ownKeys(source)) {
      if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
        const desc = Object.getOwnPropertyDescriptor(source, key);
        Object.defineProperty(target, key, desc);
      }
    }
  }

  class Mix {
    constructor() {
      for (const mixin of mixins) {
        copyProperties(this, new mixin()); // 拷贝实例属性
      }
    }
  }

  for (const mixin of mixins) {
    copyProperties(Mix, mixin); // 拷贝静态属性
    copyProperties(Mix.prototype, mixin.prototype); // 拷贝原型属性
  }

  return Mix;
}

export default class Dict extends mix(BaseDict, OtherDict) {}
