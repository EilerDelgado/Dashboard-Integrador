import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { 
  Home, 
  GraduationCap, 
  BookOpen, 
  Users, 
  BarChart3, 
  Settings,
  LogOut
} from "lucide-react";

export default function SideBar() {
  const { usuario, hasRole, logout } = useAuth();

  const menuItems = [
    {
      icon: Home,
      title: "Dashboard",
      to: "/",
      roles: ["admin", "profesor", "estudiante"]
    },
    {
      icon: GraduationCap,
      title: "Notas",
      to: "/notas",
      roles: ["admin", "profesor", "estudiante"]
    },
    {
      icon: BookOpen,
      title: "Materias",
      to: "/materias",
      roles: ["admin", "profesor"]
    },
    {
      icon: Users,
      title: "Usuarios",
      to: "/usuarios",
      roles: ["admin"]
    },
    {
      icon: BarChart3,
      title: "Reportes",
      to: "/reportes",
      roles: ["admin", "profesor"]
    }
  ];

  return (
    <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
      {/* Brand */}
      <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/">
        <div className="sidebar-brand-icon rotate-n-15">
          <i className="fas fa-graduation-cap" />
        </div>
        <div className="sidebar-brand-text mx-3">Dashboard Académico</div>
      </Link>

      <hr className="sidebar-divider my-0" />

      {/* Navigation Items */}
      {menuItems.map((item, index) => {
        if (!hasRole(item.roles)) return null;
        
        const IconComponent = item.icon;
        
        return (
          <li key={index} className="nav-item">
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
        <button 
          className="nav-link btn btn-link text-left text-white d-flex align-items-center"
          onClick={logout}
          style={{ border: 'none', background: 'none', width: '100%' }}
        >
          <LogOut size={16} className="me-2" />
          <span>Cerrar Sesión</span>
        </button>
      </li>

      <hr className="sidebar-divider d-none d-md-block" />

      {/* Sidebar Toggler */}
      <div className="text-center d-none d-md-inline">
        <button className="rounded-circle border-0" id="sidebarToggle" />
      </div>
    </ul>
  );
}
