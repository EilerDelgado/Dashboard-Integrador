/**
 * Servicio de datos para manejar LocalStorage de forma profesional
 * Incluye validación, manejo de errores y datos ficticios
 */

// Datos ficticios iniciales
const INITIAL_DATA = {
  users: [
    {
      id: 1,
      email: "admin@dashboard.com",
      password: "admin123",
      nombre: "Administrador",
      apellido: "Sistema",
      rol: "admin",
      avatar: "https://ui-avatars.com/api/?name=Admin+Sistema&background=dc3545&color=fff",
      fechaCreacion: new Date().toISOString(),
      activo: true
    },
    {
      id: 2,
      email: "profesor@dashboard.com",
      password: "profesor123",
      nombre: "María",
      apellido: "García",
      rol: "profesor",
      avatar: "https://ui-avatars.com/api/?name=Maria+Garcia&background=28a745&color=fff",
      fechaCreacion: new Date().toISOString(),
      activo: true
    },
    {
      id: 3,
      email: "estudiante@dashboard.com",
      password: "estudiante123",
      nombre: "Juan",
      apellido: "Pérez",
      rol: "estudiante",
      avatar: "https://ui-avatars.com/api/?name=Juan+Perez&background=007bff&color=fff",
      fechaCreacion: new Date().toISOString(),
      activo: true
    }
  ],
  materias: [
    {
      id: 1,
      nombre: "Matemáticas",
      codigo: "MAT001",
      descripcion: "Matemáticas básicas y avanzadas",
      profesorId: 2,
      creditos: 4,
      activa: true
    },
    {
      id: 2,
      nombre: "Programación",
      codigo: "PROG001",
      descripcion: "Fundamentos de programación",
      profesorId: 2,
      creditos: 5,
      activa: true
    },
    {
      id: 3,
      nombre: "Historia",
      codigo: "HIST001",
      descripcion: "Historia universal",
      profesorId: 2,
      creditos: 3,
      activa: true
    }
  ],
  notas: [
    {
      id: 1,
      estudianteId: 3,
      materiaId: 1,
      nota: 85,
      periodo: "2024-1",
      fecha: new Date().toISOString(),
      observaciones: "Excelente desempeño"
    },
    {
      id: 2,
      estudianteId: 3,
      materiaId: 2,
      nota: 92,
      periodo: "2024-1",
      fecha: new Date().toISOString(),
      observaciones: "Sobresaliente en programación"
    }
  ]
};

class DataService {
  constructor() {
    this.initializeData();
  }

  /**
   * Inicializar datos en LocalStorage si no existen
   */
  initializeData() {
    try {
      if (!localStorage.getItem('dashboard_users')) {
        localStorage.setItem('dashboard_users', JSON.stringify(INITIAL_DATA.users));
      }
      if (!localStorage.getItem('dashboard_materias')) {
        localStorage.setItem('dashboard_materias', JSON.stringify(INITIAL_DATA.materias));
      }
      if (!localStorage.getItem('dashboard_notas')) {
        localStorage.setItem('dashboard_notas', JSON.stringify(INITIAL_DATA.notas));
      }
    } catch (error) {
      console.error('Error inicializando datos:', error);
    }
  }

  /**
   * Obtener datos de una entidad
   */
  getData(entity) {
    try {
      const data = localStorage.getItem(`dashboard_${entity}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error obteniendo ${entity}:`, error);
      return [];
    }
  }

  /**
   * Guardar datos de una entidad
   */
  setData(entity, data) {
    try {
      localStorage.setItem(`dashboard_${entity}`, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Error guardando ${entity}:`, error);
      return false;
    }
  }

  /**
   * Obtener siguiente ID para una entidad
   */
  getNextId(entity) {
    const data = this.getData(entity);
    return data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
  }

  /**
   * Crear nuevo registro
   */
  create(entity, item) {
    try {
      const data = this.getData(entity);
      const newItem = {
        ...item,
        id: this.getNextId(entity),
        fechaCreacion: new Date().toISOString()
      };
      data.push(newItem);
      this.setData(entity, data);
      return newItem;
    } catch (error) {
      console.error(`Error creando ${entity}:`, error);
      return null;
    }
  }

  /**
   * Actualizar registro
   */
  update(entity, id, updates) {
    try {
      const data = this.getData(entity);
      const index = data.findIndex(item => item.id === id);
      if (index === -1) return null;

      data[index] = {
        ...data[index],
        ...updates,
        fechaActualizacion: new Date().toISOString()
      };
      this.setData(entity, data);
      return data[index];
    } catch (error) {
      console.error(`Error actualizando ${entity}:`, error);
      return null;
    }
  }

  /**
   * Eliminar registro
   */
  delete(entity, id) {
    try {
      const data = this.getData(entity);
      const filteredData = data.filter(item => item.id !== id);
      this.setData(entity, filteredData);
      return true;
    } catch (error) {
      console.error(`Error eliminando ${entity}:`, error);
      return false;
    }
  }

  /**
   * Buscar por ID
   */
  findById(entity, id) {
    const data = this.getData(entity);
    return data.find(item => item.id === id) || null;
  }

  /**
   * Buscar con filtros
   */
  findWhere(entity, filters) {
    const data = this.getData(entity);
    return data.filter(item => {
      return Object.keys(filters).every(key => {
        if (typeof filters[key] === 'string') {
          return item[key]?.toLowerCase().includes(filters[key].toLowerCase());
        }
        return item[key] === filters[key];
      });
    });
  }

  /**
   * Limpiar todos los datos
   */
  clearAll() {
    try {
      localStorage.removeItem('dashboard_users');
      localStorage.removeItem('dashboard_materias');
      localStorage.removeItem('dashboard_notas');
      this.initializeData();
      return true;
    } catch (error) {
      console.error('Error limpiando datos:', error);
      return false;
    }
  }
}

export default new DataService();