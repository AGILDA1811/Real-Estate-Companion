import { apiFetch } from "./apiClient";

const estimateCache = new Map();
const pendingRequests = new Map();

function getCacheKey(payload) {
  return JSON.stringify({
    id: payload.id,
    price: payload.price,
    size: payload.size,
    rooms: payload.rooms,
    location: payload.location,
  });
}

function mockEstimate(payload) {
  // TEMP fallback until backend + ML estimation endpoint is live/stable.
  const basePrice = Number(payload.price) || 0;
  const sizeFactor = (Number(payload.size) || 0) * 1.2;
  const roomsFactor = (Number(payload.rooms) || 0) * 35;
  const locationFactor = (payload.location || "").length * 2;

  const estimatedPrice = Math.round(basePrice + sizeFactor + roomsFactor + locationFactor);

  return {
    estimatedPrice,
    confidence: 0.58,
    explanation: "MOCK fallback estimate (frontend temporary).",
    source: "mock",
  };
}

export function evaluateDeal(listingPrice, estimatedPrice) {
  const listPrice = Number(listingPrice);
  const estimate = Number(estimatedPrice);

  if (!Number.isFinite(listPrice) || !Number.isFinite(estimate) || estimate <= 0) {
    return {
      isGoodDeal: false,
      diffValue: 0,
      diffPercent: 0,
    };
  }

  const diffValue = listPrice - estimate;
  const diffPercent = (diffValue / estimate) * 100;

  return {
    isGoodDeal: listPrice < estimate,
    diffValue,
    diffPercent,
  };
}

export async function getEstimate(payload) {
  const normalizedPayload = {
    id: payload.id,
    price: payload.price,
    size: payload.size ?? payload.meters ?? 0,
    rooms: payload.rooms ?? 0,
    location: payload.location ?? "",
  };

  const cacheKey = getCacheKey(normalizedPayload);
  if (estimateCache.has(cacheKey)) return estimateCache.get(cacheKey);
  if (pendingRequests.has(cacheKey)) return pendingRequests.get(cacheKey);

  const request = (async () => {
    try {
      // Backend contract:
      // POST /estimate
      // Request: { size, rooms, location, price, id }
      // Response: { estimatedPrice, confidence, explanation }
      const result = await apiFetch("/estimate", {
        method: "POST",
        body: normalizedPayload,
      });

      const finalResult = {
        estimatedPrice: Number(result?.estimatedPrice) || 0,
        confidence: typeof result?.confidence === "number" ? result.confidence : null,
        explanation: result?.explanation || "",
        source: "api",
      };

      estimateCache.set(cacheKey, finalResult);
      return finalResult;
    } catch (error) {
      const fallback = {
        ...mockEstimate(normalizedPayload),
        apiError: error?.message || "Estimator API unavailable",
      };
      estimateCache.set(cacheKey, fallback);
      return fallback;
    } finally {
      pendingRequests.delete(cacheKey);
    }
  })();

  pendingRequests.set(cacheKey, request);
  return request;
}
