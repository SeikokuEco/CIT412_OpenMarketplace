const express = require("express");
const router = express.Router();
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");

const storage = new Storage();
const bucket = storage.bucket("marketplace-images-bucket");
const upload = multer({ storage: multer.memoryStorage() });

/* POST /api/upload */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const filename = `listings/${Date.now()}_${req.file.originalname.replace(/\s+/g, "_")}`;
    const blob = bucket.file(filename);

    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: req.file.mimetype
    });

    blobStream.on("error", (err) => {
      res.status(500).json({ error: err.message });
    });

    blobStream.on("finish", async () => {
      const image_url = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      res.status(200).json({ image_url });
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ error: "Failed to upload image" });
  }
});

module.exports = router;