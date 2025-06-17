// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import UserEditForm from './components/UserEditForm';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import EditPerfil from './components/EditPerfil';
import Inicio from './components/Inicio';
import RutaProtegidaAdmin from './components/RutaProtegidaAdmin';
import { Navigate } from 'react-router-dom';
import SubirVideo from './components/SubirVideo';
import RutaPrivada from './components/RutaPrivada';
import GestionarExamenes from './components/GestionarExamenes';
import CrearExamen from './components/CrearExamen';
import EditarExamen from './components/EditarExamen';
import ResolverExamen from './components/ResolverExamen';
import ListaExamenes from './components/ListaExamenes';
import PostList from './components/PostList';
import NewPostForm from './components/NewPostForm';


function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  const location = useLocation();
  const ocultarNav = location.pathname === '/login';

  return (
    <>
      {!ocultarNav && (
        <nav>
          
        </nav>
      )}
<Routes>
  <Route path="/login" element={<LoginForm />} />
  <Route path="/register" element={<RegisterForm />} />
  <Route path="/inicio/:id" element={<Inicio />} />
  <Route path="/crear-examen" element={<CrearExamen />} />
   {/* Ruta protegida para  examen */}

  {/*<Route path="/gestionar-examen" element={<GestionarExamenes />} />
  <Route path="/editar-examen" element={<EditarExamen />} />*/}
   <Route path="/resolver-examen" element={<ResolverExamen />} />
       
  <Route
    path="/gestionar-examen"
    element={
      <RutaPrivada rolesPermitidos={['admin', 'instructor']}>
        <GestionarExamenes />
      </RutaPrivada>
    }
  />    
  <Route
    path="/editar-examen"
    element={
      <RutaPrivada rolesPermitidos={['admin', 'instructor']}>
        <EditarExamen />
      </RutaPrivada>
    }
  />   

   <Route path="/examenes-disponibles" element={<ListaExamenes />} />
   <Route path="/foro" element={<PostList />} />
   <Route path="/crear-post" element={<NewPostForm />} />
       
  
  {/* Ruta protegida para editar perfil */}
  <Route path="/miperfil" element={<EditPerfil />} />


  {/* Ruta protegida para subir video */}
  <Route
    path="/subir-video"
    element={
      <RutaPrivada rolesPermitidos={['admin', 'instructor']}>
        <SubirVideo />
      </RutaPrivada>
    }
  />


  {/* Rutas solo para admin */}
  <Route
    path="/usuarios"
    element={
      <RutaProtegidaAdmin>
        <UserList />
      </RutaProtegidaAdmin>
    }
  />
  <Route
    path="/nuevo"
    element={
      <RutaProtegidaAdmin>
        <UserForm />
      </RutaProtegidaAdmin>
    }
  />
  <Route
    path="/editar/:id"
    element={
      <RutaProtegidaAdmin>
        <UserEditForm />
      </RutaProtegidaAdmin>
    }
  />

  {/* Ruta por defecto */}
  <Route path="*" element={<Navigate to="/login" replace />} />
</Routes>

    </>
  );
}
import { useParams } from 'react-router-dom';

function EditPerfilWrapper() {
  const { id } = useParams();
  return <EditPerfil userId={id} />;
}


export default App;
