import { NextResponse, type NextRequest } from "next/server";
import { resolveSiteSlug, hostFromHeaders } from "@/lib/tenant";

/**
 * 按域名把请求分发到对应客户站点
 *
 * 访客看到的是：  hx-tools.shangbangbang.com/products
 * 内部实际渲染：  /hx-tools/products
 *
 * 这样每个客户的站点依然是**静态生成**的（SEO 和速度都好），
 * 而不是每次请求都现查数据库。
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // ⚠️ 必须用 hostFromHeaders 而不是 req.headers.get("host")：
  //    生产环境 Next 会把 Host 覆盖成自己的监听地址（见 lib/tenant.ts 注释）
  const host = hostFromHeaders((n) => req.headers.get(n));
  const slug = resolveSiteSlug(host);

  /**
   * 这两个响应头是**给你排查问题用的**：
   *   x-site-host  中间件实际拿到的 Host
   *   x-site-slug  解析出来的站点标识
   *
   * 打开的是另一个客户的站点时，用这条命令一眼看出问题：
   *   curl -sI https://客户域名/ | grep x-site
   * Host 正常、slug 不对 → 域名映射表没生成或没重新构建
   */
  const debugHeaders = {
    "x-site-host": host ?? "(none)",
    "x-site-slug": slug,
  };

  // 已经带站点前缀 → 直接放行
  if (pathname === `/${slug}` || pathname.startsWith(`/${slug}/`)) {
    const res = NextResponse.next();
    for (const [k, v] of Object.entries(debugHeaders)) res.headers.set(k, v);
    return res;
  }

  const url = req.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${slug}` : `/${slug}${pathname}`;

  const res = NextResponse.rewrite(url);
  for (const [k, v] of Object.entries(debugHeaders)) res.headers.set(k, v);
  return res;
}

export const config = {
  /**
   * 排除：
   *   _next/*        静态资源
   *   admin*         后台（Payload 自己的路由）
   *   api*           接口（接口内部自己从 Host 解析站点）
   *   带点的路径       robots.txt / sitemap.xml / favicon.ico 等
   */
  matcher: ["/((?!_next|admin|api|.*\\.).*)"],
};
