/**
 * 解决方案数据层
 *
 * 为什么要有「解决方案」而不只是「产品」：
 * 老板不搜「多语言建站」，他搜「工厂怎么做外贸网站」。
 * 先对上人，再讲产品。
 */

export type Solution = {
  slug: string;
  /** 导航与首页入口用的短名 */
  name: string;
  /** 入口卡片副文案 */
  shortDesc: string;
  emoji: string;
  heroTitle: string;
  pains: string[];
  plan: { title: string; desc: string }[];
  deliverables: string[];
  /** 关联产品 slug */
  productSlugs: string[];
  cta: string;
  order: number;
};

export const solutions: Solution[] = [
  {
    slug: "foreign-trade-factory",
    name: "我是外贸工厂",
    shortDesc: "想做独立站、拿询盘、摆脱平台依赖",
    emoji: "🏭",
    heroTitle: "让海外客户搜得到你、信得过你、找得到你",
    pains: [
      "只靠国际站，询盘一年比一年贵",
      "客户总问「你们官网呢」，答不上来",
      "展会回来加了名片，过两个月就失联",
      "产品更新了，老网站还是三年前的版本",
    ],
    plan: [
      {
        title: "第一步：把门面建起来",
        desc: "多语言独立站，英文起步。产品参数、资质认证、工厂实力都放上去，让客户能自己看懂你。",
      },
      {
        title: "第二步：让客户找得到",
        desc: "做搜索引擎收录和基础 SEO 配置，客户搜产品词的时候能搜到你，而不是只有平台。",
      },
      {
        title: "第三步：让客户联系得上",
        desc: "询盘表单 + WhatsApp 一键联系 + 邮件通知，客户在任何页面都能找到你。",
      },
      {
        title: "第四步：让询盘跑不掉",
        desc: "询盘统一进 CRM，分配跟进人、记录跟进过程，业务员离职客户也留得下。",
      },
    ],
    deliverables: [
      "多语言独立站（绑定你自己的域名）",
      "后台管理账号与操作培训",
      "产品目录 / 电子图册",
      "搜索引擎收录与基础 SEO 配置",
      "询盘通知与归集",
    ],
    productSlugs: ["foreign-trade-website", "multilingual", "inquiry-crm"],
    cta: "免费评估我的产品适合做哪种站",
    order: 1,
  },
  {
    slug: "local-shop",
    name: "我是本地商铺",
    shortDesc: "想做会员、做回头客、不再被抽佣",
    emoji: "🏬",
    heroTitle: "把到店客户，变成回头客",
    pains: [
      "平台抽佣一年比一年高",
      "客户来一次就走，没有回头客",
      "发传单没人扫，扫码了也不知道是谁",
      "想做活动只会打折，打完折人又没了",
    ],
    plan: [
      {
        title: "第一步：把客户接住",
        desc: "门店小程序 + 扫码吸粉，到店客户扫码就能进你的私域，不再全靠平台。",
      },
      {
        title: "第二步：把客户留住",
        desc: "会员卡、储值、积分、优惠券，让客户有理由再来一次。",
      },
      {
        title: "第三步：让客户带客户",
        desc: "拼团、分享有礼、老带新，用老客户帮你拉新客。",
      },
      {
        title: "第四步：看得见效果",
        desc: "客流、订单、会员、复购数据看板，哪个活动有效一目了然。",
      },
    ],
    deliverables: [
      "微信门店小程序",
      "后台管理账号",
      "门店物料文案（海报、台卡、朋友圈）",
      "员工操作培训",
    ],
    productSlugs: ["shop-miniapp", "ai-marketing", "digital-card"],
    cta: "免费给我出一份门店方案",
    order: 2,
  },
  {
    slug: "chain-brand",
    name: "我是连锁品牌",
    shortDesc: "多门店统一管理、统一营销",
    emoji: "🏢",
    heroTitle: "一套系统，管住所有店",
    pains: [
      "各店数据不统一，总部看不到真实经营情况",
      "会员卡不能通用，客户换一家店就得重新办",
      "营销活动各做各的，品牌形象不统一",
      "新店开业，从零搭一遍太慢",
    ],
    plan: [
      {
        title: "统一会员体系",
        desc: "一卡通用所有门店，储值、积分、等级全国（城）统一。",
      },
      {
        title: "总部统一发券",
        desc: "总部做活动、分店执行，避免各店各搞一套。",
      },
      {
        title: "分店数据看板",
        desc: "每家店的客流、订单、会员增长都能单独看，也能汇总对比。",
      },
      {
        title: "快速复制新店",
        desc: "新店开业套用模板，不用重新做一遍。",
      },
    ],
    deliverables: [
      "多门店小程序系统",
      "总部管理后台 + 分店账号",
      "会员与营销体系统一配置",
      "门店数据看板",
    ],
    productSlugs: ["shop-miniapp", "inquiry-crm"],
    cta: "预约演示",
    order: 3,
  },
  {
    slug: "industry-belt",
    name: "我是产业带工厂",
    shortDesc: "同行都在做，我要做得比他们好",
    emoji: "⚙️",
    heroTitle: "同行都在做，你要做得比他们好",
    pains: [
      "产品同质化严重，客户看不出你比别人强在哪",
      "只能拼价格，利润越来越薄",
      "同行网站做得比你好，客户第一眼就被抢走",
      "认证、验厂、产线这些实力，客户根本看不到",
    ],
    plan: [
      {
        title: "把实力摆出来",
        desc: "产线实拍、检测设备、认证资质、验厂素材，做成一个能看的「工厂实力」板块。",
      },
      {
        title: "把差异讲清楚",
        desc: "不是「我们质量好」，而是「我们的公差控制在 ±0.02mm」这类客户听得懂的具体事实。",
      },
      {
        title: "把门面做得比同行好",
        desc: "同行用模板站，你用定制设计。客户第一眼就知道你不一样。",
      },
      {
        title: "把产品库建起来",
        desc: "完整的产品参数库，客户要什么自己找，还能一键下载图册。",
      },
    ],
    deliverables: [
      "品牌化独立站",
      "工厂实力展示板块（产线 / 认证 / 验厂）",
      "产品参数库与电子图册",
      "同行的站是怎么做的——对比分析",
    ],
    productSlugs: ["foreign-trade-website", "multilingual", "ai-marketing"],
    cta: "看看同行的站是怎么做的",
    order: 4,
  },
];

export function getSolution(slug: string): Solution | undefined {
  return solutions.find((s) => s.slug === slug);
}

export function sortedSolutions(): Solution[] {
  return [...solutions].sort((a, b) => a.order - b.order);
}
