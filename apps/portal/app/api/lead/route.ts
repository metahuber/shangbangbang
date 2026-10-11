import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * 留资接口
 *
 * 当前实现：落盘到 data/leads.jsonl + 控制台日志。
 * ⚠️ 上线前必须替换为可靠通道（任选其一）：
 *   1) 写入数据库（推荐：后续做多租户 SaaS 时顺手就有库）
 *   2) 调用企业微信机器人 / 邮件服务 API（LEAD_WEBHOOK_URL 环境变量）
 *   3) 写入飞书多维表格
 *
 * 注意：如果部署在 Serverless 平台，本地文件不持久，必须换成上面任一方案。
 */

type Lead = {
  name: string;
  contact: string;
  interest: string;
  note?: string;
  at: string;
  ip?: string;
  ua?: string;
};

function bad(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(req: Request) {
  let body: Partial<Lead>;
  try {
    body = (await req.json()) as Partial<Lead>;
  } catch {
    return bad("请求格式不正确");
  }

  const name = String(body.name ?? "").trim();
  const contact = String(body.contact ?? "").trim();
  const interest = String(body.interest ?? "").trim();
  const note = String(body.note ?? "").trim();

  if (!name || name.length > 40) return bad("请填写称呼");
  if (!contact || contact.length > 60) return bad("请填写手机号或微信号");
  if (!interest || interest.length > 60) return bad("请选择想做的产品");

  // 最基础的防灌水：联系方式里必须有数字或邮箱特征
  if (!/[0-9@]/.test(contact)) return bad("联系方式看起来不太对，请检查一下");

  const lead: Lead = {
    name,
    contact,
    interest,
    note: note.slice(0, 500),
    at: new Date().toISOString(),
    ip: req.headers.get("x-forwarded-for") ?? undefined,
    ua: req.headers.get("user-agent") ?? undefined,
  };

  // 1) 控制台日志——部署后可在平台日志里看到，保证不丢
  console.log("[LEAD]", JSON.stringify(lead));

  // 2) 可选：转发到 webhook（企业微信机器人 / 飞书 / 自建接口）
  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          msgtype: "text",
          text: {
            content: `【商帮帮新线索】\n称呼：${lead.name}\n联系方式：${lead.contact}\n想做：${lead.interest}\n补充：${lead.note || "（无）"}\n时间：${lead.at}`,
          },
        }),
      });
    } catch (e) {
      console.error("[LEAD] webhook 转发失败", e);
    }
  }

  // 3) 落盘备份（Serverless 环境无效，仅本地/自有服务器可用）
  try {
    const dir = path.join(process.cwd(), "data");
    await fs.mkdir(dir, { recursive: true });
    await fs.appendFile(
      path.join(dir, "leads.jsonl"),
      JSON.stringify(lead) + "\n",
      "utf8",
    );
  } catch (e) {
    console.error("[LEAD] 落盘失败（不影响本次提交）", e);
  }

  return NextResponse.json({ ok: true });
}
