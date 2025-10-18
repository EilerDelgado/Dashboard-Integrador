import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  TrendingUp, 
  Calendar,
  Award,
  Clock,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import DataService from '../services/dataService';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const { usuario, hasRole } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const loadDashboardData = useCallback(() => {
    try {
      const users = DataService.getData('users');
      const materias = DataService.getData('materias');
      const notas = DataService.getData('notas');

      // Estadísticas generales
      const generalStats = {
        totalUsuarios: users.length,
        totalEstudiantes: users.filter(u => u.rol === 'estudiante').length,
        totalProfesores: users.filter(u => u.rol === 'profesor').length,
        totalMaterias: materias.length,
        totalNotas: notas.length,
        promedioGeneral: notas.length > 0 
          ? (notas.reduce((sum, nota) => sum + nota.nota, 0) / notas.length).toFixed(1)
          : 0
      };

      // Estadísticas específicas por rol
      if (usuario.rol === 'estudiante') {
        const misNotas = notas.filter(nota => nota.estudianteId === usuario.id);
        generalStats.misNotas = misNotas.length;
        generalStats.miPromedio = misNotas.length > 0 
          ? (misNotas.reduce((sum, nota) => sum + nota.nota, 0) / misNotas.length).toFixed(1)
          : 0;
        generalStats.materiasConNota = [...new Set(misNotas.map(n => n.materiaId))].length;
      }

      setStats(generalStats);

      // Actividad reciente
      const recent = notas
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 5)
        .map(nota => ({
          ...nota,
          estudianteNombre: users.find(u => u.id === nota.estudianteId)?.nombre + ' ' + 
                           users.find(u => u.id === nota.estudianteId)?.apellido,
          materiaNombre: materias.find(m => m.id === nota.materiaId)?.nombre
        }));

      setRecentActivity(recent);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [usuario.id, usuario.rol]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getNotaColor = (nota) => {
    if (nota >= 90) return 'success';
    if (nota >= 80) return 'info';
    if (nota >= 70) return 'warning';
    return 'danger';
  };

  if (loading) return <LoadingSpinner text="Cargando dashboard..." />;

  return (
    <div className="container-fluid">
      {/* Welcome Header */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h3 mb-0 text-gray-800">
            {getGreeting()}, {usuario?.nombre}! 👋
          </h1>
          <p className="text-muted mb-0">
            Aquí tienes un resumen de tu actividad académica
          </p>
        </div>
        <div className="text-end">
          <div className="text-xs text-gray-500">
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row">
        {/* Admin/Profesor Stats */}
        {hasRole(['admin', 'profesor']) && (
          <>
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                        Total Estudiantes
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {stats.totalEstudiantes}
                      </div>
                    </div>
                    <div className="col-auto">
                      <Users className="text-gray-300" size={32} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-success shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                        Total Materias
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {stats.totalMaterias}
                      </div>
                    </div>
                    <div className="col-auto">
                      <BookOpen className="text-gray-300" size={32} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-info shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                        Total Notas
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {stats.totalNotas}
                      </div>
                    </div>
                    <div className="col-auto">
                      <GraduationCap className="text-gray-300" size={32} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-warning shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                        Promedio General
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {stats.promedioGeneral}
                      </div>
                    </div>
                    <div className="col-auto">
                      <TrendingUp className="text-gray-300" size={32} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Student Stats */}
        {hasRole(['estudiante']) && (
          <>
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                        Mis Notas
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {stats.misNotas || 0}
                      </div>
                    </div>
                    <div className="col-auto">
                      <GraduationCap className="text-gray-300" size={32} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-success shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                        Mi Promedio
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {stats.miPromedio || 0}
                      </div>
                    </div>
                    <div className="col-auto">
                      <Award className="text-gray-300" size={32} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-info shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                        Materias con Nota
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {stats.materiasConNota || 0}
                      </div>
                    </div>
                    <div className="col-auto">
                      <BookOpen className="text-gray-300" size={32} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-warning shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                        Total Materias
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {stats.totalMaterias}
                      </div>
                    </div>
                    <div className="col-auto">
                      <BarChart3 className="text-gray-300" size={32} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Recent Activity */}
      <div className="row">
        <div className="col-lg-8 mb-4">
          <div className="card shadow">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">
                <Clock size={16} className="me-2" />
                Actividad Reciente
              </h6>
            </div>
            <div className="card-body">
              {recentActivity.length === 0 ? (
                <div className="text-center py-4">
                  <Clock size={48} className="text-muted mb-3" />
                  <p className="text-muted">No hay actividad reciente</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {recentActivity.map((nota, index) => (
                    <div key={index} className="list-group-item border-0 py-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <div className={`badge bg-${getNotaColor(nota.nota)} me-3`} style={{ fontSize: '0.9rem' }}>
                            {nota.nota}
                          </div>
                          <div>
                            <div className="font-weight-bold">
                              {hasRole(['estudiante']) ? nota.materiaNombre : `${nota.estudianteNombre} - ${nota.materiaNombre}`}
                            </div>
                            <div className="text-muted small">
                              {nota.observaciones || 'Sin observaciones'}
                            </div>
                          </div>
                        </div>
                        <div className="text-muted small text-end">
                          <Calendar size={14} className="me-1" />
                          {new Date(nota.fecha).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                Acciones Rápidas
              </h6>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                {hasRole(['admin', 'profesor']) && (
                  <>
                    <a href="/notas" className="list-group-item list-group-item-action border-0">
                      <div className="d-flex align-items-center">
                        <GraduationCap size={16} className="me-3 text-primary" />
                        <div>
                          <div className="font-weight-bold">Gestionar Notas</div>
                          <div className="text-muted small">Crear, editar y ver notas</div>
                        </div>
                      </div>
                    </a>
                    <a href="/materias" className="list-group-item list-group-item-action border-0">
                      <div className="d-flex align-items-center">
                        <BookOpen size={16} className="me-3 text-success" />
                        <div>
                          <div className="font-weight-bold">Gestionar Materias</div>
                          <div className="text-muted small">Administrar materias</div>
                        </div>
                      </div>
                    </a>
                  </>
                )}
                {hasRole(['estudiante']) && (
                  <a href="/notas" className="list-group-item list-group-item-action border-0">
                    <div className="d-flex align-items-center">
                      <GraduationCap size={16} className="me-3 text-primary" />
                      <div>
                        <div className="font-weight-bold">Ver Mis Notas</div>
                        <div className="text-muted small">Consultar calificaciones</div>
                      </div>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
