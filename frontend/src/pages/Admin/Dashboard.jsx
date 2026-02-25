const MOCK_STATS = [
  { id: "totalListings", label: "Total Listings", value: 248, indicator: 82 },
  { id: "totalUsers", label: "Total Users", value: 1294, indicator: 71 },
  { id: "totalGoodDeals", label: "Total Good Deals", value: 63, indicator: 64 },
  { id: "activeListings", label: "Active Listings", value: 211, indicator: 85 },
];

export default function Dashboard() {
  return (
    <section className="admin-section">
      <header className="admin-sectionHeader">
        <h1>Dashboard</h1>
        <p>Platform overview for listings, users, and deal activity.</p>
      </header>

      {/* Backend integration point: replace MOCK_STATS with GET /admin/stats */}
      <div className="admin-statsGrid">
        {MOCK_STATS.map((stat) => (
          <article key={stat.id} className="admin-statCard card-hover">
            <p className="admin-statLabel">{stat.label}</p>
            <p className="admin-statValue">{stat.value}</p>
            <div className="admin-statTrack" aria-hidden="true">
              <span className="admin-statFill" style={{ width: `${stat.indicator}%` }} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
