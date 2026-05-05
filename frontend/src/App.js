import { useEffect, useState } from "react";
import ListingDetail from "./components/ListingDetail";
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

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const loadListings = async () => {
    const res = await fetch(BASE_URL);
    const data = await res.json();
    setListings(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadListings();
  }, []);

  const addListing = async () => {
    if (!form.title || !form.price) {
      alert("Title and price required");
      return;
    }

    let image_url = "";

    if (image) {
      const fd = new FormData();
      fd.append("image", image);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: fd
      });

      const uploadData = await uploadRes.json();
      image_url = uploadData.image_url;
    }

    await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, image_url })
    });

    setForm({ title: "", price: "", description: "", location: "" });
    setImage(null);

    loadListings();
  };

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
          <div className="form">
            <h3>Create Listing</h3>

            <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
            <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
            <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={{ marginTop: "10px" }}/>

            <button className="btn" onClick={addListing}>
              Post Listing
            </button>
          </div>

          <div className="right">
            <div className="section-title">Available Listings</div>

            <div className="listings">
              {listings.map(item => (
                <div className="card" key={item.listing_id}>
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} style={{ width: "100%", height: "160px", objectFit: "cover" }} />
                  ) : (
                    <div className="card-img">Image Unavailable</div>
                  )}

                  <h4>{item.title}</h4>
                  <div className="price">${item.price}</div>
                  <p>{item.location}</p>

                  <button onClick={() => setSelected(item)}>View Details</button>
                  <button onClick={() => deleteListing(item.listing_id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selected && (
          <ListingDetail listing={selected} onClose={() => setSelected(null)} />
        )}
      </div>
  );
}

export default App;
