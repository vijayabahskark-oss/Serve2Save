import express from "express";
const router = express.Router();

// Register donor
router.post("/register", (req, res) => {
  const { name, email, phone } = req.body;
  res.json({ message: "Donor registered successfully!", donor: { name, email, phone } });
});

// List donors
router.get("/", (req, res) => {
  res.json([{ id: 1, name: "John Doe", email: "john@example.com" }]);
});

export default router;
