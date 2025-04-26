//server.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const firewallWS = require("./websocket/firewallWS");
const FirewallMsgWS = require("./websocket/FirewallMsgWS");
const statsRoutes = require("./routes/statsRoutes");
const clientsRoutes = require("./routes/clientsRoutes");
const connectionsRoutes = require("./routes/connectionsRoutes");
const rulesRoutes = require("./routes/rulesRoutes");
const patRoute = require("./routes/patRoutes");
const httpRulesRoutes = require("./routes/httpRules");
const ftpRulesRoutes = require("./routes/ftpRules");
const connectDB = require("./config/db");
const Rule = require("./models/Rule");
const FtpRule = require("./models/FtpRule");
const HttpRule = require("./models/HttpRule");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT;
const FIREWALL_INFO_PORT = process.env.FIREWALL_INFO_PORT;
app.use(cors());
// Middleware to parse JSON
app.use(express.json());

// Use routes defined in routes/
app.use("/api", statsRoutes);
app.use("/api", clientsRoutes);
app.use("/api", connectionsRoutes);
app.use("/api", rulesRoutes);
app.use("/api", patRoute);
app.use("/api", httpRulesRoutes);
app.use("/api", ftpRulesRoutes);

const server = http.createServer(app);

const FirewallMsgServer = http.createServer();  
FirewallMsgWS(FirewallMsgServer); 

server.listen(PORT,  async () => {
  await connectDB();
  
  // Load rules from MongoDB
  await Rule.loadRulesOnStartup();

  // Load HTTP DPI rules from MongoDB
  await HttpRule.loadRulesOnStartup();
  
  // Load FTP rules from MongoDB
  await FtpRule.loadRulesOnStartup();
  
  firewallWS(server); 
  console.log(`Server running on http://localhost:${PORT}`);
});
FirewallMsgServer.listen(FIREWALL_INFO_PORT);