const express = require("express");
const router = express.Router();
const db = require("../firestore");
const admin = require("firebase-admin");

// Save a listing
router.post("/:userId/:listingId", async (req, res) => {
  const { userId, listingId } = req.params;
  const { title, price, image_url } = req.body;

  try {
    await db
      .collection("saved_items")
      .doc(userId)
      .collection("listings")
      .doc(listingId)
      .set({
        listing_id: listingId,
        title,
        price,
        image_url: image_url || "",
        saved_at: admin.firestore.FieldValue.serverTimestamp()
      });

    res.status(201).json({ message: "Listing saved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save listing" });
  }
});

// Get all saved listings for a user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const snapshot = await db
      .collection("saved_items")
      .doc(userId)
      .collection("listings")
      .get();

    const saved = snapshot.docs.map(doc => doc.data());
    res.status(200).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch saved listings" });
  }
});

// Remove a saved listing
router.delete("/:userId/:listingId", async (req, res) => {
  const { userId, listingId } = req.params;

  try {
    await db
      .collection("saved_items")
      .doc(userId)
      .collection("listings")
      .doc(listingId)
      .delete();

    res.status(200).json({ message: "Listing removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove listing" });
  }
});

module.exports = router;