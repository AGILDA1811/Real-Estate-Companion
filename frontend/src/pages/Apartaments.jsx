import { useEffect, useMemo, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useApartments } from "../components/hooks/useApartments";
import SearchBar from "../components/apartaments/SearchBar";
import FiltersBar from "../components/apartaments/FiltersBar";
import ApartmentCard from "../components/apartaments/ApartmentCard";
import { evaluateDeal, getEstimate } from "../services/estimatorService";
import { useCompare } from "../context/CompareContext";
import "../components/apartaments/apartments.css";

function toEstimatePayload(listing) {
  return {
    id: listing.id || listing._id,
    price: listing.price,
    size: listing.size ?? listing.meters,
    rooms: listing.rooms,
    location: listing.location,
  };
}

function getListingId(listing) {
  return listing.id || listing._id;
}

export default function ApartmentsPage() {
  const { apartments, loading, error } = useApartments();
  const { compareList, addToCompare, removeFromCompare } = useCompare();

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
  const [loadingEstimates, setLoadingEstimates] = useState(false);
  const [estimateError, setEstimateError] = useState("");
  const [compareNotice, setCompareNotice] = useState("");

  useEffect(() => {
    if (!apartments.length) return;
    let active = true;

    (async () => {
      try {
        setLoadingEstimates(true);
        setEstimateError("");

        const missingListings = apartments.filter((listing) => {
          const id = getListingId(listing);
          return !estimatesById[id];
        });

        if (!missingListings.length) return;

        const results = await Promise.all(
          missingListings.map(async (listing) => {
            const id = getListingId(listing);
            const estimate = await getEstimate(toEstimatePayload(listing));
            return [id, estimate];
          })
        );

        if (!active) return;
        setEstimatesById((prev) => ({
          ...prev,
          ...Object.fromEntries(results),
        }));
      } catch (e) {
        if (active) setEstimateError(e?.message || "Failed to run deal finder.");
      } finally {
        if (active) setLoadingEstimates(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [apartments, estimatesById]);

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
    setPriceRange(priceRangeMax);
  }

  const priceRangeMax = useMemo(() => {
    const prices = apartments
      .map((apartment) => Number(apartment.price) || 0)
      .filter((value) => value > 0);
    if (!prices.length) return 2200;
    return Math.max(...prices);
  }, [apartments]);

  useEffect(() => {
    if (!apartments.length) return;
    setPriceRange((current) => (current === 2200 ? priceRangeMax : Math.min(current, priceRangeMax)));
  }, [apartments, priceRangeMax]);

  function isCompared(listing) {
    const id = getListingId(listing);
    return compareList.some((item) => getListingId(item) === id);
  }

  function handleCompareToggle(listing) {
    const id = getListingId(listing);
    if (isCompared(listing)) {
      removeFromCompare(id);
      setCompareNotice("Removed from comparison.");
      return;
    }

    const result = addToCompare(listing);
    setCompareNotice(result.message);
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
      const deal = evaluateDeal(apartment.price, estimate?.estimatedPrice);

      const matchesLocation = !location || aptLocation.includes(location);
      const matchesMinPrice = price >= minPrice;
      const matchesMaxPrice = price <= maxPrice;
      const matchesRooms = !rooms || aptRooms >= rooms;
      const matchesGoodDeals = !goodDealsOnly || deal.isGoodDeal;
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
    <motion.main
      className="apartments-page"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
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
          priceRangeMax={priceRangeMax}
          onPriceRangeChange={(e) => setPriceRange(Number(e.target.value))}
        />

        <section className="apartments-resultsHeader">
          <p>{filteredApartments.length} Apartments Found</p>
          <div className="apartments-resultsActions">
            <Link to="/tools/compare" className="apartments-compareNowBtn">
              Compare Now ({compareList.length}/3)
            </Link>
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
          </div>
        </section>

        {compareNotice ? <p className="apartments-state apartments-compareNotice">{compareNotice}</p> : null}

        {loading ? <p className="apartments-state">Loading...</p> : null}
        {error ? <p className="apartments-state apartments-error">{error}</p> : null}
        {loadingEstimates ? <p className="apartments-state">Running Deal Finder...</p> : null}
        {estimateError ? <p className="apartments-state apartments-error">{estimateError}</p> : null}

        {!loading && !error ? (
          filteredApartments.length ? (
            <section className="apartments-grid">
              {filteredApartments.map((apartment) => {
                const id = getListingId(apartment);
                const estimate = estimatesById[id];
                const deal = evaluateDeal(apartment.price, estimate?.estimatedPrice);

                return (
                  <ApartmentCard
                    key={id}
                    apartment={apartment}
                    isGoodDeal={deal.isGoodDeal}
                    estimatedPrice={estimate?.estimatedPrice ?? null}
                    isCompared={isCompared(apartment)}
                    compareDisabled={!isCompared(apartment) && compareList.length >= 3}
                    onToggleCompare={() => handleCompareToggle(apartment)}
                  />
                );
              })}
            </section>
          ) : (
            <p className="apartments-empty">No apartments match the current filters.</p>
          )
        ) : null}
      </div>
    </motion.main>
  );
}
