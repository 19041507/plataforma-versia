# Deploy na Vercel (Frontend + Backend)

Este projeto usa **dois projetos separados na Vercel** (um para Next.js, outro para Django). O banco fica no **Supabase** (PostgreSQL).

## Visão geral

| Projeto Vercel | Pasta raiz (Root Directory) | Stack |
|----------------|----------------------------|--------|
| `versia-frontend` | `plataforma-versia/frontend` | Next.js 15 |
| `versia-backend` | `plataforma-versia/backend` | Django 6 + django-tenants |

Em produção com domínio único na Vercel, o tenant é resolvido pelo header **`X-Tenant`** (schema da empresa, ex.: `demo`).

---

## 1. Supabase (banco)

1. No painel Supabase: **Project Settings → Database**.
2. Copie a connection string **URI** (modo **Session**, porta `5432`) para migrações e runtime inicial.
   - Formato: `postgresql://postgres.[ref]:[SENHA]@aws-0-[regiao].pooler.supabase.com:5432/postgres?sslmode=require`
3. Para serverless, prefira depois testar o **Transaction pooler** (porta `6543`) se houver muitas conexões; o projeto já desativa server-side cursors quando detecta `pooler.supabase.com`.

**Importante (django-tenants):** o usuário do Postgres precisa poder **criar schemas**. No Supabase isso funciona com o usuário `postgres` padrão.

---

## 2. Backend na Vercel

### Criar projeto

1. [vercel.com/new](https://vercel.com/new) → importe o repositório.
2. **Root Directory** (escolha um e use o `vercel.json` correspondente):
   - **Recomendado:** `plataforma-versia/backend` → usa `plataforma-versia/backend/vercel.json`
   - **Raiz do repo:** vazio → usa `/vercel.json` na raiz do GitHub
3. **Sem** bloco `builds` no `vercel.json` — assim `installCommand` e `buildCommand` rodam de verdade (`pip` + `build_files.sh`).
4. **Não** use dependência local no `requirements.txt` (`./vercel_postbuild`) — o `uv lock` duplica caminho se o Root Directory estiver errado.
5. Sempre deploy do **último commit** da `dev` (não **Redeploy** de deploy antigo).

> Se aparecer no log: `WARNING! Due to builds existing...` — é esperado com Django. O importante é ver no log linhas como `Coletando arquivos estáticos` e `Migrações` (vindas do `build_files.sh`).

### Variáveis de ambiente (Settings → Environment Variables)

| Variável | Exemplo | Obrigatório |
|----------|---------|-------------|
| `SECRET_KEY` | string longa aleatória | Sim |
| `DEBUG` | `False` | Sim |
| `DATABASE_URL` | URI do Supabase com `?sslmode=require` | Sim |
| `ALLOWED_HOSTS` | `seu-backend.vercel.app` | Sim |
| `CORS_ALLOWED_ORIGINS` | `https://seu-frontend.vercel.app` | Sim |
| `CSRF_TRUSTED_ORIGINS` | `https://seu-frontend.vercel.app` | Sim |
| `BASE_DOMAIN` | `versia.com.br` (ou seu domínio) | Sim |
| `SECURE_SSL_REDIRECT` | `False` | Sim |

Opcional:

| Variável | Uso |
|----------|-----|
| `SKIP_MIGRATIONS` | `1` para pular migrações no build (rodar migrações localmente) |

### Primeiro deploy

1. Configure `DATABASE_URL` **antes** do primeiro deploy com migrações.
2. O script `build_files.sh` roda `collectstatic` e `migrate_schemas` quando `DATABASE_URL` existe.
3. Após o deploy, anote a URL: `https://versia-backend-xxx.vercel.app`.

### Criar tenant (empresa) após migrações

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

Crie **Empresa** (`schema_name`: ex. `demo`) e **Domínio** vinculado.

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

1. Novo projeto na Vercel → mesmo repositório.
2. **Root Directory:** `plataforma-versia/frontend`
3. Framework: **Next.js** (automático).

### Variáveis de ambiente

| Variável | Exemplo |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | `https://seu-backend.vercel.app` |
| `NEXT_PUBLIC_TENANT_SCHEMA` | `demo` |

### Deploy

O build roda `npm install` + `npm run build`. Não use `output: 'standalone'` — a Vercel gera as funções automaticamente.

Helper de API no frontend: `frontend/lib/api.ts` (`apiFetch`, header `X-Tenant`).

---

## 4. Domínios customizados (opcional)

- Frontend: `app.seudominio.com` → projeto frontend.
- Backend: `api.seudominio.com` → projeto backend.
- Atualize `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS` e `NEXT_PUBLIC_API_URL`.

---

## 5. Problemas comuns

### Build do backend em ~2s (só instala pip)

O `build_files.sh` **não rodou**. Causas comuns:

1. **Root Directory errado** — alinhe com a tabela acima (backend ou raiz do repo).
2. **Erro `Distribution not found at: .../plataforma-versia/backend/plataforma-versia/backend/...`** — Root Directory está na raiz do repo em vez de `plataforma-versia/backend`. Corrija nas Settings do projeto.
3. Erro `.../backend/backend/vercel_postbuild` — Root Directory na raiz + path local no `requirements.txt`. Use commit recente sem `builds` nem `./vercel_postbuild`.
4. Build em ~2s — havia `builds` no `vercel.json` (ignora `buildCommand`). Atualize para versão sem `builds`.
4. Confira no log: `Coletando arquivos estáticos` e commit recente da `dev`.
4. **`DATABASE_URL` no build** — em Settings → Environment Variables, marque `DATABASE_URL` para **Production, Preview e Development** (incluindo builds), senão as migrações são puladas.

### Build do frontend: erro `@next/swc-*` 404

A versão `next@15.5.11` publicada sem pacote SWC correspondente quebra o build. O projeto está fixado em **`next@15.3.4`**.

### Build do backend: migrações falham

- Confirme `DATABASE_URL` na Vercel (Production + Preview).
- Teste conexão local com a mesma URL.
- Use `SKIP_MIGRATIONS=1` e rode migrações na sua máquina se o timeout do build estourar.

### 400 Tenant não encontrado

Envie o header `X-Tenant` com o `schema_name` da empresa ou acesse via subdomínio em dev.

### CORS bloqueado

Inclua a URL exata do frontend em `CORS_ALLOWED_ORIGINS`. Previews `*.vercel.app` já entram via regex em produção.

### Django muito pesado na Vercel

Se o deploy falhar por tamanho do bundle ou cold start, considere hospedar só o backend em **Railway** ou **Render** e manter o frontend na Vercel — a configuração de `X-Tenant` continua válida.

---

## 6. Checklist rápido

- [ ] Supabase com `DATABASE_URL` (sslmode=require)
- [ ] Projeto backend (`plataforma-versia/backend`) com env vars
- [ ] Migrações aplicadas (`migrate_schemas`)
- [ ] Empresa/tenant criado (`schema_name` conhecido)
- [ ] Projeto frontend (`plataforma-versia/frontend`) com `NEXT_PUBLIC_*`
- [ ] Login testado com `curl` + `X-Tenant`
