import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { fetchApartmentById, fetchCompsByApartmentId } from "../components/services/apartments.api";
import { evaluateDeal, getEstimate } from "../services/estimatorService";
import "../components/apartaments/apartments.css";
import "./propertyDetails.css";

function toEstimatePayload(property) {
  return {
    id: property.id,
    price: property.price,
    size: property.size ?? property.meters,
    rooms: property.rooms,
    location: property.location,
  };
}

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [estimate, setEstimate] = useState(null);
  const [loadingEstimate, setLoadingEstimate] = useState(false);
  const [estimateError, setEstimateError] = useState("");
  const [comps, setComps] = useState([]);
  const [loadingComps, setLoadingComps] = useState(false);
  const [compsError, setCompsError] = useState("");

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchApartmentById(id);
        if (!data) throw new Error("Property not found");
        if (!active) return;
        setProperty(data);
      } catch (e) {
        if (active) setError(e?.message || "Failed to load property details.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!property) return;
    let active = true;

    (async () => {
      try {
        setLoadingEstimate(true);
        setEstimateError("");
        const result = await getEstimate(toEstimatePayload(property));
        if (!active) return;
        setEstimate(result);
        if (result?.source === "mock" && result?.apiError) {
          setEstimateError(`Estimator API unavailable, using fallback. (${result.apiError})`);
        }
      } catch (e) {
        if (active) {
          setEstimate(null);
          setEstimateError(e?.message || "Estimator unavailable.");
        }
      } finally {
        if (active) setLoadingEstimate(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [property]);

  useEffect(() => {
    if (!id) return;
    let active = true;

    (async () => {
      try {
        setLoadingComps(true);
        setCompsError("");
        const data = await fetchCompsByApartmentId(id);
        if (!active) return;
        setComps(Array.isArray(data) ? data : []);
      } catch (e) {
        if (active) {
          setComps([]);
          setCompsError(e?.message || "Comparable listings unavailable.");
        }
      } finally {
        if (active) setLoadingComps(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  const deal = useMemo(
    () => evaluateDeal(property?.price, estimate?.estimatedPrice),
    [property?.price, estimate?.estimatedPrice]
  );

  if (loading) {
    return (
      <motion.main
        className="property-page"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="property-shell">
          <p>Loading property...</p>
        </div>
      </motion.main>
    );
  }

  if (error || !property) {
    return (
      <motion.main
        className="property-page"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="property-shell">
          <p className="property-error">{error || "Property not found."}</p>
          <Link to="/apartments" className="property-back">Back to apartments</Link>
        </div>
      </motion.main>
    );
  }

  return (
    <motion.main
      className="property-page"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="property-shell">
        <Link to="/apartments" className="property-back">← Back to apartments</Link>

        <section className="property-card">
          <div className="property-grid">
            <div className="property-main">
              <h1 className="property-title">{property.title || "Apartment Details"}</h1>
              <p className="property-location">{property.location || "Location unavailable"}</p>
              <p className="property-price">{property.price} €</p>

              <div className="property-divider" />

              <div className="property-meta">
                <div><span>Size</span><strong>{property.size ?? property.meters} m²</strong></div>
                <div><span>Rooms</span><strong>{property.rooms ?? "—"}</strong></div>
                <div><span>Bathrooms</span><strong>{property.bathrooms ?? "—"}</strong></div>
                <div><span>Floor</span><strong>{property.floor ?? "—"}</strong></div>
                <div><span>Furnishing</span><strong>{property.furnishing || "unknown"}</strong></div>
                <div><span>Elevator</span><strong>{property.hasElevator ? "Yes" : "No"}</strong></div>
                <div><span>Terrace</span><strong>{property.hasTerrace ? "Yes" : "No"}</strong></div>
                <div><span>Address</span><strong>{property.address || property.location || "—"}</strong></div>
              </div>

              <div className="property-divider" />

              <h2 className="property-subtitle">Description</h2>
              <p className="property-description">{property.description || "No description available."}</p>
            </div>

            <aside className="property-sidebar">
              <h3>Price Estimator</h3>
              <div className="property-summaryRow">
                <span>Listing Price</span>
                <strong>{property.price} €</strong>
              </div>
              <div className="property-summaryRow">
                <span>Estimated Price</span>
                <strong>
                  {loadingEstimate
                    ? "Estimating..."
                    : typeof estimate?.estimatedPrice === "number"
                      ? `${Math.round(estimate.estimatedPrice)} €`
                      : "Unavailable"}
                </strong>
              </div>
              <div className="property-summaryRow">
                <span>Fair Range</span>
                <strong>
                  {typeof estimate?.low === "number" && typeof estimate?.high === "number"
                    ? `${Math.round(estimate.low)} € - ${Math.round(estimate.high)} €`
                    : "—"}
                </strong>
              </div>
              <div className={`property-summaryRow ${deal.isGoodDeal ? "is-positive" : ""}`}>
                <span>Difference (€)</span>
                <strong>{typeof deal.diffValue === "number" ? `${deal.diffValue > 0 ? "+" : ""}${Math.round(deal.diffValue)} €` : "—"}</strong>
              </div>
              <div className={`property-summaryRow ${deal.isGoodDeal ? "is-positive" : ""}`}>
                <span>Difference (%)</span>
                <strong>{typeof deal.diffPercent === "number" ? `${deal.diffPercent > 0 ? "+" : ""}${deal.diffPercent.toFixed(1)}%` : "—"}</strong>
              </div>
              <div className="property-summaryRow">
                <span>Confidence</span>
                <strong>{typeof estimate?.confidence === "number" ? `${Math.round(estimate.confidence * 100)}%` : "—"}</strong>
              </div>

              <div className="property-divider" />

              {deal.isGoodDeal ? (
                <p className="property-dealBadge">🔥 Below Market</p>
              ) : (
                <p className="property-dealNeutral">Priced around market range</p>
              )}

              {estimateError ? <p className="property-estimateError">{estimateError}</p> : null}
              {estimate?.source === "mock" ? (
                <p className="property-estimateNote">Using temporary fallback estimate.</p>
              ) : null}
            </aside>
          </div>
        </section>

        <section className="property-card property-card-comps">
          <h2 className="property-subtitle">Comparable Properties (Top 5)</h2>
          {loadingComps ? <p className="property-compsState">Loading comparable listings...</p> : null}
          {compsError ? <p className="property-compsError">{compsError}</p> : null}
          {!loadingComps && !compsError && !comps.length ? (
            <p className="property-compsState">No comparable listings found.</p>
          ) : null}

          {comps.length ? (
            <div className="property-compsList">
              {comps.map((comp) => (
                <article key={comp.id} className="property-compItem">
                  <p><strong>Price:</strong> {Math.round(comp.price || 0).toLocaleString()} €</p>
                  <p><strong>Size:</strong> {comp.meters ?? "—"} m²</p>
                  <p><strong>Rooms:</strong> {comp.rooms ?? "—"}</p>
                  <p><strong>Why similar:</strong> {comp.reason || "Nearby and similar size/rooms"}</p>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </motion.main>
  );
}
