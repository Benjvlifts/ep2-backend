# ============================================
# STAGE 1: Instalar dependencias y compilar TS
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./

# Instalar TODAS las dependencias (incluyendo dev para compilar)
RUN npm ci

# Copiar código fuente
COPY src/ ./src/

# Compilar TypeScript a JavaScript
RUN npm run build

# ============================================
# STAGE 2: Imagen de producción (mínima)
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

# Crear usuario no root (seguridad)
RUN addgroup -g 1001 appgroup && \
    adduser -u 1001 -G appgroup -s /bin/sh -D appuser

# Copiar solo package.json para instalar dependencias de producción
COPY package*.json ./

# Instalar SOLO dependencias de producción (imagen más pequeña)
RUN npm ci --only=production && \
    npm cache clean --force

# Copiar el código compilado desde el stage builder
COPY --from=builder /app/dist ./dist

# Cambiar propietario de archivos al usuario no root
RUN chown -R appuser:appgroup /app

# Usar usuario no root
USER appuser

# Exponer el puerto de la API
EXPOSE 3001

# Health check para saber si el contenedor está sano
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3001/health || exit 1

# Comando de inicio
CMD ["node", "dist/index.js"]