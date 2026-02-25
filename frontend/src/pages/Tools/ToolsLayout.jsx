import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import "./tools.css";

export default function ToolsLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <motion.main
      className="tools-page"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="tools-shell">
        <button
          type="button"
          className="tools-sidebarToggle"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-expanded={sidebarOpen}
        >
          Tools Menu
        </button>

        <aside className={`tools-sidebar ${sidebarOpen ? "is-open" : ""}`}>
          <h2>Tools</h2>
          <nav className="tools-nav">
            <NavLink to="/tools/estimator" className={({ isActive }) => isActive ? "is-active" : ""}>
              Price Estimator
            </NavLink>
            <NavLink to="/tools/deal-finder" className={({ isActive }) => isActive ? "is-active" : ""}>
              Deal Finder
            </NavLink>
            <NavLink to="/tools/market-dashboard" className={({ isActive }) => isActive ? "is-active" : ""}>
              Market Dashboard
            </NavLink>
          </nav>
        </aside>

        <section className="tools-content">
          <Outlet />
        </section>
      </div>
    </motion.main>
  );
}
