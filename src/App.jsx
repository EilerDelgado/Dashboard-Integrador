import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider} from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import SideBar from "./components/SideBar";
import TopBar from "./components/TopBar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Notas from "./pages/Notas";
import Error403 from "./pages/Error403";

function PrivateRoute({ children, roles }) {
  const { usuario } = useAuth();

  if (!usuario) return <Navigate to="/login" />;
  if (roles && !roles.includes(usuario.rol)) return <Error403 />;

  return children;
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
              <div id="wrapper" className="d-flex">
                <SideBar />
                <div id="content-wrapper" className="d-flex flex-column">
                  <div id="content">
                    <TopBar />
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <PrivateRoute roles={["admin", "profesor", "estudiante"]}>
                            <Dashboard />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/notas"
                        element={
                          <PrivateRoute roles={["admin", "profesor", "estudiante"]}>
                            <Notas />
                          </PrivateRoute>
                        }
                      />
                    </Routes>
                  </div>
                  <Footer />
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}


