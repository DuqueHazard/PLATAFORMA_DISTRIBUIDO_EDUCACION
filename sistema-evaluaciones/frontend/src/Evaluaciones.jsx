import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Evaluaciones.css';

function Evaluaciones() {
  const navigate = useNavigate();

  return (
    <div className="evaluaciones-container">
      <h2>Módulo de Evaluaciones</h2>

      <div className="botones-evaluaciones">
        <button onClick={() => navigate('/gestionar-examen')}>Crear Examen</button>
        <button onClick={() => navigate('/examenes-disponibles')}>Rendir Examen</button>
        <button onClick={() => navigate('/foro')}>Foro</button>
      </div>
    </div>
  );
}

export default Evaluaciones;
