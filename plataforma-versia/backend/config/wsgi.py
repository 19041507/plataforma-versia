"""
WSGI config for Plataforma Versia.

Expõe o callable WSGI como `application` (padrão Django)
e como `app` (alias exigido pelo Vercel Python runtime).
"""
import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = get_wsgi_application()

# Vercel Python runtime procura por `app`
app = application
