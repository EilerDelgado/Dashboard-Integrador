import React from "react";
import { useAuth } from "../context/useAuth";

export default function Dashboard() {
  const { usuario } = useAuth();

  return (
    <div className="container mt-4">
      <h2>Bienvenido, {usuario?.nombre}</h2>
      <p>Rol actual: <strong>{usuario?.rol}</strong></p>
    </div>
  );
}
