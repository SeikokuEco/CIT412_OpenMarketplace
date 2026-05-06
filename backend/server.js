const express = require("express");
const cors = require("cors");
const { BigQuery } = require("@google-cloud/bigquery");
const { Storage } = require("@google-cloud/storage");
const uploadRoute = require("./routes/upload");
const savedRoute = require("./routes/saved");
const { Firestore } = require("@google-cloud/firestore");
const firestore = new Firestore({
  databaseId: "cit412-final-project-firestore-db"
});


const app = express();
const axios = require("axios");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

const bigquery = new BigQuery({
  projectId: "cit412-final-project-494116"
});

const DATASET = "marketplace";
const TABLE = "listings";

/* Upload route for listing images */
app.use("/api/upload", uploadRoute);

/* Saved listings route */
app.use("/api/saved", savedRoute);

/* Get Coordinates function */
async function getCoordinates(address) {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    const res = await axios.get(url);

    if (res.data.status === "OK") {
      const loc = res.data.results[0].geometry.location;
      return { lat: loc.lat, lng: loc.lng };
    } else {
      return { lat: null, lng: null };
    }
  } catch (err) {
    console.error("Geocode error:", err.message);
    return { lat: null, lng: null };
  }
}

/* GET all listings */
app.get("/api/listing", async (req, res) => {
  try {
    const query = `SELECT * FROM \`${DATASET}.${TABLE}\` ORDER BY created_at DESC`;
    const [rows] = await bigquery.query(query);
    res.json(rows);
  } catch (error) {
    console.error("🔥 BIGQUERY ERROR:", error);
    res.status(500).json({ error: error.message, details: error });
  }
});

/* GET listing by ID */
app.get("/api/listing/:id", async (req, res) => {
  try {
    const query = `
      SELECT * FROM \`${DATASET}.${TABLE}\`
      WHERE listing_id = @id
      LIMIT 1
    `;

    const options = {
      query,
      params: { id: req.params.id }
    };

    const [rows] = await bigquery.query(options);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error("🔥 BIGQUERY ERROR:", error);
    res.status(500).json({ error: error.message, details: error });
  }
});

/* Create new listing */
app.post("/api/listing", async (req, res) => {
  const {
    title,
    price,
    description,
    location,
    user_id,
    category,
    condition,
    image_url
  } = req.body;

  if (!title || !price) {
    return res.status(400).json({ error: "Title and price are required" });
  }

  let coords = { lat: null, lng: null };
  if (location) {
    coords = await getCoordinates(location);
  }

  const newListing = {
    listing_id: Date.now().toString(),
    user_id: user_id || "anonymous",
    title,
    description: description || "",
    price: price ? Number(price) : null,
    category: category || "",
    condition: condition || "",
    status: "active",
    location: location || "",
    latitude: coords.lat,
    longitude: coords.lng,
    image_url: image_url || "",
    created_at: new Date().toISOString()
  };

  try {
    console.log("📦 INSERTING:", newListing);

    //  Save to BigQuery
    await bigquery.dataset(DATASET).table(TABLE).insert([newListing]);

    //  ALSO save to Firestore
    await firestore
      .collection("listings")
      .doc(newListing.listing_id)
      .set(newListing);

  console.log("🔥 Saved to Firestore:", newListing.listing_id);
    res.status(201).json({
      message: "Listing created",
      id: newListing.listing_id
    });

  } catch (error) {
    console.error("🔥 ERROR:", error);
    res.status(500).json({ error: error.message, details: error });
  }
});

/* Update listing */
app.put("/api/listing/:id", async (req, res) => {
  const { title, price, description, location, category, condition, image_url } = req.body;

  try {
    // Recalculate coordinates if location is provided
    let coords = { lat: null, lng: null };
    if (location) {
      coords = await getCoordinates(location);
    }

    // Update BigQuery
    const query = `
      UPDATE \`${DATASET}.${TABLE}\`
      SET
        title = @title,
        price = @price,
        description = @description,
        location = @location,
        category = @category,
        condition = @condition,
        image_url = @image_url,
        latitude = @latitude,
        longitude = @longitude
      WHERE listing_id = @id
    `;

    const options = {
      query,
      params: {
        id: req.params.id,
        title: title ?? "",
        price: price !== undefined ? Number(price) : null,
        description: description ?? "",
        location: location ?? "",
        category: category ?? "",
        condition: condition ?? "",
        image_url: image_url ?? "",
        latitude: coords.lat,
        longitude: coords.lng
      }
    };

    await bigquery.query(options);

    // Update Firestore
    await firestore.collection("listings").doc(req.params.id).update({
      title,
      price: Number(price),
      description,
      location,
      category,
      condition,
      image_url,
      latitude: coords.lat,
      longitude: coords.lng
    });

    res.json({ message: "Listing updated" });

  } catch (error) {
    console.error("🔥 BIGQUERY ERROR:", error);
    res.status(500).json({ error: error.message, details: error });
  }
});




/* Delete listing */
app.delete("/api/listing/:id", async (req, res) => {
  try {
    const query = `
      DELETE FROM \`${DATASET}.${TABLE}\`
      WHERE listing_id = @id
    `;

    const options = {
      query,
      params: { id: req.params.id }
    };

    // 1. Delete from BigQuery
    await bigquery.query(options);

    // 2. Delete from Firestore
    await firestore.collection("listings").doc(req.params.id).delete();

    res.json({ message: "Listing deleted" });

  } catch (error) {
    console.error("🔥 DELETE ERROR:", error);
    res.status(500).json({ error: error.message, details: error });
  }
});


/* Health check */
app.get("/", (req, res) => {
  res.json({ message: "Marketplace API is running" });
});

/* Start server */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
