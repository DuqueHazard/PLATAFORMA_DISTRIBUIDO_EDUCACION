// src/components/UserList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './UserList.css';

const UserList = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/perfiles`)
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((err) => console.error('Error al obtener perfiles:', err));
  }, []);

  const eliminarUsuario = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      try {
        await fetch(`${process.env.REACT_APP_API_URL}/perfil/${id}`, {
          method: 'DELETE',
        });
        setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
      } catch (err) {
        console.error("Error al eliminar usuario:", err);
      }
    }
  };

  return (
    <div className="user-list-container">
      <h2 className="title">Lista de Usuarios</h2>
      <Link to="/nuevo" className="btn create-btn">Crear nuevo usuario</Link>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.correo}</td>
              <td>{usuario.rol}</td>
              <td>
                <Link to={`/editar/${usuario.id}`} className="btn edit-btn">Editar</Link>
                <button onClick={() => eliminarUsuario(usuario.id)} className="btn delete-btn">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
