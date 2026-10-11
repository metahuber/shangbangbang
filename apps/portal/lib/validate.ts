/**
 * 内容校验
 *
 * 作用：自动扫描 content/ 里所有内容，找出「还没填」的地方。
 *
 * 什么时候会跑：
 *   1. 开发模式（npm run dev）→ 页面左下角出现一个提示条
 *   2. 构建时（npm run build）   → 终端里打印一份待办清单
 *
 * ⚠️ 这个文件是代码，一般不用改。要改内容请去 content/ 目录。
 */

import { existsSync, writeFileSync } from "node:fs";
import path from "node:path";

import { site } from "@/content/site";
import { products } from "@/content/products";
import { solutions } from "@/content/solutions";
import { cases } from "@/content/cases";
import { faqs } from "@/content/faqs";
import {
  websiteTiers,
  miniappTiers,
  processSteps,
  priceNotes,
} from "@/content/pricing";
import { home } from "@/content/pages/home";
import { about } from "@/content/pages/about";
import { contact } from "@/content/pages/contact";
import { pricingPage } from "@/content/pages/pricing";
import { privacy, terms } from "@/content/pages/legal";

export type Issue = {
  /** 去哪改，例如「站点设置 → 电话」 */
  where: string;
  /** 还缺什么 */
  what: string;
};

/** 出现这些字眼，就认为内容还没填完 */
const PENDING_MARKERS = ["待填写", "待补充", "待上传", "待替换", "待定", "【"];

const SKIP_KEYS = /^draft/;

function looksPending(value: string): boolean {
  return PENDING_MARKERS.some((m) => value.includes(m));
}

/** 数组项的可读名字 */
function labelOf(item: unknown, index: number): string {
  if (item && typeof item === "object") {
    const o = item as Record<string, unknown>;
    for (const k of ["name", "title", "label", "client", "q"]) {
      if (typeof o[k] === "string") return o[k] as string;
    }
  }
  return `#${index + 1}`;
}

function walk(node: unknown, path: string[], out: Issue[]) {
  if (typeof node === "string") {
    if (looksPending(node)) {
      out.push({
        where: path.join(" → ") || "（根）",
        what: node.length > 46 ? node.slice(0, 46) + "…" : node,
      });
    }
    return;
  }

  if (Array.isArray(node)) {
    node.forEach((item, i) => walk(item, [...path, labelOf(item, i)], out));
    return;
  }

  if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if (SKIP_KEYS.test(key)) continue;
      walk(value, [...path, key], out);
    }
  }
}

export function collectIssues(): Issue[] {
  const issues: Issue[] = [];

  // ── 1. 站点设置：用更友好的名字单独报，不用点号路径 ──
  const siteFields: [string, string][] = [
    ["companyName", "公司全称"],
    ["icp", "ICP 备案号"],
    ["police", "公安联网备案号"],
    ["phone", "联系电话"],
    ["email", "联系邮箱"],
  ];
  for (const [key, label] of siteFields) {
    const value = (site as unknown as Record<string, string>)[key];
    if (typeof value === "string" && looksPending(value)) {
      issues.push({ where: `站点设置 → ${label}`, what: "还没填" });
    }
  }

  // ── 2. 关于我们：草稿状态单独提醒 ──
  if (about.why.draftMode) {
    issues.push({
      where: "关于我们 → 为什么做商帮帮",
      what: "还是草稿状态，写好后把 draftMode 改成 false",
    });
  }
  if (about.team.draftMode) {
    issues.push({
      where: "关于我们 → 团队介绍",
      what: "还是草稿状态，写好后把 draftMode 改成 false",
    });
  }

  // ── 3. 法律文本：审核状态单独提醒 ──
  if (!privacy.reviewed) {
    issues.push({
      where: "隐私政策",
      what: "还是初稿，审核通过后把 reviewed 改成 true",
    });
  }
  if (!terms.reviewed) {
    issues.push({
      where: "服务条款",
      what: "还是初稿，审核通过后把 reviewed 改成 true",
    });
  }

  // ── 4. 案例：还是样板案例 ──
  for (const c of cases) {
    if (c.isSample) {
      issues.push({
        where: `客户案例 → ${c.client}`,
        what: "还是样板案例，有真实客户后把 isSample 改成 false",
      });
    }
  }

  // ── 5. 通用扫描：所有含「待定 / 待填写 / 【」的文字 ──
  const roots: { label: string; data: unknown }[] = [
    // 站点设置已在上面的第 1 步单独处理，这里不重复扫描
    { label: "产品", data: products },
    { label: "解决方案", data: solutions },
    { label: "价格", data: [...websiteTiers, ...miniappTiers] },
    { label: "价格说明", data: priceNotes },
    { label: "交付流程", data: processSteps },
    { label: "常见问题", data: faqs },
    { label: "首页", data: home },
    { label: "关于我们", data: about },
    { label: "联系我们", data: contact },
    { label: "价格页", data: pricingPage },
    { label: "隐私政策", data: privacy },
    { label: "服务条款", data: terms },
  ];
  for (const r of roots) walk(r.data, [r.label], issues);

  // 去重（同一处可能被多轮扫到）
  const seen = new Set<string>();
  return issues.filter((i) => {
    const key = `${i.where}|${i.what}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function formatReport(issues: Issue[]): string {
  if (issues.length === 0) return "✅ 内容检查通过，没有待填项。";
  const lines = [
    `⚠️  还有 ${issues.length} 处内容没填完：`,
    "",
    ...issues.map((i, n) => `  ${String(n + 1).padStart(2)}. ${i.where} —— ${i.what}`),
  ];
  return lines.join("\n");
}

/** 一次构建/一次启动里只打印一次（Next 会多次加载模块、也会起多个进程） */
export function reportToConsoleOnce() {
  const isBuild = process.env.NODE_ENV === "production";

  if (isBuild) {
    // 构建时用标记文件去重：Next 会起多个 worker 线程，globalThis 不共享，
    // 只能靠文件判断"这次构建已经打印过了"。
    // 标记文件由 package.json 的 prebuild 在每次构建前删除。
    try {
      const marker = path.join(process.cwd(), ".content-report-done");
      if (existsSync(marker)) return;
      writeFileSync(marker, new Date().toISOString(), "utf8");
    } catch {
      // 拿不到标记文件就退回进程内去重
    }
  }

  const g = globalThis as unknown as { __SB_CONTENT_REPORTED__?: boolean };
  if (g.__SB_CONTENT_REPORTED__) return;
  g.__SB_CONTENT_REPORTED__ = true;

  const issues = collectIssues();
  // eslint-disable-next-line no-console
  console.log("\n" + formatReport(issues) + "\n");
}
