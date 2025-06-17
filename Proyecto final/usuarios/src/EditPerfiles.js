import express from 'express';
import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config(); // Cargar variables del .env
const { Pool } = pkg;

// Conexión directa a PostgreSQL usando variables del .env
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432 // o parseInt(process.env.POSTGRES_PORT) si defines uno personalizado
});


const router = express.Router();

// GET /perfil/:id
router.get('/perfil/:id', async (req, res) => {
  const id = req.params.id.trim();

  console.log('🔍 Solicitando perfil con ID:', id);

  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      console.log('⚠️ Usuario no encontrado con ID:', id);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    console.log('✅ Usuario encontrado:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error al obtener perfil:', error.message);
    res.status(500).json({ message: 'Error al obtener perfil del usuario' });
  }
});

// PUT /perfil/:id
router.put('/perfil/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, preferencias, foto } = req.body;

  if (!nombre || !correo) {
    return res.status(400).json({ message: 'Nombre y correo son obligatorios' });
  }

  try {
    const result = await pool.query(
      `UPDATE usuarios
       SET nombre = $1, correo = $2, preferencias = $3, foto = $4
       WHERE id = $5
       RETURNING id, nombre, correo, rol, preferencias, foto`,
      [nombre, correo, preferencias, foto, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado para actualizar' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ message: 'Error al actualizar perfil del usuario' });
  }
});

export default router;
