const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
const port = 3001;
app.use(cors());  
app.use(express.json());

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});
// Listar todos los perfiles
app.get("/perfiles", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener perfiles" });
  }
});

// Crear un nuevo perfil
app.post("/perfil", async (req, res) => {
  const { nombre, correo, contraseña_hash, rol, preferencias } = req.body;

  try {
    const hash = await bcrypt.hash(contraseña_hash, 10); // 👈 Hashea la contraseña

    const result = await pool.query(
      "INSERT INTO usuarios (id, nombre, correo, contraseña_hash, rol, fecha_registro, preferencias) VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), $5) RETURNING *",
      [nombre, correo, hash, rol, preferencias] // 👈 Guarda el hash, no la contraseña directa
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear perfil" });
  }
});

// Actualizar perfil
// backend
// Obtener perfil por ID
app.get("/perfil/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, nombre, correo, rol FROM usuarios WHERE id = $1",
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Perfil no encontrado" });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener perfil" });
  }
});


app.put("/perfil/:id", async (req, res) => {
  const { nombre, correo, rol } = req.body;
  try {
    const result = await pool.query(
      "UPDATE usuarios SET nombre = $1, correo = $2, rol = $3 WHERE id = $4 RETURNING *",
      [nombre, correo, rol, req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Perfil no encontrado" });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar perfil" });
  }
});


// Eliminar perfil
app.delete("/perfil/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM usuarios WHERE id = $1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Perfil no encontrado" });
    res.json({ message: "Perfil eliminado", perfil: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar perfil" });
  }
});

app.listen(port, () => console.log(`Servicio de perfiles escuchando en el puerto ${port}`));
