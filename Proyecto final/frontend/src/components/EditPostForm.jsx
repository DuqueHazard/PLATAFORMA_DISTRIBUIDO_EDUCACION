import React, { useState, useEffect } from 'react';

const EditPostForm = ({ post, onCancel, onUpdated }) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [author, setAuthor] = useState(post.author);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/posts/${post._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, author })
      });

      if (res.ok) {
        alert('Publicación actualizada');
        onUpdated(); // Actualiza la vista o vuelve atrás
      } else {
        alert('Error al actualizar la publicación');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de red');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} style={{ backgroundColor: '#1e1e1e', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
      <h3>Editar Publicación</h3>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
        style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Contenido"
        style={{ width: '100%', height: '100px', marginBottom: '10px', padding: '8px' }}
      />
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Autor"
        style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button type="submit" disabled={loading} style={{ backgroundColor: '#00ff88', border: 'none', padding: '10px', borderRadius: '8px' }}>
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
        <button type="button" onClick={onCancel} style={{ backgroundColor: '#ccc', border: 'none', padding: '10px', borderRadius: '8px' }}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EditPostForm;
