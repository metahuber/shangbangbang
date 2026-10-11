import type { CollectionConfig } from "payload";

/** 产品分类 */
export const Categories: CollectionConfig = {
  slug: "categories",
  labels: { singular: "产品分类", plural: "产品分类" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "order"],
    group: "内容",
  },
  defaultSort: "order",
  fields: [
    {
      name: "name",
      type: "text",
      label: "分类名称",
      required: true,
      localized: true,
    },
    {
      name: "slug",
      type: "text",
      label: "网址标识",
      required: true,
      index: true,
      admin: {
        description: "英文小写、用减号连接，会出现在网址里，例如 hand-tools",
      },
    },
    {
      name: "summary",
      type: "textarea",
      label: "一句话介绍",
      localized: true,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "分类图片",
    },
    {
      name: "order",
      type: "number",
      label: "排序",
      defaultValue: 0,
      admin: { description: "数字越小越靠前" },
    },
  ],
};
