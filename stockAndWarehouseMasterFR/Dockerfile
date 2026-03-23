# =============================================================================
# Dockerfile — Frontend Angular
# StockAndWarehouseMaster
# =============================================================================
# SEGURIDAD APLICADA:
#   - Multi-stage build: imagen final sin Node.js ni código fuente
#   - Usuario no-root: Nginx no corre como root
#   - Versiones fijas: reproducible y auditable
#   - Security headers: protección contra XSS, clickjacking, sniffing
#   - npm ci en vez de npm install: instalación determinista y segura
# =============================================================================

# =============================================================================
# STAGE 1: BUILD
# Node.js para compilar Angular en modo producción.
# Este stage se descarta completamente. La imagen final no tiene Node.js.
# =============================================================================
FROM node:18.20.3-alpine3.19 AS build

WORKDIR /app

# OPTIMIZACIÓN DE CACHÉ DE CAPAS:
# Igual que en el backend, primero las dependencias, luego el código.
COPY package*.json ./

# SECURITY FIX: npm ci en vez de npm install
# - npm ci usa exactamente las versiones del package-lock.json (reproducible)
# - npm install puede actualizar versiones menores silenciosamente
# - npm ci falla si package-lock.json no está sincronizado con package.json
# - En CI/CD siempre se usa npm ci
# --ignore-scripts: no ejecuta scripts de instalación de dependencias
#   (vector de ataque conocido en supply chain attacks)
RUN npm ci --ignore-scripts

# Copiamos el código fuente
COPY . .

# Build en modo producción:
# - Minificación y tree-shaking (elimina código no usado)
# - Optimizaciones de rendimiento
# - Sin source maps (no exponer código fuente en producción)
RUN npm run build -- --configuration production

# =============================================================================
# STAGE 2: RUNTIME
# Nginx para servir los ficheros estáticos.
# Versión fija de nginx sobre Alpine.
# =============================================================================
FROM nginx:1.25.4-alpine3.18

LABEL maintainer="alberto.blazquez@ejemplo.com" \
      org.opencontainers.image.title="sawm-frontend" \
      org.opencontainers.image.description="StockAndWarehouseMaster Angular Frontend" \
      org.opencontainers.image.source="https://github.com/blazquezgaralberto/StockAndWarehouseMaster"

# SECURITY FIX: Nginx no-root
# Por defecto Nginx master process corre como root (necesita bind al puerto 80).
# Solución: cambiamos al puerto 8080 (>1024, no necesita root) y usamos
# un usuario sin privilegios para los worker processes.
RUN addgroup -S nginxgroup && \
    adduser -S nginxuser -G nginxgroup && \
    # Dar permisos sobre los directorios que Nginx necesita
    chown -R nginxuser:nginxgroup /var/cache/nginx && \
    chown -R nginxuser:nginxgroup /var/log/nginx && \
    chown -R nginxuser:nginxgroup /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginxuser:nginxgroup /var/run/nginx.pid

# Copiamos los ficheros estáticos compilados del stage anterior
# Ajusta 'stock-and-warehouse-master-fr' al nombre real de tu outputPath en angular.json
COPY --from=build --chown=nginxuser:nginxgroup \
     /app/dist/stock-and-warehouse-master-fr \
     /usr/share/nginx/html

# Copiamos la configuración de Nginx con security headers
COPY --chown=nginxuser:nginxgroup nginx.conf /etc/nginx/conf.d/default.conf

USER nginxuser

# Puerto 8080 en vez de 80 (no necesita privilegios root)
EXPOSE 8080

HEALTHCHECK --interval=30s \
            --timeout=3s \
            --start-period=10s \
            --retries=3 \
            CMD wget --no-verbose --tries=1 --spider \
                http://localhost:8080/ || exit 1
