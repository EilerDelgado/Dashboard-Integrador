import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutModal from './LogoutModal';

export default function TopBar() {
    const [showModal, setShowModal] = useState(false);

    const handleLogoutClick = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                {/* Sidebar Toggle (Topbar) */}
                <button
                    id="sidebarToggleTop"
                    className="btn btn-link d-md-none rounded-circle mr-3"
                    onClick={() => {
                        // Aquí podrías emitir un evento o cambiar estado para abrir/cerrar sidebar
                        document.body.classList.toggle('sidebar-toggled');
                    }}
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
                                <i className="fas fa-search fa-sm"></i>
                            </button>
                        </div>
                    </div>
                </form>

                {/* Topbar Navbar */}
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item dropdown no-arrow">
                        <a
                            className="nav-link dropdown-toggle"
                            href="#!"
                            id="userDropdown"
                            role="button"
                            onClick={(e) => {
                                e.preventDefault();
                                // Toggle dropdown (puedes manejar con estado)
                            }}
                        >
                            <span id="nombre-usuario" className="mr-2 d-none d-lg-inline text-gray-600 small">
                                Admin Sistema
                            </span>
                            <img className="img-profile rounded-circle" src="/img/undraw_profile.svg" alt="Perfil" />
                        </a>
                        <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in">
                            <Link className="dropdown-item" to="/perfil">
                                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                Perfil
                            </Link>
                            <div className="dropdown-divider"></div>
                            <button
                                type="button"
                                className="dropdown-item"
                                onClick={handleLogoutClick}
                            >
                                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                Cerrar Sesión
                            </button>
                        </div>
                    </li>
                </ul>
            </nav>

            <LogoutModal show={showModal} onClose={closeModal} />
        </>
    );
}
