#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "$0")" && pwd)/_common.sh"

check_installed_workspace
build_packages

run pnpm -C "$ROOT_DIR/apps/webapp" build
