import { useMemo, useState } from "react";
import ApartmentCard from "../../components/apartaments/ApartmentCard";
import { fetchApartments } from "../../components/services/apartments.api";
import { evaluateDeal, getEstimate } from "../../services/estimatorService";
import "../../components/apartaments/apartments.css";
import "./tools.css";

function toEstimatePayload(listing) {
  return {
    id: listing.id || listing._id,
    price: listing.price,
    size: listing.size ?? listing.meters,
    rooms: listing.rooms,
    location: listing.location,
  };
}

function listingId(listing) {
  return listing.id || listing._id;
}

export default function DealFinderTool() {
  const [filters, setFilters] = useState({
    budgetMin: "",
    budgetMax: "",
    minSize: "",
    location: "",
  });
  const [listings, setListings] = useState([]);
  const [estimatesById, setEstimatesById] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const allListings = await fetchApartments();
      const estimatesEntries = await Promise.all(
        allListings.map(async (listing) => {
          const id = listingId(listing);
          if (estimatesById[id]) return [id, estimatesById[id]];
          const estimate = await getEstimate(toEstimatePayload(listing));
          return [id, estimate];
        })
      );

      setEstimatesById((prev) => ({ ...prev, ...Object.fromEntries(estimatesEntries) }));
      setListings(allListings);
    } catch (err) {
      setError(err?.message || "Unable to run deal finder.");
      setListings([]);
    } finally {
      setLoading(false);
    }
  }

  const goodDeals = useMemo(() => {
    const minBudget = Number(filters.budgetMin) || 0;
    const maxBudget = Number(filters.budgetMax) || Number.POSITIVE_INFINITY;
    const minSize = Number(filters.minSize) || 0;
    const location = filters.location.trim().toLowerCase();

    return listings.filter((listing) => {
      const estimate = estimatesById[listingId(listing)];
      const deal = evaluateDeal(listing.price, estimate?.estimatedPrice);
      const listingLocation = (listing.location || "").toLowerCase();
      const listingSize = Number(listing.size ?? listing.meters) || 0;
      const listingPrice = Number(listing.price) || 0;

      const inBudget = listingPrice >= minBudget && listingPrice <= maxBudget;
      const inSize = listingSize >= minSize;
      const inLocation = !location || listingLocation.includes(location);

      return deal.isGoodDeal && inBudget && inSize && inLocation;
    });
  }, [listings, estimatesById, filters]);

  return (
    <div className="tools-section">
      <h1>Deal Finder</h1>
      <p className="tools-muted">Find listings currently priced below estimate.</p>

      <form className="tools-form tools-formWide" onSubmit={handleSearch}>
        <input name="budgetMin" type="number" placeholder="Budget min" value={filters.budgetMin} onChange={handleChange} />
        <input name="budgetMax" type="number" placeholder="Budget max" value={filters.budgetMax} onChange={handleChange} />
        <input name="minSize" type="number" placeholder="Minimum size (m²)" value={filters.minSize} onChange={handleChange} />
        <input name="location" type="text" placeholder="Location" value={filters.location} onChange={handleChange} />
        <button type="submit" disabled={loading}>{loading ? "Finding..." : "Find Deals"}</button>
      </form>

      {error ? <p className="tools-error">{error}</p> : null}
      <p className="tools-summary">{goodDeals.length} Good Deals Found</p>

      <div className="tools-dealsGrid">
        {goodDeals.map((listing) => {
          const estimate = estimatesById[listingId(listing)];
          return (
            <ApartmentCard
              key={listingId(listing)}
              apartment={listing}
              isGoodDeal
              estimatedPrice={estimate?.estimatedPrice ?? null}
            />
          );
        })}
      </div>
    </div>
  );
}
