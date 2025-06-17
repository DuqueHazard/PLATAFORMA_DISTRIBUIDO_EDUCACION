import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

function LoginForm() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(`${process.env.REACT_APP_API_AUTH_URL}/login`, { correo, contraseña })
      .then(response => {
        const usuario = response.data.usuario;

        // Guardar datos en localStorage
        localStorage.removeItem('usuario');
        sessionStorage.setItem('usuario', JSON.stringify(usuario));

        // Redirigir a su perfil
        navigate(`/inicio/${usuario.id}`);
      })
      .catch(error => {
        setMensaje(error.response?.data?.message || "Error al iniciar sesión");
      });
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
        />
        <button type="submit">Entrar</button>
      </form>
      <p className="registro-link">
        ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
      </p>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default LoginForm;
