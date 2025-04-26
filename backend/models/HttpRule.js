// models/HttpRule.js
const mongoose = require("mongoose");

let cachedHttpRules = null; // to hold HTTP rules for later firewall connection

const HttpRuleSchema = new mongoose.Schema({
  hosts: {
    type: [String],
    default: []
  },
  url_path_words: {
    type: [String],
    default: []
  },
  content_types: {
    type: [String],
    default: []
  },
  http_methods: {
    type: [String],
    default: []
  },
  user_agents: {
    type: [String],
    default: []
  },
  payload_words: {
    type: [String],
    default: []
  },
  max_content_length: {
    type: Number,
    default: 0
  }
});

// Static method to load and cache HTTP rules from DB
HttpRuleSchema.statics.loadRulesOnStartup = async function(handleHttpDpiRules) {
  try {
    console.log("Loading HTTP DPI rules from database...");
    const rule = await this.findOne();

    if (rule) {
      const { _id, __v, ...cleanRule } = rule.toObject();
      
      cachedHttpRules = cleanRule; // cache for future use
      console.log(`Loaded and cached HTTP DPI rules`);

      if (typeof handleHttpDpiRules === "function") {
        handleHttpDpiRules(cleanRule); // send now if firewall is connected
      }
    } else {
      console.log("No HTTP DPI rules found in database");
    }

    return rule;
  } catch (err) {
    console.error("Error loading HTTP DPI rules:", err.message);
    return null;
  }
};

// Function to access cached HTTP rules
HttpRuleSchema.statics.getCachedRules = function() {
  return cachedHttpRules;
};

module.exports = mongoose.model("HttpRule", HttpRuleSchema);