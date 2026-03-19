#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "$0")" && pwd)/_common.sh"

check_installed_workspace
build_packages

cleanup() {
  [[ -n "${web_pid:-}" ]] && kill "$web_pid" >/dev/null 2>&1 || true
  [[ -n "${desktop_pid:-}" ]] && kill "$desktop_pid" >/dev/null 2>&1 || true
}

trap cleanup EXIT INT TERM

log "Starting webapp and desktopapp dev servers."
pnpm -C "$ROOT_DIR/apps/webapp" dev &
web_pid=$!
pnpm -C "$ROOT_DIR/apps/desktopapp" dev &
desktop_pid=$!

wait "$web_pid"
web_status=$?
wait "$desktop_pid"
desktop_status=$?

exit $(( web_status != 0 ? web_status : desktop_status ))
