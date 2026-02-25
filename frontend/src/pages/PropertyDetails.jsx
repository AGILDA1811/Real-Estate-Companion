import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import ApartmentCard from "../components/apartaments/ApartmentCard";
import { fetchApartmentById, fetchApartments } from "../components/services/apartments.api";
import { getEstimate } from "../services/estimatorService";
import "../components/apartaments/apartments.css";
import "./propertyDetails.css";

function calculateScore(property) {
  const photosScore = (property.images?.length || 0) >= 3 ? 30 : 10;
  const descriptionScore = (property.description || "").length > 100 ? 30 : 10;
  const hasCompleteMeta = Boolean(
    property.size && property.rooms && property.bathrooms && property.floor && property.location
  );
  const infoScore = hasCompleteMeta && property.hasCompleteInfo ? 40 : 20;
  return {
    total: photosScore + descriptionScore + infoScore,
    photosScore,
    descriptionScore,
    infoScore,
  };
}

function toEstimatorPayload(property) {
  return {
    id: property.id,
    size: property.size ?? property.meters,
    rooms: property.rooms,
    location: property.location,
    price: property.price,
  };
}

function buildPricingView(listingPrice, estimatedPrice) {
  if (typeof estimatedPrice !== "number" || Number.isNaN(estimatedPrice)) {
    return {
      estimatedPrice: null,
      difference: null,
      percentDifference: null,
      belowMarket: false,
    };
  }

  const difference = listingPrice - estimatedPrice;
  const percentDifference = estimatedPrice > 0 ? (difference / estimatedPrice) * 100 : 0;
  return {
    estimatedPrice,
    difference,
    percentDifference,
    belowMarket: listingPrice < estimatedPrice,
  };
}

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [estimate, setEstimate] = useState(null);
  const [estimateLoading, setEstimateLoading] = useState(false);
  const [estimateError, setEstimateError] = useState("");

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const [current, all] = await Promise.all([fetchApartmentById(id), fetchApartments()]);
        if (!current) throw new Error("Property not found");

        if (active) {
          setProperty(current);
          setAllListings(Array.isArray(all) ? all : []);
          setActiveImageIndex(0);
        }
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
    let mounted = true;

    (async () => {
      try {
        setEstimateLoading(true);
        setEstimateError("");
        const estimateResult = await getEstimate(toEstimatorPayload(property));
        if (mounted) setEstimate(estimateResult);
      } catch (e) {
        if (mounted) {
          setEstimate(null);
          setEstimateError(e?.message || "Estimator unavailable right now.");
        }
      } finally {
        if (mounted) setEstimateLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [property]);

  const score = useMemo(() => (property ? calculateScore(property) : null), [property]);
  const pricingView = useMemo(() => {
    if (!property) return buildPricingView(0, null);
    return buildPricingView(property.price, estimate?.estimatedPrice ?? null);
  }, [property, estimate]);
  const differenceLabel =
    typeof pricingView.difference === "number" ? `${pricingView.difference > 0 ? "+" : ""}${pricingView.difference.toFixed(0)} €` : "—";
  const percentLabel =
    typeof pricingView.percentDifference === "number" ? `${pricingView.percentDifference > 0 ? "+" : ""}${pricingView.percentDifference.toFixed(1)}%` : "—";
  const scoreBarWidth = score ? `${score.total}%` : "0%";
  const activeImage = property?.images?.[activeImageIndex] || property?.images?.[0] || "";

  const similarListings = useMemo(() => {
    if (!property) return [];
    return allListings.filter((listing) => listing.id !== property.id).slice(0, 3);
  }, [allListings, property]);

  if (loading) {
    return <main className="property-page"><div className="property-shell"><p>Loading property...</p></div></main>;
  }

  if (error || !property) {
    return (
      <main className="property-page">
        <div className="property-shell">
          <p className="property-error">{error || "Property not found."}</p>
          <Link to="/apartments" className="property-back">Back to apartments</Link>
        </div>
      </main>
    );
  }

  return (
    <motion.main
      className="property-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
    >
      <div className="property-shell">
        <Link to="/apartments" className="property-back">← Back to apartments</Link>

        <section className="property-gallery">
          <motion.img
            className="property-mainImage"
            src={activeImage}
            alt={property.title}
            whileHover={{ y: -2, scale: 1.01 }}
            transition={{ duration: 0.2 }}
          />
          <div className="property-thumbs">
            {property.images?.map((image, index) => (
              <motion.button
                key={`${property.id}-img-${index}`}
                type="button"
                className={`property-thumbBtn ${activeImageIndex === index ? "is-active" : ""}`}
                onClick={() => setActiveImageIndex(index)}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <img src={image} alt={`${property.title} view ${index + 1}`} />
              </motion.button>
            ))}
          </div>
        </section>

        <section className="property-contentGrid">
          <div className="property-mainCol">
            <header className="property-header">
              <h1>{property.title}</h1>
              <p className="property-location">{property.location}</p>
              <p className="property-price">{property.price} €</p>
            </header>

            <div className="property-divider" />

            <section className="property-meta">
              <div><span>Size</span><strong>{property.size} m²</strong></div>
              <div><span>Rooms</span><strong>{property.rooms}</strong></div>
              <div><span>Bathrooms</span><strong>{property.bathrooms}</strong></div>
              <div><span>Floor</span><strong>{property.floor}</strong></div>
            </section>

            <div className="property-divider" />

            <section className="property-description">
              <h2>Description</h2>
              <p>{property.description}</p>
            </section>
          </div>

          <aside className="property-sideCol">
            <div className="property-evalPanel">
              <h3>Price Summary</h3>
              <div className="property-summaryRow">
                <span>Listing Price</span>
                <strong>{property.price} €</strong>
              </div>
              <div className="property-summaryRow">
                <span>Estimated Price</span>
                <strong>
                  {estimateLoading
                    ? "Estimating..."
                    : pricingView.estimatedPrice != null
                      ? `${Math.round(pricingView.estimatedPrice)} €`
                      : "Unavailable"}
                </strong>
              </div>
              <div className={`property-summaryRow ${pricingView.belowMarket ? "is-positive" : ""}`}>
                <span>Difference</span>
                <strong>{differenceLabel}</strong>
              </div>
              <div className={`property-summaryRow ${pricingView.belowMarket ? "is-positive" : ""}`}>
                <span>Difference (%)</span>
                <strong>{percentLabel}</strong>
              </div>

              <div className="property-divider" />

              {pricingView.belowMarket ? (
                <p className="property-deal property-dealGood">🔥 Below Market</p>
              ) : (
                <p className="property-deal">Priced around market range</p>
              )}
              {estimateError ? <p className="property-estimateError">{estimateError}</p> : null}
              {estimate?.source === "mock" ? (
                <p className="property-estimateNote">Using development mock estimate.</p>
              ) : null}

              <div className="property-divider" />

              <h3>Listing Quality Score</h3>
              <div className="property-scoreTop">
                <span className="property-scoreNum">{score.total}</span>
                <span className="property-scoreLabel">/100</span>
              </div>
              <div className="property-scoreBar">
                <span style={{ width: scoreBarWidth }} />
              </div>
              <ul className="property-scoreBreakdown">
                <li><span>Photos</span><strong>{score.photosScore}/30</strong></li>
                <li><span>Description</span><strong>{score.descriptionScore}/30</strong></li>
                <li><span>Info Completeness</span><strong>{score.infoScore}/40</strong></li>
              </ul>
            </div>
          </aside>
        </section>

        <section className="property-similar">
          <h2>Similar Listings</h2>
          <div className="property-similarGrid">
            {similarListings.map((listing) => (
              <ApartmentCard key={listing.id} apartment={listing} />
            ))}
          </div>
        </section>
      </div>
    </motion.main>
  );
}
