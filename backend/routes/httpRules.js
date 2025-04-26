// routes/httpRules.js
const express = require("express");
const router = express.Router();
const HttpRule = require("../models/HttpRule");
const { handleHttpDpiRules } = require("../websocket/firewallWS");

// Save HTTP rules from frontend
router.post("/http_rules", async (req, res) => {
  try {
    const rules = req.body.http_rules;

    if (!rules) {
      return res.status(400).json({ message: "Invalid HTTP rules data" });
    }
    
    // Clear existing rules
    await HttpRule.deleteMany({});
    
    // Save new rules to MongoDB
    const newHttpRule = new HttpRule(rules);
    await newHttpRule.save();
    
    // Forward rules to firewall logic
    handleHttpDpiRules(rules);
    
    res.status(200).json({ message: "HTTP DPI rules successfully saved", http_rules: rules });
  } catch (err) {
    console.error("Error saving HTTP DPI rules:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get HTTP DPI rules
router.get("/http_rules", async (req, res) => {
  try {
    const rule = await HttpRule.findOne();
    res.json({ http_rules: rule });
  } catch (err) {
    console.error("Error fetching HTTP DPI rules:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;