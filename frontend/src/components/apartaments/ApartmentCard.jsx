import { Link } from "react-router-dom";
import "./apartments.css";

export default function ApartmentCard({
  apartment,
  isGoodDeal = false,
  estimatedPrice = null,
}) {
  if (!apartment) return null;

  const id = apartment.id || apartment._id;

  return (
    <article className="apartments-card">
      <div className="apartments-cardBody">
        {isGoodDeal ? <span className="apartments-dealBadge apartments-dealBadgeInline">🔥 Below Market</span> : null}
        <div className="apartments-topRow">
          <h3 className="apartments-price">{apartment.price != null ? `${apartment.price} €` : "— €"}</h3>
          <p className="apartments-location">{apartment.location || "Location unavailable"}</p>
        </div>

        <p className="apartments-meta">
          {apartment.meters != null ? `${apartment.meters} m²` : "— m²"} ·{" "}
          {apartment.rooms != null ? `${apartment.rooms} rooms` : "Rooms n/a"}
        </p>
        {typeof estimatedPrice === "number" ? (
          <p className="apartments-meta">Estimated: {Math.round(estimatedPrice)} €</p>
        ) : null}

        <p className="apartments-desc">{apartment.description || "No description available."}</p>

        {id ? (
          <Link className="apartments-link" to={`/apartments/${id}`}>
            View details →
          </Link>
        ) : null}
      </div>
    </article>
  );
}
