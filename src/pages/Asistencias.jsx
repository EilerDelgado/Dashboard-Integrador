import React from 'react';
import { CalendarCheck } from 'lucide-react';

const Asistencias = () => {
  return (
    <div className="container-fluid">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">
          <CalendarCheck className="me-2" size={32} />
          Control de Asistencias
        </h1>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Registro de Asistencias</h6>
        </div>
        <div className="card-body">
          <p className="text-muted">Módulo en desarrollo - Aquí se mostrará el control de asistencias</p>
        </div>
      </div>
    </div>
  );
};

export default Asistencias;
