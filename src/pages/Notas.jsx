import React, { useState } from "react";
import { useAuth } from "../context/useAuth";

export default function Notas() {
  const { usuario } = useAuth();
  const [notas, setNotas] = useState([
    { id: 1, materia: "Matemáticas", nota: 85 },
    { id: 2, materia: "Lengua", nota: 90 },
  ]);

  const [nuevaNota, setNuevaNota] = useState({ materia: "", nota: "" });

  const agregarNota = (e) => {
    e.preventDefault();
    if (!nuevaNota.materia || !nuevaNota.nota) return;
    const nueva = {
      id: Date.now(),
      materia: nuevaNota.materia,
      nota: parseFloat(nuevaNota.nota),
    };
    setNotas([...notas, nueva]);
    setNuevaNota({ materia: "", nota: "" });
  };

  const eliminarNota = (id) => {
    setNotas(notas.filter((n) => n.id !== id));
  };

  return (
    <div className="container mt-4">
      <h3>Seguimiento de Notas</h3>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Materia</th>
            <th>Nota</th>
            {(usuario.rol === "admin" || usuario.rol === "profesor") && (
              <th>Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {notas.map((n) => (
            <tr key={n.id}>
              <td>{n.materia}</td>
              <td>{n.nota}</td>
              {(usuario.rol === "admin" || usuario.rol === "profesor") && (
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarNota(n.id)}
                  >
                    Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {(usuario.rol === "admin" || usuario.rol === "profesor") && (
        <form className="mt-3" onSubmit={agregarNota}>
          <div className="row g-2">
            <div className="col-md-5">
              <input
                type="text"
                placeholder="Materia"
                className="form-control"
                value={nuevaNota.materia}
                onChange={(e) =>
                  setNuevaNota({ ...nuevaNota, materia: e.target.value })
                }
              />
            </div>
            <div className="col-md-5">
              <input
                type="number"
                placeholder="Nota"
                className="form-control"
                value={nuevaNota.nota}
                onChange={(e) =>
                  setNuevaNota({ ...nuevaNota, nota: e.target.value })
                }
              />
            </div>
            <div className="col-md-2">
              <button className="btn btn-success w-100">Agregar</button>
            </div>
          </div>
        </form>
      )}

      {usuario.rol === "estudiante" && (
        <button
          className="btn btn-outline-primary mt-3"
          onClick={() => alert("Descargando notas...")}
        >
          Descargar Notas
        </button>
      )}
    </div>
  );
}
