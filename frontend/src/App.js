import { useEffect, useState } from "react";
import "./styles.css";

const BASE_URL = "/api/listing";

function App() {
  const [listings, setListings] = useState([]);
  const [selected, setSelected] = useState(null);

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    location: ""
  });

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // LOAD DATA
  const loadListings = async () => {
    const res = await fetch(BASE_URL);
    const data = await res.json();
    console.log(data);
    setListings(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadListings();
  }, []);

  // ADD LISTING
  const addListing = async () => {
    if (!form.title || !form.price) {
      alert("Title and price required");
      return;
    }

    await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    setForm({
      title: "",
      price: "",
      description: "",
      location: ""
    });

    loadListings();
  };

  // DELETE
  const deleteListing = async (id) => {
    await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE"
    });

    loadListings();
  };

  return (
  <div>

    <div className="navbar">Open Marketplace</div>

   <div className="main">

  {/* CENTER FORM */}
  <div className="form">
    <h3>Create Listing</h3>

    <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
    <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
    <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
    <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />

    <button className="btn" onClick={addListing}>
      Post Listing
    </button>
  </div>

  {/* LISTINGS BELOW */}
  <div className="right">
    <div className="section-title">Available Listings</div>

    <div className="listings">
      {listings.map(item => (
        <div className="card" key={item.listing_id}>
          <div className="card-img"></div>

          <h4>{item.title}</h4>
          <div className="price">${item.price}</div>
          <p>{item.location}</p>

          <button onClick={() => setSelected(item)}>View Details</button>
          <button onClick={() => deleteListing(item.id)}>Delete</button>
        </div>
      ))}
    </div>
  </div>

</div>

    {/* DETAILS */}
    {selected && (
      <div className="detail">
        <h2>{selected.title}</h2>
        <p className="price">${selected.price}</p>
        <p>{selected.description}</p>
        <p>{selected.location}</p>

        <button onClick={() => setSelected(null)}>Close</button>
      </div>
    )}

  </div>
);
}

export default App;