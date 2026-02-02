#!/bin/bash

# Agent Health Check - JSON Output

NODE_VERSION=$(node -v)
PNPM_INSTALLED=false
if command -v pnpm &> /dev/null; then
    PNPM_INSTALLED=true
fi
CORE_BUILT=false
if [ -d "packages/core/dist" ]; then
    CORE_BUILT=true
fi
CONFIG_EXISTS=false
if [ -f "apo.config.json" ]; then
    CONFIG_EXISTS=true
fi

# Construct JSON
cat <<EOF
{
  "nodeVersion": "$NODE_VERSION",
  "pnpmInstalled": $PNPM_INSTALLED,
  "coreBuilt": $CORE_BUILT,
  "configExists": $CONFIG_EXISTS,
  "status": "ok"
}
EOF
exit 0
