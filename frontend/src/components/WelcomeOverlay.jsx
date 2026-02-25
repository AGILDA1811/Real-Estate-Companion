import { useState } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import "./welcomeOverlay.css";

const STORAGE_KEY = "welcome_overlay_seen_session";

function shouldShowOverlay() {
  if (typeof window === "undefined") return false;

  const params = new URLSearchParams(window.location.search);
  const welcomeParam = (params.get("welcome") || "").toLowerCase();
  const forceWelcome = welcomeParam === "1" || welcomeParam === "true" || welcomeParam === "yes";

  if (welcomeParam === "reset") {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors; overlay will still attempt to open.
    }
    return true;
  }

  if (forceWelcome) return true;

  try {
    return sessionStorage.getItem(STORAGE_KEY) !== "true";
  } catch {
    return true;
  }
}

export default function WelcomeOverlay() {
  const [isOpen, setIsOpen] = useState(() => shouldShowOverlay());

  function closeOverlay() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignore storage errors and just close in memory.
    }
    setIsOpen(false);
  }

  const panelVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1 },
    },
    exit: { opacity: 0, y: 14, scale: 0.985, transition: { duration: 0.25 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="welcome-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={closeOverlay}
        >
          <motion.div
            className="welcome-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-title"
            variants={panelVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div className="welcome-visual" variants={itemVariants}>
              <div className="welcome-visualGlow" aria-hidden="true" />
              <p className="welcome-visualLabel">Smart Search Experience</p>
              <h3>Find, evaluate, and decide faster.</h3>
            </motion.div>

            <div className="welcome-content">
              <motion.p className="welcome-kicker" variants={itemVariants}>Real Estate Companion</motion.p>
              <motion.h2 id="welcome-title" variants={itemVariants}>Welcome to Real Estate Companion</motion.h2>
              <motion.p variants={itemVariants}>
                Explore listings, compare pricing, and use practical tools to move faster
                on your next property decision.
              </motion.p>

              <motion.div className="welcome-actions" variants={itemVariants}>
                <Link to="/apartments" className="welcome-btn welcome-btn-primary" onClick={closeOverlay}>
                  Browse Apartments
                </Link>
                <Link to="/tools/estimator" className="welcome-btn welcome-btn-secondary" onClick={closeOverlay}>
                  Explore Tools
                </Link>
              </motion.div>

              <motion.div className="welcome-footer" variants={itemVariants}>
                <button type="button" className="welcome-link" onClick={closeOverlay}>
                  Continue to site
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
