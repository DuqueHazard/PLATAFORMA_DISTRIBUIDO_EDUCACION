import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResolverExamen.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function ResolverExamen() {
  const [examen, setExamen] = useState(null);
  const [respuestas, setRespuestas] = useState({});
  const [studentId, setStudentId] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [nota, setNota] = useState(null);
  const [certificadoVisible, setCertificadoVisible] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const [examenFinalizado, setExamenFinalizado] = useState(false);

  const examId = new URLSearchParams(window.location.search).get("id");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/exams/${examId}`)
      .then((res) => res.json())
      .then((data) => {
        setExamen(data);
        setTiempoRestante(data.questions.length * 90);
      })
      .catch((err) => console.error("Error al cargar el examen:", err));
  }, [examId]);

  useEffect(() => {
    if (!examen || examenFinalizado) return;
    if (tiempoRestante <= 0) {
      enviarExamen();
      return;
    }

    const timer = setInterval(() => {
      setTiempoRestante((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [tiempoRestante, examen, examenFinalizado]);

  const formatoTiempo = (segundos) => {
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleChange = (preguntaId, valor) => {
    setRespuestas({ ...respuestas, [preguntaId]: valor });
  };

  const enviarExamen = async () => {
    if (!studentId || !nombreCompleto) {
      alert("Debes ingresar tu ID de estudiante y nombre completo antes de comenzar.");
      return;
    }

    const payload = {
      student_id: studentId,
      exam_id: examId,
      responses: Object.entries(respuestas).map(([id, answer]) => ({
        id: parseInt(id),
        answer,
      })),
    };

    try {
      const res = await fetch("/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback(data.feedback);
        setNota(data.nota);
        setExamenFinalizado(true);
        if (data.nota >= 60) setCertificadoVisible(true);
      } else {
        alert(data.error || "Error al enviar respuestas");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await enviarExamen();
  };

  const generarPDF = () => {
    const elemento = document.getElementById("certificado-content");
    html2canvas(elemento).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`certificado_${nombreCompleto}.pdf`);

      setTimeout(() => {
        navigate('/');
      }, 500);
    });
  };

  if (!examen) return <div className="cargando">Cargando examen...</div>;

  return (
    <div className="contenedor-examen">
      <h2>{examen.title}</h2>
      <p>Tiempo restante: <strong>{formatoTiempo(tiempoRestante)}</strong></p>

      {!examenFinalizado && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="ID del estudiante"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
            required
          />

          <h3 className="titulo-preguntas">Preguntas</h3>

          {examen.questions.map((q) => (
            <div key={q.id} className="pregunta">
              <p className="texto-pregunta">{q.question}</p>

              {q.type === 'multiple' ? (
                q.options.map((opt, i) => (
                  <div key={i} className="opcion">
                    <input
                      type="radio"
                      name={`q_${q.id}`}
                      value={opt}
                      checked={respuestas[q.id] === opt}
                      onChange={() => handleChange(q.id, opt)}
                    /> {opt}
                  </div>
                ))
              ) : (
                <div className="opcion">
                  <label>
                    <input
                      type="radio"
                      name={`q_${q.id}`}
                      value="Verdadero"
                      checked={respuestas[q.id] === "Verdadero"}
                      onChange={() => handleChange(q.id, "Verdadero")}
                    /> Verdadero
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`q_${q.id}`}
                      value="Falso"
                      checked={respuestas[q.id] === "Falso"}
                      onChange={() => handleChange(q.id, "Falso")}
                    /> Falso
                  </label>
                </div>
              )}
            </div>
          ))}

          <button type="submit">Enviar Examen</button>
        </form>
      )}

      {nota !== null && (
        <div className="resultado">
          <h3>Nota: {nota}%</h3>
          {nota >= 60 ? (
            <p>¡Aprobado!</p>
          ) : (
            <div>
              <p>No aprobado.</p>
              <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginTop: "10px" }}>
                <button onClick={() => window.location.reload()}>Volver a intentar</button>
                <button onClick={() => navigate("/lista-examenes")}>Volver a la lista</button>
              </div>
            </div>
          )}
        </div>
      )}

      {certificadoVisible && (
        <div>
          <div className="popup-certificado">
            <p>¡Felicidades! Puedes descargar tu certificado.</p>
            <button onClick={generarPDF}>Descargar Certificado</button>
          </div>

          <div id="certificado-content" className="certificado-box">
            <h1>Certificado de Aprobación</h1>
            <p>Otorgado a <strong>{nombreCompleto}</strong></p>
            <p>Por haber aprobado satisfactoriamente el curso:</p>
            <h2>{examen.title}</h2>
            <p>Con una calificación de <strong>{nota}%</strong></p>
            <p>Fecha: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResolverExamen;
