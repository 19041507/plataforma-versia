#!/bin/bash
# Entrypoint do Backend — Versia (Docker no Render)
set -e

echo "▶ Versia backend — entrypoint"

if [ -z "${DATABASE_URL:-}" ]; then
  echo "❌ DATABASE_URL não definida. Configure no Render (Environment)."
  exit 1
fi

python scripts/wait_for_db.py

echo "🔄 Migrações (shared)..."
python manage.py migrate_schemas --shared --noinput

echo "🔄 Migrações (tenants)..."
python manage.py migrate_schemas --noinput

echo "📦 Coletando arquivos estáticos..."
python manage.py collectstatic --noinput

echo "🚀 Iniciando Gunicorn..."
exec "$@"
