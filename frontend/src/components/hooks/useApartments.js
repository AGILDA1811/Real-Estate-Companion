import { useEffect, useState } from "react";
import { fetchApartments } from "../services/apartments.api";

export function useApartments() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchApartments();
        if (alive) setApartments(Array.isArray(data) ? data : []);
      } catch (e) {
        if (alive) setError(e?.message || "Failed to load apartments");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return { apartments, loading, error };
}