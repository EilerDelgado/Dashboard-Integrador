import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  BookOpen, 
  User, 
  Calendar,
  Eye,
  X
} from 'lucide-react';
import DataService from '../services/dataService';
import { useAuth } from '../context/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

const Materias = () => {
  const [materias, setMaterias] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [filteredMaterias, setFilteredMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMateria, setEditingMateria] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProfesor, setFilterProfesor] = useState('');
  
  const { hasRole } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterMaterias();
  }, [filterMaterias]);

  const loadData = () => {
    try {
      const materiasData = DataService.getData('materias');
      const profesoresData = DataService.findWhere('users', { rol: 'profesor' });
      
      setMaterias(materiasData);
      setProfesores(profesoresData);
    } catch {
      toast.error('Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  const filterMaterias = useCallback(() => {
    let filtered = materias;

    if (searchTerm) {
      filtered = filtered.filter(materia =>
        materia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        materia.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        materia.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterProfesor) {
      filtered = filtered.filter(materia => 
        materia.profesorId === parseInt(filterProfesor)
      );
    }

    setFilteredMaterias(filtered);
  }, [materias, searchTerm, filterProfesor]);

  const handleOpenModal = (materia = null) => {
    setEditingMateria(materia);
    if (materia) {
      reset({
        nombre: materia.nombre,
        codigo: materia.codigo,
        descripcion: materia.descripcion,
        profesorId: materia.profesorId,
        creditos: materia.creditos,
        activa: materia.activa
      });
    } else {
      reset({
        activa: true,
        creditos: 3
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMateria(null);
    reset();
  };

  const onSubmit = (data) => {
    try {
      if (editingMateria) {
        const updated = DataService.update('materias', editingMateria.id, {
          ...data,
          profesorId: parseInt(data.profesorId),
          creditos: parseInt(data.creditos)
        });
        if (updated) {
          setMaterias(prev => prev.map(m => m.id === editingMateria.id ? updated : m));
          toast.success('Materia actualizada exitosamente');
        }
      } else {
        const created = DataService.create('materias', {
          ...data,
          profesorId: parseInt(data.profesorId),
          creditos: parseInt(data.creditos)
        });
        if (created) {
          setMaterias(prev => [...prev, created]);
          toast.success('Materia creada exitosamente');
        }
      }
      handleCloseModal();
    } catch {
      toast.error('Error guardando la materia');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta materia?')) {
      try {
        const success = DataService.delete('materias', id);
        if (success) {
          setMaterias(prev => prev.filter(m => m.id !== id));
          toast.success('Materia eliminada exitosamente');
        }
      } catch {
        toast.error('Error eliminando la materia');
      }
    }
  };

  const getProfesorNombre = (profesorId) => {
    const profesor = profesores.find(p => p.id === profesorId);
    return profesor ? `${profesor.nombre} ${profesor.apellido}` : 'Sin asignar';
  };

  if (loading) return <LoadingSpinner text="Cargando materias..." />;

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">
          <BookOpen className="me-2" size={24} />
          Gestión de Materias
        </h1>
        {hasRole(['admin', 'profesor']) && (
          <button
            className="btn btn-primary btn-sm shadow-sm"
            onClick={() => handleOpenModal()}
          >
            <Plus size={16} className="me-1" />
            Nueva Materia
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Filtros</h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por nombre, código o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <select
                className="form-control"
                value={filterProfesor}
                onChange={(e) => setFilterProfesor(e.target.value)}
              >
                <option value="">Todos los profesores</option>
                {profesores.map(profesor => (
                  <option key={profesor.id} value={profesor.id}>
                    {profesor.nombre} {profesor.apellido}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Materias List */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Lista de Materias ({filteredMaterias.length})
          </h6>
        </div>
        <div className="card-body">
          {filteredMaterias.length === 0 ? (
            <div className="text-center py-4">
              <BookOpen size={48} className="text-muted mb-3" />
              <p className="text-muted">No se encontraron materias</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Profesor</th>
                    <th>Créditos</th>
                    <th>Estado</th>
                    <th>Fecha Creación</th>
                    {hasRole(['admin', 'profesor']) && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredMaterias.map(materia => (
                    <tr key={materia.id}>
                      <td>
                        <span className="badge bg-secondary">{materia.codigo}</span>
                      </td>
                      <td className="fw-bold">{materia.nombre}</td>
                      <td>
                        <div className="text-truncate" style={{ maxWidth: '200px' }}>
                          {materia.descripcion}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <User size={16} className="me-2 text-muted" />
                          {getProfesorNombre(materia.profesorId)}
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-info">{materia.creditos}</span>
                      </td>
                      <td>
                        <span className={`badge ${materia.activa ? 'bg-success' : 'bg-danger'}`}>
                          {materia.activa ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Calendar size={16} className="me-2 text-muted" />
                          {new Date(materia.fechaCreacion).toLocaleDateString()}
                        </div>
                      </td>
                      {hasRole(['admin', 'profesor']) && (
                        <td>
                          <div className="btn-group" role="group">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleOpenModal(materia)}
                              title="Editar"
                            >
                              <Edit3 size={14} />
                            </button>
                            {hasRole(['admin']) && (
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(materia.id)}
                                title="Eliminar"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
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
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingMateria ? 'Editar Materia' : 'Nueva Materia'}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nombre *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                        {...register('nombre', {
                          required: 'El nombre es obligatorio',
                          minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                        })}
                      />
                      {errors.nombre && (
                        <div className="invalid-feedback">{errors.nombre.message}</div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Código *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.codigo ? 'is-invalid' : ''}`}
                        {...register('codigo', {
                          required: 'El código es obligatorio',
                          pattern: {
                            value: /^[A-Z0-9]+$/,
                            message: 'Solo letras mayúsculas y números'
                          }
                        })}
                      />
                      {errors.codigo && (
                        <div className="invalid-feedback">{errors.codigo.message}</div>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      {...register('descripcion')}
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Profesor *</label>
                      <select
                        className={`form-control ${errors.profesorId ? 'is-invalid' : ''}`}
                        {...register('profesorId', {
                          required: 'Selecciona un profesor'
                        })}
                      >
                        <option value="">Seleccionar profesor</option>
                        {profesores.map(profesor => (
                          <option key={profesor.id} value={profesor.id}>
                            {profesor.nombre} {profesor.apellido}
                          </option>
                        ))}
                      </select>
                      {errors.profesorId && (
                        <div className="invalid-feedback">{errors.profesorId.message}</div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Créditos *</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        className={`form-control ${errors.creditos ? 'is-invalid' : ''}`}
                        {...register('creditos', {
                          required: 'Los créditos son obligatorios',
                          min: { value: 1, message: 'Mínimo 1 crédito' },
                          max: { value: 10, message: 'Máximo 10 créditos' }
                        })}
                      />
                      {errors.creditos && (
                        <div className="invalid-feedback">{errors.creditos.message}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="activa"
                      {...register('activa')}
                    />
                    <label className="form-check-label" htmlFor="activa">
                      Materia activa
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingMateria ? 'Actualizar' : 'Crear'}
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

export default Materias;