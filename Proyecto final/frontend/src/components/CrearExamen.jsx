import React, { useState, useEffect } from 'react';
import './CrearExamen.css';

function CrearExamen() {
  const [title, setTitle] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [questions, setQuestions] = useState([
    { id: 1, question: '', type: 'multiple', options: ['', '', ''], answer: '' }
  ]);

  // Cargar info del usuario logueado
  useEffect(() => {
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    if (usuario) {
      setTeacherId(usuario.id); // ← ID para backend
      setTeacherName(usuario.nombre); // ← Nombre para mostrar
    }
  }, []);

  const agregarPregunta = () => {
    const nuevaId = questions.length + 1;
    setQuestions([
      ...questions,
      { id: nuevaId, question: '', type: 'multiple', options: ['', '', ''], answer: '' }
    ]);
  };

  const actualizarPregunta = (index, campo, valor) => {
    const nuevas = [...questions];
    nuevas[index][campo] = valor;

    if (campo === 'type') {
      nuevas[index].options = valor === 'multiple' ? ['', '', ''] : [];
      nuevas[index].answer = '';
    }

    setQuestions(nuevas);
  };

  const actualizarOpcion = (index, optIndex, valor) => {
    const nuevas = [...questions];
    nuevas[index].options[optIndex] = valor;
    setQuestions(nuevas);
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
       const res = await fetch('http://localhost:5000/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error del backend:", errorText);
        setMensajeError("Error al crear examen: " + res.status);
        return;
      }

      const data = await res.json();
      alert(`Examen creado exitosamente`);
      window.location.href = "/gestionar-examen";
    } catch (err) {
      console.error("Error en el fetch:", err);
      setMensajeError('Error al crear examen (fallo de conexión o error inesperado)');
    }
  };

  return (
    <div className="formulario-examen">
      <button className="boton-volver" onClick={() => navigate('/gestionar-examen')}>
        Volver
      </button>


      <h2>Crear Examen</h2>

      <div className="mensaje-importante">
        <strong>Docente:</strong> {teacherName}
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

        {/* Ya no mostramos el ID directamente */}
        {/* <input type="text" value={teacherId} hidden /> */}

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

            {q.type === 'multiple' && (
              <>
                {q.options.map((opt, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Opción ${i + 1}`}
                    value={opt}
                    onChange={(e) => actualizarOpcion(index, i, e.target.value)}
                    required
                  />
                ))}
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
              </>
            )}

            {q.type === 'truefalse' && (
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

        <div style={{ display: "flex", gap: "20px", marginTop: "20px", justifyContent: "center" }}>
          <button type="button" onClick={agregarPregunta}>Agregar pregunta</button>
          <button type="submit">Crear Examen</button>
        </div>
      </form>
    </div>
  );
}

export default CrearExamen;
