import React from 'react';
import { BarChart3 } from 'lucide-react';

const Estadisticas = () => {
  return (
    <div className="container-fluid">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">
          <BarChart3 className="me-2" size={32} />
          Estadísticas y Reportes
        </h1>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Reportes Estadísticos</h6>
        </div>
        <div className="card-body">
          <p className="text-muted">Módulo en desarrollo - Aquí se mostrarán las estadísticas y reportes</p>
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;
