# Deploy do backend no Render

Frontend continua na **Vercel**. Backend Django no **Render** + banco **Supabase** (PostgreSQL).

## 1. Criar Web Service no Render

1. [dashboard.render.com](https://dashboard.render.com) → **New +** → **Web Service**
2. Conecte o repo `plataforma-versia`
3. Configuração:

| Campo | Valor |
|-------|--------|
| **Name** | `versia-api` (ou outro) |
| **Region** | mais próxima de você |
| **Branch** | `dev` |
| **Root Directory** | `plataforma-versia/backend` |
| **Runtime** | Python 3 |
| **Build Command** | `pip install -r requirements.txt && python manage.py collectstatic --noinput` |
| **Start Command** | `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --threads 2 --timeout 120 --access-logfile - --error-logfile -` |
| **Pre-Deploy Command** | `python manage.py migrate_schemas --shared --noinput && python manage.py migrate_schemas --noinput` |

**Health Check Path:** `/health/`

### Alternativa: Docker

Use o `Dockerfile` em `plataforma-versia/backend` (Runtime → Docker). O `entrypoint.sh` já roda migrações e collectstatic.

---

## 2. Variáveis de ambiente (Render → Environment)

| Variável | Exemplo | Obrigatório |
|----------|---------|-------------|
| `SECRET_KEY` | chave longa aleatória | Sim |
| `DEBUG` | `False` | Sim |
| `DATABASE_URL` | URI Supabase (`?sslmode=require`) | Sim |
| `ALLOWED_HOSTS` | `versia-api.onrender.com` | Sim |
| `CORS_ALLOWED_ORIGINS` | URL do frontend Vercel | Sim |
| `CSRF_TRUSTED_ORIGINS` | mesma URL do frontend | Sim |
| `SECURE_SSL_REDIRECT` | `False` | Sim |
| `BASE_DOMAIN` | seu domínio (ex. `versia.com.br`) | Recomendado |

O Render define automaticamente `RENDER_EXTERNAL_HOSTNAME` e `RENDER_EXTERNAL_URL` — o `settings.py` já os usa.

**Supabase:** use connection string **Session** (porta 5432). Se usar pooler transaction (6543), o projeto já ajusta `DISABLE_SERVER_SIDE_CURSORS`.

---

## 3. Frontend (Vercel)

Em **frontend** → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://versia-api.onrender.com
NEXT_PUBLIC_TENANT_SCHEMA=demo
```

Substitua pelo URL real do seu serviço Render.

---

## 4. Multi-tenant na API

- **Schema público** (`/`, `/admin/`, `/api/empresas/`, `/health/`): acessa sem `X-Tenant` no domínio `*.onrender.com`
- **Rotas de tenant** (`/api/auth/login/`, cursos, etc.): envie header **`X-Tenant: demo`** (schema da empresa)

```bash
curl https://versia-api.onrender.com/health/
curl -H "X-Tenant: demo" https://versia-api.onrender.com/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","senha":"sua-senha"}'
```

---

## 5. Pós-deploy

1. Crie superusuário (local com `DATABASE_URL` do Supabase ou shell do Render):
   ```bash
   python manage.py createsuperuser
   ```
2. No admin (`/admin/`), crie **Empresa** + **Domínio**
3. Rode `python manage.py migrate_schemas` se criar novos tenants

---

## 6. Problemas comuns

| Sintoma | Solução |
|---------|---------|
| 502 / service unavailable | Aguarde cold start (plano free); confira logs no Render |
| 500 no `/` | Migrações não aplicadas ou `DATABASE_URL` errada |
| 400 tenant | Header `X-Tenant` incorreto ou empresa não criada |
| CORS | Atualize `CORS_ALLOWED_ORIGINS` com URL exata do frontend |
| DisallowedHost | Inclua `*.onrender.com` em `ALLOWED_HOSTS` ou deixe o Render preencher via `RENDER_EXTERNAL_HOSTNAME` |

---

## Arquivos úteis no repo

- `plataforma-versia/backend/Dockerfile` — deploy Docker
- `plataforma-versia/backend/Procfile` — referência de comando
- `plataforma-versia/backend/entrypoint.sh` — migrações + collectstatic (Docker)
- `plataforma-versia/render.yaml` — Blueprint opcional
