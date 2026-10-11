import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { getTenant } from "@/lib/cms";
import { resolveSiteSlug, hostFromHeaders } from "@/lib/tenant";

/**
 * 询盘接口
 *
 * 前台表单 → 这里做校验 → 用 Payload 的 Local API 写进 inquiries 集合。
 *
 * 为什么不让前台直接写：那样任何人都能灌水，而且拿不到租户上下文。
 * 服务端写入可以：校验、限流、记来源、按租户归档、发通知。
 */
export const dynamic = "force-dynamic";

type Body = {
  name?: string;
  email?: string;
  company?: string;
  country?: string;
  quantity?: string;
  message?: string;
  productSlug?: string;
};

function bad(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return bad("Invalid request");
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || name.length > 60) return bad("Please enter your name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 120) {
    return bad("Please enter a valid business email");
  }
  if (!message || message.length > 2000) return bad("Please enter your message");
  if (!/[a-zA-Z0-9]/.test(message)) {
    return bad("Please describe your requirement");
  }

  try {
    const payload = await getPayload({ config });
    // 这条询盘是发给哪个客户的？由访问的域名决定
    // ⚠️ 用 hostFromHeaders：生产环境 Next 会覆盖 Host（见 lib/tenant.ts）
    const siteSlug = resolveSiteSlug(
      hostFromHeaders((n) => req.headers.get(n)),
    );
    const tenant = await getTenant(siteSlug);
    if (!tenant) return bad("Site is not configured yet", 500);

    // 如果询盘是从某个产品页发起的，关联上那个产品
    let productId: number | undefined;
    const productSlug = String(body.productSlug ?? "").trim();
    if (productSlug) {
      const { docs } = await payload.find({
        collection: "products",
        where: {
          and: [
            { tenant: { equals: tenant.id } },
            { slug: { equals: productSlug } },
          ],
        },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      });
      const found = docs[0] as { id: number } | undefined;
      if (found) productId = Number(found.id);
    }

    const created = await payload.create({
      collection: "inquiries",
      data: {
        name,
        email,
        company: String(body.company ?? "").trim().slice(0, 120) || undefined,
        country: String(body.country ?? "").trim().slice(0, 60) || undefined,
        quantity: String(body.quantity ?? "").trim().slice(0, 120) || undefined,
        message,
        product: productId,
        status: "new",
        tenant: tenant.id,
      },
      overrideAccess: true,
    });

    console.log(
      `[INQUIRY] #${created.id} ${name} <${email}> product=${productSlug || "-"}`,
    );

    // 可选：通知（企业微信机器人 / 飞书）
    // 正式版这里还要发邮件给客户，并在后台显示未读提醒
    const webhook = process.env.INQUIRY_WEBHOOK_URL;
    if (webhook) {
      try {
        await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            msgtype: "text",
            text: {
              content: [
                "【新询盘】",
                `产品：${productSlug || "（未指定）"}`,
                `姓名：${name}`,
                `邮箱：${email}`,
                `公司：${body.company || "-"}`,
                `国家：${body.country || "-"}`,
                `数量/目标价：${body.quantity || "-"}`,
                `留言：${message}`,
              ].join("\n"),
            },
          }),
        });
      } catch (e) {
        console.error("[INQUIRY] webhook 转发失败", e);
      }
    }

    return NextResponse.json({ ok: true, id: created.id });
  } catch (e) {
    console.error("[INQUIRY] 写入失败", e);
    return bad("Could not save your inquiry. Please email us directly.", 500);
  }
}
