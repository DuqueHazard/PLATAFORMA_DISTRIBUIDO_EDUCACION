const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { MongoClient, GridFSBucket } = require('mongodb');
const { Readable } = require('stream');

const app = express();
app.use(cors());

// Cargar archivo en memoria temporalmente
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Conexión a MongoDB
const mongoURI = process.env.MONGO_URI;
let gridFSBucket;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  const db = mongoose.connection.db;
  gridFSBucket = new GridFSBucket(db, { bucketName: 'videos' });
  console.log('✅ Conectado a MongoDB y GridFS listo');
});

// Ruta para subir video a GridFS
app.post('/api/upload', upload.single('video'), async (req, res) => {
  try {
    const { originalname, buffer, mimetype } = req.file;
    const { nombre, descripcion, modulo, tema } = req.body;

    if (!buffer) {
      return res.status(400).json({ error: 'Archivo vacío o no válido' });
    }

    const readableStream = Readable.from(buffer);

    const uploadStream = gridFSBucket.openUploadStream(originalname, {
      contentType: mimetype,
      metadata: {
        nombre: nombre || originalname,
        descripcion: descripcion || '',
        modulo: modulo || 'General',
        tema: tema || '',
        fechaSubida: new Date()
      }
    });

    readableStream.pipe(uploadStream)
      .on('error', (err) => {
        console.error('❌ Error al subir:', err);
        res.status(500).json({ error: 'Error al subir el video' });
      })
      .on('finish', () => {
        console.log('✅ Video subido con ID:', uploadStream.id);
        res.json({ mensaje: 'Video subido correctamente', fileId: uploadStream.id });
      });

  } catch (error) {
    console.error('❌ Error general:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${process.env.PORT}`);
});
