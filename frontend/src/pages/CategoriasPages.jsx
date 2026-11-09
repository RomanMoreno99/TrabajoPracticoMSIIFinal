import { useEffect, useState } from "react";
import api from "../api/client.jsx";

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCategorias = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/categorias");
      setCategorias(response.data);
    } catch {
      setError("No se pudieron cargar las categorías. Intentá actualizar la página.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/categorias", {
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || null,
        activa: true,
      });
      setNombre("");
      setDescripcion("");
      setSuccess("La categoría se creó correctamente.");
      await loadCategorias();
    } catch {
      setError("No se pudo crear la categoría. Puede que ese nombre ya exista.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">ORGANIZACIÓN</p>
          <h1>Categorías</h1>
          <p className="page-description">
            Agrupá tus productos para mantener el inventario ordenado.
          </p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="two-column-layout">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Nueva categoría</h2>
              <p>Creá una categoría para tus productos.</p>
            </div>
          </div>

          <form className="form-stack" onSubmit={handleSubmit}>
            <label className="field">
              <span>Nombre</span>
              <input
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
                placeholder="Ej. Accesorios"
                minLength="2"
                maxLength="80"
                required
              />
            </label>

            <label className="field">
              <span>Descripción <small>(opcional)</small></span>
              <textarea
                value={descripcion}
                onChange={(event) => setDescripcion(event.target.value)}
                placeholder="¿Qué productos incluye?"
                rows="4"
              />
            </label>

            <button className="button button-primary" disabled={saving}>
              {saving ? "Guardando…" : "Crear categoría"}
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Tus categorías</h2>
              <p>{categorias.length} categorías registradas</p>
            </div>
            <button
              className="button button-secondary button-small"
              type="button"
              onClick={loadCategorias}
            >
              Actualizar
            </button>
          </div>

          {loading ? (
            <div className="empty-state">Cargando categorías…</div>
          ) : categorias.length === 0 ? (
            <div className="empty-state">
              <strong>Aún no hay categorías</strong>
              <span>Creá la primera usando el formulario.</span>
            </div>
          ) : (
            <div className="category-list">
              {categorias.map((categoria) => (
                <article className="category-item" key={categoria.id_categoria}>
                  <span className="category-icon">▦</span>
                  <div className="category-details">
                    <strong>{categoria.nombre}</strong>
                    <span>{categoria.descripcion || "Sin descripción"}</span>
                  </div>
                  <span
                    className={`badge ${
                      categoria.activa ? "badge-success" : "badge-muted"
                    }`}
                  >
                    {categoria.activa ? "Activa" : "Inactiva"}
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}