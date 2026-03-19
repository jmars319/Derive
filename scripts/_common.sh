#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

log() {
  printf "==> %s\n" "$*"
}

warn() {
  printf "Warning: %s\n" "$*" >&2
}

fail() {
  printf "Error: %s\n" "$*" >&2
  exit 1
}

run() {
  log "$*"
  "$@"
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || fail "Missing required command: $1"
}

check_installed_workspace() {
  [[ -d "$ROOT_DIR/node_modules" ]] || fail "Dependencies are not installed. Run pnpm install from the repository root."
}

build_packages() {
  run pnpm -C "$ROOT_DIR/packages/shared-types" build
  run pnpm -C "$ROOT_DIR/packages/config" build
  run pnpm -C "$ROOT_DIR/packages/domain" build
  run pnpm -C "$ROOT_DIR/packages/api-contracts" build
  run pnpm -C "$ROOT_DIR/packages/validation" build
  run pnpm -C "$ROOT_DIR/packages/privacy" build
  run pnpm -C "$ROOT_DIR/packages/realtime" build
  run pnpm -C "$ROOT_DIR/packages/auth" build
  run pnpm -C "$ROOT_DIR/packages/geo" build
  run pnpm -C "$ROOT_DIR/packages/ui" build
}
