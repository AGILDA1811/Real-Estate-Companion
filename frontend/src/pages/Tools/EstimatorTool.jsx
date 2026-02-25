import { useMemo, useState } from "react";
import { evaluateDeal, getEstimate } from "../../services/estimatorService";
import "./tools.css";

export default function EstimatorTool() {
  const [form, setForm] = useState({
    size: "",
    rooms: "",
    location: "",
    listingPrice: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const estimate = await getEstimate({
        id: `tool-${Date.now()}`,
        price: Number(form.listingPrice) || 0,
        size: Number(form.size) || 0,
        rooms: Number(form.rooms) || 0,
        location: form.location.trim(),
      });
      setResult(estimate);
    } catch (err) {
      setError(err?.message || "Estimator unavailable.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  const deal = useMemo(() => {
    if (!result) return null;
    if (!form.listingPrice) return null;
    return evaluateDeal(Number(form.listingPrice), result.estimatedPrice);
  }, [result, form.listingPrice]);

  return (
    <div className="tools-section">
      <h1>Price Estimator</h1>
      <p className="tools-muted">API-ready estimator form powered by service layer.</p>

      <form className="tools-form" onSubmit={handleSubmit}>
        <input name="size" type="number" placeholder="Size (m²)" value={form.size} onChange={handleChange} required />
        <input name="rooms" type="number" placeholder="Rooms" value={form.rooms} onChange={handleChange} required />
        <input name="location" type="text" placeholder="Location" value={form.location} onChange={handleChange} required />
        <input name="listingPrice" type="number" placeholder="Listing Price (optional)" value={form.listingPrice} onChange={handleChange} />
        <button type="submit" disabled={loading}>{loading ? "Estimating..." : "Run Estimate"}</button>
      </form>

      {error ? <p className="tools-error">{error}</p> : null}

      {result ? (
        <div className="tools-panel">
          <h3>Estimate Result</h3>
          <p><strong>Estimated price:</strong> {Math.round(result.estimatedPrice)} €</p>
          <p><strong>Confidence:</strong> {typeof result.confidence === "number" ? `${Math.round(result.confidence * 100)}%` : "—"}</p>
          <p><strong>Explanation:</strong> {result.explanation || "No explanation available."}</p>
          {deal ? (
            <p className={deal.isGoodDeal ? "tools-dealGood" : "tools-dealNeutral"}>
              {deal.isGoodDeal ? "🔥 Below Market" : "Around Market"} ({deal.diffPercent.toFixed(1)}%)
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
