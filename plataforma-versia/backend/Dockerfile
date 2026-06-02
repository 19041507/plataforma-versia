# ============================================
# Plataforma Versia — Backend (Django + Gunicorn)
# ============================================
FROM python:3.12-slim

# Evita .pyc e bufferiza stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Dependências de sistema para psycopg2 e Pillow
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libpq-dev gcc libjpeg62-turbo-dev zlib1g-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Instala dependências Python primeiro (cache de camada)
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir gunicorn==23.0.0

# Copia o código do backend
COPY . .

# LF no entrypoint (evita "exec format error" com CRLF do Windows)
RUN sed -i 's/\r$//' /app/entrypoint.sh && chmod +x /app/entrypoint.sh

# Porta do Gunicorn (Railway define $PORT dinamicamente, mas expomos 8000 como documentação)
EXPOSE 8000

# Healthcheck (mesmo path que o Render: /health/)
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
    CMD python -c "import urllib.request, os; port = os.getenv('PORT', '8000'); urllib.request.urlopen(f'http://127.0.0.1:{port}/health/')" || exit 1

# Entrypoint: aguarda DB + migrações + collectstatic
ENTRYPOINT ["/app/entrypoint.sh"]

# Comando padrão: Gunicorn usando shell para interpretar $PORT
CMD ["sh", "-c", "gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 3 --timeout 120 --access-logfile - --error-logfile -"]

