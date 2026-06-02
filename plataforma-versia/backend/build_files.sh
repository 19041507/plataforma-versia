#!/bin/bash
# ============================================
# Build script para deploy na Vercel
# ============================================
set -e

echo "📦 Instalando dependências..."
pip install -r requirements.txt

echo "📦 Coletando arquivos estáticos..."
python manage.py collectstatic --noinput

echo "🔄 Rodando migrações (shared)..."
python manage.py migrate_schemas --shared --noinput

echo "🔄 Rodando migrações (tenants)..."
python manage.py migrate_schemas --noinput

echo "✅ Build concluído!"
