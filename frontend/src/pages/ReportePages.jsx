import { useEffect, useState } from "react";
import api from "../api/client.jsx";

function formatPrice(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function escapeCsv(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export default function ReportePage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProductos = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/productos");
      setProductos(response.data);
    } catch {
      setError("No se pudo cargar el reporte. Intentá actualizar la página.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductos();
  }, []);

  const totalUnidades = productos.reduce(
    (total, producto) => total + Number(producto.stock || 0),
    0,
  );
  const bajoStock = productos.filter(
    (producto) => Number(producto.stock) <= 5,
  ).length;

  const exportCsv = () => {
    const rows = [
      ["ID", "Producto", "SKU", "Precio", "Stock"],
      ...productos.map((producto) => [
        producto.id_producto,
        producto.nombre,
        producto.sku,
        producto.precio,
        producto.stock,
      ]),
    ];

    const content = `\uFEFF${rows
      .map((row) => row.map(escapeCsv).join(","))
      .join("\n")}`;
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "reporte-productos.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">RESUMEN</p>
          <h1>Reportes</h1>
          <p className="page-description">
            Consultá el estado actual de tu inventario.
          </p>
        </div>
        <div className="heading-actions">
          <button
            className="button button-secondary"
            type="button"
            onClick={() => window.print()}
          >
            Imprimir
          </button>
          <button
            className="button button-primary"
            type="button"
            onClick={exportCsv}
            disabled={productos.length === 0}
          >
            Descargar CSV
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <section className="stats-grid">
        <article className="stat-card">
          <span className="stat-label">Productos registrados</span>
          <strong>{loading ? "—" : productos.length}</strong>
          <span className="stat-note">Artículos en el catálogo</span>
        </article>
        <article className="stat-card">
          <span className="stat-label">Unidades en stock</span>
          <strong>{loading ? "—" : totalUnidades}</strong>
          <span className="stat-note">Unidades disponibles</span>
        </article>
        <article className="stat-card">
          <span className="stat-label">Stock bajo</span>
          <strong className={bajoStock > 0 ? "stat-warning" : ""}>
            {loading ? "—" : bajoStock}
          </strong>
          <span className="stat-note">Productos con 5 unidades o menos</span>
        </article>
      </section>

      <section className="panel report-panel">
        <div className="panel-heading">
          <div>
            <h2>Detalle del inventario</h2>
            <p>Listado de productos, precios y unidades disponibles.</p>
          </div>
          <button
            className="button button-secondary button-small"
            type="button"
            onClick={loadProductos}
          >
            Actualizar
          </button>
        </div>

        {loading ? (
          <div className="empty-state">Preparando el reporte…</div>
        ) : productos.length === 0 ? (
          <div className="empty-state">
            <strong>No hay datos para mostrar</strong>
            <span>Cuando agregues productos, aparecerán en este reporte.</span>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>SKU</th>
                  <th>Precio</th>
                  <th>Stock disponible</th>
                  <th>Estado del stock</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => {
                  const isLowStock = Number(producto.stock) <= 5;

                  return (
                    <tr key={producto.id_producto}>
                      <td><strong>{producto.nombre}</strong></td>
                      <td><span className="sku-tag">{producto.sku}</span></td>
                      <td className="price-cell">{formatPrice(producto.precio)}</td>
                      <td>{producto.stock} unidades</td>
                      <td>
                        <span
                          className={`badge ${
                            isLowStock ? "badge-warning" : "badge-success"
                          }`}
                        >
                          {isLowStock ? "Revisar stock" : "Disponible"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}