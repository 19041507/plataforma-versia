# Deploy backend na Vercel (Opção A)

## Configuração do projeto

| Campo | Valor |
|-------|--------|
| **Root Directory** | `plataforma-versia/backend` |
| **Branch** | `dev` |
| **Framework** | Other |

## Variáveis de ambiente (mínimo)

- `SECRET_KEY`, `DEBUG=False`, `DATABASE_URL`
- `ALLOWED_HOSTS` = seu domínio `.vercel.app`
- `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS` = URL do frontend
- `SECURE_SSL_REDIRECT=False`

## Log de build esperado

- `Installing ... requirements.txt` (sem prefixo `plataforma-versia/backend/`)
- `@vercel/python` em `api/index.py` (obrigatório — `pip` sozinho falha sem runtime Python)
- `Coletando arquivos estáticos` (via `build_files.sh` no `installCommand` do build)
- Pode aparecer `WARNING! Due to builds existing` — é normal nesta configuração

Guia completo: `../DEPLOY_VERCEL.md`
