import { useState } from "react";

export default function ListingForm({ onAdd }) {
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    location: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = () => {
    if (!form.title || !form.price) {
      alert("Title and price required");
      return;
    }

    onAdd(form);
    setForm({ title: "", price: "", description: "", location: "" });
  };

  return (
    <div className="card p-3">
      <h4>Create Listing</h4>

      <input className="form-control mb-2" name="title" placeholder="Title" value={form.title} onChange={handleChange} />
      <input className="form-control mb-2" name="price" placeholder="Price" value={form.price} onChange={handleChange} />
      <textarea className="form-control mb-2" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <input className="form-control mb-2" name="location" placeholder="Location" value={form.location} onChange={handleChange} />

      <button className="btn btn-primary" onClick={submit}>Post Listing</button>
    </div>
  );
}