import { useMemo, useState } from "react";

const MOCK_LISTINGS = [
  { id: "l1", title: "Modern Downtown Loft", price: 265000, location: "Berlin Mitte", status: "Pending" },
  { id: "l2", title: "Riverside Family Flat", price: 315000, location: "Hamburg Altona", status: "Active" },
  { id: "l3", title: "Compact City Studio", price: 179000, location: "Munich Maxvorstadt", status: "Blocked" },
  { id: "l4", title: "Bright Renovated Apartment", price: 228000, location: "Cologne Ehrenfeld", status: "Active" },
];

function normalizeStatus(value) {
  if (value === "All") return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export default function Listings() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [listings, setListings] = useState(MOCK_LISTINGS);

  const filteredListings = useMemo(() => {
    const text = query.trim().toLowerCase();
    return listings.filter((listing) => {
      const byText =
        !text ||
        listing.title.toLowerCase().includes(text) ||
        listing.location.toLowerCase().includes(text);
      const byStatus = statusFilter === "All" || listing.status === statusFilter;
      return byText && byStatus;
    });
  }, [listings, query, statusFilter]);

  function updateStatus(id, nextStatus) {
    setListings((prev) =>
      prev.map((listing) =>
        listing.id === id ? { ...listing, status: normalizeStatus(nextStatus) } : listing
      )
    );
  }

  function removeListing(id) {
    setListings((prev) => prev.filter((listing) => listing.id !== id));
  }

  return (
    <section className="admin-section">
      <header className="admin-sectionHeader">
        <h1>Listings</h1>
        <p>Review and moderate published properties.</p>
      </header>

      {/* Backend integration points:
          GET /admin/listings
          PATCH /admin/listings/:id
          DELETE /admin/listings/:id
      */}
      <div className="admin-toolbar">
        <input
          className="admin-input"
          type="search"
          placeholder="Search by title or location"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="admin-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All statuses</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>

      <div className="admin-tableWrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredListings.map((listing) => (
              <tr key={listing.id}>
                <td>{listing.title}</td>
                <td>{listing.price.toLocaleString()} EUR</td>
                <td>{listing.location}</td>
                <td>
                  <span className={`admin-pill admin-pill-${listing.status.toLowerCase()}`}>
                    {listing.status}
                  </span>
                </td>
                <td className="admin-actionsCell">
                  <button type="button" onClick={() => updateStatus(listing.id, "Active")}>
                    Approve
                  </button>
                  <button type="button" onClick={() => updateStatus(listing.id, "Blocked")}>
                    Block
                  </button>
                  <button type="button" className="admin-dangerBtn" onClick={() => removeListing(listing.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!filteredListings.length ? (
              <tr>
                <td colSpan="5" className="admin-emptyRow">No listings found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
