# Dockerfile para MongoDB
FROM mongo:6.0

# Copia el script de inicialización
COPY init.js /docker-entrypoint-initdb.d/

EXPOSE 27017
