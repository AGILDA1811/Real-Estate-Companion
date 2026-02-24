import ApartmentCard from "./ApartmentCard";
import "./apartments.css";

export default function ApartmentsList({ apartments }) {
  if (!apartments || apartments.length === 0) {
    return <p className="aptEmpty">No apartments found.</p>;
  }

  return (
    <div className="aptGrid">
      {apartments.map((a) => (
        <ApartmentCard key={a.id || a._id} apartment={a} />
      ))}
    </div>
  );
}