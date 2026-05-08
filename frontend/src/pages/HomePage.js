import React, { useState } from "react";

export default function HomePage({ listings, onSelect, onDelete, onSave }) {

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");

  // Filtering logic
  const filteredListings = listings.filter(item => {
    const categoryMatch =
      selectedCategory === "" || item.category === selectedCategory;

    const conditionMatch =
      selectedCondition === "" || item.condition === selectedCondition;

    return categoryMatch && conditionMatch;
  });

  return (
    <div className="right">
      <h2 className="section-title">Available Listings</h2>

      {/* Filtering system */}
      <div className="filters">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="dropdown">
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Furniture">Furniture</option>
          <option value="Toys">Toys</option>
          <option value="Vehicles">Vehicles</option>
          <option value="Home Goods">Home Goods</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={selectedCondition}
          onChange={(e) => setSelectedCondition(e.target.value)}
          className="dropdown">
          <option value="">All Conditions</option>
          <option value="New">Brand New</option>
          <option value="Good">Good condition</option>
          <option value="Somewhat Used">Somewhat used</option>
          <option value="Fair">Fairly used</option>
          <option value="Poor">Poor condition</option>
        </select>
      </div>

      <div className="listings">
        {filteredListings.map(item => (
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
            <button id="detailsButtonhHome" onClick={() => onSelect(item)}>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}
