import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './RegisterForm.css'; // 👈 importa tu estilo fosforescente aquí

function RegisterForm() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_API_URL}/perfil`, {
      nombre,
      correo,
      contraseña_hash: contraseña,
      rol: 'estudiante',
      preferencias: { tema: 'oscuro', notificaciones: true }
    })
      .then(() => {
        toast.success('✅ Registro exitoso. Redirigiendo...');
        setTimeout(() => navigate('/login'), 1500);
      })
      .catch(error => {
        toast.error(error.response?.data?.message || '❌ Error al registrarse');
      });
  };

  return (
    <div className="register-box neon-border text-white">
      <h2 className="text-center neon-text mb-4">📝 Registro de Usuario</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control neon-input mb-3"
          placeholder="Tu nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input
          type="email"
          className="form-control neon-input mb-3"
          placeholder="ejemplo@correo.com"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />

        <input
          type="password"
          className="form-control neon-input mb-3"
          placeholder="••••••••"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
        />

        <button type="submit" className="btn btn-neon w-100">Registrarse</button>
        <button
          type="button"
          className="btn btn-neon-outline w-100 mt-2"
          onClick={() => navigate(-1)}
        >
          ⬅ Volver
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default RegisterForm;
