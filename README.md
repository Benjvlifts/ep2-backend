# ⚙️ EP2 Backend — Innovatech Chile

API REST del sistema Innovatech Chile, desarrollada con Node.js + Express + TypeScript y PostgreSQL, desplegada en AWS EC2.

## 🛠️ Tecnologías
- Node.js 20 + Express + TypeScript
- PostgreSQL 15
- Docker con multi-stage build
- GitHub Actions (CI/CD)
- Amazon ECR

## 🚀 Cómo ejecutar localmente

### Sin Docker
```bash
npm install
# Necesitas PostgreSQL local corriendo
npm run dev
```

### Con Docker (recomendado)
```bash
docker compose up --build
# API disponible en http://localhost:3001
```

## 🔌 Endpoints API
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Estado del servidor |
| GET | `/api/products` | Listar todos los productos |
| GET | `/api/products/:id` | Obtener producto por ID |
| POST | `/api/products` | Crear producto |

## 🐳 Estructura Docker

**Multi-stage build:**
- **Stage 1 (builder):** Instala deps + compila TypeScript
- **Stage 2 (production):** Solo deps de producción + código compilado

**Volúmenes:**
- `postgres_data` (named volume): Persiste los datos de PostgreSQL tras reinicios

**Por qué named volume y no bind mount:**
- Más portable entre entornos
- No depende de la ruta del host
- Mejor rendimiento en producción

## 🔄 Pipeline CI/CD

Activado con `push` en rama `deploy`:
1. Compilar TypeScript y crear imagen Docker
2. Push a Amazon ECR
3. SSH a EC2 backend
4. Recrear contenedores con `docker-compose`

## 📁 Variables de entorno
| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto de la API (default: 3001) |
| `DB_HOST` | Host de PostgreSQL |
| `DB_NAME` | Nombre de la base de datos |
| `DB_USER` | Usuario de PostgreSQL |
| `DB_PASSWORD` | Contraseña |
| `FRONTEND_URL` | URL del frontend (CORS) |
