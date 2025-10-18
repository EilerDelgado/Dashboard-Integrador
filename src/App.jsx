import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import SideBarNew from "./components/SideBarNew";
import TopBar from "./components/TopBar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotasNew from "./pages/NotasNew";
import Materias from "./pages/Materias";
import Estudiantes from "./pages/Estudiantes";
import Historial from "./pages/Historial";
import Familiares from "./pages/Familiares";
import Asistencias from "./pages/Asistencias";
import Bienestar from "./pages/Bienestar";
import Estadisticas from "./pages/Estadisticas";
import Error403 from "./pages/Error403";
import LoadingSpinner from "./components/LoadingSpinner";

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.rol)) return <Error403 />;

  return children;
}

function AppLayout({ children }) {
  return (
    <div id="wrapper" className="d-flex">
      <SideBarNew />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <TopBar />
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <PrivateRoute roles={["admin", "profesor", "estudiante"]}>
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/notas" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    
                    {/* Módulo de Notas */}
                    <Route path="/notas" element={<NotasNew />} />
                    <Route 
                      path="/notas/crear" 
                      element={
                        <PrivateRoute roles={["admin", "profesor"]}>
                          <NotasNew />
                        </PrivateRoute>
                      } 
                    />
                    
                    {/* Módulo de Materias */}
                    <Route
                      path="/materias"
                      element={
                        <PrivateRoute roles={["admin", "profesor"]}>
                          <Materias />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/materias/crear"
                      element={
                        <PrivateRoute roles={["admin"]}>
                          <Materias />
                        </PrivateRoute>
                      }
                    />
                    
                    {/* Módulo de Estudiantes */}
                    <Route
                      path="/estudiantes"
                      element={
                        <PrivateRoute roles={["admin", "profesor"]}>
                          <Estudiantes />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/estudiantes/crear"
                      element={
                        <PrivateRoute roles={["admin"]}>
                          <Estudiantes />
                        </PrivateRoute>
                      }
                    />
                    
                    {/* Módulo de Historial */}
                    <Route
                      path="/historial"
                      element={
                        <PrivateRoute roles={["admin", "profesor"]}>
                          <Historial />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/historial/crear"
                      element={
                        <PrivateRoute roles={["admin", "profesor"]}>
                          <Historial />
                        </PrivateRoute>
                      }
                    />
                    
                    {/* Módulo Familiar */}
                    <Route path="/familiares" element={<Familiares />} />
                    <Route
                      path="/familiares/crear"
                      element={
                        <PrivateRoute roles={["admin", "estudiante"]}>
                          <Familiares />
                        </PrivateRoute>
                      }
                    />
                    
                    {/* Módulo de Asistencias */}
                    <Route path="/asistencias" element={<Asistencias />} />
                    <Route
                      path="/asistencias/crear"
                      element={
                        <PrivateRoute roles={["admin", "profesor"]}>
                          <Asistencias />
                        </PrivateRoute>
                      }
                    />
                    
                    {/* Módulo de Bienestar */}
                    <Route
                      path="/bienestar"
                      element={
                        <PrivateRoute roles={["admin", "profesor"]}>
                          <Bienestar />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/bienestar/crear"
                      element={
                        <PrivateRoute roles={["admin", "profesor"]}>
                          <Bienestar />
                        </PrivateRoute>
                      }
                    />
                    
                    {/* Módulo de Estadísticas */}
                    <Route
                      path="/estadisticas"
                      element={
                        <PrivateRoute roles={["admin", "profesor"]}>
                          <Estadisticas />
                        </PrivateRoute>
                      }
                    />
                    
                    <Route path="*" element={<Navigate to="/notas" replace />} />
                  </Routes>
                </AppLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AuthProvider>
  );
}


