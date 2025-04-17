//server.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const firewallWS = require("./websocket/firewallWS");
const conflictedRuleWS = require("./websocket/conflictedRuleWS");
const statsRoutes = require("./routes/statsRoutes");
const clientsRoutes = require("./routes/clientsRoutes");
const connectionsRoutes = require("./routes/connectionsRoutes");
const rulesRoutes = require("./routes/rulesRoutes");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT;
const CONFLICTED_RULE_PORT = process.env.CONFLICTED_RULE_PORT;
app.use(cors());
// Middleware to parse JSON
app.use(express.json());

// Use routes defined in routes/
app.use("/api", statsRoutes);
app.use("/api", clientsRoutes);
app.use("/api", connectionsRoutes);
app.use("/api",rulesRoutes);


const server = http.createServer(app);
firewallWS(server); 

const conflictedRuleServer = http.createServer();  
conflictedRuleWS(conflictedRuleServer); 

server.listen(PORT,  async () => {
  await connectDB();
  console.log(`Server running on http://localhost:${PORT}`);
  // Load rules from MongoDB and apply them
  const Rule = require("./models/Rule");
  await Rule.loadRulesOnStartup();
});
conflictedRuleServer.listen(CONFLICTED_RULE_PORT);