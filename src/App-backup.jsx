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
                    <Route
                      path="/notas"
                      element={
                        <PrivateRoute roles={["admin", "profesor", "estudiante"]}>
                          <NotasNew />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/materias"
                      element={
                        <PrivateRoute roles={["admin", "profesor"]}>
                          <Materias />
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



