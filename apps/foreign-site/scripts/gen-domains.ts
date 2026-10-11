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
 */

import { getPayload } from "payload";
import config from "../payload.config";
import { writeDomainMap } from "./lib/domain-map";

const payload = await getPayload({ config });
const map = await writeDomainMap(payload);

const count = Object.keys(map).length;
console.log(`✓ 域名映射已生成：${count} 条 → lib/domains.generated.json`);
for (const [host, slug] of Object.entries(map)) {
  console.log(`    ${host}  →  ${slug}`);
}

process.exit(0);
