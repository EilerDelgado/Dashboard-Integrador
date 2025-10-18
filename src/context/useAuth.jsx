import { createContext, useContext } from "react";


export const AuthContext = createContext(undefined);


export const useAuth = () => {
  const context = useContext(AuthContext);

  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  return context;
};

