
import { useApartments } from "../components/hooks/useApartments";
import "../components/apartaments/apartments.css";
import ApartmentsList from "../components/apartaments/ApartmentsList";

export default function ApartmentsPage() {
  const { apartments, loading, error } = useApartments();

  return (
    <main className="aptPage">
      <h1 className="aptTitle">Apartments</h1>

      {loading ? <p className="aptState">Loading...</p> : null}
      {error ? <p className="aptState aptError">{error}</p> : null}

      {!loading && !error ? <ApartmentsList apartments={apartments} /> : null}
    </main>
  );
}
