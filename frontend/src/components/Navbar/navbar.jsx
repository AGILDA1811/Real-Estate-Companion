import { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "./navbar.css";

import logo from "../../assets/logo.png";
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const menuRef = useRef(null);

  
  useEffect(() => {
    const onDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
        setToolsOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);


  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setToolsOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const close = () => {
    setOpen(false);
    setToolsOpen(false);
  };

  const toggleTools = () => setToolsOpen((v) => !v);
  const openToolsOnHover = () => {
    if (window.matchMedia("(min-width: 921px)").matches) setToolsOpen(true);
  };
  const closeToolsOnHover = () => {
    if (window.matchMedia("(min-width: 921px)").matches) setToolsOpen(false);
  };

  return (
    <header className="rec-header" ref={menuRef}>
      <nav className="rec-nav">

        <Link to="/" className="rec-brand" onClick={close} aria-label="Go to home">
          <img className="rec-logo" src={logo} alt="Real Estate Companion" />
        </Link>


        <div className={`rec-links ${open ? "is-open" : ""}`} role="navigation" aria-label="Main">
          <NavLink
            to="/apartments"
            className={({ isActive }) => `rec-link ${isActive ? "is-active" : ""}`}
            onClick={close}
          >
            Apartments
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) => `rec-link ${isActive ? "is-active" : ""}`}
            onClick={close}
          >
            About Us
          </NavLink>

          <NavLink
            to="/contacts"
            className={({ isActive }) => `rec-link ${isActive ? "is-active" : ""}`}
            onClick={close}
          >
            Contacts
          </NavLink>

          <NavLink
            to="/help"
            className={({ isActive }) => `rec-link ${isActive ? "is-active" : ""}`}
            onClick={close}
          >
            Help Center
          </NavLink>

          <div
            className={`navbar-tools ${toolsOpen ? "is-open" : ""}`}
            onMouseEnter={openToolsOnHover}
            onMouseLeave={closeToolsOnHover}
          >
            <button
              type="button"
              className="navbar-toolsToggle"
              onClick={toggleTools}
              aria-expanded={toolsOpen}
              aria-haspopup="true"
            >
              Tools
            </button>
            <div className="navbar-toolsMenu">
              <Link to="/tools/estimator" onClick={close}>Price Estimator</Link>
              <Link to="/tools/deal-finder" onClick={close}>Deal Finder</Link>
              <Link to="/tools/market-dashboard" onClick={close}>Market Dashboard</Link>
            </div>
          </div>

          <div className="rec-actions">
            <Link className="rec-primaryBtn" to="/login" onClick={close}>
              Sign in
            </Link>
          </div>
        </div>


        <button
          className="rec-burger"
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className={`rec-burgerLine ${open ? "x1" : ""}`} />
          <span className={`rec-burgerLine ${open ? "x2" : ""}`} />
          <span className={`rec-burgerLine ${open ? "x3" : ""}`} />
        </button>
      </nav>
    </header>
  );
}
