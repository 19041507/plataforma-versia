#!/bin/bash
# Roda após pip install (installCommand do @vercel/python na Vercel).
set -euo pipefail

cd "$(dirname "$0")"

PYTHON="${VERCEL_PYTHON:-${PYTHON:-python3}}"
if ! command -v "$PYTHON" >/dev/null 2>&1; then
  PYTHON=python3
fi

echo "▶ Usando Python: $(command -v "$PYTHON" || echo "$PYTHON")"
"$PYTHON" --version

echo "📦 Coletando arquivos estáticos..."
"$PYTHON" manage.py collectstatic --noinput

if [ "${SKIP_MIGRATIONS:-0}" = "1" ]; then
  echo "⏭️  SKIP_MIGRATIONS=1 — pulando migrações."
  exit 0
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "⚠️  DATABASE_URL não definida — pulando migrações no build."
  exit 0
fi

echo "🔄 Migrações (schema public/shared)..."
"$PYTHON" manage.py migrate_schemas --shared --noinput

echo "🔄 Migrações (tenants)..."
"$PYTHON" manage.py migrate_schemas --noinput

echo "✅ Build concluído!"
