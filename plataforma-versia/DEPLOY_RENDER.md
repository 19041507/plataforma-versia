# Deploy do backend no Render

Frontend continua na **Vercel**. Backend Django no **Render** + banco **Supabase** (PostgreSQL).

> **Banco:** use **somente o PostgreSQL do Supabase**. Não crie “PostgreSQL” no Render nem use `DB_HOST=postgres` do Docker local — o backend lê **`DATABASE_URL`** apontando para o seu projeto Supabase.

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

### Passo a passo — Supabase → Render

1. [supabase.com](https://supabase.com) → seu projeto → **Project Settings** → **Database**
2. Em **Connection string**, escolha **URI** e **Session** (porta **5432**)
3. Copie a string, substitua `[YOUR-PASSWORD]` pela senha do banco (ou use a senha já codificada que o painel mostra)
4. Garanta no final: **`?sslmode=require`**
5. No Render: **Environment** → **Add** → chave `DATABASE_URL` → cole o valor **sem aspas**
6. **Save** e **Manual Deploy** (ou aguarde redeploy automático)

Não é necessário vincular “PostgreSQL” do Render ao serviço.

| Variável | Exemplo | Obrigatório |
|----------|---------|-------------|
| `SECRET_KEY` | chave longa aleatória | Sim |
| `DEBUG` | `False` | Sim |
| `DATABASE_URL` | URI do **seu** projeto Supabase (`?sslmode=require`) | Sim |
| `ALLOWED_HOSTS` | `versia-api.onrender.com` | Sim |
| `CORS_ALLOWED_ORIGINS` | URL do frontend Vercel | Sim |
| `CSRF_TRUSTED_ORIGINS` | mesma URL do frontend | Sim |
| `SECURE_SSL_REDIRECT` | `False` | Sim |
| `BASE_DOMAIN` | seu domínio (ex. `versia.com.br`) | Recomendado |

O Render define automaticamente `RENDER_EXTERNAL_HOSTNAME` e `RENDER_EXTERNAL_URL` — o `settings.py` já os usa.

### Supabase — `DATABASE_URL` (importante)

No Supabase: **Project Settings → Database → Connection string → URI** → modo **Session** (porta **5432**).

Cole no Render **sem aspas**:

```text
postgresql://postgres.[PROJECT-REF]:[SENHA-URL-ENCODED]@aws-0-[regiao].pooler.supabase.com:5432/postgres?sslmode=require
```

| Erro no deploy | Causa comum |
|----------------|-------------|
| `PostgreSQL indisponível` em loop | `DATABASE_URL` ausente, errada, ou Supabase pausado |
| `password authentication failed` | Senha errada ou não codificada na URL (`@` → `%40`) |
| `timeout` | Firewall/região; teste a URI no [SQL Editor](https://supabase.com) do projeto |
| `SSL` | Falta `?sslmode=require` |

**Render Python (sem Docker):** o `entrypoint.sh` **não roda** — use **Pre-Deploy** para migrações (tabela acima).

**Render Docker:** o `entrypoint.sh` espera o banco antes das migrações; os logs mostram o erro real de conexão após as tentativas.

Para pular a espera (só se o banco já estiver up): `SKIP_DB_WAIT=1`.

### Deploy falhou no commit `5a9b002` ou similar

1. Abra **Logs** do serviço (não só o build) e procure:
   - `DATABASE_URL nao definida` → adicione a URI do Supabase em **Environment**
   - `password authentication failed` → senha/URI incorreta
   - `timeout` / `could not connect` → Supabase pausado ou URL sem `sslmode=require`
2. **Health Check Path** no Render: `/health/`
3. Se migrações já rodam no **Pre-Deploy**, no Docker pode definir `RUN_STARTUP_MIGRATIONS=0` para só migrar uma vez.

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
