# 🧠 Plataforma Web de Evaluaciones y Foro con Microservicios

Este proyecto es un sistema distribuido desarrollado con una arquitectura basada en microservicios, contenedores Docker y un frontend moderno en React. Ofrece funcionalidades como autenticación de usuarios, gestión de exámenes, retroalimentación automática, visualización de estadísticas y un foro de discusión.

## 🚀 Tecnologías Utilizadas

- **Frontend**: React + Bootstrap
- **Backend**: Flask (Python)
- **Bases de datos**: MongoDB y PostgreSQL
- **Contenedores**: Docker y Docker Compose
- **Otras herramientas**: BullMQ, Redis, FFmpeg, JWT, MinIO

## 📁 Estructura del Proyecto
proyecto/
│
├── frontend/ # Interfaz de usuario
├── autenticacion/ # Servicio de login/autenticación
├── perfiles/ # Microservicio de perfiles
├── usuarios/ # Registro y gestión de usuarios
├── quiz-service/ # Creación y gestión de exámenes
├── feedback-service/ # Evaluación automática
├── forum-service/ # Foro de discusión
├── estadisticas/ # Generación de datos visuales
├── SUBIR_VIDEOS/ # Procesamiento de videos
├── VIDEOS/ # Reproductor de video (HLS)
├── db/
│ ├── mongo/ # Configuración de MongoDB
│ └── postgres/ # Configuración de PostgreSQL
└── docker-compose.yml # Orquestación de servicios

## 🧪 Requisitos Previos

- Visual Studio Code
- Docker Desktop
- Virtualización activada en BIOS

## 🔧 Instalación

1### 1. Clonar el repositorio
``` bash
git clone https://github.com/tu-usuario/nombre-repo.git
cd nombre-repo
```
### Ejucutar Sistema
docker-compose up --build

### Acceder al sistema
http://localhost:3002

### Comandos útiles
| Acción                             | Comando                                |
| ---------------------------------- | -------------------------------------- |
| Levantar el sistema                | `docker-compose up --build`            |
| Detener el sistema                 | `docker-compose down`                  |
| Ver logs de un servicio específico | `docker logs <nombre-servicio>`        |
| Reconstruir un solo servicio       | `docker-compose up --build <servicio>` |



