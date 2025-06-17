FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Si tu index.js está dentro de /src
CMD ["node", "src/index.js"]
