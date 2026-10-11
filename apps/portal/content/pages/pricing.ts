/**
 * 价格页文案
 *
 * ⭐ 页面上的文字在这里，**具体档位和金额在 content/pricing.ts**。
 */

export const pricingPage = {
  hero: {
    eyebrow: "明码标价",
    title: "不用来回问，直接看档位",
    desc: "不同意的部分，我们可以聊。先把包含什么、不包含什么讲清楚。",
  },

  website: {
    eyebrow: "主力产品",
    title: "通用版外贸网站",
    desc: "多语言独立站，带后台管理。",
    // 档位内容在 content/pricing.ts 的 websiteTiers
  },

  miniapp: {
    eyebrow: "主力产品",
    title: "门店小程序",
    desc: "点单、预约、会员、卡券一体。",
    // 档位内容在 content/pricing.ts 的 miniappTiers
  },

  extra: {
    eyebrow: "其他产品",
    title: "增值与配套",
    /**
     * ⭐ 这里**不重复写产品名和价格**——它们都来自 content/products.ts。
     *    这里只决定「价格页要展示哪几个产品、按什么顺序」。
     *    所以改产品名或价格，只需要改 content/products.ts 一处。
     *    （slug 必须和 content/products.ts 里的 slug 对得上）
     */
    productSlugs: [
      "digital-card",
      "multilingual",
      "ai-marketing",
      "inquiry-crm",
      "domain-hosting",
    ],
  },

  faq: {
    eyebrow: "关于价格",
    title: "常见问题",
    items: [
      {
        q: "价格是固定的吗？会不会有额外收费？",
        a: "档位价格是固定的，价格页上写多少就是多少。可能有额外费用的只有三类：超出档位范围的功能定制、域名和服务器这类第三方费用、以及你没时间而委托我们代录内容的服务费。这三类都会在下单前写进报价单，不会中途加价。",
      },
      {
        q: "年费包含什么？",
        a: "包含建站、部署、SSL 证书、备案指导、后台培训和维护期内的技术支持。不含域名、服务器、短信等第三方费用，这些按实收，我们不加价。",
      },
      {
        q: "第二年还要交钱吗？",
        a: "要，年费包含持续的技术支持和系统更新。这也是我们能一直管你的原因。",
      },
      {
        q: "能只买一部分吗？",
        a: "可以。先做核心站点，验证有效果再加模块，不用一次投入全部预算。",
      },
    ],
  },

  cta: {
    eyebrow: "想要准确报价？",
    title: "告诉我们你的情况，给你一份报价单",
    desc: "不同行业、不同规模，需要的配置不一样。说清楚需求，报价才准。",
  },
};
