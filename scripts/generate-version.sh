#!/usr/bin/env sh
set -e
# Generate version.json containing git tag/commit and ISO timestamp
VERSION=$(git describe --tags --always 2>/dev/null || echo unknown)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
cat > version.json <<EOF
{
  "version": "${VERSION}",
  "timestamp": "${TIMESTAMP}"
}
EOF
printf "Generated version.json: version=%s, timestamp=%s\n" "$VERSION" "$TIMESTAMP"
