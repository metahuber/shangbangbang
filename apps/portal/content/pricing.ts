/**
 * 价格与流程数据层
 *
 * ⭐ 价格已定，直接改这里的数字即可。
 *
 * 当前定价（老板 2026-10 拍板）：
 *   外贸网站：2,680 / 5,888 / 13,800 起
 *   门店小程序：1,980 / 3,980 / 9,800 起
 *   定价逻辑见 docs/09-定价决策框架.md
 */

export type PriceTier = {
  name: string;
  price: string;
  unit: string;
  forWho: string;
  features: string[];
  highlight?: boolean;
};

/** 外贸网站价格档 */
export const websiteTiers: PriceTier[] = [
  {
    name: "体验版",
    price: "¥2,680",
    unit: "/年",
    forWho: "适合先试试水的",
    features: [
      "标准模板站",
      "英文单语种",
      "基础询盘表单",
      "绑定你自己的域名",
      "SSL 证书",
      "后台管理账号",
    ],
  },
  {
    name: "标准版",
    price: "¥5,888",
    unit: "/年",
    forWho: "最受欢迎，适合多数工厂",
    highlight: true,
    features: [
      "体验版全部功能",
      "独立设计风格",
      "多语言（不限语种）",
      "产品参数库 + PDF 图册下载",
      "完整 SEO 配置",
      "询盘管理 CRM",
      "WhatsApp 一键联系",
      "优先技术支持",
    ],
  },
  {
    name: "品牌版",
    price: "¥13,800",
    unit: "/年 起",
    forWho: "需要定制与代运营的",
    features: [
      "标准版全部功能",
      "完全定制设计",
      "多站点 / 站群",
      "AI 业务员自动回复询盘",
      "内容代运营",
      "专属顾问对接",
    ],
  },
];

/** 门店小程序价格档 */
export const miniappTiers: PriceTier[] = [
  {
    name: "展示版",
    price: "¥1,980",
    unit: "/年",
    forWho: "只需要线上门面的",
    features: [
      "小程序展示站",
      "商品 / 服务展示",
      "门店定位与导航",
      "一键拨号",
      "后台管理账号",
    ],
  },
  {
    name: "门店版",
    price: "¥3,980",
    unit: "/年",
    forWho: "要点单、会员、活动的",
    highlight: true,
    features: [
      "展示版全部功能",
      "在线点单 / 预约",
      "在线支付",
      "会员卡 + 储值 + 积分",
      "优惠券",
      "数据看板",
      "员工操作培训",
    ],
  },
  {
    name: "连锁版",
    price: "¥9,800",
    unit: "/年 起",
    forWho: "多门店统一管理的",
    features: [
      "门店版全部功能",
      "多门店管理",
      "总部统一发券",
      "会员卡全店通用",
      "分店数据看板",
      "拼团 / 秒杀 / 分销",
    ],
  },
];

/** 价格页统一小字 */
export const priceNotes = [
  "价格含：建站、部署、SSL、备案指导、后台培训、维护期内技术支持",
  "不含：域名、服务器、短信等第三方费用（按实收，不加价）",
  "支持：对公转账 / 微信 / 支付宝；可开发票，具体票种请联系确认",
];

/** 交付流程——首页与关于我们共用 */
export type ProcessStep = {
  step: number;
  title: string;
  deliverable: string;
  duration: string;
};

export const processSteps: ProcessStep[] = [
  { step: 1, title: "需求沟通", deliverable: "《方案与报价单》", duration: "1 天" },
  { step: 2, title: "设计确认", deliverable: "设计稿（确认后才开发）", duration: "2–3 天" },
  { step: 3, title: "开发搭建", deliverable: "可访问的测试站点", duration: "3–10 天" },
  {
    step: 4,
    title: "内容填充与培训",
    deliverable: "后台账号 + 操作视频",
    duration: "1–2 天",
  },
  {
    step: 5,
    title: "正式上线",
    deliverable: "域名、SSL、收录全部配好",
    duration: "1 天",
  },
  {
    step: 6,
    title: "长期陪跑",
    deliverable: "维护期内随时找得到人",
    duration: "持续",
  },
];
