

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from './AuthContextCreate';
import AuthService from '../services/authService';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const currentUser = AuthService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await AuthService.login(email, password);
      if (response.success) {
        setUser(response.user);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
      return response;
    } catch {
      toast.error('Error en el servidor');
      return { success: false, message: 'Error en el servidor' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await AuthService.register(userData);
      if (response.success) {
        setUser(response.user);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
      return response;
    } catch {
      toast.error('Error en el servidor');
      return { success: false, message: 'Error en el servidor' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    const response = AuthService.logout();
    setUser(null);
    toast.info(response.message);
  };

  const updateProfile = async (updates) => {
    try {
      const response = await AuthService.updateProfile(updates);
      if (response.success) {
        setUser(response.user);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
      return response;
    } catch {
      toast.error('Error actualizando perfil');
      return { success: false, message: 'Error actualizando perfil' };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await AuthService.changePassword(currentPassword, newPassword);
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
      return response;
    } catch {
      toast.error('Error cambiando contraseña');
      return { success: false, message: 'Error cambiando contraseña' };
    }
  };

  const hasRole = (roles) => {
    return AuthService.hasRole(roles);
  };

  const getUserStats = () => {
    if (!user) return null;
    return AuthService.getUserStats(user.id);
  };

  const value = {
    user,
    usuario: user, // Alias para compatibilidad con código existente
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    hasRole,
    getUserStats,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


