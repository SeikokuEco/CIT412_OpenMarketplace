process.env.GOOGLE_APPLICATION_CREDENTIALS =
  "./bigquery-key.json";

const uploadRoute = require("./routes/upload");
const express = require("express");
const cors = require("cors");
const { BigQuery } = require("@google-cloud/bigquery");
const { Storage } = require("@google-cloud/storage");
const app = express();
const axios = require("axios");
require("dotenv").config();



app.use(cors());
app.use(express.json());
// added to handle JSON.stringify
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

const bigquery = new BigQuery({
  projectId: "cit412-final-project-494116"
});

const DATASET = "marketplace";
const TABLE = "listings";


async function getCoordinates(address) {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    console.log("Using API key:", apiKey);
    console.log("Geocode URL:", url);

    const res = await axios.get(url);

    if (res.data.status === "OK") {
      const loc = res.data.results[0].geometry.location;
      return { lat: loc.lat, lng: loc.lng };
    } else {
      console.warn("Geocode failed:", res.data.status);
      return { lat: null, lng: null };
    }
  } catch (err) {
    console.error("Geocode error:", err.message);
    return { lat: null, lng: null };
  }
}




/* Upload route for listing images -- images to be stored in firestore */
app.use("/api/upload", uploadRoute);

/* GET all listings */
app.get("/api/listing", async (req, res) => {
  try {
    const query = `SELECT * FROM \`${DATASET}.${TABLE}\` ORDER BY created_at DESC`;
    const [rows] = await bigquery.query(query);
    res.json(rows);
  } catch (error) {
    console.error("🔥 BIGQUERY ERROR:", error);

    res.status(500).json({
      error: error.message,
      details: error
    });
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

    res.status(500).json({
      error: error.message,
      details: error
    });
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

  //  GET COORDINATES FROM ADDRESS
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
    latitude: coords.lat,      // 🔥 FIXED
    longitude: coords.lng,     // 🔥 FIXED
    image_url: image_url || "",
    created_at: new Date().toISOString()
  };

  try {
    console.log("📦 INSERTING:", newListing);

    await bigquery
      .dataset(DATASET)
      .table(TABLE)
      .insert([newListing]);

    res.status(201).json({
      message: "Listing created",
      id: newListing.listing_id
    });

  } catch (error) {
    console.error("🔥 BIGQUERY INSERT ERROR:", error);

    res.status(500).json({
      error: error.message,
      details: error
    });
  }
});

/* Update listing */
app.put("/api/listing/:id", async (req, res) => {
  const { title, price, description, location, status } = req.body;

  try {
    const query = `
      UPDATE \`${DATASET}.${TABLE}\`
      SET
        title = COALESCE(@title, title),
        price = COALESCE(@price, price),
        description = COALESCE(@description, description),
        location = COALESCE(@location, location),
        status = COALESCE(@status, status)
      WHERE listing_id = @id
    `;

    const options = {
      query,
      params: {
        id: req.params.id,
        title: title || null,
        price: price ? Number(price) : null,
        description: description || null,
        location: location || null,
        status: status || null
      }
    };

    await bigquery.query(options);

    res.json({ message: "Listing updated" });

  } catch (error) {
    console.error("🔥 BIGQUERY ERROR:", error);

    res.status(500).json({
      error: error.message,
      details: error
    });
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

    await bigquery.query(options);

    res.json({ message: "Listing deleted" });

  } catch (error) {
    console.error("🔥 BIGQUERY ERROR:", error);

    res.status(500).json({
      error: error.message,
      details: error
    });
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