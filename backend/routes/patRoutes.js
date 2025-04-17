const express = require("express");
const router = express.Router();
const { getActivePorts } = require("../controllers/patController");

router.get("/pat-table", (req, res) => {
  try {
    const ports = getActivePorts();
    res.status(200).json(ports);
  } catch (err) {
    console.error("Error retrieving active ports:", err);
    res.status(500).json({ error: "Failed to retrieve port mappings" });
  }
});

module.exports = router;