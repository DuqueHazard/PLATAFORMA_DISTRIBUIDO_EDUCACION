import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CrearExamen.css';

function EditarExamen() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const examId = queryParams.get("id");

  const [title, setTitle] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [mensajeError, setMensajeError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!examId) {
      setMensajeError("ID del examen no especificado.");
      navigate("/gestionar-examen");
      return;
    }

    const obtenerExamen = async () => {
      try {
        const res = await fetch(`http://localhost:5000/exams/${examId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Error al obtener examen');

        const preguntas = (data.questions || []).map((q, i) => ({
          id: q.id || i + 1,
          question: q.question || '',
          type: q.type || 'multiple',
          options: q.options?.length === 3 ? q.options : ['', '', ''],
          answer: q.answer || ''
        }));

        setTitle(data.title || '');
        setTeacherId(data.teacher_id || '');
        setQuestions(preguntas);
      } catch (err) {
        console.error('Error:', err);
        setMensajeError('Error al cargar el examen.');
      } finally {
        setLoading(false);
      }
    };

    obtenerExamen();
  }, [examId, navigate]);

  const actualizarPregunta = (index, campo, valor) => {
    const nuevas = [...questions];
    nuevas[index][campo] = valor;
    if (campo === 'type' && valor === 'truefalse') {
      nuevas[index].options = ['', '', ''];
      nuevas[index].answer = '';
    }
    setQuestions(nuevas);
  };

  const actualizarOpcion = (index, optIndex, valor) => {
    const nuevas = [...questions];
    nuevas[index].options[optIndex] = valor;
    setQuestions(nuevas);
  };

  const agregarPregunta = () => {
    const nuevaId = questions.length + 1;
    setQuestions([
      ...questions,
      { id: nuevaId, question: '', type: 'multiple', options: ['', '', ''], answer: '' }
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError('');

    for (let q of questions) {
      if (!q.question || !q.answer) {
        setMensajeError(`La pregunta ${q.id} debe tener enunciado y respuesta.`);
        return;
      }

      if (q.type === "truefalse") {
        if (q.answer !== "Verdadero" && q.answer !== "Falso") {
          setMensajeError(`La respuesta de la pregunta ${q.id} debe ser "Verdadero" o "Falso".`);
          return;
        }
      }

      if (q.type === "multiple") {
        const opciones = q.options.map(opt => opt.trim().toLowerCase());
        const respuesta = q.answer.trim().toLowerCase();
        if (!opciones.includes(respuesta)) {
          setMensajeError(`La respuesta de la pregunta ${q.id} no coincide con ninguna de las opciones.`);
          return;
        }
      }
    }

    const payload = {
      title,
      teacher_id: teacherId,
      questions
    };

    try {
      const res = await fetch(`/exams/${examId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        alert("Examen actualizado correctamente");
        navigate("/gestionar-examen");
      } else {
        setMensajeError(data.error || "Error al actualizar el examen");
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      setMensajeError("Error al actualizar el examen");
    }
  };

  if (loading) return <p style={{ color: "#00ff88", textAlign: "center" }}>Cargando datos del examen...</p>;

  return (
    <div className="formulario-examen">
      <button className="boton-volver" onClick={() => navigate("/gestionar-examen")}>
        Volver
      </button>

      <h2>Editar Examen</h2>

      <div className="mensaje-importante">
        <strong>Nota:</strong> La respuesta correcta debe coincidir con una de las opciones.
      </div>

      {mensajeError && (
        <div className="mensaje-error">
          {mensajeError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título del examen"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="ID del docente"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          required
        />

        {questions.map((q, index) => (
          <div key={q.id} className="pregunta-box">
            <h4>Pregunta {q.id}</h4>
            <input
              type="text"
              placeholder="Texto de la pregunta"
              value={q.question}
              onChange={(e) => actualizarPregunta(index, 'question', e.target.value)}
              required
            />

            <select
              value={q.type}
              onChange={(e) => actualizarPregunta(index, 'type', e.target.value)}
            >
              <option value="multiple">Opción múltiple</option>
              <option value="truefalse">Verdadero/Falso</option>
            </select>

            {q.type === 'multiple' && q.options.map((opt, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Opción ${i + 1}`}
                value={opt}
                onChange={(e) => actualizarOpcion(index, i, e.target.value)}
                required
              />
            ))}

            {q.type === 'multiple' ? (
              <select
                value={q.answer}
                onChange={(e) => actualizarPregunta(index, 'answer', e.target.value)}
                required
              >
                <option value="">Selecciona la respuesta correcta</option>
                {q.options.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <select
                value={q.answer}
                onChange={(e) => actualizarPregunta(index, 'answer', e.target.value)}
                required
              >
                <option value="">Selecciona la respuesta correcta</option>
                <option value="Verdadero">Verdadero</option>
                <option value="Falso">Falso</option>
              </select>
            )}
          </div>
        ))}

        {/* Botones bien agrupados y separados */}
        <div style={{ display: "flex", gap: "20px", marginTop: "20px", justifyContent: "center" }}>
          <button type="button" onClick={agregarPregunta}>Agregar pregunta</button>
          <button type="submit">Guardar Cambios</button>
        </div>
      </form>
    </div>
  );
}

export default EditarExamen;
