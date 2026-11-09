import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="/productos" aria-label="Ir a productos">
          <span className="brand-mark">N</span>
          <span>
            <strong>Nexo</strong>
            <small>Panel de gestión</small>
          </span>
        </a>

        <div className="sidebar-label">MENÚ PRINCIPAL</div>

        <nav className="side-nav" aria-label="Navegación principal">
          <NavLink to="/productos" className="nav-link">
            <span className="nav-icon">□</span>
            <span>Productos</span>
          </NavLink>
          <NavLink to="/categorias" className="nav-link">
            <span className="nav-icon">▦</span>
            <span>Categorías</span>
          </NavLink>
          <NavLink to="/reporte" className="nav-link">
            <span className="nav-icon">▤</span>
            <span>Reportes</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-avatar">
            {(user?.email?.[0] || "U").toUpperCase()}
          </div>
          <div className="user-info">
            <strong>Sesión activa</strong>
            <span>{user?.email || "Usuario"}</span>
          </div>
          <button
            className="icon-button logout-button"
            type="button"
            onClick={handleLogout}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            ↗
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <span className="topbar-caption">Administración</span>
          <span className="connection-status">
            <span className="status-dot" />
            Sistema conectado
          </span>
        </header>
        <div className="page-container">{children}</div>
      </main>
    </div>
  );
}