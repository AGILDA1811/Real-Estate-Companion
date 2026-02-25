import { Link } from "react-router-dom";
import "./notFound.css";

export default function NotFound() {
  return (
    <main className="notfound-page">
      <section className="notfound-shell">
        <p className="notfound-code">404</p>
        <h1 className="notfound-title">Page not found</h1>
        <p className="notfound-text">
          The page you requested does not exist or may have been moved.
        </p>
        <Link className="notfound-btn" to="/">
          Back to Home
        </Link>
      </section>
    </main>
  );
}
