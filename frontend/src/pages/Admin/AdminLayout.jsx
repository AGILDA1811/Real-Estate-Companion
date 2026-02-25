import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./admin.css";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("auth_token");
    navigate("/login");
  }

  function handleNavClick() {
    setSidebarOpen(false);
  }

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <button
          type="button"
          className="admin-sidebarToggle"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-expanded={sidebarOpen}
        >
          Admin Menu
        </button>

        <aside className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}>
          <h2 className="admin-logo">Admin Panel</h2>
          <nav className="admin-nav">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => (isActive ? "is-active" : "")}
              onClick={handleNavClick}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/admin/listings"
              className={({ isActive }) => (isActive ? "is-active" : "")}
              onClick={handleNavClick}
            >
              Listings
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) => (isActive ? "is-active" : "")}
              onClick={handleNavClick}
            >
              Users
            </NavLink>
            <button type="button" className="admin-logoutBtn" onClick={handleLogout}>
              Logout
            </button>
          </nav>
        </aside>

        <section className="admin-content">
          <Outlet />
        </section>
      </div>
    </main>
  );
}
