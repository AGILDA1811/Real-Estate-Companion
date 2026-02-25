import { Link } from "react-router-dom";
import "./apartments.css";

export default function ApartmentCard({ apartment, isBelowMarket = false, estimatedPrice = null }) {
  if (!apartment) return null;

  const id = apartment.id || apartment._id;

  return (
    <div className="aptCard">
      {isBelowMarket ? <span className="aptDealBadge">🔥 Below Market</span> : null}
      <div className="aptTop">
        <div className="aptPrice">{apartment.price != null ? `${apartment.price} €` : "— €"}</div>
        <div className="aptMeters">{apartment.meters != null ? `${apartment.meters} m²` : "— m²"}</div>
      </div>
      {typeof estimatedPrice === "number" ? (
        <p className="aptEstimate">Estimated: {Math.round(estimatedPrice)} €</p>
      ) : null}

      <p className="aptDesc">{apartment.description || "No description available."}</p>

      {id ? (
        <Link className="aptLink" to={`/apartments/${id}`}>
          View details →
        </Link>
      ) : null}
    </div>
  );
}
