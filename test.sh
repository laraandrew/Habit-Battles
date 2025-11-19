#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"


cd "$ROOT/server"
[ -d node_modules ] || npm i
NODE_ENV=test npm test