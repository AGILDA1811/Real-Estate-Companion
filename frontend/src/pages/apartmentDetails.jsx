import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchApartmentById } from "../components/services/apartments.api";
import "../components/apartaments/apartments.css";

export default function ApartmentDetailsPage() {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchApartmentById(id);
        if (!data) throw new Error("Apartment not found");
        if (alive) setApartment(data);
      } catch (e) {
        if (alive) setError(e?.message || "Failed to load apartment");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  return (
    <main className="aptPage">
      <Link className="aptBack" to="/apartments">← Back to apartments</Link>

      <h1 className="aptTitle">Apartment Details</h1>

      {loading ? <p className="aptState">Loading...</p> : null}
      {error ? <p className="aptState aptError">{error}</p> : null}

      {!loading && !error && apartment ? (
        <div className="aptBox">
          <p><strong>Price:</strong> {apartment.price} €</p>
          <p><strong>Meters:</strong> {apartment.meters} m²</p>
          <p><strong>Description:</strong> {apartment.description}</p>
        </div>
      ) : null}
    </main>
  );
}
