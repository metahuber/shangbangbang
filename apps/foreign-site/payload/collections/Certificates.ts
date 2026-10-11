import type { CollectionConfig } from "payload";

/** 认证资质 */
export const Certificates: CollectionConfig = {
  slug: "certificates",
  labels: { singular: "认证资质", plural: "认证资质" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "issuer", "order"],
    group: "内容",
  },
  defaultSort: "order",
  fields: [
    { name: "name", type: "text", label: "证书名称", required: true },
    { name: "issuer", type: "text", label: "发证机构" },
    { name: "note", type: "text", label: "说明", localized: true },
    { name: "image", type: "upload", relationTo: "media", label: "证书图片" },
    { name: "order", type: "number", label: "排序", defaultValue: 0 },
  ],
};
