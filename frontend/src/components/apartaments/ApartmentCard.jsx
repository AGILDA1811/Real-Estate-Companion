import { Link } from "react-router-dom";
import "./apartments.css";

export default function ApartmentCard({ apartment }) {
  if (!apartment) return null;

  const id = apartment.id || apartment._id;
  const isGoodDeal =
    typeof apartment.price === "number" &&
    typeof apartment.estimatedPrice === "number" &&
    apartment.price < apartment.estimatedPrice;

  return (
    <article className="apartments-card">
      <div className="apartments-cardBody">
        {isGoodDeal ? <span className="apartments-dealBadge apartments-dealBadgeInline">🔥 Good Deal</span> : null}
        <div className="apartments-topRow">
          <h3 className="apartments-price">{apartment.price != null ? `${apartment.price} €` : "— €"}</h3>
          <p className="apartments-location">{apartment.location || "Location unavailable"}</p>
        </div>

        <p className="apartments-meta">
          {apartment.meters != null ? `${apartment.meters} m²` : "— m²"} ·{" "}
          {apartment.rooms != null ? `${apartment.rooms} rooms` : "Rooms n/a"}
        </p>

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
