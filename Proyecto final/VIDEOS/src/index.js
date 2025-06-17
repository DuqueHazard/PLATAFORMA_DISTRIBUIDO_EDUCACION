const express = require('express');
const { MongoClient, ObjectId, GridFSBucket } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = 'plataforma';
let db;
let gridFSBucket;

// Conectar a MongoDB
MongoClient.connect(mongoUrl, { useUnifiedTopology: true })
  .then(client => {
    console.log('📦 Conectado a MongoDB');
    db = client.db(dbName);
    gridFSBucket = new GridFSBucket(db, { bucketName: 'videos' }); // importante
  })
  .catch(err => console.error('❌ Error conectando a Mongo:', err));

// Listar archivos subidos
app.get('/api/videos', async (req, res) => {
  try {
    const files = await db.collection('videos.files').find().toArray();
    res.json(files.map(file => ({
      _id: file._id,
      nombre: file.filename,
      tipo: file.contentType,
      fecha: file.uploadDate
    })));
  } catch (err) {
    console.error('❌ Error al obtener videos:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Ver un video por ID
app.get('/api/videos/:id', async (req, res) => {
  try {
    const fileId = new ObjectId(req.params.id);
    const filesCollection = db.collection('videos.files');
    const file = await filesCollection.findOne({ _id: fileId });

    if (!file) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }

    const range = req.headers.range;
    const contentLength = file.length;
    const contentType = file.contentType || 'video/mp4';

    if (!range) {
      res.set({
        'Content-Type': contentType,
        'Content-Length': contentLength,
      });
      gridFSBucket.openDownloadStream(fileId).pipe(res);
    } else {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : contentLength - 1;
      const chunkSize = end - start + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${contentLength}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType,
      });

      gridFSBucket
        .openDownloadStream(fileId, { start, end: end + 1 })
        .pipe(res);
    }
  } catch (err) {
    console.error('❌ Error al mostrar video:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend en puerto ${PORT}`);
});
