export default function ListingList({ listings, onDelete, onSelect }) {
  return (
    <div className="row">
      {listings.map(item => (
        <div className="col-md-6 mb-3" key={item.id}>
          <div className="card p-3">

            <h5>{item.title}</h5>
            <p className="text-success fw-bold">${item.price}</p>
            <p>{item.location}</p>

            <button className="btn btn-outline-primary mb-2" onClick={() => onSelect(item)}>
              View Details
            </button>

            <button className="btn btn-danger" onClick={() => onDelete(item.id)}>
              Delete
            </button>

          </div>
        </div>
      ))}
    </div>
  );
}