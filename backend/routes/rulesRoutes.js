const express = require("express");
const router = express.Router();
const Rule = require("../models/Rule");
const { handleFirewallRules } = require("../websocket/firewallWS");

// Save rules from frontend
router.post("/rules", async (req, res) => {
  try {
    const rules = req.body.rules;
    
    console.log("Received rules from frontend:", JSON.stringify(rules, null, 2));
    
    if (!rules || !Array.isArray(rules)) {
      return res.status(400).json({ message: "Invalid rules data" });
    }
    
    // Clear existing rules
    await Rule.deleteMany({});
    
    // Save new rules to MongoDB
    await Rule.insertMany(rules);
    
    // Forward rules to firewall logic
    handleFirewallRules(rules);
    
    res.status(200).json({ message: "Rules successfully saved", rules });
  } catch (err) {
    console.error("Error saving rules:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all rules
router.get("/rules", async (req, res) => {
  try {
    const rules = await Rule.find();
    res.json({ rules });
  } catch (err) {
    console.error("Error fetching rules:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;