# Mi Esquina

![CI/CD Pipeline](https://github.com/LZBZ-1/MiEsquina/actions/workflows/ci.yml/badge.svg)

Aplicación fullstack con React + Vite (frontend), FastAPI (backend), desplegada en Railway y usando Supabase como base de datos.

## Estructura del Proyecto

```
.
├── frontend/          # React + Vite + TypeScript
├── backend/           # FastAPI + Python
├── supabase/          # Migraciones y documentación de Supabase
├── .github/workflows/ # CI/CD con GitHub Actions
└── README.md
```

## Requisitos Previos

- Node.js >= 20
- Python >= 3.12
- Cuenta en [Railway](https://railway.app)
- Cuenta en [Supabase](https://supabase.com)

## Setup Local

### 1. Clonar y configurar variables de entorno

```bash
git clone https://github.com/LZBZ-1/MiEsquina.git
cd MiEsquina
cp .env .env.local  # Edita .env.local con tus credenciales de Supabase
```

### 2. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

El backend estará disponible en `http://localhost:8000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`.

## Tests

### Backend (pytest)

```bash
cd backend
pytest -v
```

### Frontend (vitest)

```bash
cd frontend
npm run test
```

## Despliegue

El despliegue en Railway se realiza automáticamente al hacer push a la rama `main`.

Asegúrate de configurar el secret `RAILWAY_TOKEN` en GitHub:

1. Ve a **Settings > Secrets and variables > Actions** en tu repositorio.
2. Crea un nuevo secret llamado `RAILWAY_TOKEN` con tu token de Railway.

## Variables de Entorno en Railway

Configura las siguientes variables en tu proyecto de Railway para cada servicio:

### Backend
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`

### Frontend
- `VITE_API_URL` (URL pública del backend en Railway)

## Supabase

Consulta [supabase/README.md](./supabase/README.md) para instrucciones sobre migraciones y políticas RLS.

## Licencia

MIT
