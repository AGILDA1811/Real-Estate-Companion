import { Link } from "react-router-dom";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="rec-footer">
      <div className="rec-footer-container">


        <div className="rec-footer-col">
          <h2 className="rec-footer-logo">Real Estate Companion</h2>
          <p className="rec-footer-description">
            Smart tools to help you find, compare and evaluate properties with confidence.
          </p>
        </div>


        <div className="rec-footer-col">
          <h3>Quick Links</h3>
          <Link to="/apartments">Apartments</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contacts">Contacts</Link>
          <Link to="/help">Help Center</Link>
        </div>


        <div className="rec-footer-col">
          <h3>Tools</h3>
          <Link to="/tools/estimator">Price Estimator</Link>
          <Link to="/dashboard">Market Dashboard</Link>
          <Link to="/apartments">Deal Finder</Link>
        </div>


        <div className="rec-footer-col">
          <h3>Contact</h3>
          <p>Email: support@realestatecompanion.com</p>
          <p>Phone: +1 (000) 000-0000</p>
          <p>Location: Tirane</p>
        </div>

      </div>

      <div className="rec-footer-bottom">
        © {new Date().getFullYear()} Real Estate Companion. All rights reserved.
      </div>
    </footer>
  );
}