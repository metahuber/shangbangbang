/**
 * 生成「域名 → 站点标识」映射表（供中间件使用）
 *
 * 抽成函数是为了让 gen-domains 和 new-site 共用同一套逻辑。
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT_FILE = path.resolve(here, "../../lib/domains.generated.json");

export const ROOT_DOMAIN =
  process.env.NEXT_PUBLIC_ROOT_DOMAIN || "shangbangbang.com";

function normalizeDomain(raw: unknown): string {
  return String(raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/:\d+$/, "");
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function writeDomainMap(payload: any): Promise<Record<string, string>> {
  const { docs } = await payload.find({
    collection: "tenants",
    limit: 500,
    depth: 0,
    overrideAccess: true,
  });

  const map: Record<string, string> = {};

  for (const t of docs as Array<Record<string, unknown>>) {
    const slug = String(t.slug ?? "")
      .trim()
      .toLowerCase();
    if (!slug) continue;

    // 1) 每个租户默认拥有的子域名：客户名.shangbangbang.com
    map[`${slug}.${ROOT_DOMAIN}`] = slug;

    // 2) 客户在后台填的自定义域名
    const domains = Array.isArray(t.domains) ? t.domains : [];
    for (const d of domains) {
      const host = normalizeDomain((d as Record<string, unknown>)?.domain);
      if (!host) continue;
      map[host] = slug;
      if (!host.startsWith("www.")) {
        map[`www.${host}`] = slug;
      }
    }
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify(map, null, 2) + "\n", "utf8");
  return map;
}
