import React from 'react';
import { Navigate } from 'react-router-dom';

function RutaPrivada({ children, rolesPermitidos }) {
  const usuario = JSON.parse(sessionStorage.getItem('usuario'));

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Validar rol permitido
  if (!rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/inicio" replace />;
  }

  return children;
}

export default RutaPrivada;
