"use client";

import { useEffect } from "react";

/**
 * Tawk.to 在线聊天
 *
 * 海外买家习惯用网页聊天问询（比填表单门槛低），所以这个要放在前台。
 *
 * 没配环境变量时**完全静默**，不加载任何脚本。
 * 配法：见 deploy/README.md
 *   NEXT_PUBLIC_TAWK_PROPERTY_ID=你的PropertyID
 *   NEXT_PUBLIC_TAWK_WIDGET_ID=你的WidgetID
 *
 * ⚠️ 注意：聊天组件会写 Cookie。严格 GDPR 合规的做法是等访客同意后再加载；
 *    这里选择默认加载，因为它是**联系渠道**（关掉直接影响客户成单）。
 *    如果以后客户有合规要求，把它挪进 CookieConsent 里按同意加载即可。
 */

const PROPERTY_ID = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
const WIDGET_ID = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID;

export default function TawkChat() {
  useEffect(() => {
    if (!PROPERTY_ID || !WIDGET_ID) return;

    const w = window as unknown as Record<string, unknown>;
    if (w.Tawk_API) return;

    w.Tawk_API = w.Tawk_API || {};
    w.Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}`;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.head.appendChild(script);
  }, []);

  return null;
}
