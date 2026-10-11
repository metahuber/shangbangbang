import type { CollectionConfig } from "payload";

/**
 * 站点设置（每个租户一份）
 *
 * isGlobal: true 是 multi-tenant 插件的能力：每个客户只有一份，
 * 在后台就像一个「设置页」而不是一个列表。
 *
 * 这里放的是首页/关于页上那些「一组一组」的内容。
 */
export const SiteSettings: CollectionConfig = {
  slug: "site-settings",
  labels: { singular: "站点设置", plural: "站点设置" },
  admin: {
    group: "内容",
    description: "首页和工厂实力页上的成组内容",
  },
  fields: [
    {
      name: "paymentTerms",
      type: "array",
      label: "收款方式",
      labels: { singular: "方式", plural: "收款方式" },
      admin: {
        description:
          "⚠️ 很重要：买家在决定联系你之前，会先看你怎么收款。写清楚（T/T、L/C、PayPal）本身就是信任信号；写「只接受私下转账」会直接吓跑人。",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "method",
              type: "text",
              label: "方式",
              required: true,
              admin: { width: "30%", description: "例如 T/T、L/C、PayPal" },
            },
            {
              name: "detail",
              type: "text",
              label: "说明",
              required: true,
              localized: true,
              admin: {
                width: "70%",
                description: "例如 30% deposit, 70% against B/L copy",
              },
            },
          ],
        },
      ],
    },
    {
      name: "heroPoints",
      type: "array",
      label: "首屏要点",
      labels: { singular: "要点", plural: "首屏要点" },
      admin: {
        description: "首页最上面那三条打勾的短句。每个客户写自己的。",
      },
      fields: [
        {
          name: "text",
          type: "text",
          label: "内容",
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: "stats",
      type: "array",
      label: "数据条",
      labels: { singular: "数据", plural: "数据条" },
      admin: { description: "首页顶部那四个数字，例如「18 年 / 260 人」" },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "value",
              type: "text",
              label: "数字",
              required: true,
              admin: { width: "40%" },
            },
            {
              name: "label",
              type: "text",
              label: "说明",
              required: true,
              localized: true,
              admin: { width: "60%" },
            },
          ],
        },
      ],
    },
    {
      name: "capabilities",
      type: "array",
      label: "生产能力",
      labels: { singular: "环节", plural: "生产能力" },
      admin: { description: "工厂实力页的工序段落" },
      fields: [
        {
          name: "name",
          type: "text",
          label: "环节名称",
          required: true,
          localized: true,
        },
        { name: "desc", type: "textarea", label: "说明", localized: true },
        { name: "image", type: "upload", relationTo: "media", label: "配图" },
      ],
    },
    {
      name: "whyUs",
      type: "array",
      label: "为什么选我们",
      labels: { singular: "理由", plural: "为什么选我们" },
      fields: [
        {
          name: "title",
          type: "text",
          label: "标题",
          required: true,
          localized: true,
        },
        { name: "desc", type: "textarea", label: "说明", localized: true },
      ],
    },
    {
      name: "faqs",
      type: "array",
      label: "常见问题",
      labels: { singular: "问题", plural: "常见问题" },
      admin: { description: "前台会自动生成 FAQ 结构化数据，对 SEO 有用" },
      fields: [
        {
          name: "q",
          type: "text",
          label: "问题",
          required: true,
          localized: true,
        },
        { name: "a", type: "textarea", label: "回答", required: true, localized: true },
      ],
    },
  ],
};
