import React from "react";
import SidebarCollapseItem from "./SidebarCollapseItem";
import { Link } from "react-router-dom";

export default function SideBar() {
    return (
        <div id="wrapper">
            <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
                {/* Brand */}
                <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/">
                    <div className="sidebar-brand-icon rotate-n-15">
                        <i className="fas fa-graduation-cap" />
                    </div>
                    <div className="sidebar-brand-text mx-3">Sistema Educativo</div>
                </Link>

                <hr className="sidebar-divider my-0" />

                {/* Dashboard */}
                <li className="nav-item">
                    <Link className="nav-link" to="/">
                        <i className="fas fa-fw fa-tachometer-alt" />
                        <span>Dashboard</span>
                    </Link>
                </li>

                <hr className="sidebar-divider" />

                <div className="sidebar-heading">Módulos Educativos</div>

                <SidebarCollapseItem
                    icon="fa-user-plus"
                    title="Ingreso y registro"
                    items={[
                        { to: "/estudiantes", text: "Ver Estudiantes" },
                        { to: "/estudiantes/crear", text: "Crear Estudiante" },
                    ]}
                />

                <SidebarCollapseItem
                    icon="fa-history"
                    title="Hy estudiantil"
                    items={[
                        { to: "/historial", text: "Ver Historial" },
                        { to: "/historial/crear", text: "Crear Registro" },
                    ]}
                />

                <SidebarCollapseItem
                    icon="fa-users"
                    title="Módulo Familiar"
                    items={[
                        { to: "/familiares", text: "Ver Familiares" },
                        { to: "/familiares/crear", text: "Crear Familiar" },
                    ]}
                />

                <SidebarCollapseItem
                    icon="fa-clipboard-list"
                    title="Seguimiento de notas"
                    items={[
                        { to: "/notas", text: "Ver Notas" },
                        { to: "/notas/crear", text: "Registrar Nota" },
                    ]}
                />

                <SidebarCollapseItem
                    icon="fa-calendar-check"
                    title="Asistencias"
                    items={[
                        { to: "/asistencias", text: "Ver Asistencias" },
                        { to: "/asistencias/crear", text: "Registrar Asistencia" },
                    ]}
                />

                <SidebarCollapseItem
                    icon="fa-heart"
                    title="Bienestar Estudiantil"
                    items={[
                        { to: "/bienestar", text: "Ver Registros" },
                        { to: "/bienestar/crear", text: "Crear Registro" },
                    ]}
                />

                <SidebarCollapseItem
                    icon="fa-chart-bar"
                    title="Estadísticas"
                    items={[
                        { to: "/estadisticas", text: "Ver Reportes" },
                    ]}
                />

                <hr className="sidebar-divider" />

                <div className="text-center d-none d-md-inline">
                    <button className="rounded-circle border-0" id="sidebarToggle" />
                </div>
            </ul>
        </div>
    );
}
