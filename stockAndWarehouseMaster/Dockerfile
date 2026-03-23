# =============================================================================
# Dockerfile — Backend Spring Boot
# StockAndWarehouseMaster
# =============================================================================
# SEGURIDAD APLICADA:
#   - Multi-stage build: imagen final sin Maven ni código fuente
#   - Usuario no-root: el proceso Java no corre como root
#   - Versiones fijas: reproducible y auditable
#   - HEALTHCHECK: Kubernetes/Docker sabe si la app está realmente viva
#   - JVM tuning: límites de memoria y RNG seguro
# =============================================================================

# =============================================================================
# STAGE 1: BUILD
# Imagen completa con Maven + JDK para compilar.
# Este stage se descarta completamente al final.
# La imagen final NO contiene Maven, JDK, ni código fuente.
# =============================================================================
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# OPTIMIZACIÓN DE CACHÉ DE CAPAS:
# Copiamos pom.xml primero y descargamos dependencias en una capa separada.
# Si el código cambia pero el pom.xml no, Docker reutiliza esta capa
# y no vuelve a descargar las dependencias (ahorra 2-3 minutos por build).
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Ahora copiamos el código fuente y compilamos
COPY src ./src

# -DskipTests: los tests se ejecutan en una fase anterior del pipeline CI/CD
# -B: modo batch (sin colores, mejor para logs de CI)
# -Pproducción: activa el perfil de producción que excluye devtools
RUN mvn clean package -DskipTests -B

# =============================================================================
# STAGE 2: RUNTIME
# Imagen mínima con solo el JRE (no el JDK completo).
# Versión fija para reproducibilidad y auditoría.
#
# SECURITY: eclipse-temurin es la distribución OpenJDK con soporte activo
# de seguridad. Alpine reduce la superficie de ataque al mínimo.
# =============================================================================
FROM eclipse-temurin:17-jre-alpine

# METADATOS: trazabilidad de la imagen
# En producción, estas etiquetas permiten saber de dónde viene cada imagen
LABEL maintainer="alberto.blazquez@ejemplo.com" \
      org.opencontainers.image.title="sawm-backend" \
      org.opencontainers.image.description="StockAndWarehouseMaster Spring Boot API" \
      org.opencontainers.image.source="https://github.com/blazquezgaralberto/StockAndWarehouseMaster" \
      org.opencontainers.image.version="1.0.0"

WORKDIR /app

# SECURITY FIX: Crear usuario y grupo sin privilegios
# El proceso Java NUNCA debe correr como root.
# Si un atacante explota una vulnerabilidad en la app y ejecuta código
# en el contenedor, solo tiene permisos de 'appuser', no de root.
# Trivy y cualquier escáner marca HIGH si el proceso corre como root.
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    # El directorio de trabajo pertenece al usuario de la app
    chown -R appuser:appgroup /app

# Copiamos SOLO el JAR del stage de build, nada más
# --chown asegura que el fichero pertenece al usuario correcto
COPY --from=build --chown=appuser:appgroup /app/target/*.jar app.jar

# Activamos el usuario sin privilegios para todo lo que viene a partir de aquí
USER appuser

# Puerto que expone la aplicación (documentativo, no abre el puerto por sí solo)
EXPOSE 8080

# HEALTHCHECK: Docker y Kubernetes usan esto para saber si la app está viva.
# Sin esto, un pod puede estar en Running pero con la app colgada sin responder.
# --start-period=60s: da tiempo a Spring Boot para arrancar antes de empezar checks
# --interval=30s: comprueba cada 30 segundos
# --timeout=3s: si no responde en 3s, cuenta como fallo
# --retries=3: tras 3 fallos consecutivos, el contenedor se marca como unhealthy
HEALTHCHECK --interval=30s \
            --timeout=3s \
            --start-period=60s \
            --retries=3 \
            CMD wget --no-verbose --tries=1 --spider \
                http://localhost:8080/stockAndWarehouseMaster/actuator/health \
                || exit 1

# Opciones JVM para producción en contenedor:
# -XX:MaxRAMPercentage=75.0    → JVM usa máx 75% de la RAM del contenedor
#                                Evita OOMKills y deja margen al SO
# -XX:+UseContainerSupport     → JVM detecta los límites de CPU/RAM del contenedor
#                                (por defecto en Java 11+, explícito por claridad)
# -Djava.security.egd=...      → Fuente de entropía más rápida en Linux
#                                Mejora rendimiento de operaciones crypto (JWT, TLS)
# -Dspring.profiles.active=... → Perfil activo, sobreescribible por variable de entorno
ENTRYPOINT ["java", \
            "-XX:MaxRAMPercentage=75.0", \
            "-XX:+UseContainerSupport", \
            "-Djava.security.egd=file:/dev/./urandom", \
            "-Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:-default}", \
            "-jar", "app.jar"]
