// src/components/RutaProtegidaAdmin.js
import React from 'react';
import { Navigate } from 'react-router-dom';

function RutaProtegidaAdmin({ children }) {
  const usuario = JSON.parse(sessionStorage.getItem('usuario'));

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (usuario.rol !== 'admin') {
    return <Navigate to={`/inicio/${usuario.id}`} replace />;
  }

  return children;
}

export default RutaProtegidaAdmin;
