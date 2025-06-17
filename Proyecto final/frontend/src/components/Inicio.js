import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Inicio.css';

function Inicio() {
  const usuario = JSON.parse(sessionStorage.getItem('usuario'));
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);
  const [videos, setVideos] = useState([]);
  const menuRef = useRef(null);

  if (!usuario) return <p>No has iniciado sesión.</p>;

  const cerrarSesion = () => {
    sessionStorage.removeItem('usuario');
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Obtener los videos desde el backend
  useEffect(() => {
    fetch('http://localhost:4000/api/videos')
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch((err) => console.error('Error al cargar videos:', err));
  }, []);

  return (
    <div className="inicio-wrapper">
      <header className="navbar">
        <div className="logo">🎬 Mi Plataforma</div>

        <nav className="nav-links">
          <Link to="/inicio">Inicio</Link>
          <Link to="/peliculas">Películas</Link>
          <Link to="/series">Series</Link>
        </nav>

        <div className="avatar-wrapper" ref={menuRef}>
          <div className="avatar-contenedor" onClick={() => setMenuVisible(!menuVisible)}>
            <img src={usuario.foto} alt="avatar" className="avatar" />
          </div>

          <div className={`menu-desplegable ${menuVisible ? 'menu-visible' : ''}`}>
            <div className="perfil-info">
              <img src={usuario.foto} alt="avatar" className="avatar-grande" />
              <strong>{usuario.nombre}</strong>
            </div>
            <hr />
            <Link to="/miperfil">Editar perfil</Link>

            {usuario.rol === 'admin' && (
              <Link to="/usuarios">Gestión de usuarios</Link>
            )}

            {(usuario.rol === 'admin' || usuario.rol === 'instructor') && (
              <Link to="/subir-video">Subir Video</Link>
            )}
             {(usuario.rol === 'admin' || usuario.rol === 'instructor') && (
                  <Link to="/gestionar-examen">Gestioanr Examen</Link>
            )}
              <Link to="/examenes-disponibles">Listado Examen</Link>

              <Link to="/foro">Foro</Link>
            
              
            <button onClick={cerrarSesion}>Cerrar sesión</button>
          </div>

        </div>
      </header>

      {/* ⬇️ MOSTRAR VIDEOS AQUÍ */}
      <main className="contenido-principal">
        <h2>Bienvenido, {usuario.nombre}</h2>
        <p>Estos son los videos disponibles:</p>

      <div className="videos-grid">
         {videos.map((video) => (
    <div key={video._id} className="video-card">
  <video controls width="320">
    <source
      src={`http://localhost:4000/api/videos/${video._id}`}
      type={video.tipo || 'video/mp4'}
    />
    Tu navegador no soporta la reproducción de video.
  </video>
  <p><strong>{video.metadata?.nombre || video.nombre}</strong></p>
  <p>{video.metadata?.descripcion}</p>
  <p>Subido el: {new Date(video.fecha).toLocaleString()}</p>
</div>

  ))}
</div>

      </main>
    </div>
  );
}

export default Inicio;
