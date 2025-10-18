import React, { useState } from 'react';
import { Bell, Search, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export default function TopBar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { usuario, logout, getUserStats } = useAuth();
  
  const stats = getUserStats();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      {/* Sidebar Toggle (Topbar) */}
      <button
        id="sidebarToggleTop"
        className="btn btn-link d-md-none rounded-circle me-3"
        onClick={() => {
          document.body.classList.toggle('sidebar-toggled');
        }}
      >
        <i className="fa fa-bars"></i>
      </button>

      {/* Topbar Search */}
      <form className="d-none d-sm-inline-block form-inline me-auto ms-md-3 my-2 my-md-0 mw-100 navbar-search">
        <div className="input-group">
          <input
            type="text"
            className="form-control bg-light border-0 small"
            placeholder="Buscar..."
            aria-label="Search"
          />
          <div className="input-group-append">
            <button className="btn btn-primary" type="button">
              <Search size={16} />
            </button>
          </div>
        </div>
      </form>

      {/* Topbar Navbar */}
      <ul className="navbar-nav ms-auto">
        {/* Notifications */}
        <li className="nav-item dropdown no-arrow mx-1">
          <a
            className="nav-link dropdown-toggle"
            href="#"
            id="alertsDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <Bell size={18} />
            <span className="badge badge-danger badge-counter">3+</span>
          </a>
        </li>

        {/* User Information */}
        <li className="nav-item dropdown no-arrow">
          <a
            className="nav-link dropdown-toggle"
            href="#"
            id="userDropdown"
            role="button"
            onClick={toggleDropdown}
            aria-haspopup="true"
            aria-expanded={showDropdown}
          >
            <div className="d-flex align-items-center">
              <div className="me-3 text-end d-none d-lg-block">
                <span className="text-gray-600 small">
                  {usuario?.nombre} {usuario?.apellido}
                </span>
                <br />
                <span className="text-gray-500 small">
                  {usuario?.rol?.charAt(0).toUpperCase() + usuario?.rol?.slice(1)}
                </span>
              </div>
              <img
                className="img-profile rounded-circle"
                src={usuario?.avatar}
                alt="Profile"
                style={{ width: '40px', height: '40px' }}
              />
            </div>
          </a>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div 
              className="dropdown-menu dropdown-menu-end shadow animated--grow-in show"
              style={{ 
                position: 'absolute',
                right: 0,
                top: '100%',
                zIndex: 1000,
                minWidth: '280px'
              }}
            >
              {/* User Info Header */}
              <div className="dropdown-header bg-gradient-primary text-white">
                <div className="d-flex align-items-center">
                  <img
                    src={usuario?.avatar}
                    alt="Profile"
                    className="rounded-circle me-3"
                    style={{ width: '50px', height: '50px' }}
                  />
                  <div>
                    <h6 className="mb-0">{usuario?.nombre} {usuario?.apellido}</h6>
                    <small className="text-white-50">{usuario?.email}</small>
                  </div>
                </div>
              </div>

              {/* Stats for Students */}
              {usuario?.rol === 'estudiante' && stats && (
                <>
                  <div className="dropdown-header">Estadísticas</div>
                  <div className="px-3 py-2">
                    <div className="row text-center">
                      <div className="col-6">
                        <div className="text-primary font-weight-bold">{stats.totalMaterias}</div>
                        <div className="text-xs text-gray-500">Materias</div>
                      </div>
                      <div className="col-6">
                        <div className="text-success font-weight-bold">{stats.promedioGeneral}</div>
                        <div className="text-xs text-gray-500">Promedio</div>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                </>
              )}

              {/* Menu Items */}
              <a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}>
                <User size={16} className="me-2" />
                Mi Perfil
              </a>
              
              <a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}>
                <Settings size={16} className="me-2" />
                Configuración
              </a>

              <div className="dropdown-divider"></div>

              <button 
                className="dropdown-item text-danger" 
                onClick={handleLogout}
              >
                <LogOut size={16} className="me-2" />
                Cerrar Sesión
              </button>
            </div>
          )}
        </li>
      </ul>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="position-fixed w-100 h-100"
          style={{ 
            top: 0, 
            left: 0, 
            zIndex: 999 
          }}
          onClick={() => setShowDropdown(false)}
        />
      )}
    </nav>
  );
}