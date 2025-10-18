

import { useState } from "react";

import { AuthContext } from "./useAuth.jsx"; 




export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    const data = localStorage.getItem("usuario");
    return data ? JSON.parse(data) : null;
  });

  const login = (rol) => {
    const nuevoUsuario = { nombre: rol.toUpperCase(), rol };
    localStorage.setItem("usuario", JSON.stringify(nuevoUsuario));
    setUsuario(nuevoUsuario);
  };

  const logout = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


