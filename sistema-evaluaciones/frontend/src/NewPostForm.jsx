import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewPostForm.css';

const NewPostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = { title, content, author };

    try {
      const res = await fetch('/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });

      if (res.ok) {
        alert('Publicación creada correctamente');
        navigate('/foro');
      } else {
        alert('Error al crear la publicación');
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('Error al conectar con el servidor');
    }
  };

  return (
    <div className="new-post-form">
      <h2>Crear Nueva Publicación</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Contenido"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Autor"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <div className="form-buttons">
          <button type="submit">Publicar</button>
          <button type="button" onClick={() => navigate('/foro')}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default NewPostForm;
