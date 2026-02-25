import "./tools.css";

const mockStats = {
  avgPrice: 845,
  avgPricePerM2: 11.6,
  dealRatio: 28,
  activeListings: 124,
};

export default function MarketDashboard() {
  return (
    <div className="tools-section">
      <h1>Market Dashboard</h1>
      <p className="tools-muted">
        Market overview prepared for backend analytics integration.
      </p>
      <p className="tools-muted">
        Backend endpoint target: <code>GET /analytics/market</code>
      </p>

      <div className="tools-statsGrid">
        <article className="tools-statCard">
          <h3>Average Price</h3>
          <p>{mockStats.avgPrice} €</p>
        </article>
        <article className="tools-statCard">
          <h3>Avg Price / m²</h3>
          <p>{mockStats.avgPricePerM2} €</p>
        </article>
        <article className="tools-statCard">
          <h3>Deal Ratio</h3>
          <p>{mockStats.dealRatio}%</p>
        </article>
        <article className="tools-statCard">
          <h3>Active Listings</h3>
          <p>{mockStats.activeListings}</p>
        </article>
      </div>
    </div>
  );
}
