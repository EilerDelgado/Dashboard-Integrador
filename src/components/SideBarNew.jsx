import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  BookOpen, 
  GraduationCap, 
  Users,
  Settings,
  User,
  LogOut,
  UserPlus,
  History,
  UsersRound,
  ClipboardList,
  CalendarCheck,
  Heart,
  BarChart3,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../context/useAuth";

const SideBar = () => {
  const { usuario, hasRole, logout } = useAuth();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (menuId) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const menuItems = [
    {
      to: "/dashboard",
      title: "Dashboard",
      icon: Home,
      roles: ["admin", "profesor", "estudiante"]
    },
    {
      id: "ingreso",
      title: "Ingreso y Registro",
      icon: UserPlus,
      roles: ["admin", "profesor"],
      submenu: [
        {
          to: "/estudiantes",
          title: "Ver Estudiantes",
          roles: ["admin", "profesor"]
        },
        {
          to: "/estudiantes/crear",
          title: "Crear Estudiante",
          roles: ["admin"]
        }
      ]
    },
    {
      id: "historial",
      title: "Historial Estudiantil",
      icon: History,
      roles: ["admin", "profesor"],
      submenu: [
        {
          to: "/historial",
          title: "Ver Historial",
          roles: ["admin", "profesor"]
        },
        {
          to: "/historial/crear",
          title: "Crear Registro",
          roles: ["admin", "profesor"]
        }
      ]
    },
    {
      id: "familiar",
      title: "Módulo Familiar",
      icon: UsersRound,
      roles: ["admin", "profesor", "estudiante"],
      submenu: [
        {
          to: "/familiares",
          title: "Ver Familiares",
          roles: ["admin", "profesor", "estudiante"]
        },
        {
          to: "/familiares/crear",
          title: "Crear Familiar",
          roles: ["admin", "estudiante"]
        }
      ]
    },
    {
      id: "notas",
      title: "Seguimiento de Notas",
      icon: ClipboardList,
      roles: ["admin", "profesor", "estudiante"],
      submenu: [
        {
          to: "/notas",
          title: "Ver Notas",
          roles: ["admin", "profesor", "estudiante"]
        },
        {
          to: "/notas/crear",
          title: "Registrar Nota",
          roles: ["admin", "profesor"]
        }
      ]
    },
    {
      id: "asistencias",
      title: "Asistencias",
      icon: CalendarCheck,
      roles: ["admin", "profesor", "estudiante"],
      submenu: [
        {
          to: "/asistencias",
          title: "Ver Asistencias",
          roles: ["admin", "profesor", "estudiante"]
        },
        {
          to: "/asistencias/crear",
          title: "Registrar Asistencia",
          roles: ["admin", "profesor"]
        }
      ]
    },
    {
      id: "bienestar",
      title: "Bienestar Estudiantil",
      icon: Heart,
      roles: ["admin", "profesor"],
      submenu: [
        {
          to: "/bienestar",
          title: "Ver Registros",
          roles: ["admin", "profesor"]
        },
        {
          to: "/bienestar/crear",
          title: "Crear Registro",
          roles: ["admin", "profesor"]
        }
      ]
    },
    {
      id: "materias",
      title: "Materias",
      icon: BookOpen,
      roles: ["admin", "profesor"],
      submenu: [
        {
          to: "/materias",
          title: "Ver Materias",
          roles: ["admin", "profesor"]
        },
        {
          to: "/materias/crear",
          title: "Crear Materia",
          roles: ["admin"]
        }
      ]
    },
    {
      id: "estadisticas",
      title: "Estadísticas",
      icon: BarChart3,
      roles: ["admin", "profesor"],
      submenu: [
        {
          to: "/estadisticas",
          title: "Ver Reportes",
          roles: ["admin", "profesor"]
        }
      ]
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const isMenuActive = (submenu) => {
    return submenu?.some(item => location.pathname === item.to);
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      logout();
    }
  };

  return (
    <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
      {/* Brand */}
      <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/dashboard">
        <div className="sidebar-brand-icon rotate-n-15">
          <i className="fas fa-graduation-cap" />
        </div>
        <div className="sidebar-brand-text mx-3">Sistema Educativo</div>
      </Link>

      <hr className="sidebar-divider my-0" />

      {/* Navigation Items */}
      {menuItems.map((item, index) => {
        if (!hasRole(item.roles)) return null;
        
        const IconComponent = item.icon;
        
        // Si tiene submenú
        if (item.submenu) {
          const isOpen = openMenus[item.id];
          const hasActiveSubmenu = isMenuActive(item.submenu);
          
          return (
            <li key={index} className={`nav-item ${hasActiveSubmenu ? 'active' : ''}`}>
              <a
                className="nav-link collapsed"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  toggleMenu(item.id);
                }}
                aria-expanded={isOpen}
              >
                <div className="d-flex align-items-center justify-content-between w-100">
                  <div className="d-flex align-items-center">
                    <IconComponent size={16} className="me-2" />
                    <span>{item.title}</span>
                  </div>
                  {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </div>
              </a>
              <div className={`collapse ${isOpen || hasActiveSubmenu ? 'show' : ''}`}>
                <div className="bg-white py-2 collapse-inner rounded">
                  <h6 className="collapse-header">Acciones:</h6>
                  {item.submenu.map((subItem, subIndex) => {
                    if (!hasRole(subItem.roles)) return null;
                    
                    return (
                      <Link
                        key={subIndex}
                        className={`collapse-item ${isActiveRoute(subItem.to) ? 'active' : ''}`}
                        to={subItem.to}
                      >
                        {subItem.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </li>
          );
        }
        
        // Si es un item simple
        const isActive = isActiveRoute(item.to);
        
        return (
          <li key={index} className={`nav-item ${isActive ? 'active' : ''}`}>
            <Link className="nav-link" to={item.to}>
              <div className="d-flex align-items-center">
                <IconComponent size={16} className="me-2" />
                <span>{item.title}</span>
              </div>
            </Link>
          </li>
        );
      })}

      <hr className="sidebar-divider" />

      {/* User Info */}
      <div className="sidebar-heading">Usuario</div>
      
      <li className="nav-item">
        <div className="nav-link">
          <div className="d-flex align-items-center">
            <img
              src={usuario?.avatar}
              alt="Avatar"
              className="rounded-circle me-2"
              style={{ width: '32px', height: '32px' }}
            />
            <div>
              <div className="text-white small font-weight-bold">
                {usuario?.nombre} {usuario?.apellido}
              </div>
              <div className="text-white-50 small">
                {usuario?.rol?.charAt(0).toUpperCase() + usuario?.rol?.slice(1)}
              </div>
            </div>
          </div>
        </div>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/perfil">
          <div className="d-flex align-items-center">
            <User size={16} className="me-2" />
            <span>Mi Perfil</span>
          </div>
        </Link>
      </li>

      {hasRole(['admin']) && (
        <li className="nav-item">
          <Link className="nav-link" to="/configuracion">
            <div className="d-flex align-items-center">
              <Settings size={16} className="me-2" />
              <span>Configuración</span>
            </div>
          </Link>
        </li>
      )}

      <hr className="sidebar-divider d-none d-md-block" />

      <li className="nav-item">
        <button 
          className="nav-link btn btn-link text-start w-100 border-0"
          onClick={handleLogout}
          style={{ backgroundColor: 'transparent' }}
        >
          <div className="d-flex align-items-center">
            <LogOut size={16} className="me-2" />
            <span>Cerrar Sesión</span>
          </div>
        </button>
      </li>

      {/* Sidebar Toggler */}
      <div className="text-center d-none d-md-inline">
        <button className="rounded-circle border-0" id="sidebarToggle"></button>
      </div>
    </ul>
  );
};

export default SideBar;