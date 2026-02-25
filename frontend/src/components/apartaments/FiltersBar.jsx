export default function FiltersBar({
  sort,
  onSortChange,
  goodDealsOnly,
  onGoodDealsChange,
  priceRange,
  onPriceRangeChange,
}) {
  return (
    <section className="apartments-filtersRow">
      <div className="apartments-filterGroup">
        <label htmlFor="apartments-sort">Sort</label>
        <select id="apartments-sort" value={sort} onChange={onSortChange}>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      <label className="apartments-toggle">
        <input type="checkbox" checked={goodDealsOnly} onChange={onGoodDealsChange} />
        <span>Show good deals only</span>
      </label>

      <div className="apartments-sliderPlaceholder">
        <label htmlFor="apartments-priceRange">Price range (placeholder)</label>
        <input
          id="apartments-priceRange"
          type="range"
          min="400"
          max="2200"
          step="50"
          value={priceRange}
          onChange={onPriceRangeChange}
        />
        <small>Up to {priceRange} €</small>
      </div>
    </section>
  );
}
