// routes/rulesRoutes.js
const express = require("express");
const router = express.Router();
const { handleFirewallRules } = require("../websocket/firewallWS"); // Import the function to forward rules

// API route to receive rules from the frontend via HTTP POST
router.post("/rules", (req, res) => {
  const rules = req.body.rules; // Get the rules from the request body

  // Log the received rules to verify they're coming in correctly
  console.log("Received rules from frontend:", JSON.stringify(rules, null, 2));

  if (!rules || !Array.isArray(rules)) {
    return res.status(400).json({ message: "Invalid rules data" });
  }

  // Forward the rules to the firewall logic
  handleFirewallRules(rules);

  // Send success response
  res.status(200).json({ message: "Rules successfully saved", rules });
});

module.exports = router;
