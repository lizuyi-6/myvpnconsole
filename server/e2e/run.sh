#!/usr/bin/env bash
# NOVA E2E runner: fresh DB → production server → Playwright suite.
#
# Prerequisites (from the repo root):
#   npm run build                      # frontend → dist/
#   cd server && npm run build         # API → server/dist/
#
# Then: cd server && npm run test:e2e
set -euo pipefail
cd "$(dirname "$0")/.."

# Kill any server from a previous run (by PID file, then by binary as fallback).
if [ -f /tmp/nova-e2e-server.pid ]; then
  kill "$(cat /tmp/nova-e2e-server.pid)" 2>/dev/null || true
  rm -f /tmp/nova-e2e-server.pid
fi
pkill -f "node dist/index\.js" 2>/dev/null || true
sleep 0.7

rm -rf /tmp/nova-e2e
mkdir -p /tmp/nova-e2e
nohup env PORT=8791 DB_PATH=/tmp/nova-e2e/nova.db \
  WEB_ROOT="$(cd .. && pwd)/dist" \
  node dist/index.js > /tmp/nova-e2e-api.log 2>&1 &
echo $! > /tmp/nova-e2e-server.pid

for _ in $(seq 1 20); do
  if curl -s -m 2 http://127.0.0.1:8791/api/health | grep -q ok; then break; fi
  sleep 0.5
done

node e2e/run.mjs
status=$?
kill "$(cat /tmp/nova-e2e-server.pid)" 2>/dev/null || true
exit $status
