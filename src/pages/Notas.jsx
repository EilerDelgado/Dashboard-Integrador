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
  const [filteredNotas, setFilteredNotas] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [searchTerm] = useState('');
  const [filtroMateria] = useState('');
  const [filtroEstudiante] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Cargar datos
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const notasData = await DataService.getAll('notas');
      const materiasData = await DataService.getAll('materias');
      const estudiantesData = await DataService.getAll('usuarios');

      setNotas(notasData);
      setMaterias(materiasData);
      setEstudiantes(estudiantesData.filter(u => u.rol === 'estudiante'));
    } catch {
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtrar notas
  const filterNotas = useCallback(() => {
    let filtered = [...notas];

    // Filtro por rol
    if (user.rol === 'estudiante') {
      filtered = filtered.filter(nota => nota.estudianteId === user.id);
    } else if (user.rol === 'profesor') {
      // Obtener materias del profesor
      const materiasPorProfesor = materias.filter(m => m.profesorId === user.id);
      const materiaIds = materiasPorProfesor.map(m => m.id);
      filtered = filtered.filter(nota => materiaIds.includes(nota.materiaId));
    }

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(nota => {
        const estudiante = estudiantes.find(e => e.id === nota.estudianteId);
        const materia = materias.find(m => m.id === nota.materiaId);
        return (
          estudiante?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          materia?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Filtro por materia
    if (filtroMateria) {
      filtered = filtered.filter(nota => nota.materiaId === filtroMateria);
    }

    // Filtro por estudiante
    if (filtroEstudiante) {
      filtered = filtered.filter(nota => nota.estudianteId === filtroEstudiante);
    }

    setFilteredNotas(filtered);
  }, [notas, searchTerm, filtroMateria, filtroEstudiante, user, materias, estudiantes]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    filterNotas();
  }, [filterNotas]);

  // Crear o actualizar nota
  const onSubmit = async (data) => {
    try {
      const notaData = {
        ...data,
        calificacion: parseFloat(data.calificacion),
        fecha: data.fecha || new Date().toISOString().split('T')[0],
        observaciones: data.observaciones || ''
      };

      if (editingId) {
        await DataService.update('notas', editingId, notaData);
        toast.success('Nota actualizada exitosamente');
      } else {
        await DataService.create('notas', notaData);
        toast.success('Nota creada exitosamente');
      }

      await loadData();
      setShowModal(false);
      setEditingId(null);
      reset();
    } catch {
      toast.error('Error al guardar la nota');
    }
  };

  // Eliminar nota
  const eliminarNota = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta nota?')) {
      try {
        await DataService.delete('notas', id);
        toast.success('Nota eliminada exitosamente');
        await loadData();
      } catch {
        toast.error('Error al eliminar la nota');
      }
    }
  };

  // Editar nota
  const editarNota = (nota) => {
    setEditingId(nota.id);
    setValue('estudianteId', nota.estudianteId);
    setValue('materiaId', nota.materiaId);
    setValue('calificacion', nota.calificacion);
    setValue('fecha', nota.fecha);
    setValue('observaciones', nota.observaciones);
    setShowModal(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container-fluid">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">
          <GraduationCap className="me-2" size={32} />
          Gestión de Notas
        </h1>
        {(user.rol === 'admin' || user.rol === 'profesor') && (
          <button
            className="btn btn-primary btn-sm shadow-sm"
            onClick={() => {
              setEditingId(null);
              reset();
              setShowModal(true);
            }}
          >
            <Plus size={16} className="me-1" />
            Nueva Nota
          </button>
        )}
      </div>

      <div className="card shadow mb-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Materia</th>
                  <th>Calificación</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  {(user.rol === 'admin' || user.rol === 'profesor') && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {filteredNotas.map(nota => {
                  const estudiante = estudiantes.find(e => e.id === nota.estudianteId);
                  const materia = materias.find(m => m.id === nota.materiaId);
                  return (
                    <tr key={nota.id}>
                      <td>{estudiante?.nombre || 'N/A'}</td>
                      <td>{materia?.nombre || 'N/A'}</td>
                      <td>
                        <span className={`badge ${nota.calificacion >= 3.0 ? 'bg-success' : 'bg-danger'}`}>
                          {nota.calificacion.toFixed(1)}
                        </span>
                      </td>
                      <td>{new Date(nota.fecha).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${nota.calificacion >= 3.0 ? 'bg-success' : 'bg-danger'}`}>
                          {nota.calificacion >= 3.0 ? 'Aprobado' : 'Reprobado'}
                        </span>
                      </td>
                      {(user.rol === 'admin' || user.rol === 'profesor') && (
                        <td>
                          <div className="btn-group" role="group">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => editarNota(nota)}
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => eliminarNota(nota.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingId ? 'Editar Nota' : 'Nueva Nota'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowModal(false);
                      setEditingId(null);
                      reset();
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Estudiante</label>
                    <select
                      className={`form-select ${errors.estudianteId ? 'is-invalid' : ''}`}
                      {...register('estudianteId', { required: 'El estudiante es requerido' })}
                    >
                      <option value="">Seleccionar estudiante</option>
                      {estudiantes.map(estudiante => (
                        <option key={estudiante.id} value={estudiante.id}>
                          {estudiante.nombre}
                        </option>
                      ))}
                    </select>
                    {errors.estudianteId && (
                      <div className="invalid-feedback">{errors.estudianteId.message}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Materia</label>
                    <select
                      className={`form-select ${errors.materiaId ? 'is-invalid' : ''}`}
                      {...register('materiaId', { required: 'La materia es requerida' })}
                    >
                      <option value="">Seleccionar materia</option>
                      {materias.map(materia => (
                        <option key={materia.id} value={materia.id}>
                          {materia.nombre}
                        </option>
                      ))}
                    </select>
                    {errors.materiaId && (
                      <div className="invalid-feedback">{errors.materiaId.message}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Calificación</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      className={`form-control ${errors.calificacion ? 'is-invalid' : ''}`}
                      {...register('calificacion', {
                        required: 'La calificación es requerida',
                        min: { value: 0, message: 'La calificación mínima es 0' },
                        max: { value: 5, message: 'La calificación máxima es 5' }
                      })}
                    />
                    {errors.calificacion && (
                      <div className="invalid-feedback">{errors.calificacion.message}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Fecha</label>
                    <input
                      type="date"
                      className="form-control"
                      {...register('fecha')}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Observaciones</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      {...register('observaciones')}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setEditingId(null);
                      reset();
                    }}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingId ? 'Actualizar' : 'Crear'}
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