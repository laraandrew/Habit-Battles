#!/usr/bin/env bash
# e-e-tester.sh — endpoint/e2e connectivity tester
# Usage: ./e-e-tester.sh [BASE_URL]
# If BASE_URL not provided, defaults to http://localhost:3001

set -euo pipefail

BASE=${1:-http://localhost:3001}

echo "Testing API connectivity at: ${BASE}"

function check() {
  local path=$1
  local method=${2:-GET}
  printf "%-30s " "${method} ${path}"
  status=$(curl -s -o /dev/stderr -w "%{http_code}" -X ${method} "${BASE}${path}" || true)
  if [[ "$status" == "" ]]; then
    echo "NO RESPONSE"
  else
    echo "HTTP $status"
  fi
}

check "/healthz"
check "/users"
check "/habits"
check "/challenges"

echo "\nIf you see non-2xx responses or no response, make sure the server is running:\n  cd server && npm run dev\nand that the URL above matches the server port (default 3001)." 

echo "Also check browser console for CORS or Mixed Content errors if the frontend still can't reach the backend." 
