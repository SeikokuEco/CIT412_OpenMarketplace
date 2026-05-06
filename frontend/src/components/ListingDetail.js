import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

export default function ListingDetail({ listing, onClose }) {
  if (!listing) return null;

  const center = {
    lat: listing.latitude || 39.7684,
    lng: listing.longitude || -86.1581,
  };

  return (
    <div className="detail-card">
      <h3>{listing.title}</h3>
      <p className="text-success">${listing.price}</p>
      <p>{listing.description}</p>
      <p><strong>Category:</strong> {listing.category}</p>
      <p><strong>Condition:</strong> {listing.condition}</p>
      <p><strong>Location:</strong> {listing.location}</p>

      <div className="detail-flex">
        {listing.image_url && (
          <img
            src={listing.image_url}
            alt="Listing"
            className="detail-image"
          />
        )}

        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <div className="detail-map">
            <Map center={center} zoom={18} style={{ width: "100%", height: "100%" }}>
              <Marker position={center} />
            </Map>
          </div>
        </APIProvider>
      </div>

      <button className="btn detail-close" onClick={onClose}>
        Close
      </button>
    </div>
  );
}
