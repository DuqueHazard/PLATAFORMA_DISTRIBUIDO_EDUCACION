import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ListaExamenes.css';

function ListaExamenes() {
  const [examenes, setExamenes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5001/exams')
      .then(res => res.json())
      .then(data => setExamenes(data))
      .catch(err => console.error("Error al cargar exámenes:", err));
  }, []);

  const irAResolver = (id) => {
    navigate(`/resolver-examen?id=${id}`);
  };

  const volverAModuloEvaluaciones = () => {
    navigate('/modulo-evaluaciones'); // Cambia esta ruta si es distinta
  };

  return (
    <div className="lista-examenes">
      <h2>Exámenes Disponibles</h2>

      {examenes.length === 0 ? (
        <p>No hay exámenes disponibles.</p>
      ) : (
        <ul>
          {examenes.map((examen) => (
            <li key={examen._id}>
              <strong>{examen.title}</strong>
              <button onClick={() => irAResolver(examen._id)}>Resolver</button>
            </li>
          ))}
        </ul>
      )}

      <button className="boton-volver" onClick={() => window.location.href = "/"}>
        Volver al Módulo de Evaluaciones
      </button>
    </div>
  );
}

export default ListaExamenes;
