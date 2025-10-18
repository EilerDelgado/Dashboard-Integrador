import React from "react";
import { Link } from "react-router-dom";

export default function Error403() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      <h1 className="text-danger">403</h1>
      <p>No tienes permiso para acceder a esta página.</p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </div>
  );
}
