import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import LoginPage from "./pages/LoginPage";
import ProductosPage from "./pages/ProductosPages";
import CategoriasPage from "./pages/CategoriasPages";
import ReportePage from "./pages/ReportePages";

function PrivatePage({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/productos"
            element={
              <PrivatePage>
                <ProductosPage />
              </PrivatePage>
            }
          />
          <Route
            path="/categorias"
            element={
              <PrivatePage>
                <CategoriasPage />
              </PrivatePage>
            }
          />
          <Route
            path="/reporte"
            element={
              <PrivatePage>
                <ReportePage />
              </PrivatePage>
            }
          />
          <Route path="*" element={<Navigate to="/productos" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}