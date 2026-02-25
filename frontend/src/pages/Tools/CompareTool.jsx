import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCompare } from "../../context/CompareContext";
import { evaluateDeal, getEstimate } from "../../services/estimatorService";
import "./tools.css";

function getPropertyId(property) {
  return property.id || property._id;
}

function toEstimatePayload(property) {
  return {
    id: getPropertyId(property),
    price: property.price,
    size: property.size ?? property.meters,
    rooms: property.rooms,
    location: property.location,
  };
}

function getPricePerSquareMeter(property) {
  const size = Number(property.size ?? property.meters);
  const price = Number(property.price);
  if (!Number.isFinite(size) || size <= 0 || !Number.isFinite(price)) return null;
  return price / size;
}

function getMetricRows(properties, estimatesById) {
  return [
    {
      key: "price",
      label: "Price",
      format: (property) => `${Number(property.price || 0).toLocaleString()} EUR`,
      metricValue: (property) => Number(property.price) || 0,
      lowerIsBetter: true,
    },
    {
      key: "estimatedPrice",
      label: "Estimated Price",
      format: (property) => {
        const estimate = estimatesById[getPropertyId(property)];
        return typeof estimate?.estimatedPrice === "number"
          ? `${Math.round(estimate.estimatedPrice).toLocaleString()} EUR`
          : "Estimating...";
      },
      metricValue: (property) => {
        const estimate = estimatesById[getPropertyId(property)];
        return typeof estimate?.estimatedPrice === "number" ? estimate.estimatedPrice : Number.POSITIVE_INFINITY;
      },
      lowerIsBetter: true,
    },
    {
      key: "diffPercent",
      label: "Difference %",
      format: (property) => {
        const estimate = estimatesById[getPropertyId(property)];
        const deal = evaluateDeal(property.price, estimate?.estimatedPrice);
        return `${deal.diffPercent.toFixed(1)}%`;
      },
      metricValue: (property) => {
        const estimate = estimatesById[getPropertyId(property)];
        const deal = evaluateDeal(property.price, estimate?.estimatedPrice);
        return deal.diffPercent;
      },
      lowerIsBetter: true,
    },
    {
      key: "size",
      label: "Size",
      format: (property) => `${property.size ?? property.meters ?? "—"} m²`,
      metricValue: (property) => Number(property.size ?? property.meters) || 0,
      lowerIsBetter: false,
    },
    {
      key: "rooms",
      label: "Rooms",
      format: (property) => `${property.rooms ?? "—"}`,
      metricValue: (property) => Number(property.rooms) || 0,
      lowerIsBetter: false,
    },
    {
      key: "pricePerM2",
      label: "Price per m²",
      format: (property) => {
        const value = getPricePerSquareMeter(property);
        return value != null ? `${Math.round(value).toLocaleString()} EUR` : "—";
      },
      metricValue: (property) => {
        const value = getPricePerSquareMeter(property);
        return value ?? Number.POSITIVE_INFINITY;
      },
      lowerIsBetter: true,
    },
    {
      key: "investmentScore",
      label: "Investment Score",
      format: (property) => (property.investmentScore != null ? `${property.investmentScore}/100` : "N/A"),
      metricValue: (property) => (property.investmentScore != null ? Number(property.investmentScore) : -1),
      lowerIsBetter: false,
    },
    {
      key: "deal",
      label: "Deal Badge",
      format: (property) => {
        const estimate = estimatesById[getPropertyId(property)];
        const deal = evaluateDeal(property.price, estimate?.estimatedPrice);
        return deal.isGoodDeal ? "Below Market" : "Market Range";
      },
      metricValue: (property) => {
        const estimate = estimatesById[getPropertyId(property)];
        const deal = evaluateDeal(property.price, estimate?.estimatedPrice);
        return deal.isGoodDeal ? 1 : 0;
      },
      lowerIsBetter: false,
    },
  ];
}

function getBestIds(rows, properties) {
  const bestByRow = {};

  rows.forEach((row) => {
    const values = properties.map((property) => ({
      id: getPropertyId(property),
      value: row.metricValue(property),
    }));

    const filtered = values.filter(({ value }) => Number.isFinite(value));
    if (!filtered.length) return;

    const target = row.lowerIsBetter
      ? Math.min(...filtered.map((item) => item.value))
      : Math.max(...filtered.map((item) => item.value));

    bestByRow[row.key] = filtered
      .filter((item) => item.value === target)
      .map((item) => item.id);
  });

  return bestByRow;
}

export default function CompareTool() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const [estimatesById, setEstimatesById] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!compareList.length) return;
    let active = true;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const missing = compareList.filter((property) => {
          const id = getPropertyId(property);
          return !estimatesById[id];
        });

        if (!missing.length) return;

        const settled = await Promise.allSettled(
          missing.map(async (property) => {
            const id = getPropertyId(property);
            const estimate = await getEstimate(toEstimatePayload(property));
            return [id, estimate];
          })
        );

        if (!active) return;
        const successful = settled
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value);

        if (successful.length) {
          setEstimatesById((prev) => ({ ...prev, ...Object.fromEntries(successful) }));
        }

        if (settled.some((result) => result.status === "rejected")) {
          setError("Some estimates could not be loaded. Showing available results.");
        }
      } catch (e) {
        if (active) setError(e?.message || "Unable to load estimates right now.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [compareList, estimatesById]);

  const rows = useMemo(() => getMetricRows(compareList, estimatesById), [compareList, estimatesById]);
  const bestByRow = useMemo(() => getBestIds(rows, compareList), [rows, compareList]);

  if (!compareList.length) {
    return (
      <section className="tools-section tools-compare-empty">
        <h1>Compare Properties</h1>
        <p className="tools-muted">Select up to 3 apartments and compare key metrics side by side.</p>
        <Link to="/apartments" className="tools-compare-emptyBtn">Select Apartments</Link>
      </section>
    );
  }

  return (
    <section className="tools-section tools-compare-section">
      <div className="tools-compare-top">
        <div>
          <h1>Compare Properties</h1>
          <p className="tools-muted">API-ready comparison with estimator values and deal indicators.</p>
        </div>
        <button type="button" className="tools-compare-clearBtn" onClick={clearCompare}>
          Clear All
        </button>
      </div>

      {loading ? <p className="tools-compare-state">Loading estimates...</p> : null}
      {error ? <p className="tools-error">{error}</p> : null}

      <div className="tools-compare-tableWrap">
        <table className="tools-compare-table">
          <thead>
            <tr>
              <th>Metric</th>
              {compareList.map((property, index) => (
                <th key={getPropertyId(property)}>
                  <div className="tools-compare-headCell">
                    <strong>Property {String.fromCharCode(65 + index)}</strong>
                    <p>{property.location || property.title || "Apartment"}</p>
                    <button
                      type="button"
                      className="tools-compare-removeBtn"
                      onClick={() => removeFromCompare(getPropertyId(property))}
                    >
                      Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <td>{row.label}</td>
                {compareList.map((property) => {
                  const propertyId = getPropertyId(property);
                  const isBest = bestByRow[row.key]?.includes(propertyId);
                  const estimate = estimatesById[propertyId];
                  const deal = evaluateDeal(property.price, estimate?.estimatedPrice);
                  const cellValue = row.format(property);
                  const isDealRow = row.key === "deal";

                  return (
                    <td key={`${row.key}-${propertyId}`} className={isBest ? "is-best" : ""}>
                      {isDealRow ? (
                        <span className={deal.isGoodDeal ? "tools-compare-badge" : "tools-compare-neutral"}>
                          {cellValue}
                        </span>
                      ) : (
                        cellValue
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="tools-compare-mobileStack">
        {compareList.map((property, index) => {
          const propertyId = getPropertyId(property);
          const estimate = estimatesById[propertyId];
          const deal = evaluateDeal(property.price, estimate?.estimatedPrice);

          return (
            <article key={propertyId} className="tools-compare-mobileCard card-hover">
              <div className="tools-compare-mobileTop">
                <h3>Property {String.fromCharCode(65 + index)}</h3>
                <button type="button" onClick={() => removeFromCompare(propertyId)}>Remove</button>
              </div>
              <p className="tools-muted">{property.location || property.title || "Apartment"}</p>

              {rows.map((row) => (
                <div key={`${row.key}-${propertyId}`} className="tools-compare-mobileRow">
                  <span>{row.label}</span>
                  <strong>
                    {row.key === "deal" ? (
                      <span className={deal.isGoodDeal ? "tools-compare-badge" : "tools-compare-neutral"}>
                        {row.format(property)}
                      </span>
                    ) : (
                      row.format(property)
                    )}
                  </strong>
                </div>
              ))}
            </article>
          );
        })}
      </div>
    </section>
  );
}
