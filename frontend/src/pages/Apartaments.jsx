import { useEffect, useMemo, useState } from "react";
import { useApartments } from "../components/hooks/useApartments";
import SearchBar from "../components/apartaments/SearchBar";
import FiltersBar from "../components/apartaments/FiltersBar";
import ApartmentCard from "../components/apartaments/ApartmentCard";
import { getEstimate } from "../services/estimatorService";
import "../components/apartaments/apartments.css";

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
  const [searchValues, setSearchValues] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    rooms: "",
  });
  const [appliedSearch, setAppliedSearch] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    rooms: "",
  });
  const [sort, setSort] = useState("price-asc");
  const [goodDealsOnly, setGoodDealsOnly] = useState(false);
  const [priceRange, setPriceRange] = useState(2200);
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
            const listingId = getListingId(listing);
            const estimate = await getEstimate(toEstimatorPayload(listing));
            return [listingId, estimate];
          })
        );

        if (!mounted) return;
        setEstimatesById(Object.fromEntries(pairs));
      } catch (e) {
        if (!mounted) return;
        setEstimatesById({});
        setEstimatesError(e?.message || "Could not load deal estimates.");
      } finally {
        if (mounted) setEstimatesLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [apartments]);

  function handleSearchChange(e) {
    const { name, value } = e.target;
    setSearchValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    setAppliedSearch(searchValues);
  }

  function handleClearSearch() {
    const cleared = { location: "", minPrice: "", maxPrice: "", rooms: "" };
    setSearchValues(cleared);
    setAppliedSearch(cleared);
    setGoodDealsOnly(false);
  }

  const filteredApartments = useMemo(() => {
    const location = appliedSearch.location.trim().toLowerCase();
    const minPrice = Number(appliedSearch.minPrice) || 0;
    const maxPrice = Number(appliedSearch.maxPrice) || Number.POSITIVE_INFINITY;
    const rooms = Number(appliedSearch.rooms) || 0;

    const base = apartments.filter((apartment) => {
      const aptLocation = (apartment.location || "").toLowerCase();
      const price = Number(apartment.price) || 0;
      const aptRooms = Number(apartment.rooms) || 0;
      const estimate = estimatesById[getListingId(apartment)];

      const matchesLocation = !location || aptLocation.includes(location);
      const matchesMinPrice = price >= minPrice;
      const matchesMaxPrice = price <= maxPrice;
      const matchesRooms = !rooms || aptRooms >= rooms;
      const matchesGoodDeals = !goodDealsOnly || isBelowMarket(apartment, estimate);
      const matchesRange = price <= priceRange;

      return (
        matchesLocation &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesRooms &&
        matchesGoodDeals &&
        matchesRange
      );
    });

    const sorted = [...base];
    sorted.sort((a, b) => {
      const aPrice = Number(a.price) || 0;
      const bPrice = Number(b.price) || 0;
      return sort === "price-desc" ? bPrice - aPrice : aPrice - bPrice;
    });
    return sorted;
  }, [apartments, appliedSearch, sort, goodDealsOnly, priceRange, estimatesById]);

  return (
    <main className="apartments-page">
      <div className="apartments-container">
        <h1 className="apartments-title">Apartments</h1>

        <SearchBar
          values={searchValues}
          onChange={handleSearchChange}
          onSubmit={handleSearchSubmit}
          onClear={handleClearSearch}
        />

        <FiltersBar
          sort={sort}
          onSortChange={(e) => setSort(e.target.value)}
          goodDealsOnly={goodDealsOnly}
          onGoodDealsChange={(e) => setGoodDealsOnly(e.target.checked)}
          priceRange={priceRange}
          onPriceRangeChange={(e) => setPriceRange(Number(e.target.value))}
        />

        <section className="apartments-resultsHeader">
          <p>{filteredApartments.length} Apartments Found</p>
          <div className="apartments-filterGroup apartments-filterGroupInline">
            <label htmlFor="apartments-sort-inline">Sort</label>
            <select
              id="apartments-sort-inline"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>
        </section>

        {loading ? <p className="apartments-state">Loading...</p> : null}
        {error ? <p className="apartments-state apartments-error">{error}</p> : null}
        {estimatesLoading ? <p className="apartments-state">Running Deal Finder...</p> : null}
        {estimatesError ? <p className="apartments-state apartments-error">{estimatesError}</p> : null}

        {!loading && !error ? (
          filteredApartments.length ? (
            <section className="apartments-grid">
              {filteredApartments.map((apartment) => {
                const listingId = getListingId(apartment);
                const estimate = estimatesById[listingId];
                return (
                  <ApartmentCard
                    key={listingId}
                    apartment={apartment}
                    isBelowMarket={isBelowMarket(apartment, estimate)}
                    estimatedPrice={estimate?.estimatedPrice ?? null}
                  />
                );
              })}
            </section>
          ) : (
            <p className="apartments-empty">No apartments match the current filters.</p>
          )
        ) : null}
      </div>
    </main>
  );
}
