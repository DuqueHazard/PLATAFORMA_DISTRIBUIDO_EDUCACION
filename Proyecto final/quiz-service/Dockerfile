FROM python:3.11-slim

WORKDIR /app

# Copiar código y requisitos
COPY . .

# Instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Exponer el puerto del servicio
EXPOSE 5000

# Comando para ejecutar el servidor Flask
CMD ["python", "app.py"]
