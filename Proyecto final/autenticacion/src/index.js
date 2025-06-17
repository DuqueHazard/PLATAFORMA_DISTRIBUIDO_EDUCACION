const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require("cors");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3002',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

app.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);

    if (result.rows.length === 0) return res.status(401).json({ message: 'Usuario no encontrado' });

    const usuario = result.rows[0];
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña_hash);

    if (!contraseñaValida) return res.status(401).json({ message: 'Contraseña incorrecta' });
    res.json({message: 'Login exitoso',
    usuario: {
    id: usuario.id,
    nombre: usuario.nombre,
    rol: usuario.rol,
    foto: usuario.foto,
    preferencias: usuario.preferencias
  }
});
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Autenticación activa en el puerto ${PORT}`));
