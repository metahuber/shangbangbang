import path from "path";
import type { CollectionConfig } from "payload";

/**
 * ⚠️ 媒体目录必须用 process.cwd() 算，**不能用 import.meta.url**。
 *
 * 原因：打包成 standalone 之后，这个模块会被塞进 .next/server/chunks/，
 *       import.meta.url 指向那里，`../../public/media` 就算歪了 ——
 *       后台传的图会存到一个奇怪的目录，容器一重建就丢。
 *       process.cwd() 在容器里是 /app，正好对上 compose 挂的卷 /app/public/media。
 */
const MEDIA_DIR =
  process.env.MEDIA_DIR || path.resolve(process.cwd(), "public/media");

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
    staticDir: MEDIA_DIR,
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
