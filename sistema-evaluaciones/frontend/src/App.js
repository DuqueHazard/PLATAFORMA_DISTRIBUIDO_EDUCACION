import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Evaluaciones from './Evaluaciones';
import GestionarExamenes from './GestionarExamenes';
import ListaExamenes from './ListaExamenes';
import CrearExamen from './CrearExamen';
import EditarExamen from './EditarExamen';
import ResolverExamen from './ResolverExamen';
import PostList from './PostList';
import NewPostForm from './NewPostForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Evaluaciones />} />
        <Route path="/gestionar-examen" element={<GestionarExamenes />} />
        <Route path="/examenes-disponibles" element={<ListaExamenes />} />
        <Route path="/resolver-examen" element={<ResolverExamen />} />
        <Route path="/crear-examen" element={<CrearExamen />} />
        <Route path="/editar-examen" element={<EditarExamen />} />
        <Route path="/foro" element={<PostList />} />
        <Route path="/crear-post" element={<NewPostForm />} />
      </Routes>
    </Router>
  );
}

export default App;
