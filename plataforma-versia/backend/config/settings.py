from pathlib import Path
from dotenv import load_dotenv
from datetime import timedelta
import os
import dj_database_url

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-chave-local-desenvolvimento')

DEBUG = os.getenv('DEBUG', 'True') == 'True'

ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv('ALLOWED_HOSTS', '*').split(',')
    if host.strip()
]
# Garante que domínios do Railway e wildcard estejam disponíveis
if not DEBUG:
    ALLOWED_HOSTS.extend(['.railway.app', '.up.railway.app'])

# ===== DJANGO TENANTS =====
SHARED_APPS = [
    'django_tenants',
    'django.contrib.contenttypes',
    'empresas',
    'usuarios',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
]

TENANT_APPS = [
    'django.contrib.contenttypes',
    'django.contrib.auth',
    'cursos',
    'progresso',
    'matriculas',
    'materiais',
    'certificados',
]

INSTALLED_APPS = list(SHARED_APPS) + [
    app for app in TENANT_APPS
    if app not in SHARED_APPS
]

TENANT_MODEL = "empresas.Empresa"
TENANT_DOMAIN_MODEL = "empresas.Dominio"

AUTH_USER_MODEL = 'usuarios.Usuario'

MIDDLEWARE = [
    'config.middleware.HeaderOrDomainTenantMiddleware',  # Middleware customizado de tenant
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # WhiteNoise serve estáticos em produção
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'
PUBLIC_SCHEMA_URLCONF = 'config.urls_public'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django_tenants.postgresql_backend',
        'NAME': os.getenv('POSTGRES_DB', 'versia_db'),
        'USER': os.getenv('POSTGRES_USER', 'versia_user'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD', 'versia123'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

# Se DATABASE_URL estiver presente (ambiente de produção do Railway),
# configura o banco de dados dinamicamente usando dj_database_url
if os.getenv('DATABASE_URL'):
    db_config = dj_database_url.config(
        default=os.getenv('DATABASE_URL'),
        conn_max_age=600,
        ssl_require=True
    )
    # IMPORTANTE: Preservar o engine especial do django_tenants
    db_config['ENGINE'] = 'django_tenants.postgresql_backend'
    DATABASES['default'] = db_config

DATABASE_ROUTERS = (
    'django_tenants.routers.TenantSyncRouter',
)

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Sao_Paulo'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# WhiteNoise storage para servir arquivos estáticos comprimidos e otimizados
STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ===== JWT =====
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=8),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# ===== DRF =====
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

# ===== CORS =====
if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True
else:
    CORS_ALLOW_ALL_ORIGINS = False
    CORS_ALLOWED_ORIGINS = [
        origin.strip()
        for origin in os.getenv('CORS_ALLOWED_ORIGINS', '').split(',')
        if origin.strip()
    ]
CORS_ALLOW_CREDENTIALS = True

# ===== SEGURANÇA EM PRODUÇÃO =====
if not DEBUG:
    # HTTPS
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

    # HSTS — instrui o browser a só usar HTTPS
    SECURE_HSTS_SECONDS = 31536000       # 1 ano
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True

    # Proteções extra
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_BROWSER_XSS_FILTER = True
    X_FRAME_OPTIONS = 'DENY'

    # Logging estruturado para produção
    LOGGING = {
        'version': 1,
        'disable_existing_loggers': False,
        'formatters': {
            'verbose': {
                'format': '[{asctime}] {levelname} {name} {message}',
                'style': '{',
            },
        },
        'handlers': {
            'console': {
                'class': 'logging.StreamHandler',
                'formatter': 'verbose',
            },
        },
        'root': {
            'handlers': ['console'],
            'level': 'WARNING',
        },
        'loggers': {
            'django': {
                'handlers': ['console'],
                'level': 'WARNING',
                'propagate': False,
            },
            'django.request': {
                'handlers': ['console'],
                'level': 'ERROR',
                'propagate': False,
            },
        },
    }
