import React from 'react';
import { UsersRound } from 'lucide-react';

const Familiares = () => {
  return (
    <div className="container-fluid">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">
          <UsersRound className="me-2" size={32} />
          Módulo Familiar
        </h1>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Información Familiar</h6>
        </div>
        <div className="card-body">
          <p className="text-muted">Módulo en desarrollo - Aquí se mostrará la información de familiares</p>
        </div>
      </div>
    </div>
  );
};

export default Familiares;
