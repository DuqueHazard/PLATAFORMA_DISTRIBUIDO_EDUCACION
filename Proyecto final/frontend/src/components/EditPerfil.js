import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));
const userId = usuarioGuardado?.id;

function EditPerfil() {
  const [usuario, setUsuario] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [imagenBase64, setImagenBase64] = useState('');
  const navigate = useNavigate();

  const API_URL = 'http://localhost:3003';

  useEffect(() => {
    if (!userId) {
      setMensaje('No has iniciado sesión.');
      return;
    }

    axios.get(`${API_URL}/perfil/${userId}`)
      .then(res => setUsuario(res.data))
      .catch(err => setMensaje('Error al cargar perfil'));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferencias = (e) => {
    const { name, checked } = e.target;
    setUsuario(prev => ({
      ...prev,
      preferencias: { ...prev.preferencias, [name]: checked }
    }));
  };

  const handleImagen = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImagenBase64(reader.result);
      setUsuario(prev => ({ ...prev, foto: reader.result }));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.put(`${API_URL}/perfil/${userId}`, usuario)
      .then(res => {
        setMensaje('Perfil actualizado correctamente');
        const usuarioActualizado = res.data;
        const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));

        sessionStorage.setItem('usuario', JSON.stringify({
          ...usuarioGuardado,
          nombre: usuarioActualizado.nombre,
          foto: usuarioActualizado.foto,
          preferencias: usuarioActualizado.preferencias
        }));
      })
      .catch(() => setMensaje('Error al actualizar perfil'));
  };

  if (!usuario) return <p className="text-center mt-5">{mensaje || 'Cargando perfil...'}</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">👤 Editar Perfil</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={usuario.nombre}
            onChange={handleChange}
            className="form-control"
            placeholder="Nombre"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input
            type="email"
            name="correo"
            value={usuario.correo}
            onChange={handleChange}
            className="form-control"
            placeholder="Correo"
            required
          />
        </div>

        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="tema"
            checked={usuario.preferencias?.tema || false}
            onChange={handlePreferencias}
            id="temaSwitch"
          />
          <label className="form-check-label" htmlFor="temaSwitch">
            Tema oscuro
          </label>
        </div>

        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="notificaciones"
            checked={usuario.preferencias?.notificaciones || false}
            onChange={handlePreferencias}
            id="notificacionesSwitch"
          />
          <label className="form-check-label" htmlFor="notificacionesSwitch">
            Recibir notificaciones
          </label>
        </div>

        <div className="mb-3">
          <label className="form-label">Foto de perfil</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleImagen}
          />
          {usuario.foto && (
            <div className="mt-3">
              <img src={usuario.foto} alt="Preview" className="img-thumbnail" width="150" />
            </div>
          )}
        </div>

        <div className="d-flex gap-3">
          <button type="submit" className="btn btn-success">
            Guardar Cambios
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
            ⬅ Volver
          </button>
        </div>

        {mensaje && (
          <div className="alert alert-info mt-3">
            {mensaje}
          </div>
        )}
      </form>
    </div>
  );
}

export default EditPerfil;
