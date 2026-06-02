#!/bin/bash
# Build para deploy na Vercel (Django + django-tenants)
set -euo pipefail

echo "📦 Coletando arquivos estáticos..."
python manage.py collectstatic --noinput

if [ "${SKIP_MIGRATIONS:-0}" = "1" ]; then
  echo "⏭️  SKIP_MIGRATIONS=1 — pulando migrações no build."
  echo "✅ Build concluído (rode migrações manualmente com DATABASE_URL configurada)."
  exit 0
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "⚠️  DATABASE_URL não definida — pulando migrações no build."
  echo "   Configure DATABASE_URL nas Environment Variables da Vercel e faça redeploy,"
  echo "   ou rode localmente: python manage.py migrate_schemas --shared && python manage.py migrate_schemas"
  exit 0
fi

echo "🔄 Migrações (schema public/shared)..."
python manage.py migrate_schemas --shared --noinput

echo "🔄 Migrações (tenants)..."
python manage.py migrate_schemas --noinput

echo "✅ Build concluído!"
