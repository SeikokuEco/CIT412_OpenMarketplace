    export default function ListingDetail({ listing, onClose }) {
  if (!listing) return null;

  return (
    <div className="card mt-3 p-3">
      <h3>{listing.title}</h3>
      <p className="text-success">${listing.price}</p>
      <p>{listing.description}</p>
      <p>{listing.location}</p>

      <button className="btn btn-secondary" onClick={onClose}>
        Close
      </button>
    </div>
  );
}