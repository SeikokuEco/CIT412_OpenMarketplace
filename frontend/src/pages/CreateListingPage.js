import { useState, useEffect } from "react";

export default function CreateListingPage({
  listings,
  onAdd,
  onDelete,
  onSelect,
  onEdit,      // function to start editing
  onUpdate,    // function to save edits
  editing      // the listing being edited
}) {
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    location: "",
    category: "",
    condition: ""
  });

  const [image, setImage] = useState(null);

  //  Pre-fill form when editing
  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title,
        price: editing.price,
        description: editing.description,
        location: editing.location,
        category: editing.category,
        condition: editing.condition
      });
    }
  }, [editing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="create-page">

      {/* Create / Edit Form */}
      <div className="form">
        <h3>{editing ? "Edit Listing" : "Create Listing"}</h3>

        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />

        <select className="dropdown" name="category" value={form.category} onChange={handleChange}>
          <option value="">Select Category</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Furniture">Furniture</option>
          <option value="Toys">Toys</option>
          <option value="Vehicles">Vehicles</option>
          <option value="Home Goods">Home Goods</option>
          <option value="Other">Other</option>
        </select>

        <select className="dropdown" name="condition" value={form.condition} onChange={handleChange}>
          <option value="">Select Condition</option>
          <option value="New">Brand New</option>
          <option value="Good">Good condition</option>
          <option value="Somewhat Used">Somewhat used</option>
          <option value="Fair">Fairly used</option>
          <option value="Poor">Poor condition</option>
        </select>

        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />

        <button
          className="btn"
          onClick={() => {
            if (editing) {
              onUpdate(editing.listing_id, form, image);
            } else {
              onAdd(form, image);
            }
          }}
        >
          {editing ? "Save Changes" : "Post Listing"}
        </button>
      </div>

      {/* Current Listings Section */}
      <div className="right">
        <h2 className="section-title">Your Current Listings</h2>

        <div className="listings">
          {listings.map(item => (
            <div className="card" key={item.listing_id}>
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  style={{ width: "100%", height: "160px", objectFit: "cover" }}
                />
              ) : (
                <div className="card-img">Image Unavailable</div>
              )}

              <h4>{item.title}</h4>
              <div className="price">${item.price}</div>
              <p>{item.location}</p>

              <button onClick={() => onSelect(item)}>View Details</button>
              <button onClick={() => onEdit(item)}>Edit</button>
              <button onClick={() => onDelete(item.listing_id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
