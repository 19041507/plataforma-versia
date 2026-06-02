#!/bin/bash
# Build para deploy na Vercel (Django + django-tenants)
# Deve rodar DEPOIS do @vercel/python (venv em .vercel/python/.venv).
set -euo pipefail

cd "$(dirname "$0")"

resolve_python() {
  if [ -n "${VERCEL_PYTHON:-}" ] && [ -x "${VERCEL_PYTHON}" ]; then
    echo "${VERCEL_PYTHON}"
    return 0
  fi
  local candidates=(
    ".vercel/python/.venv/bin/python"
    ".vercel/python/.venv/bin/python3"
    "python3"
    "python"
  )
  local c
  for c in "${candidates[@]}"; do
    if command -v "$c" >/dev/null 2>&1; then
      echo "$(command -v "$c")"
      return 0
    fi
    if [ -x "$c" ]; then
      echo "$c"
      return 0
    fi
  done
  return 1
}

if ! PYTHON="$(resolve_python)"; then
  echo "❌ Python/Django não disponível. Confira se o build @vercel/python roda antes do vercel-build."
  exit 1
fi

echo "▶ Usando Python: ${PYTHON}"
"${PYTHON}" --version

echo "📦 Coletando arquivos estáticos..."
"${PYTHON}" manage.py collectstatic --noinput

if [ "${SKIP_MIGRATIONS:-0}" = "1" ]; then
  echo "⏭️  SKIP_MIGRATIONS=1 — pulando migrações."
  echo "✅ Build concluído."
  exit 0
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "⚠️  DATABASE_URL não definida — pulando migrações no build."
  echo "✅ Build concluído (static ok)."
  exit 0
fi

echo "🔄 Migrações (schema public/shared)..."
"${PYTHON}" manage.py migrate_schemas --shared --noinput

echo "🔄 Migrações (tenants)..."
"${PYTHON}" manage.py migrate_schemas --noinput

echo "✅ Build concluído!"
