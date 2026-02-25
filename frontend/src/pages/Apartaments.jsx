
import { useApartments } from "../components/hooks/useApartments";
import "../components/apartaments/apartments.css";
import ApartmentsList from "../components/apartaments/ApartmentsList";
import { useEffect, useMemo, useState } from "react";
import { getEstimate } from "../services/estimatorService";

function toEstimatorPayload(listing) {
  return {
    id: listing.id || listing._id,
    size: listing.size ?? listing.meters,
    rooms: listing.rooms,
    location: listing.location,
    price: listing.price,
  };
}

function getListingId(listing) {
  return listing.id || listing._id;
}

function isBelowMarket(listing, estimate) {
  if (!estimate || typeof estimate.estimatedPrice !== "number") return false;
  return Number(listing.price) < Number(estimate.estimatedPrice);
}

export default function ApartmentsPage() {
  const { apartments, loading, error } = useApartments();
  const [goodDealsOnly, setGoodDealsOnly] = useState(false);
  const [estimatesById, setEstimatesById] = useState({});
  const [estimatesLoading, setEstimatesLoading] = useState(false);
  const [estimatesError, setEstimatesError] = useState("");

  useEffect(() => {
    if (!apartments.length) return;
    let mounted = true;

    (async () => {
      try {
        setEstimatesLoading(true);
        setEstimatesError("");

        // Backend/ML integration point: estimatorService calls backend API and caches results.
        const pairs = await Promise.all(
          apartments.map(async (listing) => {
            const id = getListingId(listing);
            const estimate = await getEstimate(toEstimatorPayload(listing));
            return [id, estimate];
          })
        );

        if (!mounted) return;
        const nextEstimates = Object.fromEntries(pairs);
        setEstimatesById(nextEstimates);
      } catch (e) {
        if (!mounted) return;
        setEstimatesError(e?.message || "Could not load deal estimates.");
        setEstimatesById({});
      } finally {
        if (mounted) setEstimatesLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [apartments]);

  const visibleApartments = useMemo(() => {
    if (!goodDealsOnly) return apartments;
    return apartments.filter((listing) => isBelowMarket(listing, estimatesById[getListingId(listing)]));
  }, [apartments, estimatesById, goodDealsOnly]);

  return (
    <main className="aptPage">
      <h1 className="aptTitle">Apartments</h1>
      <div className="aptFilters">
        <label className="aptToggle">
          <input
            type="checkbox"
            checked={goodDealsOnly}
            onChange={(e) => setGoodDealsOnly(e.target.checked)}
          />
          <span>Show good deals only</span>
        </label>
      </div>

      {loading ? <p className="aptState">Loading...</p> : null}
      {error ? <p className="aptState aptError">{error}</p> : null}
      {estimatesLoading ? <p className="aptState">Running Deal Finder...</p> : null}
      {estimatesError ? <p className="aptState aptError">{estimatesError}</p> : null}

      {!loading && !error ? (
        <ApartmentsList
          apartments={visibleApartments}
          estimatesById={estimatesById}
          isBelowMarket={isBelowMarket}
        />
      ) : null}
    </main>
  );
}
