//firewallWS.js
const WebSocket = require("ws");
const { updateStats } = require("../controllers/statsController");
const { updateConnections } = require("../controllers/connectionsController");
const {sendBlockMsgToFrontend, sendInfoMsgToFrontend} = require("./FirewallMsgWS");
const { handleActivePortsMessage } = require("../controllers/patController");
const Rule = require("../models/Rule");
const HttpRule = require("../models/HttpRule");
const FtpRule = require("../models/FtpRule");

let firewallConnection = null;

function setupFirewallWebSocket(server) {
  const firewallWSS = new WebSocket.Server({
    server: server,
    path: "/firewall",
  });

  firewallWSS.on("connection", (ws) => {
    if (firewallConnection) {
      ws.send("Only one firewall connection is allowed.");
      ws.close();
      return;
    }

    firewallConnection = ws;
    console.log("Firewall connected.");
    
     // Send cached  IP rules
    const cached = Rule.getCachedRules();
    if (cached.length > 0)
    {
      console.log("Sending cached firewall rules to newly connected firewall...");
      ws.send(JSON.stringify({ type: "update rules", rules: cached }));
    }

    // Send cached HTTP DPI rules
    const cachedHttpRules = HttpRule.getCachedRules();
    if (cachedHttpRules)
    {
      handleHttpDpiRules(cachedHttpRules);
    }

    // Send cached FTP rules
    const cachedFtpRules = FtpRule.getCachedRules();
    if (cachedFtpRules)
    {
      handleFtpDpiRules(cachedFtpRules);
    }

    ws.on("message", (raw) => {
      try {
        const data = JSON.parse(raw);

        if (data.type === "packet stats")
        {
          delete data.type;
          updateStats(data);
        } 
        else if (data.type === "connections update")
        {
          delete data.type;
          updateConnections(data);
        } 
        else if (data.type === "active ports")
        {
          delete data.type;
          handleActivePortsMessage(data.data);
        }
        else if (data.type === "firewall info")
        {
          sendInfoMsgToFrontend(data.data);
        }
        else if (data.type === "firewall block")
        {
          sendBlockMsgToFrontend(data.data);
        } 
        else {
          console.log("Unknown message from firewall:", data);
        }
      } catch (err) {
        console.error("Error parsing firewall data:", err);
      }
    });

    ws.on("close", () => {
      console.log("Firewall disconnected.");
      firewallConnection = null;
    });

    ws.on("error", (err) => {
      console.error("Firewall WS error:", err);
    });
  });
}

/**
 * Handle incoming firewall rules and send them to the firewall logic
 */
function handleFirewallRules(rules) 
{
  // Forward the rules to the firewall application
  if (firewallConnection) 
  {
    console.log("Received firewall rules: ", rules);
    firewallConnection.send(JSON.stringify({ type: "update rules", rules :rules}));
  }
}

function handleHttpDpiRules(rules)
{
  if (firewallConnection)
  {
    console.log("Received firewall http Dpi rules: ", rules)
    firewallConnection.send(JSON.stringify({type: "update rules", http_rules : rules}))
  }
}

function handleFtpDpiRules(rules)
{
  if (firewallConnection)
  {
    console.log("Received firewall FTP Dpi rules: ", rules)
    firewallConnection.send(JSON.stringify({type: "update rules", ftp_rules: rules}))
  }
}

module.exports = setupFirewallWebSocket;
module.exports.handleFirewallRules = handleFirewallRules;
module.exports.handleHttpDpiRules = handleHttpDpiRules;
module.exports.handleFtpDpiRules = handleFtpDpiRules;