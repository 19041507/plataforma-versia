#!/bin/sh
# Entrypoint — Docker no Render (banco: Supabase via DATABASE_URL)
set -e

echo "== Versia backend entrypoint =="

if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERRO: DATABASE_URL nao definida."
  echo "Render -> Environment -> DATABASE_URL = URI do Supabase (Session, 5432, ?sslmode=require)"
  exit 1
fi

# Render: falha mais rapido se a URL estiver errada (evita deploy travado 15 min)
if [ -n "${RENDER:-}" ] && [ -z "${DB_WAIT_MAX_ATTEMPTS:-}" ]; then
  export DB_WAIT_MAX_ATTEMPTS=10
fi

if [ "${SKIP_DB_WAIT:-}" != "1" ]; then
  python scripts/wait_for_db.py
else
  echo "SKIP_DB_WAIT=1 — pulando espera do banco"
fi

if [ "${RUN_STARTUP_MIGRATIONS:-1}" = "1" ]; then
  echo "Migracoes (shared)..."
  python manage.py migrate_schemas --shared --noinput
  echo "Migracoes (tenants)..."
  python manage.py migrate_schemas --noinput
fi

if [ "${RUN_STARTUP_COLLECTSTATIC:-1}" = "1" ]; then
  echo "Collectstatic..."
  python manage.py collectstatic --noinput
fi

echo "Iniciando Gunicorn..."
exec "$@"
