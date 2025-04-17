const mongoose = require("mongoose");

let cachedRules = []; // to hold rules for later firewall connection

const RuleSchema = new mongoose.Schema({
  name: String,
  action: String, // accept or block
  protocol: String, // tcp or udp
  src_ip: String,
  src_port: String,
  dst_ip: String,
  dst_port: String,
  is_active: Boolean
});

// Static method to load and cache rules from DB
RuleSchema.statics.loadRulesOnStartup = async function(handleFirewallRules) {
  try {
    console.log("Loading firewall rules from database...");
    const rules = await this.find();

    if (rules && rules.length > 0) {
      const cleanRules = rules.map(rule => {
        const { _id, __v, ...rest } = rule.toObject();
        return rest;
      });

      cachedRules = cleanRules; // cache for future use
      console.log(`Loaded and cached ${cleanRules.length} firewall rules`);

      if (typeof handleFirewallRules === "function") {
        handleFirewallRules(cleanRules); // send now if firewall is connected
      }
    } else {
      console.log("No firewall rules found in database");
    }

    return rules;
  } catch (err) {
    console.error("Error loading firewall rules:", err.message);
    return [];
  }
};

// Function to access cached rules
RuleSchema.statics.getCachedRules = function() {
  return cachedRules;
};

module.exports = mongoose.model("Rule", RuleSchema);
