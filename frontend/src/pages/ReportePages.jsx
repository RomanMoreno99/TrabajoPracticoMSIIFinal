import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import api from "../api/client.jsx";

export default function ReportePage() {
  const [productos, setProductos] = useState([]);

  const loadProductos = async () => {
    const response = await api.get("/productos");
    setProductos(response.data);
  };

  useEffect(() => {
    loadProductos();
  }, []);

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(productos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Productos");
    XLSX.writeFile(wb, "productos.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Reporte de Productos", 14, 16);

    let y = 30;
    productos.forEach((p, index) => {
      doc.text(`${index + 1}. ${p.nombre} | Precio: $${p.precio} | Stock: ${p.stock}`, 14, y);
      y += 10;
    });

    doc.save("productos.pdf");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Reporte</h2>

      <button onClick={exportExcel} style={{ marginRight: 10 }}>
        Exportar Excel
      </button>

      <button onClick={exportPDF}>
        Exportar PDF
      </button>

      <table border="1" cellPadding="8" style={{ width: "100%", marginTop: 20, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id_producto}>
              <td>{p.id_producto}</td>
              <td>{p.nombre}</td>
              <td>{p.precio}</td>
              <td>{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}