import type { CollectionConfig } from "payload";

/**
 * 询盘
 *
 * ⭐ 这是整个产品最重要的集合。
 *    老板付年费的理由不是「我有个网站」，而是「询盘一条都没丢，还知道谁在跟」。
 *
 * 前台不能直接写这个集合（会灌水），一律走服务端的 /api/inquiry，
 * 在那里做校验后再用 Local API 写入。
 */
export const Inquiries: CollectionConfig = {
  slug: "inquiries",
  labels: { singular: "询盘", plural: "询盘" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "country", "product", "status", "createdAt"],
    group: "询盘",
    description: "客户从网站发来的询盘",
  },
  defaultSort: "-createdAt",
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", label: "姓名", required: true, admin: { width: "33%" } },
        { name: "email", type: "email", label: "邮箱", required: true, admin: { width: "33%" } },
        { name: "country", type: "text", label: "国家", admin: { width: "34%" } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "company", type: "text", label: "公司", admin: { width: "33%" } },
        { name: "quantity", type: "text", label: "数量 / 目标价", admin: { width: "33%" } },
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          label: "咨询的产品",
          admin: { width: "34%" },
        },
      ],
    },
    {
      name: "message",
      type: "textarea",
      label: "留言",
      required: true,
    },
    {
      type: "row",
      fields: [
        {
          name: "status",
          type: "select",
          label: "跟进状态",
          defaultValue: "new",
          admin: { width: "50%" },
          options: [
            { label: "🆕 新询盘", value: "new" },
            { label: "📞 跟进中", value: "following" },
            { label: "💰 已报价", value: "quoted" },
            { label: "✅ 已成交", value: "won" },
            { label: "🚫 无效", value: "lost" },
          ],
        },
        {
          name: "assignee",
          type: "text",
          label: "跟进人",
          admin: { width: "50%" },
        },
      ],
    },
    {
      name: "notes",
      type: "array",
      label: "跟进记录",
      labels: { singular: "记录", plural: "跟进记录" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "at", type: "date", label: "时间", admin: { width: "30%" } },
            { name: "by", type: "text", label: "跟进人", admin: { width: "30%" } },
            { name: "nextAt", type: "date", label: "下次联系", admin: { width: "40%" } },
          ],
        },
        { name: "content", type: "textarea", label: "内容", required: true },
      ],
    },
  ],
  access: {
    // 前台不能直接读写；服务端走 Local API（overrideAccess）
    create: ({ req: { user } }) => Boolean(user),
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
};
