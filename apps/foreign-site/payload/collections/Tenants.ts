import type { CollectionConfig } from "payload";
import { isSuperAdmin } from "../access";

/**
 * 站点（= 客户）
 *
 * 一个客户 = 一个租户 = 一个站点。
 * 绑定的域名指向哪个站点，由中间件按 host 判断（M1 后续实现）。
 */
export const Tenants: CollectionConfig = {
  slug: "tenants",
  labels: { singular: "站点（客户）", plural: "站点（客户）" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "status", "expiresAt"],
    group: "系统",
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "基本信息",
          fields: [
            {
              name: "name",
              type: "text",
              label: "公司全称",
              required: true,
              admin: { description: "例如：Hengxin Precision Tools Co., Ltd." },
            },
            {
              name: "slug",
              type: "text",
              label: "站点标识",
              required: true,
              unique: true,
              index: true,
              admin: {
                description:
                  "英文小写、用减号连接。后台切换站点时显示，也是默认子域名。",
              },
            },
            {
              name: "brand",
              type: "text",
              label: "品牌短名",
              admin: { description: "页头显示的短名，例如 HX TOOLS" },
            },
            {
              name: "tagline",
              type: "text",
              label: "首屏大标题",
            },
            {
              name: "description",
              type: "textarea",
              label: "网站描述（SEO）",
              admin: { description: "搜索引擎结果里显示的那句话" },
            },
            {
              name: "founded",
              type: "number",
              label: "成立年份",
            },
          ],
        },
        {
          label: "域名与状态",
          fields: [
            {
              name: "domains",
              type: "array",
              label: "绑定域名",
              labels: { singular: "域名", plural: "域名" },
              admin: {
                description:
                  "客户自己的域名。填进来后由 Caddy 自动签发 SSL 证书。",
              },
              fields: [
                { name: "domain", type: "text", label: "域名", required: true },
              ],
            },
            {
              name: "status",
              type: "select",
              label: "状态",
              defaultValue: "active",
              options: [
                { label: "试用中", value: "trial" },
                { label: "正常", value: "active" },
                { label: "已到期", value: "expired" },
              ],
            },
            {
              name: "expiresAt",
              type: "date",
              label: "服务到期日",
              admin: { description: "到期前提醒客户续费" },
            },
          ],
        },
        {
          label: "外观",
          fields: [
            {
              name: "logo",
              type: "upload",
              relationTo: "media",
              label: "Logo",
            },
            {
              name: "primaryColor",
              type: "text",
              label: "主色",
              defaultValue: "#1e425f",
              admin: {
                description: "十六进制色值，例如 #1e425f",
              },
            },
          ],
        },
        {
          label: "联系方式",
          fields: [
            { name: "email", type: "email", label: "邮箱" },
            { name: "phone", type: "text", label: "电话" },
            {
              name: "whatsapp",
              type: "text",
              label: "WhatsApp",
              admin: { description: "纯数字带国家码，例如 8613857001234" },
            },
            { name: "address", type: "textarea", label: "地址" },
          ],
        },
        {
          label: "语言",
          fields: [
            {
              name: "defaultLocale",
              type: "select",
              label: "默认语言",
              defaultValue: "en",
              options: [
                { label: "English", value: "en" },
                { label: "中文", value: "zh" },
                { label: "Español", value: "es" },
                { label: "العربية", value: "ar" },
              ],
            },
            {
              name: "enabledLocales",
              type: "select",
              label: "启用的语言",
              hasMany: true,
              defaultValue: ["en"],
              options: [
                { label: "English", value: "en" },
                { label: "中文", value: "zh" },
                { label: "Español", value: "es" },
                { label: "العربية", value: "ar" },
              ],
              admin: {
                description:
                  "第一版只开英文。以后要开小语种，在这里勾选即可。",
              },
            },
          ],
        },
      ],
    },
  ],
  access: {
    // 只有你能建/删站点
    create: isSuperAdmin,
    delete: isSuperAdmin,
    // 登录用户都能读（插件会限制成只有自己能访问的租户）
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
  },
};
