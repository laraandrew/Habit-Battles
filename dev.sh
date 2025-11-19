#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"


# Ensure server deps and env
if [[ ! -d "$ROOT/server/node_modules" ]]; then
(cd "$ROOT/server" && npm i)
fi
if [[ ! -f "$ROOT/server/.env" && -f "$ROOT/server/.env.example" ]]; then
cp "$ROOT/server/.env.example" "$ROOT/server/.env"
fi


# Start API
(
cd "$ROOT/server"
npm run dev
) &
SERVER_PID=$!


echo "API started (pid $SERVER_PID)"


# Ensure web deps
if [[ ! -d "$ROOT/web/node_modules" ]]; then
(cd "$ROOT/web" && npm i)
fi


# Default API base if not provided
export VITE_API_BASE_URL="${VITE_API_BASE_URL:-http://localhost:3001}"


# Start Web
(
cd "$ROOT/web"
VITE_API_BASE_URL="$VITE_API_BASE_URL" npm run dev
) &
WEB_PID=$!


echo "Web started (pid $WEB_PID) — VITE_API_BASE_URL=$VITE_API_BASE_URL"


echo "Press Ctrl+C to stop both."
trap 'echo; echo "Stopping…"; kill $SERVER_PID $WEB_PID 2>/dev/null || true' EXIT
wait