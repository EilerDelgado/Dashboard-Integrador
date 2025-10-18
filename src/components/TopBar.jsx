import React, { useState } from 'react';
import { Search, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/useAuth';

const TopBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      {/* Sidebar Toggle (Topbar) */}
      <button
        id="sidebarToggleTop"
        className="btn btn-link d-md-none rounded-circle mr-3"
      >
        <i className="fa fa-bars"></i>
      </button>

      {/* Topbar Search */}
      <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
        <div className="input-group">
          <input
            type="text"
            className="form-control bg-light border-0 small"
            placeholder="Buscar..."
            aria-label="Search"
            aria-describedby="basic-addon2"
          />
          <div className="input-group-append">
            <button className="btn btn-primary" type="button">
              <Search size={16} />
            </button>
          </div>
        </div>
      </form>

      {/* Topbar Navbar */}
      <ul className="navbar-nav ml-auto">
        {/* Nav Item - Search Dropdown (Visible Only XS) */}
        <li className="nav-item dropdown no-arrow d-sm-none">
          <a
            className="nav-link dropdown-toggle"
            href="#!"
            id="searchDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <Search size={16} />
          </a>
        </li>

        {/* Nav Item - Alerts */}
        <li className="nav-item dropdown no-arrow mx-1">
          <a
            className="nav-link dropdown-toggle"
            href="#!"
            id="alertsDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <Bell size={18} />
            <span className="badge badge-danger badge-counter">3+</span>
          </a>
        </li>

        {/* Nav Item - User Information */}
        <li className="nav-item dropdown no-arrow">
          <div className="nav-link dropdown-toggle" style={{ cursor: 'pointer' }}>
            <div className="d-flex align-items-center position-relative">
              <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                {user?.nombre || 'Usuario'}
              </span>
              <div 
                className="d-flex align-items-center"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <User className="img-profile rounded-circle bg-primary text-white p-1" size={32} />
              </div>
              
              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in show position-absolute" 
                     style={{ top: '100%', right: 0, zIndex: 1000 }}>
                  <a className="dropdown-item" href="#!">
                    <User size={16} className="mr-2 text-gray-400" />
                    Perfil
                  </a>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="mr-2 text-gray-400" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </li>
      </ul>

      {/* Overlay to close dropdown */}
      {showDropdown && (
        <div
          className="position-fixed w-100 h-100"
          style={{ top: 0, left: 0, zIndex: 999 }}
          onClick={() => setShowDropdown(false)}
        />
      )}
    </nav>
  );
};

export default TopBar;