export default function SearchBar({ values, onChange, onSubmit, onClear }) {
  return (
    <section className="apartments-searchSection">
      <form className="apartments-searchBar" onSubmit={onSubmit}>
        <div className="apartments-field">
          <label htmlFor="apartments-location">Location</label>
          <input
            id="apartments-location"
            type="text"
            name="location"
            placeholder="City or neighborhood"
            value={values.location}
            onChange={onChange}
          />
        </div>

        <div className="apartments-field">
          <label htmlFor="apartments-minPrice">Min price</label>
          <input
            id="apartments-minPrice"
            type="number"
            name="minPrice"
            placeholder="0"
            value={values.minPrice}
            onChange={onChange}
            min="0"
          />
        </div>

        <div className="apartments-field">
          <label htmlFor="apartments-maxPrice">Max price</label>
          <input
            id="apartments-maxPrice"
            type="number"
            name="maxPrice"
            placeholder="No limit"
            value={values.maxPrice}
            onChange={onChange}
            min="0"
          />
        </div>

        <div className="apartments-field">
          <label htmlFor="apartments-rooms">Rooms</label>
          <input
            id="apartments-rooms"
            type="number"
            name="rooms"
            placeholder="Any"
            value={values.rooms}
            onChange={onChange}
            min="1"
          />
        </div>

        <div className="apartments-searchActions">
          <button className="apartments-btn apartments-btnPrimary" type="submit">
            Search
          </button>
          <button className="apartments-btn apartments-btnGhost" type="button" onClick={onClear}>
            Clear
          </button>
        </div>
      </form>
    </section>
  );
}
