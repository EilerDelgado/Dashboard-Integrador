import React from 'react';
import { Heart } from 'lucide-react';

const Bienestar = () => {
  return (
    <div className="container-fluid">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">
          <Heart className="me-2" size={32} />
          Bienestar Estudiantil
        </h1>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Registro de Bienestar</h6>
        </div>
        <div className="card-body">
          <p className="text-muted">Módulo en desarrollo - Aquí se mostrará el registro de bienestar estudiantil</p>
        </div>
      </div>
    </div>
  );
};

export default Bienestar;
