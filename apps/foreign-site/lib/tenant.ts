/**
 * 租户解析（纯函数，不依赖数据库）
 *
 * 中间件跑在 Edge 运行时，不能连数据库，所以这里只做「从现在访问的域名
 * 推出站点标识」这件事。真正的租户数据在 cms.ts 里按标识去查。
 *
 * 规则：
 *   hx-tools.shangbangbang.com   → hx-tools
 *   shangbangbang.com            → 默认站点
 *   www.shangbangbang.com        → 默认站点
 *   localhost / 127.0.0.1        → 默认站点（本地开发）
 *   其他域名（客户自己的域名）    → 暂时回退到默认站点
 *                                   （下一步做「域名 → 站点」映射表）
 */

import domainMap from "./domains.generated.json";

/**
 * 域名 → 站点标识 的映射表
 *
 * 由 `scripts/gen-domains.ts` 在 dev/build 之前自动生成
 * （中间件是 Edge 运行时，不能查数据库，所以只能靠这张表）。
 */
const DOMAIN_MAP = domainMap as Record<string, string>;

export const ROOT_DOMAIN =
  process.env.NEXT_PUBLIC_ROOT_DOMAIN || "shangbangbang.com";

/**
 * 取出「访客实际访问的域名」
 *
 * ⚠️⚠️ 这里有个**只在生产环境才会踩的坑**：
 *
 *   Next.js 的 dev 服务器会把客户端的 Host 头原样传给中间件；
 *   但 **production 服务器（next start / standalone）会把 Host 覆盖成自己的监听地址**
 *   （例如 localhost:3000），中间件拿不到访客真正访问的域名。
 *
 *   如果不处理，后果是：**所有客户域名都会打开同一个（默认）站点。**
 *   开发时完全看不出来，一上线就炸。
 *
 *   解决办法：优先读 `x-forwarded-host`。反向代理（Caddy/Nginx）会带上它，
 *   而 Caddy 配置里我们显式写了 `header_up X-Forwarded-Host {host}`。
 */
export function hostFromHeaders(
  get: (name: string) => string | null | undefined,
): string {
  const first = (v: string | null | undefined): string | null => {
    const s = v?.split(",")[0]?.trim();
    return s ? s : null;
  };
  return first(get("x-forwarded-host")) ?? first(get("host")) ?? "";
}

export const DEFAULT_SITE = process.env.DEFAULT_SITE || "hengxin-tools";

/** 本地开发时用 *.localhost 模拟客户子域名 */
const LOCAL_ROOT = "localhost";

/** 这些子域名不当作客户站点 */
const RESERVED_SUBDOMAINS = new Set([
  "www",
  "admin",
  "api",
  "app",
  "cdn",
  "static",
  "mail",
]);

/** 从 "子域名.根域名" 里取出子域名；不匹配则返回 null */
function subdomainOf(hostname: string, root: string): string | null {
  if (!hostname.endsWith(`.${root}`)) return null;
  const sub = hostname.slice(0, -(root.length + 1));
  if (!sub || sub.includes(".") || RESERVED_SUBDOMAINS.has(sub)) return null;
  return sub;
}

export function resolveSiteSlug(host: string | null | undefined): string {
  const hostname = (host ?? "").split(":")[0].trim().toLowerCase();

  if (!hostname || hostname === "127.0.0.1" || hostname === "0.0.0.0") {
    return DEFAULT_SITE;
  }

  // 本地开发：ruitai-machinery.localhost → ruitai-machinery
  const localSub = subdomainOf(hostname, LOCAL_ROOT);
  if (localSub) return localSub;
  if (hostname === LOCAL_ROOT) return DEFAULT_SITE;

  if (hostname === ROOT_DOMAIN || hostname === `www.${ROOT_DOMAIN}`) {
    return DEFAULT_SITE;
  }

  // 正式环境：ruitai-machinery.shangbangbang.com → ruitai-machinery
  const sub = subdomainOf(hostname, ROOT_DOMAIN);
  if (sub) return sub;

  // 客户绑定的自定义域名（factory-a.com / www.factory-a.com）
  // 查构建前生成的映射表
  const mapped = DOMAIN_MAP[hostname];
  if (mapped) return mapped;

  // 完全没配过的域名 → 回退到默认站点
  // ⚠️ 这就是 README 里提到的风险：陌生域名会打开某个客户的网站。
  //    部署时建议在 Caddy 里加兜底响应（见 deploy/Caddyfile 第 5 段）
  return DEFAULT_SITE;
}
