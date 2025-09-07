#!/usr/bin/env bash
set -Eeuo pipefail

DOCKER_BUILDKIT=1 docker compose build
docker compose up -d

echo ""
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:5174/api/guests"
