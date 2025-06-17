# Imagen base
FROM node:18

# Crear directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto (ajústalo si tu servicio usa otro)
EXPOSE 4000

# Comando para ejecutar el servidor
CMD ["node", "src/index.js"]
