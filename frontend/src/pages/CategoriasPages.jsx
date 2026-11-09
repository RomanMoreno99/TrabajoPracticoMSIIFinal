import { useEffect, useState } from "react";
import api from "../api/client.jsx";

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);

  const loadCategorias = async () => {
    const response = await api.get("/categorias");
    setCategorias(response.data);
  };

  useEffect(() => { 
    loadCategorias();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Categorías</h2>

      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Activa</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((c) => (
            <tr key={c.id_categoria}>
              <td>{c.id_categoria}</td>
              <td>{c.nombre}</td>
              <td>{c.descripcion}</td>
              <td>{c.activa ? "Sí" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}