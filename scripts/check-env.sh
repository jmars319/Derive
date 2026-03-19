#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "$0")" && pwd)/_common.sh"

require_cmd node
require_cmd pnpm

required_node_major="$(cut -d. -f1 "$ROOT_DIR/.node-version")"
current_node_version="$(node -v)"
current_node_major="${current_node_version#v}"
current_node_major="${current_node_major%%.*}"

[[ "$current_node_major" == "$required_node_major" ]] || fail "Node major version mismatch. Expected $required_node_major.x, found $current_node_version."

current_pnpm_version="$(pnpm -v)"
current_pnpm_major="${current_pnpm_version%%.*}"

[[ "$current_pnpm_major" == "10" ]] || fail "pnpm major version mismatch. Expected 10.x, found $current_pnpm_version."

log "Node version OK: $current_node_version"
log "pnpm version OK: $current_pnpm_version"

if command -v rustc >/dev/null 2>&1; then
  log "Rust available: $(rustc --version)"
else
  warn "Rust not found. Desktop native tooling remains optional in this scaffold."
fi
