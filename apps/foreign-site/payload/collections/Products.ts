import type { CollectionConfig } from "payload";

/**
 * 产品
 *
 * 这是客户在后台最常改的东西，也是询盘的落点。
 */
export const Products: CollectionConfig = {
  slug: "products",
  labels: { singular: "产品", plural: "产品" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "sku", "category", "status", "order"],
    group: "内容",
  },
  defaultSort: "order",
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "name",
          type: "text",
          label: "产品名称",
          required: true,
          localized: true,
          admin: { width: "60%" },
        },
        {
          name: "sku",
          type: "text",
          label: "货号",
          required: true,
          admin: { width: "40%", description: "例如 HX-HW-1001" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "slug",
          type: "text",
          label: "网址标识",
          required: true,
          index: true,
          admin: {
            width: "50%",
            description: "英文小写、用减号连接，会出现在网址里",
          },
        },
        {
          name: "category",
          type: "relationship",
          relationTo: "categories",
          label: "所属分类",
          required: true,
          admin: { width: "50%" },
        },
      ],
    },
    {
      name: "summary",
      type: "textarea",
      label: "一句话卖点",
      required: true,
      localized: true,
      admin: {
        description:
          "列表页和搜索引擎结果里显示的这句话。买家大概只会看这一句。",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "详细介绍",
      localized: true,
      admin: {
        description: "空一行分段。前台会自动渲染成多个段落。",
      },
    },
    {
      name: "features",
      type: "array",
      label: "核心卖点",
      labels: { singular: "卖点", plural: "卖点" },
      admin: { description: "产品页上打勾显示的那几条" },
      fields: [
        { name: "text", type: "text", label: "内容", required: true, localized: true },
      ],
    },
    {
      name: "specs",
      type: "array",
      label: "规格参数",
      labels: { singular: "参数", plural: "参数" },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "label",
              type: "text",
              label: "参数名",
              required: true,
              localized: true,
              admin: { width: "40%" },
            },
            {
              name: "value",
              type: "text",
              label: "参数值",
              required: true,
              localized: true,
              admin: { width: "60%" },
            },
          ],
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "moq",
          type: "text",
          label: "最小起订量",
          localized: true,
          admin: { width: "33%", description: "例如 1,000 pcs" },
        },
        {
          name: "leadTime",
          type: "text",
          label: "交货周期",
          localized: true,
          admin: { width: "33%", description: "例如 25–30 days" },
        },
        {
          name: "order",
          type: "number",
          label: "排序",
          defaultValue: 0,
          admin: { width: "34%", description: "数字越小越靠前" },
        },
      ],
    },
    {
      name: "gallery",
      type: "upload",
      relationTo: "media",
      hasMany: true,
      label: "产品图",
      admin: { description: "第一张作为主图" },
    },
    {
      name: "brochure",
      type: "upload",
      relationTo: "media",
      label: "PDF 图册",
      admin: { description: "买家可以下载的规格书" },
    },
    {
      name: "featured",
      type: "checkbox",
      label: "首页推荐",
      defaultValue: false,
      admin: { description: "勾上会出现在首页的「主推产品」" },
    },
    {
      name: "status",
      type: "select",
      label: "状态",
      defaultValue: "published",
      options: [
        { label: "已发布", value: "published" },
        { label: "草稿（前台不显示）", value: "draft" },
      ],
    },
  ],
};
