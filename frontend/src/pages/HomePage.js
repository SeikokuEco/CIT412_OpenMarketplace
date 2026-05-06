export default function HomePage({ listings, onSelect, onDelete, onSave }) {
  return (
    <div className="right">
      <h2 className="section-title">Available Listings</h2>

      <div className="listings">
        {listings.map(item => (
          <div className="card" key={item.listing_id}>
            <img
              src={item.image_url}
              alt={item.title}
              style={{ width: "100%", height: "160px", objectFit: "cover" }}
            />

            <h4>{item.title}</h4>
            <div className="price">${item.price}</div>
            <p>{item.location}</p>

            {/* This opens the detail view with the map */}
            <button onClick={() => onSelect(item)}>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}
