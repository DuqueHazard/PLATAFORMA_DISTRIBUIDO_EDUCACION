// Conectar a la base de datos 'plataforma'
db = db.getSiblingDB("plataforma");

// Crear las colecciones si no existen
db.createCollection("estadisticas");
db.createCollection("multimedia");

// Insertar datos de prueba en 'estadisticas'
db.estadisticas.insertMany([
  {
    "usuario_id": "uuid-prueba",
    "ultima_leccion_vista": "uuid-leccion-prueba",
    "tiempo_total_visualizado": 1200,
    "progreso": {
      "curso_1": 0.8,
      "curso_2": 0.5
    }
  },
  {
    "usuario_id": "uuid-otro-usuario",
    "ultima_leccion_vista": "uuid-leccion-otro",
    "tiempo_total_visualizado": 300,
    "progreso": {
      "curso_1": 0.2,
      "curso_2": 0.9
    }
  }
]);

// Insertar datos de prueba en 'multimedia'
 /*db.multimedia.insertMany([
  {
    
  "curso_id": "curso-uuid",
  "leccion_id": "leccion-uuid",
  "tipo": "video",
  "url": "/videos/samba.mp4", 
  "metadata": {
    "resoluciones": ["720p"],
    "duracion_segundos": 167,
    "formato": "mp4"
  }
}
]);*/
