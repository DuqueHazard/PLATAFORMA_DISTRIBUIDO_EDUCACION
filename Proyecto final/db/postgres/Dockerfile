# Dockerfile para PostgreSQL
FROM postgres:15-alpine

ENV POSTGRES_DB=plataforma
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=admin123

# Copia el script de inicialización
COPY init.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
