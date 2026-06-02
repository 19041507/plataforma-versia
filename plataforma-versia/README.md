# 🏢 Versia

Plataforma SaaS de **treinamento corporativo multi-tenant** construída em Django + DRF + PostgreSQL (`django-tenants`).

Cada empresa (tenant) possui seu próprio **schema** no PostgreSQL — os dados de cursos, matrículas, progresso, materiais e certificados ficam isolados entre empresas.

---

## 🧱 Stack

- **Python 3.11+**
- **Django 6** + **Django REST Framework**
- **django-tenants** (multi-tenancy por schema)
- **SimpleJWT** (autenticação via JWT)
- **PostgreSQL 16** (Supabase em produção)
- **django-cors-headers**
- **Gunicorn** (produção no Render)
- **Docker** (opcional — deploy local ou Render Docker)

## 🚀 Deploy

| Componente | Plataforma | Guia |
|------------|------------|------|
| Backend API | [Render](https://render.com) | [DEPLOY_RENDER.md](./DEPLOY_RENDER.md) |
| Frontend | [Vercel](https://vercel.com) | `plataforma-versia/frontend` (Root Directory) |
| Banco | [Supabase](https://supabase.com) | `DATABASE_URL` no Render |

---

## 📂 Estrutura do backend

```
backend/
├── config/              # settings, urls (público + tenant), wsgi/asgi
├── empresas/            # SHARED — tenants (Empresa + Dominio)
├── usuarios/            # SHARED — Usuario customizado (AUTH_USER_MODEL)
├── cursos/              # TENANT — Categoria, Curso, Modulo, Aula
├── progresso/           # TENANT — Progresso de aula por usuário
├── matriculas/          # TENANT — Matricula (usuário ↔ curso)
├── materiais/           # TENANT — Materiais anexos às aulas
└── certificados/        # TENANT — Certificado com código UUID validável
```

---

## ⚙️ Pré-requisitos

- Python **3.11+**
- Docker + Docker Compose
- Git

---

## 🚀 Como rodar localmente

### 1) Clone e prepare o ambiente

```bash
git clone <repo> plataforma-versia
cd plataforma-versia

# copiar .env
cp .env.example .env

# ambiente virtual
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate   # Linux/Mac

pip install -r requirements.txt
```

### 2) Subir PostgreSQL via Docker

```bash
docker-compose up -d
```

### 3) Migrações (atenção à ordem com multi-tenancy!)

```bash
cd backend

# 1) Gerar migrations que ainda faltam
python manage.py makemigrations empresas usuarios cursos progresso matriculas materiais certificados

# 2) Migrar schema PUBLIC (tenants + usuários)
python manage.py migrate_schemas --shared

# 3) Criar superusuário (no schema public)
python manage.py createsuperuser
```

### 4) Criar empresa (tenant) e domínio

Acesse `http://localhost:8000/admin/` com o superuser e cadastre:

1. **Empresa** → nome + `schema_name` (ex.: `demo`)
2. **Domínio** → `demo.localhost` vinculado à empresa (marcar `is_primary`)

Ou via API pública:

```http
POST http://localhost:8000/api/empresas/
{
  "nome": "Demo Corp",
  "schema_name": "demo",
  "dominio": "demo.localhost"
}
```

### 5) Migrar os tenants

```bash
python manage.py migrate_schemas
```

### 6) Adicionar host local

Edite `C:\Windows\System32\drivers\etc\hosts` (Windows) ou `/etc/hosts` (Linux/Mac):

```
127.0.0.1   localhost
127.0.0.1   demo.localhost
```

### 7) Rodar o servidor

```bash
python manage.py runserver
```

- **Schema público:** http://localhost:8000/ (gerencia empresas)
- **Tenant:** http://demo.localhost:8000/ (cursos, matrículas, etc.)

---

## 🔌 Endpoints principais

### Schema público (`localhost:8000`)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/empresas/` | Criar empresa + domínio |
| GET  | `/api/empresas/` | Listar empresas (admin) |
| GET  | `/admin/` | Django admin |

### Tenant (`<subdominio>.localhost:8000`)

**Autenticação**

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/login/` | Login (retorna access + refresh) |
| POST | `/api/auth/logout/` | Logout (blacklist refresh) |
| POST | `/api/auth/registro/` | Registro de aluno |
| POST | `/api/auth/refresh/` | Renovar token |
| GET / PATCH | `/api/auth/usuario/` | Usuário logado |

**Cursos**

| Método | Rota |
|--------|------|
| GET | `/api/cursos/` |
| GET | `/api/cursos/<id>/` |
| GET | `/api/aulas/<id>/` |

**Matrículas**

| Método | Rota |
|--------|------|
| GET | `/api/matriculas/` |
| POST | `/api/matricular/` `{ "curso": <id> }` |
| POST | `/api/matriculas/<id>/concluir/` |

**Progresso**

| Método | Rota |
|--------|------|
| POST | `/api/aulas/<aula_id>/concluir/` |
| GET  | `/api/progresso/` |

**Materiais**

| Método | Rota |
|--------|------|
| GET | `/api/materiais/?aula=<id>` |
| GET | `/api/materiais/<id>/` |

**Certificados**

| Método | Rota |
|--------|------|
| GET | `/api/certificados/` |
| POST | `/api/certificados/emitir/<curso_id>/` |
| GET | `/api/certificados/validar/<uuid>/` (público) |

---

## 🔐 Exemplo de login (cURL)

```bash
curl -X POST http://demo.localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","senha":"senha123"}'
```

Resposta:

```json
{
  "token": "eyJ...",
  "refresh": "eyJ...",
  "usuario": { "id": 1, "username": "admin", "papel": "admin" }
}
```

Use em requisições autenticadas:

```
Authorization: Bearer <access_token>
```

---

## 🧪 Testes

```bash
cd backend
python manage.py test
```

---

## 📝 Status

🔄 Em desenvolvimento — MVP do backend completo (auth, multi-tenancy, cursos, matrículas, progresso, materiais e certificados).
