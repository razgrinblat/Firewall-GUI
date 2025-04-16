// server.js
const express = require("express");
const http = require("http");
const firewallWS = require("./websocket/firewallWS");
const statsRoutes = require("./routes/statsRoutes");
const clientsRoutes = require("./routes/clientsRoutes");
const connectionsRoutes = require("./routes/connectionsRoutes");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Use routes defined in routes/
app.use("/api", statsRoutes);
app.use("/api", clientsRoutes);
app.use("/api", connectionsRoutes);

// Create an HTTP server
const server = http.createServer(app);

// Setup the WebSocket server for the firewall on the same HTTP server
firewallWS(server); 

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});