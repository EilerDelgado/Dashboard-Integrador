import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  GraduationCap, 
  User, 
  BookOpen,
  Calendar,
  TrendingUp,
  Award
} from 'lucide-react';
import DataService from '../services/dataService';
import { useAuth } from '../context/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

const Notas = () => {
  const [notas, setNotas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [filteredNotas, setFilteredNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNota, setEditingNota] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMateria, setFilterMateria] = useState('');
  const [filterEstudiante, setFilterEstudiante] = useState('');
  const [filterPeriodo, setFilterPeriodo] = useState('');
  
  const { usuario, hasRole } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  // Funciones auxiliares primero
  const getEstudianteNombre = useCallback((estudianteId) => {
    const estudiante = estudiantes.find(e => e.id === estudianteId);
    return estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : 'Estudiante no encontrado';
  }, [estudiantes]);

  const getMateriaNombre = useCallback((materiaId) => {
    const materia = materias.find(m => m.id === materiaId);
    return materia ? materia.nombre : 'Materia no encontrada';
  }, [materias]);

  const loadData = useCallback(() => {
    try {
      let notasData = DataService.getData('notas');
      
      // Si es estudiante, solo ver sus notas
      if (usuario.rol === 'estudiante') {
        notasData = notasData.filter(nota => nota.estudianteId === usuario.id);
      }
      
      const estudiantesData = DataService.findWhere('users', { rol: 'estudiante' });
      const materiasData = DataService.getData('materias');
      
      setNotas(notasData);
      setEstudiantes(estudiantesData);
      setMaterias(materiasData);
    } finally {
      setLoading(false);
    }
  }, [usuario.rol, usuario.id]);

  const filterNotas = useCallback(() => {
    let filtered = notas;

    if (searchTerm) {
      filtered = filtered.filter(nota => {
        const estudiante = getEstudianteNombre(nota.estudianteId);
        const materia = getMateriaNombre(nota.materiaId);
        return estudiante.toLowerCase().includes(searchTerm.toLowerCase()) ||
               materia.toLowerCase().includes(searchTerm.toLowerCase()) ||
               nota.observaciones?.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    if (filterMateria) {
      filtered = filtered.filter(nota => nota.materiaId === parseInt(filterMateria));
    }

    if (filterEstudiante) {
      filtered = filtered.filter(nota => nota.estudianteId === parseInt(filterEstudiante));
    }

    if (filterPeriodo) {
      filtered = filtered.filter(nota => nota.periodo === filterPeriodo);
    }

    setFilteredNotas(filtered);
  }, [notas, searchTerm, filterMateria, filterEstudiante, filterPeriodo, getEstudianteNombre, getMateriaNombre]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    filterNotas();
  }, [filterNotas]);

  const handleOpenModal = (nota = null) => {
    setEditingNota(nota);
    if (nota) {
      reset({
        estudianteId: nota.estudianteId,
        materiaId: nota.materiaId,
        nota: nota.nota,
        periodo: nota.periodo,
        observaciones: nota.observaciones
      });
    } else {
      reset({
        periodo: '2024-1',
        nota: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingNota(null);
    reset();
  };

  const onSubmit = (data) => {
    try {
      const notaData = {
        ...data,
        estudianteId: parseInt(data.estudianteId),
        materiaId: parseInt(data.materiaId),
        nota: parseFloat(data.nota)
      };

      if (editingNota) {
        const updated = DataService.update('notas', editingNota.id, notaData);
        if (updated) {
          setNotas(prev => prev.map(n => n.id === editingNota.id ? updated : n));
          toast.success('Nota actualizada exitosamente');
        }
      } else {
        const created = DataService.create('notas', notaData);
        if (created) {
          setNotas(prev => [...prev, created]);
          toast.success('Nota creada exitosamente');
        }
      }
      handleCloseModal();
    } catch {
      toast.error('Error guardando la nota');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
      try {
        const success = DataService.delete('notas', id);
        if (success) {
          setNotas(prev => prev.filter(n => n.id !== id));
          toast.success('Nota eliminada exitosamente');
        }
      } catch {
        toast.error('Error eliminando la nota');
      }
    }
  };

  const getNotaColor = (nota) => {
    if (nota >= 90) return 'success';
    if (nota >= 80) return 'info';
    if (nota >= 70) return 'warning';
    return 'danger';
  };

  const getPromedio = () => {
    if (filteredNotas.length === 0) return 0;
    const suma = filteredNotas.reduce((acc, nota) => acc + nota.nota, 0);
    return (suma / filteredNotas.length).toFixed(1);
  };

  const getPeriodos = () => {
    const periodos = [...new Set(notas.map(nota => nota.periodo))];
    return periodos.sort();
  };

  if (loading) return <LoadingSpinner text="Cargando notas..." />;

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">
          <GraduationCap className="me-2" size={24} />
          Gestión de Notas
        </h1>
        {hasRole(['admin', 'profesor']) && (
          <button
            className="btn btn-primary btn-sm shadow-sm"
            onClick={() => handleOpenModal()}
          >
            <Plus size={16} className="me-1" />
            Nueva Nota
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Notas
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {filteredNotas.length}
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
                    Promedio General
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {getPromedio()}
                  </div>
                </div>
                <div className="col-auto">
                  <TrendingUp className="text-gray-300" size={32} />
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
                    Notas Excelentes (≥90)
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {filteredNotas.filter(n => n.nota >= 90).length}
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
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Materias Diferentes
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {[...new Set(filteredNotas.map(n => n.materiaId))].length}
                  </div>
                </div>
                <div className="col-auto">
                  <BookOpen className="text-gray-300" size={32} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Filtros</h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3 mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <select
                className="form-control"
                value={filterMateria}
                onChange={(e) => setFilterMateria(e.target.value)}
              >
                <option value="">Todas las materias</option>
                {materias.map(materia => (
                  <option key={materia.id} value={materia.id}>
                    {materia.nombre}
                  </option>
                ))}
              </select>
            </div>
            {hasRole(['admin', 'profesor']) && (
              <div className="col-md-3 mb-3">
                <select
                  className="form-control"
                  value={filterEstudiante}
                  onChange={(e) => setFilterEstudiante(e.target.value)}
                >
                  <option value="">Todos los estudiantes</option>
                  {estudiantes.map(estudiante => (
                    <option key={estudiante.id} value={estudiante.id}>
                      {estudiante.nombre} {estudiante.apellido}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="col-md-3 mb-3">
              <select
                className="form-control"
                value={filterPeriodo}
                onChange={(e) => setFilterPeriodo(e.target.value)}
              >
                <option value="">Todos los períodos</option>
                {getPeriodos().map(periodo => (
                  <option key={periodo} value={periodo}>
                    {periodo}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notas List */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Lista de Notas ({filteredNotas.length})
          </h6>
        </div>
        <div className="card-body">
          {filteredNotas.length === 0 ? (
            <div className="text-center py-4">
              <GraduationCap size={48} className="text-muted mb-3" />
              <p className="text-muted">No se encontraron notas</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    {hasRole(['admin', 'profesor']) && <th>Estudiante</th>}
                    <th>Materia</th>
                    <th>Nota</th>
                    <th>Período</th>
                    <th>Observaciones</th>
                    <th>Fecha</th>
                    {hasRole(['admin', 'profesor']) && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredNotas.map(nota => (
                    <tr key={nota.id}>
                      {hasRole(['admin', 'profesor']) && (
                        <td>
                          <div className="d-flex align-items-center">
                            <User size={16} className="me-2 text-muted" />
                            {getEstudianteNombre(nota.estudianteId)}
                          </div>
                        </td>
                      )}
                      <td>
                        <div className="d-flex align-items-center">
                          <BookOpen size={16} className="me-2 text-muted" />
                          {getMateriaNombre(nota.materiaId)}
                        </div>
                      </td>
                      <td>
                        <span className={`badge bg-${getNotaColor(nota.nota)} fs-6`}>
                          {nota.nota}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-secondary">{nota.periodo}</span>
                      </td>
                      <td>
                        <div className="text-truncate" style={{ maxWidth: '200px' }}>
                          {nota.observaciones || 'Sin observaciones'}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Calendar size={16} className="me-2 text-muted" />
                          {new Date(nota.fecha).toLocaleDateString()}
                        </div>
                      </td>
                      {hasRole(['admin', 'profesor']) && (
                        <td>
                          <div className="btn-group" role="group">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleOpenModal(nota)}
                              title="Editar"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(nota.id)}
                              title="Eliminar"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingNota ? 'Editar Nota' : 'Nueva Nota'}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Estudiante *</label>
                    <select
                      className={`form-control ${errors.estudianteId ? 'is-invalid' : ''}`}
                      {...register('estudianteId', {
                        required: 'Selecciona un estudiante'
                      })}
                    >
                      <option value="">Seleccionar estudiante</option>
                      {estudiantes.map(estudiante => (
                        <option key={estudiante.id} value={estudiante.id}>
                          {estudiante.nombre} {estudiante.apellido}
                        </option>
                      ))}
                    </select>
                    {errors.estudianteId && (
                      <div className="invalid-feedback">{errors.estudianteId.message}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Materia *</label>
                    <select
                      className={`form-control ${errors.materiaId ? 'is-invalid' : ''}`}
                      {...register('materiaId', {
                        required: 'Selecciona una materia'
                      })}
                    >
                      <option value="">Seleccionar materia</option>
                      {materias.map(materia => (
                        <option key={materia.id} value={materia.id}>
                          {materia.nombre} ({materia.codigo})
                        </option>
                      ))}
                    </select>
                    {errors.materiaId && (
                      <div className="invalid-feedback">{errors.materiaId.message}</div>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nota *</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        className={`form-control ${errors.nota ? 'is-invalid' : ''}`}
                        {...register('nota', {
                          required: 'La nota es obligatoria',
                          min: { value: 0, message: 'La nota mínima es 0' },
                          max: { value: 100, message: 'La nota máxima es 100' }
                        })}
                      />
                      {errors.nota && (
                        <div className="invalid-feedback">{errors.nota.message}</div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Período *</label>
                      <select
                        className={`form-control ${errors.periodo ? 'is-invalid' : ''}`}
                        {...register('periodo', {
                          required: 'Selecciona un período'
                        })}
                      >
                        <option value="">Seleccionar período</option>
                        <option value="2024-1">2024-1</option>
                        <option value="2024-2">2024-2</option>
                        <option value="2025-1">2025-1</option>
                        <option value="2025-2">2025-2</option>
                      </select>
                      {errors.periodo && (
                        <div className="invalid-feedback">{errors.periodo.message}</div>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Observaciones</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Comentarios adicionales sobre la nota..."
                      {...register('observaciones')}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingNota ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notas;