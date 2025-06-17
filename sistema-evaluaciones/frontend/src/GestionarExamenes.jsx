import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GestionExamenes.css';

function GestionExamenes() {
  const [examenes, setExamenes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/exams')
      .then((res) => res.json())
      .then((data) => setExamenes(data))
      .catch((err) => console.error("Error al obtener exámenes:", err));
  }, []);

  const eliminarExamen = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este examen?")) {
      fetch(`/exams/${id}`, {
        method: 'DELETE'
      })
        .then((res) => {
          if (res.ok) {
            setExamenes(prev => prev.filter(ex => ex._id !== id));
          } else {
            alert("Error al eliminar el examen");
          }
        })
        .catch((err) => console.error("Error al eliminar:", err));
    }
  };

  const irACrear = () => {
    navigate('/crear-examen');
  };

  const volverAEvaluaciones = () => {
    navigate('/');
  };

  return (
    <div className="gestion-examenes">
      <div className="barra-superior">
        <button className="btn-volver" onClick={volverAEvaluaciones}> Volver al Módulo de Evaluaciones</button>
        <button className="btn-crear" onClick={irACrear}> Crear Nuevo Examen</button>
      </div>

      <h2>Gestión de Exámenes</h2>

      {examenes.length === 0 ? (
        <p className="no-examenes">No hay exámenes disponibles.</p>
      ) : (
        examenes.map((examen) => (
          <div className="examen-item" key={examen._id}>
            <h3>{examen.title}</h3>
            <button className="edit" onClick={() => navigate(`/editar-examen?id=${examen._id}`)}>Editar</button>
            <button className="delete" onClick={() => eliminarExamen(examen._id)}>Eliminar</button>
          </div>
        ))
      )}
    </div>
  );
}

export default GestionExamenes;
