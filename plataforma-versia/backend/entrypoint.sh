#!/bin/bash
# ============================================
# Entrypoint do Backend — Versia
# Roda migrações automaticamente antes de iniciar o Gunicorn.
# ============================================
set -e

echo "⏳ Aguardando PostgreSQL..."
while ! python -c "
import os, psycopg2
db_url = os.getenv('DATABASE_URL')
if db_url:
    conn = psycopg2.connect(db_url)
else:
    conn = psycopg2.connect(
        dbname=os.getenv('POSTGRES_DB'),
        user=os.getenv('POSTGRES_USER'),
        password=os.getenv('POSTGRES_PASSWORD'),
        host=os.getenv('DB_HOST', 'postgres'),
        port=os.getenv('DB_PORT', '5432'),
    )
conn.close()
" 2>/dev/null; do
    echo "  PostgreSQL indisponível — tentando novamente em 2s..."
    sleep 2
done
echo "✅ PostgreSQL pronto!"

echo "🔄 Rodando migrações (shared)..."
python manage.py migrate_schemas --shared --noinput

echo "🔄 Rodando migrações (tenants)..."
python manage.py migrate_schemas --noinput

echo "📦 Coletando arquivos estáticos..."
python manage.py collectstatic --noinput

echo "🚀 Iniciando Gunicorn..."
exec "$@"
