# Plataforma Versia — Backend (Render Docker + Supabase)
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libpq-dev gcc libjpeg62-turbo-dev zlib1g-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

# collectstatic no build (não precisa de Supabase)
ENV SECRET_KEY=collectstatic-build-only \
    DEBUG=False \
    DATABASE_URL=postgresql://build:build@127.0.0.1:5432/build?sslmode=disable
RUN python manage.py collectstatic --noinput

# Render: migrações no Pre-Deploy; runtime só sobe o Gunicorn
CMD ["sh", "-c", "gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 2 --threads 2 --timeout 120 --access-logfile - --error-logfile -"]
