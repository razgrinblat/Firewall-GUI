//firewallMsgWS.js
const WebSocket = require("ws");

// Create a new WebSocket server for firewall messages
let FirewallMsgWSConnection = null;

module.exports = function setupInfoMessageWebSocket(server) {
  const InfoMessageWS = new WebSocket.Server({
    server: server,
    path: "/firewall_messages", // New path for firewall messages WebSocket
  });

  InfoMessageWS.on("connection", (ws) => {
    FirewallMsgWSConnection = ws;

    // Handle messages coming to this WebSocket
    ws.on("message", (raw) => {
    });

    ws.on("close", () => {
      FirewallMsgWSConnection = null;
    });

    ws.on("error", (err) => {
      console.error("Firewall Messages WS error:", err);
    });
  });
};

/**
 * Function to send Firewall General Info to the frontend
 * @param {Object} FirewallInfo - The message sent to frontend
 */
function sendInfoMsgToFrontend(FirewallInfo) {
  if (FirewallMsgWSConnection && FirewallMsgWSConnection.readyState === WebSocket.OPEN) 
  {
    FirewallMsgWSConnection.send(JSON.stringify({
      type: "firewall info",
      data: FirewallInfo,
    }));
  } else {
    console.error("No active WebSocket connection for info message");
  }
}

/**
 * Function to send blocked packet Info to the frontend
 * @param {Object} FirewallInfo - The message sent to frontend
 */
function sendBlockMsgToFrontend(FirewalMsg)
{
  if (FirewallMsgWSConnection && FirewallMsgWSConnection.readyState === WebSocket.OPEN) 
  {
    FirewallMsgWSConnection.send(JSON.stringify({
    
      type: "firewall block",
      data: FirewalMsg,
    }));
  } else {
    console.error("No active WebSocket connection for info message");
  }
}

module.exports.sendInfoMsgToFrontend = sendInfoMsgToFrontend;
module.exports.sendBlockMsgToFrontend = sendBlockMsgToFrontend;