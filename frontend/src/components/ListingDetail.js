import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

export default function ListingDetail({ listing, onClose }) {
  if (!listing) return null;

  // ok im not leaking the API AGAIN WHOOPS
  console.log("Frontend key:", process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

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

      {listing.image_url && (
        <img
          src={listing.image_url}
          alt="Listing"
          className="img-fluid mb-3"
        />
      )}

      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <Map
          style={{ width: "100%", height: "300px" }}
          center={center}
          zoom={20}
        >
          <Marker position={center} />
        </Map>
      </APIProvider>

      <button className="btn btn-secondary mt-3" onClick={onClose}>
        Close
      </button>
    </div>
  );
}
