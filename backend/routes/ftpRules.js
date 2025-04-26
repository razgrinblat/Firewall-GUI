// routes/ftpRules.js
const express = require("express");
const router = express.Router();
const FtpRule = require("../models/FtpRule");
const { handleFtpDpiRules } = require("../websocket/firewallWS");

// Save FTP rules from frontend
router.post("/ftp_rules", async (req, res) => {
  try {
    const rules = req.body.ftp_rules;
    
    if (!rules) {
      return res.status(400).json({ message: "Invalid FTP rules data" });
    }
    
    // Clear existing rules
    await FtpRule.deleteMany({});
    
    // Save new rules to MongoDB
    const newFtpRule = new FtpRule(rules);
    await newFtpRule.save();
    
    // Forward rules to firewall logic
    handleFtpDpiRules(rules);
    
    res.status(200).json({ message: "FTP rules successfully saved", ftp_rules: rules });
  } catch (err) {
    console.error("Error saving FTP rules:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get FTP rules
router.get("/ftp_rules", async (req, res) => {
  try {
    const rule = await FtpRule.findOne();
    res.json({ ftp_rules: rule});
  } catch (err) {
    console.error("Error fetching FTP rules:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;