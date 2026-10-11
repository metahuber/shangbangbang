"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Cookie 同意条 + GA4 接入
 *
 * 为什么把两件事放在一个组件里：
 *   GDPR 要求**分析类 Cookie 必须事先征得同意**。
 *   所以 GA4 不能在页面加载时就加载 —— 必须等访客点了 Accept。
 *   放在一起，就不会出现"忘了加判断、GA 提前加载"这种事。
 *
 * 没配 NEXT_PUBLIC_GA_ID 时：只显示同意条，不加载任何统计脚本。
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const STORAGE_KEY = "sbb-cookie-consent";

function loadGA(id: string) {
  if (document.getElementById("sbb-ga")) return;

  const tag = document.createElement("script");
  tag.id = "sbb-ga";
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(tag);

  const init = document.createElement("script");
  init.id = "sbb-ga-init";
  init.text = [
    "window.dataLayer=window.dataLayer||[];",
    "function gtag(){dataLayer.push(arguments);}",
    "gtag('js',new Date());",
    `gtag('config','${id}',{anonymize_ip:true});`,
  ].join("");
  document.head.appendChild(init);
}

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  /** null = 访客已经选过了；"pending" = 还没选 */
  const [decision, setDecision] = useState<string | null>("pending");

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    setDecision(saved);
    if (saved === "accepted" && GA_ID) loadGA(GA_ID);
  }, []);

  function decide(value: "accepted" | "declined") {
    localStorage.setItem(STORAGE_KEY, value);
    setDecision(value);
    if (value === "accepted" && GA_ID) loadGA(GA_ID);
  }

  // 服务端渲染和"已经选过"的情况都不显示
  if (!mounted || decision !== null) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/98 shadow-2xl backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-slate-600">
          We use essential cookies to run this site, and analytics cookies to
          understand how it is used. You can decline analytics and the site will
          work exactly the same.{" "}
          <Link
            href="/privacy"
            className="font-medium text-brand-700 underline underline-offset-2 hover:text-brand-800"
          >
            Privacy Policy
          </Link>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => decide("declined")}
            className="rounded border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="rounded bg-accent-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-accent-600"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
