// routes/connectionsRoutes.js
const express = require("express");
const router = express.Router();
const { getConnections } = require("../controllers/connectionsController");
  
// Route to fetch current connections/sessions
router.get("/sessions", (req, res) => {
  res.json(getConnections());
});

module.exports = router;