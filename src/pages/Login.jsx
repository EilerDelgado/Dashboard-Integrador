import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, User, Mail, Lock, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../context/useAuth';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, register, loading, isAuthenticated } = useAuth();

  const {
    register: registerForm,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm();

  // Redirigir si ya está autenticado
  if (isAuthenticated) {
    return <Navigate to="/notas" replace />;
  }

  const onSubmit = async (data) => {
    if (isRegister) {
      const response = await register(data);
      if (response.success) {
        reset();
      }
    } else {
      await login(data.email, data.password);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    reset();
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const watchPassword = watch('password');

  return (
    <div className="bg-gradient-primary min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-8 col-md-9">
            <div className="card o-hidden border-0 shadow-lg">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="p-5">
                      {/* Header */}
                      <div className="text-center mb-4">
                        <div className="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle mb-3" 
                             style={{ width: '60px', height: '60px' }}>
                          {isRegister ? (
                            <UserPlus className="text-white" size={28} />
                          ) : (
                            <LogIn className="text-white" size={28} />
                          )}
                        </div>
                        <h1 className="h4 text-gray-900 mb-2">
                          {isRegister ? '¡Crear Cuenta!' : '¡Bienvenido de Nuevo!'}
                        </h1>
                        <p className="text-muted">
                          {isRegister 
                            ? 'Crea tu cuenta para acceder al dashboard' 
                            : 'Inicia sesión para continuar'
                          }
                        </p>
                      </div>

                      {/* Demo Credentials */}
                      {!isRegister && (
                        <div className="alert alert-info alert-dismissible fade show" role="alert">
                          <strong>Credenciales de prueba:</strong><br />
                          <small>
                            <strong>Admin:</strong> admin@dashboard.com / admin123<br />
                            <strong>Profesor:</strong> profesor@dashboard.com / profesor123<br />
                            <strong>Estudiante:</strong> estudiante@dashboard.com / estudiante123
                          </small>
                        </div>
                      )}

                      {/* Form */}
                      <form onSubmit={handleSubmit(onSubmit)} className="user">
                        {isRegister && (
                          <div className="row">
                            <div className="col-sm-6 mb-3">
                              <div className="form-group">
                                <div className="input-group">
                                  <span className="input-group-text">
                                    <User size={16} />
                                  </span>
                                  <input
                                    type="text"
                                    className={`form-control form-control-user ${errors.nombre ? 'is-invalid' : ''}`}
                                    placeholder="Nombre"
                                    {...registerForm('nombre', {
                                      required: 'El nombre es obligatorio',
                                      minLength: {
                                        value: 2,
                                        message: 'Mínimo 2 caracteres'
                                      }
                                    })}
                                  />
                                </div>
                                {errors.nombre && (
                                  <div className="invalid-feedback d-block">
                                    {errors.nombre.message}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                              <div className="form-group">
                                <div className="input-group">
                                  <span className="input-group-text">
                                    <User size={16} />
                                  </span>
                                  <input
                                    type="text"
                                    className={`form-control form-control-user ${errors.apellido ? 'is-invalid' : ''}`}
                                    placeholder="Apellido"
                                    {...registerForm('apellido', {
                                      required: 'El apellido es obligatorio',
                                      minLength: {
                                        value: 2,
                                        message: 'Mínimo 2 caracteres'
                                      }
                                    })}
                                  />
                                </div>
                                {errors.apellido && (
                                  <div className="invalid-feedback d-block">
                                    {errors.apellido.message}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="form-group mb-3">
                          <div className="input-group">
                            <span className="input-group-text">
                              <Mail size={16} />
                            </span>
                            <input
                              type="email"
                              className={`form-control form-control-user ${errors.email ? 'is-invalid' : ''}`}
                              placeholder="Correo Electrónico"
                              {...registerForm('email', {
                                required: 'El email es obligatorio',
                                pattern: {
                                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                  message: 'Email inválido'
                                }
                              })}
                            />
                          </div>
                          {errors.email && (
                            <div className="invalid-feedback d-block">
                              {errors.email.message}
                            </div>
                          )}
                        </div>

                        <div className="form-group mb-3">
                          <div className="input-group">
                            <span className="input-group-text">
                              <Lock size={16} />
                            </span>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              className={`form-control form-control-user ${errors.password ? 'is-invalid' : ''}`}
                              placeholder="Contraseña"
                              {...registerForm('password', {
                                required: 'La contraseña es obligatoria',
                                minLength: {
                                  value: 6,
                                  message: 'Mínimo 6 caracteres'
                                }
                              })}
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                          {errors.password && (
                            <div className="invalid-feedback d-block">
                              {errors.password.message}
                            </div>
                          )}
                        </div>

                        {isRegister && (
                          <>
                            <div className="form-group mb-3">
                              <div className="input-group">
                                <span className="input-group-text">
                                  <Lock size={16} />
                                </span>
                                <input
                                  type={showConfirmPassword ? 'text' : 'password'}
                                  className={`form-control form-control-user ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                  placeholder="Confirmar Contraseña"
                                  {...registerForm('confirmPassword', {
                                    required: 'Confirma tu contraseña',
                                    validate: value =>
                                      value === watchPassword || 'Las contraseñas no coinciden'
                                  })}
                                />
                                <button
                                  type="button"
                                  className="btn btn-outline-secondary"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                              </div>
                              {errors.confirmPassword && (
                                <div className="invalid-feedback d-block">
                                  {errors.confirmPassword.message}
                                </div>
                              )}
                            </div>

                            <div className="form-group mb-3">
                              <select
                                className={`form-control form-control-user ${errors.rol ? 'is-invalid' : ''}`}
                                {...registerForm('rol', {
                                  required: 'Selecciona un rol'
                                })}
                                defaultValue=""
                              >
                                <option value="">Seleccionar Rol</option>
                                <option value="estudiante">Estudiante</option>
                                <option value="profesor">Profesor</option>
                              </select>
                              {errors.rol && (
                                <div className="invalid-feedback d-block">
                                  {errors.rol.message}
                                </div>
                              )}
                            </div>
                          </>
                        )}

                        <button
                          type="submit"
                          className="btn btn-primary btn-user btn-block w-100 py-2"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" />
                              Procesando...
                            </>
                          ) : (
                            <>
                              {isRegister ? (
                                <>
                                  <UserPlus size={16} className="me-2" />
                                  Crear Cuenta
                                </>
                              ) : (
                                <>
                                  <LogIn size={16} className="me-2" />
                                  Iniciar Sesión
                                </>
                              )}
                            </>
                          )}
                        </button>
                      </form>

                      <hr />

                      <div className="text-center">
                        <button
                          type="button"
                          className="btn btn-link"
                          onClick={toggleMode}
                          disabled={loading}
                        >
                          {isRegister 
                            ? '¿Ya tienes cuenta? Inicia Sesión' 
                            : '¿No tienes cuenta? Regístrate'
                          }
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
