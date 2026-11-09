import { useEffect, useState } from "react";
import api from "../api/client.jsx";

const emptyForm = {
  id_categoria: "",
  nombre: "",
  descripcion: "",
  sku: "",
  precio: "",
  stock: "",
  imagen_url: "",
  activo: true,
};

function formatPrice(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [productosResponse, categoriasResponse] = await Promise.all([
        api.get("/productos"),
        api.get("/categorias"),
      ]);

      setProductos(productosResponse.data);
      setCategorias(categoriasResponse.data);
      setForm((current) => ({
        ...current,
        id_categoria:
          current.id_categoria ||
          String(categoriasResponse.data[0]?.id_categoria || ""),
      }));
    } catch {
      setError("No se pudieron cargar los datos. Intentá actualizar la página.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/productos", {
        ...form,
        id_categoria: Number(form.id_categoria),
        precio: Number(form.precio),
        stock: Number(form.stock),
        imagen_url: form.imagen_url || null,
      });

      setForm({
        ...emptyForm,
        id_categoria: String(categorias[0]?.id_categoria || ""),
      });
      setShowForm(false);
      setSuccess("El producto se creó correctamente.");
      await loadData();
    } catch {
      setError("No se pudo guardar el producto. Revisá los datos e intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (producto) => {
    const confirmed = window.confirm(
      `¿Querés eliminar el producto "${producto.nombre}"?`,
    );
    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await api.delete(`/productos/${producto.id_producto}`);
      setProductos((current) =>
        current.filter((item) => item.id_producto !== producto.id_producto),
      );
      setSuccess("El producto se eliminó correctamente.");
    } catch {
      setError("No se pudo eliminar el producto.");
    }
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">INVENTARIO</p>
          <h1>Productos</h1>
          <p className="page-description">
            Administrá los artículos de tu tienda.
          </p>
        </div>
        <button
          className="button button-primary"
          type="button"
          onClick={() => {
            setShowForm((visible) => !visible);
            setError("");
            setSuccess("");
          }}
        >
          {showForm ? "Cancelar" : "+ Nuevo producto"}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <section className="panel form-panel">
          <div className="panel-heading">
            <div>
              <h2>Agregar producto</h2>
              <p>Completá la información del artículo.</p>
            </div>
          </div>

          {categorias.length === 0 ? (
            <div className="alert alert-error">
              Primero necesitás crear una categoría para poder agregar productos.
            </div>
          ) : (
            <form className="data-form" onSubmit={handleSubmit}>
              <label className="field">
                <span>Nombre</span>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej. Auriculares inalámbricos"
                  minLength="2"
                  maxLength="120"
                  required
                />
              </label>

              <label className="field">
                <span>SKU</span>
                <input
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  placeholder="Ej. ELEC001"
                  minLength="3"
                  maxLength="50"
                  required
                />
              </label>

              <label className="field">
                <span>Categoría</span>
                <select
                  name="id_categoria"
                  value={form.id_categoria}
                  onChange={handleChange}
                  required
                >
                  {categorias.map((categoria) => (
                    <option key={categoria.id_categoria} value={categoria.id_categoria}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Precio</span>
                <input
                  name="precio"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.precio}
                  onChange={handleChange}
                  placeholder="0,00"
                  required
                />
              </label>

              <label className="field">
                <span>Stock</span>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </label>

              <label className="field">
                <span>URL de imagen <small>(opcional)</small></span>
                <input
                  name="imagen_url"
                  type="url"
                  value={form.imagen_url}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </label>

              <label className="field field-full">
                <span>Descripción <small>(opcional)</small></span>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  placeholder="Agregá una breve descripción"
                  rows="3"
                />
              </label>

              <div className="form-actions field-full">
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </button>
                <button className="button button-primary" disabled={saving}>
                  {saving ? "Guardando…" : "Guardar producto"}
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Listado de productos</h2>
            <p>{productos.length} artículos registrados</p>
          </div>
          <button
            className="button button-secondary button-small"
            type="button"
            onClick={loadData}
          >
            Actualizar
          </button>
        </div>

        {loading ? (
          <div className="empty-state">Cargando productos…</div>
        ) : productos.length === 0 ? (
          <div className="empty-state">
            <strong todavía>No hay productos todavía</strong>
            <span>Usá “Nuevo producto” para agregar el primero.</span>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>SKU</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id_producto}>
                    <td>
                      <div className="product-name">
                        <span className="product-placeholder">□</span>
                        <span>
                          <strong>{producto.nombre}</strong>
                          <small>{producto.descripcion || "Sin descripción"}</small>
                        </span>
                      </div>
                    </td>
                    <td><span className="sku-tag">{producto.sku}</span></td>
                    <td className="price-cell">{formatPrice(producto.precio)}</td>
                    <td>
                      <span
                        className={`stock-value ${
                          Number(producto.stock) <= 5 ? "stock-low" : ""
                        }`}
                      >
                        {producto.stock} unidades
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          producto.activo ? "badge-success" : "badge-muted"
                        }`}
                      >
                        {producto.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="text-button text-danger"
                        type="button"
                        onClick={() => handleDelete(producto)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}