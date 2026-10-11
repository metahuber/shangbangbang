/**
 * 案例数据层
 *
 * ⚠️ 重要原则：没有真实客户时用「样板案例」并明确标注，
 *    不要编造客户名和假数据。信任做起来慢，崩起来只要一次。
 *
 * 有真实案例后：把 isSample 改成 false，替换真实客户名与数据。
 */

export type Case = {
  slug: string;
  /** 客户名称。样板案例用「某 XX 厂」 */
  client: string;
  industry: string;
  location: string;
  /** 一句话：他原来的问题 */
  problem: string;
  /** 一句话：我们做了什么 */
  solution: string;
  /** 结果数据 */
  metrics: { value: string; label: string }[];
  /** 客户原话 */
  quote?: string;
  /** 用到的产品 slug */
  productSlugs: string[];
  /** true = 样板案例（非真实客户），页面会显示标注 */
  isSample: boolean;
  order: number;
};

export const cases: Case[] = [
  {
    slug: "hardware-export",
    client: "某五金工具出口厂",
    industry: "外贸工厂",
    location: "浙江",
    problem: "原来只靠国际站，询盘成本一年比一年高，客户还总问「你们有官网吗」。",
    solution:
      "做了英文独立站 + 产品参数库 + PDF 图册下载，配好搜索引擎收录和询盘表单。",
    metrics: [
      { value: "样板", label: "案例类型" },
      { value: "3 个月", label: "上线周期" },
      { value: "—", label: "自然询盘" },
    ],
    quote: "【待替换为真实客户原话】",
    productSlugs: ["foreign-trade-website", "multilingual"],
    isSample: true,
    order: 1,
  },
  {
    slug: "local-restaurant",
    client: "某连锁餐饮门店",
    industry: "本地商铺",
    location: "本地",
    problem: "平台抽佣高，到店客户留不下，做活动只会打折。",
    solution: "门店小程序 + 扫码吸粉 + 会员储值 + 优惠券，把到店客户接进自己的池子。",
    metrics: [
      { value: "样板", label: "案例类型" },
      { value: "7 天", label: "上线周期" },
      { value: "—", label: "会员增长" },
    ],
    productSlugs: ["shop-miniapp", "ai-marketing"],
    isSample: true,
    order: 2,
  },
  {
    slug: "industry-belt-factory",
    client: "某产业带制造厂",
    industry: "产业带工厂",
    location: "产业带",
    problem: "产品同质化严重，只能拼价格，客户看不出比同行强在哪。",
    solution: "品牌化独立站 + 工厂实力板块（产线、检测、认证、验厂素材）+ 差异化产品呈现。",
    metrics: [
      { value: "样板", label: "案例类型" },
      { value: "—", label: "交付周期" },
      { value: "—", label: "询盘质量" },
    ],
    productSlugs: ["foreign-trade-website", "ai-marketing"],
    isSample: true,
    order: 3,
  },
];

export function sortedCases(): Case[] {
  return [...cases].sort((a, b) => a.order - b.order);
}

export function getCase(slug: string): Case | undefined {
  return cases.find((c) => c.slug === slug);
}
