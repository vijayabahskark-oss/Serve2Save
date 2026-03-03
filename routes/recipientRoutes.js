import express from "express";
const router = express.Router();

// Register recipient (like NGOs)
router.post("/register", (req, res) => {
  const { orgName, contact, location } = req.body;
  res.json({ message: "Recipient registered successfully!", recipient: { orgName, contact, location } });
});

// List recipients
router.get("/", (req, res) => {
  res.json([{ id: 1, orgName: "Helping Hands NGO", contact: "9999999999" }]);
});

export default router;
