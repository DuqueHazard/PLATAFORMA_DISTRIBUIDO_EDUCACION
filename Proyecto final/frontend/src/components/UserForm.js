import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserForm() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [rol, setRol] = useState('estudiante');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_API_URL}/perfil`, {
      nombre,
      correo,
      contraseña_hash: contraseña,
      rol,
      preferencias: { tema: "oscuro", notificaciones: true }
    })
      .then(() => {
        toast.success('✅ Usuario creado correctamente');
        setTimeout(() => navigate('/usuarios'), 1500);
      })
      .catch(error => {
        toast.error(error.response?.data?.message || '❌ Error al crear usuario');
      });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="text-center mb-4">👤 Crear Nuevo Usuario</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              placeholder="correo@ejemplo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Rol</label>
            <select
              className="form-select"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              required
            >
              <option value="estudiante">Estudiante</option>
              <option value="admin">Administrador</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>

          <button type="submit" className="btn btn-danger w-100">Crear Usuario</button>
          <button
            type="button"
            className="btn btn-secondary w-100 mt-2"
            onClick={() => navigate(-1)}
          >
            ⬅ Volver
          </button>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default UserForm;
