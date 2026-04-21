const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

/* Placeholder database  */
let listings = [];

/* GET all listings */
app.get("/api/listing", (req, res) => {
  try {
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

/* GET listing by ID */
app.get("/api/listing/:id", (req, res) => {
  try {
    const listing = listings.find(l => l.id === req.params.id);

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving listing" });
  }
});

/* Create new listing */
app.post("/api/listing", (req, res) => {
  const { title, price, description, location, latitude, longitude } = req.body;

  if (!title || !price) {
    return res.status(400).json({ error: "Title and price are required" });
  }

  const newListing = {
    id: Date.now().toString(),
    title,
    price,
    description: description || "",
    location: location || "",
    latitude: latitude || null,
    longitude: longitude || null,
    createdAt: new Date()
  };

  listings.push(newListing);

  res.json({
    message: "Listing created",
    id: newListing.id
  });
});

/* Update listing */
app.put("/api/listing/:id", (req, res) => {
  const index = listings.findIndex(l => l.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Listing not found" });
  }

  listings[index] = {
    ...listings[index],
    ...req.body,
    updatedAt: new Date()
  };

  res.json({ message: "Listing updated" });
});

/* Delete listing */
app.delete("/api/listing/:id", (req, res) => {
  const index = listings.findIndex(l => l.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Listing not found" });
  }

  listings.splice(index, 1);

  res.json({ message: "Listing deleted" });
});

/* Health check route */
app.get("/", (req, res) => {
  res.json({ message: "Marketplace API is running" });
});

/* Start server */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});