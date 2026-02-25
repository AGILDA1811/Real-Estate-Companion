import { apiFetch } from "./apiClient";

const estimateCache = new Map();
const inFlightRequests = new Map();

function buildCacheKey(payload) {
  return JSON.stringify({
    id: payload.id,
    size: payload.size,
    rooms: payload.rooms,
    location: payload.location,
    price: payload.price,
  });
}

function mockEstimate(payload) {
  const base = Number(payload.price) || 0;
  const variance = Math.round(((Number(payload.size) || 0) * 1.5) + ((Number(payload.rooms) || 0) * 22));
  const estimatedPrice = base + variance;

  return {
    estimatedPrice,
    confidence: 0.62,
    explanation: "MOCK: Local development fallback estimate.",
    source: "mock",
  };
}

export async function getEstimate(propertyPayload) {
  const payload = {
    id: propertyPayload.id,
    size: propertyPayload.size ?? propertyPayload.meters,
    rooms: propertyPayload.rooms,
    location: propertyPayload.location,
    price: propertyPayload.price,
  };

  const key = buildCacheKey(payload);
  if (estimateCache.has(key)) return estimateCache.get(key);
  if (inFlightRequests.has(key)) return inFlightRequests.get(key);

  const requestPromise = (async () => {
    try {
      // Backend/ML integration point: POST /estimate should return real estimator output.
      const result = await apiFetch("/estimate", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const normalized = {
        estimatedPrice: Number(result?.estimatedPrice) || 0,
        confidence: typeof result?.confidence === "number" ? result.confidence : null,
        explanation: result?.explanation || "",
        source: "api",
      };

      estimateCache.set(key, normalized);
      return normalized;
    } catch (error) {
      // Dev fallback only: in production we surface API errors to UI.
      if (import.meta.env.DEV) {
        const fallback = mockEstimate(payload);
        estimateCache.set(key, fallback);
        return fallback;
      }
      throw error;
    } finally {
      inFlightRequests.delete(key);
    }
  })();

  inFlightRequests.set(key, requestPromise);
  return requestPromise;
}
