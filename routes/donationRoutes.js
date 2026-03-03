import express from "express";
import Donation from "../models/Donation.js";

const router = express.Router();

// Create donation
router.post("/", async (req, res) => {
  try {
    const { donorId, food, quantity, location } = req.body;
    const donation = await Donation.create({ donorId, food, quantity, location });
    res.json({ message: "✅ Donation created successfully!", donation });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Track donations
router.get("/", async (req, res) => {
  const donations = await Donation.find().populate("donorId", "name email");
  res.json(donations);
});

export default router;

