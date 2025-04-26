// models/FtpRule.js
const mongoose = require("mongoose");

let cachedFtpRules = null; // to hold FTP rules for later firewall connection

const FtpRuleSchema = new mongoose.Schema({
  download_key_words: {
    type: [String],
    default: []
  },
  upload_key_words: {
    type: [String],
    default: []
  },
  download_file_names: {
    type: [String],
    default: []
  },
  upload_file_names: {
    type: [String],
    default: []
  }
});

// Static method to load and cache FTP rules from DB
FtpRuleSchema.statics.loadRulesOnStartup = async function(handleFtpDpiRules) {
  try {
    console.log("Loading FTP rules from database...");
    const rule = await this.findOne();

    if (rule) {
      const { _id, __v, ...cleanRule } = rule.toObject();
      
      cachedFtpRules = cleanRule; // cache for future use
      console.log(`Loaded and cached FTP rules`);

      if (typeof handleFtpDpiRules === "function") {
        handleFtpDpiRules(cleanRule); // send now if firewall is connected
      }
    } else {
      console.log("No FTP rules found in database");
    }

    return rule;
  } catch (err) {
    console.error("Error loading FTP rules:", err.message);
    return null;
  }
};

// Function to access cached FTP rules
FtpRuleSchema.statics.getCachedRules = function() {
  return cachedFtpRules;
};

module.exports = mongoose.model("FtpRule", FtpRuleSchema);