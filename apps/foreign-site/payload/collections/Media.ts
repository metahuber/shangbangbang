import path from "path";
import { fileURLToPath } from "url";
import type { CollectionConfig } from "payload";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/**
 * 媒体库
 *
 * 上传的图片会按尺寸自动裁剪，前台按需取用。
 * 正式部署时把 staticDir 换成对象存储（OSS/COS）。
 */
export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "媒体", plural: "媒体库" },
  admin: { group: "内容" },
  upload: {
    staticDir: path.resolve(dirname, "../../public/media"),
    mimeTypes: ["image/*", "application/pdf"],
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre" },
      { name: "card", width: 800, height: 600, position: "centre" },
      { name: "wide", width: 1600, height: 1000, position: "centre" },
    ],
    adminThumbnail: "thumbnail",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "替代文字（ALT）",
      localized: true,
      admin: {
        description:
          "给搜索引擎和读屏软件看的图片说明。SEO 体检会检查这一项有没有填。",
      },
    },
  ],
  access: {
    read: () => true,
  },
};
