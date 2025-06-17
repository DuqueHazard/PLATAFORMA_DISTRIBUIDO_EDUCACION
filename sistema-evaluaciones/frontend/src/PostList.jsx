import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CommentForm from './CommentForm';
import EditPostForm from './EditPostForm';
import './PostList.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [menuVisibleId, setMenuVisibleId] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error('Error al obtener publicaciones:', err));
  }, []);

  // Cierra el menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuVisibleId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta publicación?')) {
      fetch(`/posts/${id}`, {
        method: 'DELETE'
      })
        .then((res) => {
          if (res.ok) {
            alert('Publicación eliminada');
            window.location.reload();
          } else {
            alert('Error al eliminar la publicación');
          }
        })
        .catch((err) => {
          console.error('Error:', err);
          alert('Error de red al eliminar');
        });
    }
  };

  return (
    <div className="post-list-container">
      <h2>Foro de Discusión</h2>
      <div className="forum-buttons">
        <button onClick={() => navigate('/crear-post')}> Nueva Publicación</button>
        <button onClick={() => navigate('/')}> Volver a Evaluaciones</button>
      </div>

      {posts.length === 0 ? (
        <p>No hay publicaciones todavía.</p>
      ) : (
        posts.map((post) =>
          editingPostId === post._id ? (
            <EditPostForm
              key={post._id}
              post={post}
              onCancel={() => setEditingPostId(null)}
              onUpdated={() => window.location.reload()}
            />
          ) : (
            <div key={post._id} className="post-card">
              {/* Encabezado con título y opciones */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>{post.title}</h3>
                <div style={{ position: 'relative' }} ref={menuRef}>
                  <button
                    onClick={() =>
                      setMenuVisibleId(menuVisibleId === post._id ? null : post._id)
                    }
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#aaa',
                      fontSize: '1.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    ⋯
                  </button>
                  {menuVisibleId === post._id && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        backgroundColor: '#1e1e1e',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        padding: '8px',
                        zIndex: 10
                      }}
                    >
                      <button
                        onClick={() => {
                          setEditingPostId(post._id);
                          setMenuVisibleId(null);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#00ff88',
                          cursor: 'pointer',
                          display: 'block',
                          marginBottom: '6px'
                        }}
                      >
                         Editar
                      </button>
                      <button
                        onClick={() => {
                          handleDelete(post._id);
                          setMenuVisibleId(null);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ff4d4d',
                          cursor: 'pointer',
                          display: 'block'
                        }}
                      >
                         Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Contenido del post */}
              <p className="author">Publicado por: {post.author}</p>
              <p className="content">{post.content}</p>
              <div className="comments">
                <strong>Comentarios:</strong>
                <ul>
                  {post.comments.map((cmt, index) => (
                    <li key={index}>{cmt}</li>
                  ))}
                </ul>
              </div>
              <CommentForm postId={post._id} onCommentAdded={() => window.location.reload()} />
            </div>
          )
        )
      )}
    </div>
  );
};

export default PostList;
