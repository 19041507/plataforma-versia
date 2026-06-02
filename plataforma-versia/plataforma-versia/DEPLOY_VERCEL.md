# Deploy na Vercel (Frontend + Backend)

Este projeto usa **dois projetos separados na Vercel** (um para Next.js, outro para Django). O banco fica no **Supabase** (PostgreSQL).

## Vis??o geral

| Projeto Vercel | Pasta raiz (Root Directory) | Stack |
|----------------|----------------------------|--------|
| `versia-frontend` | `plataforma-versia/frontend` | Next.js 15 |
| `versia-backend` | `plataforma-versia/backend` | Django 6 + django-tenants |

Em produ????o com dom??nio ??nico na Vercel, o tenant ?? resolvido pelo header **`X-Tenant`** (schema da empresa, ex.: `demo`).

---

## 1. Supabase (banco)

1. No painel Supabase: **Project Settings ??? Database**.
2. Copie a connection string **URI** (modo **Session**, porta `5432`) para migra????es e runtime inicial.
   - Formato: `postgresql://postgres.[ref]:[SENHA]@aws-0-[regiao].pooler.supabase.com:5432/postgres?sslmode=require`
3. Para serverless, prefira depois testar o **Transaction pooler** (porta `6543`) se houver muitas conex??es; o projeto j?? desativa server-side cursors quando detecta `pooler.supabase.com`.

**Importante (django-tenants):** o usu??rio do Postgres precisa poder **criar schemas**. No Supabase isso funciona com o usu??rio `postgres` padr??o.

---

## 2. Backend na Vercel

### Criar projeto

1. [vercel.com/new](https://vercel.com/new) ??? importe o reposit??rio.
2. **Root Directory:** `plataforma-versia/backend`
3. Framework: detecta Python via `vercel.json`.

### Vari??veis de ambiente (Settings ??? Environment Variables)

| Vari??vel | Exemplo | Obrigat??rio |
|----------|---------|-------------|
| `SECRET_KEY` | string longa aleat??ria | Sim |
| `DEBUG` | `False` | Sim |
| `DATABASE_URL` | URI do Supabase com `?sslmode=require` | Sim |
| `ALLOWED_HOSTS` | `seu-backend.vercel.app` | Sim |
| `CORS_ALLOWED_ORIGINS` | `https://seu-frontend.vercel.app` | Sim |
| `CSRF_TRUSTED_ORIGINS` | `https://seu-frontend.vercel.app` | Sim |
| `BASE_DOMAIN` | `versia.com.br` (ou seu dom??nio) | Sim |
| `SECURE_SSL_REDIRECT` | `False` | Sim |

Opcional:

| Vari??vel | Uso |
|----------|-----|
| `SKIP_MIGRATIONS` | `1` para pular migra????es no build (rodar migra????es localmente) |

### Primeiro deploy

1. Configure `DATABASE_URL` **antes** do primeiro deploy com migra????es.
2. O script `build_files.sh` roda `collectstatic` e `migrate_schemas` quando `DATABASE_URL` existe.
3. Ap??s o deploy, anote a URL: `https://versia-backend-xxx.vercel.app`.

### Criar tenant (empresa) ap??s migra????es

Localmente (com a mesma `DATABASE_URL` do Supabase):

```bash
cd plataforma-versia/backend
pip install -r requirements.txt
export DATABASE_URL="postgresql://..."
python manage.py migrate_schemas --shared
python manage.py migrate_schemas
python manage.py createsuperuser
```

Ou via admin: `https://seu-backend.vercel.app/admin/` (schema public).

Crie **Empresa** (`schema_name`: ex. `demo`) e **Dom??nio** vinculado.

### Testar API

```bash
curl -X POST "https://SEU-BACKEND.vercel.app/api/auth/login/" \
  -H "Content-Type: application/json" \
  -H "X-Tenant: demo" \
  -d '{"usuario":"admin","senha":"sua-senha"}'
```

---

## 3. Frontend na Vercel

### Criar projeto

1. Novo projeto na Vercel ??? mesmo reposit??rio.
2. **Root Directory:** `plataforma-versia/frontend`
3. Framework: **Next.js** (autom??tico).

### Vari??veis de ambiente

| Vari??vel | Exemplo |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | `https://seu-backend.vercel.app` |
| `NEXT_PUBLIC_TENANT_SCHEMA` | `demo` |

### Deploy

O build roda `npm install` + `npm run build`. N??o use `output: 'standalone'` ??? a Vercel gera as fun????es automaticamente.

Helper de API no frontend: `frontend/lib/api.ts` (`apiFetch`, header `X-Tenant`).

---

## 4. Dom??nios customizados (opcional)

- Frontend: `app.seudominio.com` ??? projeto frontend.
- Backend: `api.seudominio.com` ??? projeto backend.
- Atualize `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS` e `NEXT_PUBLIC_API_URL`.

---

## 5. Problemas comuns

### Build do frontend: erro `@next/swc-*` 404

A vers??o `next@15.5.11` publicada sem pacote SWC correspondente quebra o build. O projeto est?? fixado em **`next@15.3.4`**.

### Build do backend: migra????es falham

- Confirme `DATABASE_URL` na Vercel (Production + Preview).
- Teste conex??o local com a mesma URL.
- Use `SKIP_MIGRATIONS=1` e rode migra????es na sua m??quina se o timeout do build estourar.

### 400 Tenant n??o encontrado

Envie o header `X-Tenant` com o `schema_name` da empresa ou acesse via subdom??nio em dev.

### CORS bloqueado

Inclua a URL exata do frontend em `CORS_ALLOWED_ORIGINS`. Previews `*.vercel.app` j?? entram via regex em produ????o.

### Django muito pesado na Vercel

Se o deploy falhar por tamanho do bundle ou cold start, considere hospedar s?? o backend em **Railway** ou **Render** e manter o frontend na Vercel ??? a configura????o de `X-Tenant` continua v??lida.

---

## 6. Checklist r??pido

- [ ] Supabase com `DATABASE_URL` (sslmode=require)
- [ ] Projeto backend (`plataforma-versia/backend`) com env vars
- [ ] Migra????es aplicadas (`migrate_schemas`)
- [ ] Empresa/tenant criado (`schema_name` conhecido)
- [ ] Projeto frontend (`plataforma-versia/frontend`) com `NEXT_PUBLIC_*`
- [ ] Login testado com `curl` + `X-Tenant`
