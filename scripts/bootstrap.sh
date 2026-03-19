#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "$0")" && pwd)/_common.sh"

require_cmd node
require_cmd pnpm

log "Node $(node -v)"
log "pnpm $(pnpm -v)"

if command -v rustc >/dev/null 2>&1; then
  log "Rust $(rustc --version)"
else
  warn "Rust is optional for the current scaffold, but it will be needed later if the Tauri shell is activated."
fi

run pnpm install
