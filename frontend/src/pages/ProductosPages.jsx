import { useEffect, useState } from "react";
import api from "../api/client.jsx";

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    id_categoria: 1,
    nombre: "",
    descripcion: "",
    sku: "",
    precio: 0,
    stock: 0,
    imagen_url: "",
    activo: true,
  });

  const loadProductos = async () => {
    const response = await api.get("/productos");
    setProductos(response.data);
  };

  useEffect(() => { loadProductos
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/productos", {
      ...form,
      precio: Number(form.precio),
      stock: Number(form.stock),
      id_categoria: Number(form.id_categoria),
    });
    setForm({
      id_categoria: 1,
      nombre: "",
      descripcion: "",
      sku: "",
      precio: 0,
      stock: 0,
      imagen_url: "",
      activo: true,
    });
    loadProductos();
  };

  return (
    <div>
      <h2>Productos</h2>

      <form onSubmit={handleSubmit}>
        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" />
        <input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" />
        <input name="precio" type="number" value={form.precio} onChange={handleChange} placeholder="Precio" />
        <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Stock" />
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" />
        <button type="submit">Guardar</button>
      </form>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>SKU</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id_producto}>
              <td>{p.id_producto}</td>
              <td>{p.nombre}</td>
              <td>{p.precio}</td>
              <td>{p.stock}</td>
              <td>{p.sku}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}