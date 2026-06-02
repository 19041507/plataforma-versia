#!/bin/bash
# Build para deploy na Vercel (Django + django-tenants)
set -euo pipefail

echo "???? Coletando arquivos est??ticos..."
python manage.py collectstatic --noinput

if [ "${SKIP_MIGRATIONS:-0}" = "1" ]; then
  echo "??????  SKIP_MIGRATIONS=1 ??? pulando migra????es no build."
  echo "??? Build conclu??do (rode migra????es manualmente com DATABASE_URL configurada)."
  exit 0
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "??????  DATABASE_URL n??o definida ??? pulando migra????es no build."
  echo "   Configure DATABASE_URL nas Environment Variables da Vercel e fa??a redeploy,"
  echo "   ou rode localmente: python manage.py migrate_schemas --shared && python manage.py migrate_schemas"
  exit 0
fi

echo "???? Migra????es (schema public/shared)..."
python manage.py migrate_schemas --shared --noinput

echo "???? Migra????es (tenants)..."
python manage.py migrate_schemas --noinput

echo "??? Build conclu??do!"
