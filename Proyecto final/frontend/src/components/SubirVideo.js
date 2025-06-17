import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SubirVideo = () => {
  const [video, setVideo] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [modulo, setModulo] = useState('');
  const [tema, setTema] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleArchivo = (e) => setVideo(e.target.files[0]);

  const handleSubir = async () => {
    if (!video || !nombre || !modulo) {
      toast.warning('⚠️ Elige un archivo y completa los campos obligatorios');
      return;
    }

    const formData = new FormData();
    formData.append('video', video);
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('modulo', modulo);
    formData.append('tema', tema);

    try {
      setCargando(true);

      const res = await fetch('http://localhost:4003/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setCargando(false);

      if (res.ok) {
        toast.success('✅ Video subido correctamente');
      } else {
        toast.error(`❌ Error: ${data.error || 'Error desconocido'}`);
      }
    } catch (err) {
      setCargando(false);
      toast.error('❌ Error de conexión con el servidor');
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">📤 Subir Video</h2>

      <div className="mb-3">
        <label className="form-label">Seleccionar archivo *</label>
        <input
          type="file"
          className="form-control"
          accept="video/*"
          onChange={handleArchivo}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Nombre del video *</label>
        <input
          type="text"
          className="form-control"
          placeholder="Ej: Tutorial de React"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <textarea
          className="form-control"
          placeholder="Ej: Introducción a hooks y componentes funcionales"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        ></textarea>
      </div>

      <div className="mb-3">
        <label className="form-label">Módulo *</label>
        <input
          type="text"
          className="form-control"
          placeholder="Ej: Módulo 1 - Fundamentos"
          value={modulo}
          onChange={(e) => setModulo(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Tema</label>
        <input
          type="text"
          className="form-control"
          placeholder="Ej: JSX, Props, Estados"
          value={tema}
          onChange={(e) => setTema(e.target.value)}
        />
      </div>

      <div className="d-flex gap-3">
        <button onClick={handleSubir} className="btn btn-primary" disabled={cargando}>
          {cargando ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" />
              Subiendo…
            </>
          ) : (
            'Subir Video'
          )}
        </button>

        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          ⬅️ Volver
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default SubirVideo;
