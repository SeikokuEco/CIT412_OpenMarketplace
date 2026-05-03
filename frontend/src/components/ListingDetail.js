import { GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
};

export default function ListingDetail({ listing, onClose }) {
  if (!listing) return null;

  const center = {
    lat: listing.latitude || 39.7684,
    lng: listing.longitude || -86.1581,
  };

  return (
    <div className="card mt-3 p-3">
      <h3>{listing.title}</h3>
      <p className="text-success">${listing.price}</p>
      <p>{listing.description}</p>
      <p>{listing.location}</p>

      <img src={listing.image_url} alt="Listing" className="img-fluid mb-3" />

      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        <Marker position={center} />
      </GoogleMap>

      <button className="btn btn-secondary mt-3" onClick={onClose}>
        Close
      </button>
    </div>
  );
}
