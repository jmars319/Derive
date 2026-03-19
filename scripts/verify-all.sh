#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "$0")" && pwd)/_common.sh"

run "$ROOT_DIR/scripts/verify-web.sh"
run "$ROOT_DIR/scripts/verify-desktop.sh"
run "$ROOT_DIR/scripts/verify-mobile.sh"
