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

const submit = async () => {
  if (!form.title || !form.price) {
    alert("Title and price required");
    return;
  }

  let image_url = "";

  // Upload image if selected
  if (image) {
    const fd = new FormData();
    fd.append("image", image);

    const uploadRes = await fetch("http://localhost:3000/api/upload", {
      method: "POST",
      body: fd
    });

    const uploadData = await uploadRes.json();
    image_url = uploadData.image_url;
  }

  // Send listing with image_url
  onAdd({ ...form, image_url });

  // Reset form
  setForm({ title: "", price: "", description: "", location: "" });
  setImage(null);
};


  const [image, setImage] = useState(null);

  return (
    <div className="card p-3">
      <h4>Create Listing</h4>

      <input className="form-control mb-2" name="title" placeholder="Title" value={form.title} onChange={handleChange} />
      <input className="form-control mb-2" name="price" placeholder="Price" value={form.price} onChange={handleChange} />
      <textarea className="form-control mb-2" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <input className="form-control mb-2" name="location" placeholder="Location" value={form.location} onChange={handleChange} />
      <input type="file" className="form-control mb-2" accept="image/*" onChange={(e) => setImage(e.target.files[0])}/>

      <button className="btn btn-primary" onClick={submit}>Post Listing</button>
    </div>
  );
}


