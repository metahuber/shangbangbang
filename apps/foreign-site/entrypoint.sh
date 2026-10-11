#!/bin/sh
# =============================================================================
# 容器启动脚本
#
#   1. 可选：等数据库就绪并跑 Payload 迁移（RUN_MIGRATIONS=true 时）
#   2. 启动 Next.js（standalone 的 server.js）
#
# 为什么需要它：生产环境**不能**用开发模式的 schema push，必须跑 migrate；
# 而迁移需要 TS 源码和完整 node_modules，跑不到 standalone 产物里，
# 所以这里 cd /app/full 用 Payload 命令行执行。
#
# 不做的事：不跑 seed.ts（它会清空 products / inquiries 等已有数据，
# 只能人工在有需要时执行，命令见 deploy/README.md）。
# =============================================================================
set -e

if [ "${RUN_MIGRATIONS}" = "true" ]; then
  echo "[entrypoint] RUN_MIGRATIONS=true，开始等数据库…"

  # 等 Postgres 能接受连接。最多等 60 次 * 2 秒 = 120 秒。
  i=0
  until node -e "
    const net = require('net');
    const url = new URL(process.env.DATABASE_URL);
    const s = net.connect(Number(url.port || 5432), url.hostname);
    s.on('connect', () => { s.end(); process.exit(0); });
    s.on('error', () => process.exit(1));
    setTimeout(() => process.exit(1), 2000);
  "; do
    i=$((i + 1))
    if [ "$i" -ge 60 ]; then
      echo "[entrypoint] 数据库 120 秒内没连上，放弃。先看 db 容器日志：docker compose logs db" >&2
      exit 1
    fi
    echo "[entrypoint] 数据库还没起来，2 秒后重试（第 $i 次）…"
    sleep 2
  done

  echo "[entrypoint] 数据库已就绪，执行 payload migrate…"
  cd /app/full
  # 用 node 直接跑 CLI，避免 npx 在离线环境下尝试联网解析包
  node node_modules/payload/bin.js migrate
  echo "[entrypoint] 迁移完成。"
fi

echo "[entrypoint] 启动应用：$*"
exec "$@"
