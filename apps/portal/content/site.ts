/**
 * 全站基础配置
 *
 * ⚠️ 凡是标记 TBD 的字段都是占位，等公司主体与联系方式确定后替换。
 *    替换点集中在这里，不需要改页面代码。
 */

export const TBD = "待填写";

export const site = {
  name: "商帮帮",
  nameEn: "Shangbangbang",
  domain: "shangbangbang.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://shangbangbang.com",

  /** 一句话定位 */
  tagline: "工厂做外贸，商铺做私域。",
  /** 品牌口号 */
  slogan: "你懂生意，技术交给我们。",
  description:
    "商帮帮为外贸工厂和本地商铺做官网、小程序和获客工具。你把生意讲清楚，剩下的我们搭好、教你用、后面一直管。",

  /** TBD：公司主体信息（执照下来后替换） */
  companyName: TBD,
  /** TBD：ICP 备案号（备案通过后替换） */
  icp: TBD,
  /** TBD：公安联网备案号 */
  police: TBD,

  /** TBD：联系方式 */
  phone: "13412482580",
  email: "1025274058@qq.com",
  wechatQr: "/images/wechat-qr.png",

  /**
   * 信任条数据。
   * ⚠️ 还没有真实客户时，用「我们确实做得到的事实」，不要编客户数量。
   *    有真实案例后再把客户数、站点数换上去。
   */
  stats: [
    { value: "3–15 天", label: "标准产品交付周期" },
    { value: "6 步", label: "交付流程，每步都有交付物" },
    { value: "免费", label: "需求评估与初步方案" },
  ],
} as const;

/** 主 CTA 文案，全站统一 */
export const CTA = {
  primary: "免费获取方案",
  secondary: "看看我们做过什么",
  product: "让顾问帮我评估",
  pricing: "这档适合我吗？",
} as const;

/** ⛔ 禁用词清单——文案评审时对照检查 */
export const BANNED_WORDS = [
  "赋能",
  "闭环",
  "生态",
  "数字化转型",
  "一站式解决方案",
  "私域流量池",
  "全链路",
  "抓手",
  "颗粒度",
  "打法",
] as const;
