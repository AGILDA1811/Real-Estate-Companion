import { useMemo, useState } from "react";
import { useApartments } from "../components/hooks/useApartments";
import "../components/apartaments/apartments.css";
import SearchBar from "../components/apartaments/SearchBar";
import FiltersBar from "../components/apartaments/FiltersBar";
import ApartmentCard from "../components/apartaments/ApartmentCard";

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
      const isGoodDeal =
        typeof apartment.price === "number" &&
        typeof apartment.estimatedPrice === "number" &&
        apartment.price < apartment.estimatedPrice;

      const matchesLocation = !location || aptLocation.includes(location);
      const matchesMinPrice = price >= minPrice;
      const matchesMaxPrice = price <= maxPrice;
      const matchesRooms = !rooms || aptRooms >= rooms;
      const matchesGoodDeals = !goodDealsOnly || isGoodDeal;
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
  }, [apartments, appliedSearch, sort, goodDealsOnly, priceRange]);

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

        {!loading && !error ? (
          filteredApartments.length ? (
            <section className="apartments-grid">
              {filteredApartments.map((apartment) => (
                <ApartmentCard key={apartment.id || apartment._id} apartment={apartment} />
              ))}
            </section>
          ) : (
            <p className="apartments-empty">No apartments match the current filters.</p>
          )
        ) : null}
      </div>
    </main>
  );
}
