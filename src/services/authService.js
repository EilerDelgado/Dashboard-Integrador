/**
 * Servicio de autenticación profesional
 * Maneja login, registro, validación de tokens y sesiones
 */

import DataService from './dataService';

class AuthService {
  constructor() {
    this.tokenKey = 'dashboard_auth_token';
    this.userKey = 'dashboard_current_user';
  }

  /**
   * Generar token JWT simulado
   */
  generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      rol: user.rol,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
    };
    
    // Simulación de JWT (en producción usar una librería real)
    return btoa(JSON.stringify(payload));
  }

  /**
   * Validar token
   */
  validateToken(token) {
    try {
      const payload = JSON.parse(atob(token));
      return payload.exp > Date.now();
    } catch {
      return false;
    }
  }

  /**
   * Obtener datos del token
   */
  getTokenData(token) {
    try {
      return JSON.parse(atob(token));
    } catch {
      return null;
    }
  }

  /**
   * Login del usuario
   */
  async login(email, password) {
    try {
      const users = DataService.getData('users');
      const user = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password &&
        u.activo
      );

      if (!user) {
        throw new Error('Credenciales incorrectas o usuario inactivo');
      }

      // Actualizar último acceso
      DataService.update('users', user.id, {
        ultimoAcceso: new Date().toISOString()
      });

      const token = this.generateToken(user);
      const userSafe = this.sanitizeUser(user);

      // Guardar en localStorage
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userKey, JSON.stringify(userSafe));

      return {
        success: true,
        user: userSafe,
        token,
        message: 'Login exitoso'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Registro de nuevo usuario
   */
  async register(userData) {
    try {
      const { email, password, nombre, apellido, rol = 'estudiante' } = userData;

      // Validaciones
      if (!email || !password || !nombre || !apellido) {
        throw new Error('Todos los campos son obligatorios');
      }

      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Verificar si el email ya existe
      const users = DataService.getData('users');
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('El email ya está registrado');
      }

      // Crear usuario
      const newUser = {
        email: email.toLowerCase(),
        password,
        nombre,
        apellido,
        rol,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre + ' ' + apellido)}&background=6c757d&color=fff`,
        activo: true,
        ultimoAcceso: new Date().toISOString()
      };

      const createdUser = DataService.create('users', newUser);
      if (!createdUser) {
        throw new Error('Error al crear el usuario');
      }

      const token = this.generateToken(createdUser);
      const userSafe = this.sanitizeUser(createdUser);

      // Guardar en localStorage
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userKey, JSON.stringify(userSafe));

      return {
        success: true,
        user: userSafe,
        token,
        message: 'Registro exitoso'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Logout del usuario
   */
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    return { success: true, message: 'Logout exitoso' };
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser() {
    try {
      const token = localStorage.getItem(this.tokenKey);
      const userStr = localStorage.getItem(this.userKey);

      if (!token || !userStr) return null;

      if (!this.validateToken(token)) {
        this.logout();
        return null;
      }

      return JSON.parse(userStr);
    } catch {
      this.logout();
      return null;
    }
  }

  /**
   * Verificar si está autenticado
   */
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }

  /**
   * Verificar permisos por rol
   */
  hasRole(requiredRoles) {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(user.rol);
    }
    return user.rol === requiredRoles;
  }

  /**
   * Actualizar perfil del usuario
   */
  async updateProfile(updates) {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }

      // No permitir cambio de email si ya existe
      if (updates.email && updates.email !== currentUser.email) {
        const users = DataService.getData('users');
        if (users.find(u => u.email.toLowerCase() === updates.email.toLowerCase())) {
          throw new Error('El email ya está en uso');
        }
      }

      const updatedUser = DataService.update('users', currentUser.id, updates);
      if (!updatedUser) {
        throw new Error('Error al actualizar perfil');
      }

      const userSafe = this.sanitizeUser(updatedUser);
      localStorage.setItem(this.userKey, JSON.stringify(userSafe));

      return {
        success: true,
        user: userSafe,
        message: 'Perfil actualizado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      // Verificar contraseña actual
      const users = DataService.getData('users');
      const fullUser = users.find(u => u.id === user.id);
      
      if (fullUser.password !== currentPassword) {
        throw new Error('Contraseña actual incorrecta');
      }

      if (newPassword.length < 6) {
        throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
      }

      DataService.update('users', user.id, { password: newPassword });

      return {
        success: true,
        message: 'Contraseña cambiada exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Limpiar datos sensibles del usuario
   */
  sanitizeUser(user) {
    // eslint-disable-next-line no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Obtener estadísticas del usuario
   */
  getUserStats(userId) {
    const notas = DataService.findWhere('notas', { estudianteId: userId });
    const materias = DataService.getData('materias');
    
    return {
      totalMaterias: materias.length,
      materiasConNota: notas.length,
      promedioGeneral: notas.length > 0 
        ? (notas.reduce((sum, nota) => sum + nota.nota, 0) / notas.length).toFixed(1)
        : 0,
      ultimaActividad: notas.length > 0 
        ? new Date(Math.max(...notas.map(n => new Date(n.fecha)))).toLocaleDateString()
        : 'Sin actividad'
    };
  }
}

export default new AuthService();