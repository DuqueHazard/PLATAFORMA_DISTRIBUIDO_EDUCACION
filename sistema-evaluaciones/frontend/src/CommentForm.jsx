import React, { useState } from 'react';

const CommentForm = ({ postId, onCommentAdded }) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment })
      });

      if (res.ok) {
        setComment('');
        onCommentAdded(); // Refresca los datos del post
      } else {
        alert('Error al enviar el comentario');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('No se pudo enviar el comentario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleComment} style={{ marginTop: '10px' }}>
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Escribe un comentario..."
        style={{
          width: '100%',
          padding: '8px',
          borderRadius: '6px',
          border: 'none',
          marginBottom: '6px'
        }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          backgroundColor: '#00ff88',
          border: 'none',
          padding: '8px 12px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        {loading ? 'Enviando...' : 'Comentar'}
      </button>
    </form>
  );
};

export default CommentForm;
