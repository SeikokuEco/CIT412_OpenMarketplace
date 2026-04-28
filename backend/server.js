const express = require("express");
const cors = require("cors");
const { BigQuery } = require("@google-cloud/bigquery");
const uploadRoute = require("./routes/upload"); // import upload route

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const bigquery = new BigQuery({
  projectId: "cit412-final-project-494116"
});
const DATASET = "marketplace";
const TABLE = "listings";

/* Upload route for listing images -- images to be stored in firestore*/
app.use("/api/upload", uploadRoute);

/* GET all listings */
app.get("/api/listing", async (req, res) => {
  try {
    const query = `SELECT * FROM \`${DATASET}.${TABLE}\` ORDER BY created_at DESC`;
    const [rows] = await bigquery.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch listings" });
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
    res.status(500).json({ error: "Error retrieving listing" });
  }
});

/* Create new listing */
app.post("/api/listing", async (req, res) => {
  const { title, price, description, location, latitude, longitude, user_id, category, condition, image_url } = req.body;

  if (!title || !price) {
    return res.status(400).json({ error: "Title and price are required" });
  }

  const newListing = {
    listing_id: Date.now().toString(),
    user_id: user_id || "anonymous",
    title,
    price: parseFloat(price),
    description: description || "",
    location: location || "",
    latitude: latitude || null,
    longitude: longitude || null,
    category: category || "",
    condition: condition || "",
    image_url: image_url || "",
    status: "active",
    created_at: new Date().toISOString()
  };

  try {
    await bigquery
      .dataset(DATASET)
      .table(TABLE)
      .insert([newListing]);

    res.status(201).json({
      message: "Listing created",
      id: newListing.listing_id
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create listing" });
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
        price: price ? parseFloat(price) : null,
        description: description || null,
        location: location || null,
        status: status || null
      }
    };

    await bigquery.query(options);
    res.json({ message: "Listing updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update listing" });
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
    res.status(500).json({ error: "Failed to delete listing" });
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