/**
 * 生成「域名 → 站点标识」映射表
 *
 * 为什么需要它：
 *   中间件跑在 Edge 运行时，**不能查数据库**。而客户绑自己的域名
 *   （比如 factory-a.com）时，光看域名猜不出是哪个站点，必须有一张表。
 *
 * 什么时候跑：
 *   - npm run dev / build 之前自动跑（见 package.json 的 predev / prebuild）
 *   - 后台加了新客户或改了域名后手动跑：npm run domains
 *
 * ⚠️⚠️ 这个脚本**绝不能以非 0 退出**：
 *   它是 prebuild 钩子，一旦抛错，整个 Docker 镜像构建就中断了。
 *   而「第一次上线」时数据库还没跑迁移 —— 连不上是**正常**的。
 *   所以这里必须软着陆：打警告、沿用已有的映射表、照常继续构建。
 */

import { getPayload } from "payload";
import config from "../payload.config";
import { writeDomainMap } from "./lib/domain-map";

try {
  const payload = await getPayload({ config });
  const map = await writeDomainMap(payload);

  const count = Object.keys(map).length;
  if (count === 0) {
    console.warn(
      "⚠️  数据库里还没有任何站点，域名映射为空。构建会继续。",
    );
  } else {
    console.log(`✓ 域名映射已生成：${count} 条 → lib/domains.generated.json`);
    for (const [host, slug] of Object.entries(map)) {
      console.log(`    ${host}  →  ${slug}`);
    }
  }
} catch (err) {
  console.warn("");
  console.warn("⚠️  连不上数据库，本次跳过域名映射生成（构建会继续）。");
  console.warn("    如果你正在第一次上线，这是正常的：数据库还没跑迁移、还没灌数据。");
  console.warn("    数据库就绪之后，重新构建一次即可：docker compose build site");
  console.warn("    本次沿用已有的 lib/domains.generated.json（可能是旧的或空的）。");
  console.warn(
    `    原因：${err instanceof Error ? err.message : String(err)}`,
  );
  console.warn("");
}

// 无论成败都正常退出，避免打断 prebuild / Docker 构建
process.exit(0);
