const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  nombre: String,
  tipo: String,
  datos: Buffer,
  fecha: Date
});

module.exports = mongoose.model('Video', VideoSchema, 'multimedia');
