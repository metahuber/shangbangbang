import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { multiTenantPlugin } from "@payloadcms/plugin-multi-tenant";
import { en } from "@payloadcms/translations/languages/en";
import { zh } from "@payloadcms/translations/languages/zh";
import sharp from "sharp";

import { Users } from "./payload/collections/Users";
import { Tenants } from "./payload/collections/Tenants";
import { Media } from "./payload/collections/Media";
import { Categories } from "./payload/collections/Categories";
import { Products } from "./payload/collections/Products";
import { Certificates } from "./payload/collections/Certificates";
import { Inquiries } from "./payload/collections/Inquiries";
import { SiteSettings } from "./payload/collections/SiteSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/**
 * 商帮帮 · 通用版外贸网站 —— 后台配置
 *
 * 这里声明「有哪些集合、每个集合有哪些字段」，
 * Payload 会自动生成整个后台管理界面。
 */
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: " · 商帮帮外贸站",
    },
    components: {},
  },

  // 后台界面语言：中文优先，可切英文
  i18n: {
    fallbackLanguage: "zh",
    supportedLanguages: { zh, en },
  },

  collections: [
    Tenants,
    Users,
    Media,
    Categories,
    Products,
    Certificates,
    Inquiries,
    SiteSettings,
  ],

  editor: lexicalEditor(),

  // ⚠️ 生产环境必须换成复杂随机串（环境变量 PAYLOAD_SECRET）
  secret:
    process.env.PAYLOAD_SECRET ||
    "dev-only-secret-change-me-before-production-please",

  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },

  /**
   * 数据库适配器按 DATABASE_URL 自动选择：
   *   本地开发 → SQLite（零配置，一个文件）
   *   生产部署 → PostgreSQL（compose 里的 db 服务）
   *
   * ⚠️ 关于 push: true —— 这是**过渡方案**，用之前要知道代价：
   *    好处：第一次上线不用折腾迁移文件，容器起来表就自动建好。
   *    风险：以后表结构改了、库里又有真实客户数据时，push 可能**改动甚至删列**。
   *    所以：**一旦有真实客户数据，就必须改成正规迁移**（payload migrate），
   *          把这里换成 push: false 并提交迁移文件。
   */
  db: (process.env.DATABASE_URL || "").startsWith("postgres")
    ? postgresAdapter({
        pool: { connectionString: process.env.DATABASE_URL },
        push: true,
      })
    : sqliteAdapter({
        client: {
          url: process.env.DATABASE_URL || "file:./payload.db",
        },
      }),

  // 图片裁剪 / 缩略图
  sharp,

  // 多语言：第一版只开英文。
  // 以后要开小语种，在这里加一条即可，字段已经有 localized 标记。
  localization: {
    locales: [{ code: "en", label: "English" }],
    defaultLocale: "en",
    fallback: true,
  },

  plugins: [
    multiTenantPlugin({
      // 这些集合会自动获得一个 tenant 字段，并按租户隔离数据
      collections: {
        media: {},
        categories: {},
        products: {},
        certificates: {},
        inquiries: {},
        // 每个租户一份的「设置页」
        "site-settings": { isGlobal: true },
      },
      tenantsSlug: "tenants",
      // 你是超级管理员，能看所有客户的站点
      userHasAccessToAllTenants: (user) =>
        Boolean(
          user && (user as { roles?: string[] }).roles?.includes("super-admin"),
        ),
    }),
  ],
});
