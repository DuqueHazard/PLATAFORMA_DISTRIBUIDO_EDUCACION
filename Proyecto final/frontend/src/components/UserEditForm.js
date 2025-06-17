import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserEditForm() {
  const { id } = useParams();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [rol, setRol] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/perfil/${id}`)
      .then(response => {
        setNombre(response.data.nombre);
        setCorreo(response.data.correo);
        setRol(response.data.rol);
      })
      .catch(error => {
        toast.error('❌ Error al cargar el perfil');
        console.error("Error al obtener el perfil:", error);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`${process.env.REACT_APP_API_URL}/perfil/${id}`, {
      nombre,
      correo,
      rol
    })
      .then(() => {
        toast.success('✅ Usuario actualizado');
        setTimeout(() => navigate('/usuarios'), 1500);
      })
      .catch(error => {
        toast.error('❌ Error al actualizar el perfil');
        console.error("Error al actualizar el perfil:", error);
      });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="text-center mb-4">✏️ Editar Usuario</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del usuario"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input
              type="email"
              className="form-control"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Correo electrónico"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Rol</label>
            <select
              className="form-select"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              required
            >
              <option value="">Selecciona un rol</option>
              <option value="estudiante">Estudiante</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Guardar Cambios
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary w-100 mt-2"
          >
            ⬅ Volver
          </button>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default UserEditForm;
