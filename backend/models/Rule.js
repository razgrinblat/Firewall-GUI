const mongoose = require("mongoose");
const { handleFirewallRules } = require("../websocket/firewallWS");

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

// Static method to load rules
RuleSchema.statics.loadRulesOnStartup = async function() {
  try {
    console.log("Loading firewall rules from database...");
    const rules = await this.find();
    
    if (rules && rules.length > 0) {
      console.log(`Loaded ${rules.length} firewall rules`);
      handleFirewallRules(rules);
    } else {
      console.log("No firewall rules found in database");
    }
    
    return rules;
  } catch (err) {
    console.error("Error loading firewall rules:", err.message);
    return [];
  }
};

module.exports = mongoose.model("Rule", RuleSchema);