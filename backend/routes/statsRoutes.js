const express = require("express");
const router = express.Router();
const { getStats } = require("../controllers/statsController");

  // Route to fetch current stats
  router.get("/stats", (req, res) => {
    res.json(getStats());
  });

module.exports = router;
