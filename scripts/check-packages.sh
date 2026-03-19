#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "$0")" && pwd)/_common.sh"

check_installed_workspace

package_files=(
  "apps/webapp/package.json"
  "apps/desktopapp/package.json"
  "apps/mobileapp/package.json"
  "packages/shared-types/package.json"
  "packages/domain/package.json"
  "packages/api-contracts/package.json"
  "packages/validation/package.json"
  "packages/realtime/package.json"
  "packages/auth/package.json"
  "packages/geo/package.json"
  "packages/privacy/package.json"
  "packages/ui/package.json"
  "packages/config/package.json"
)

for relative_path in "${package_files[@]}"; do
  [[ -f "$ROOT_DIR/$relative_path" ]] || fail "Missing manifest: $relative_path"
done

run pnpm -C "$ROOT_DIR" list --recursive --depth -1
