const WebSocket = require("ws");

// Create a new WebSocket server for conflicted rule messages
let conflictedRuleConnection = null;

module.exports = function setupConflictedRuleWebSocket(server) {
  const conflictedRuleWSS = new WebSocket.Server({
    server: server,
    path: "/conflicted-rule", // New path for conflicted rules WebSocket
  });

  conflictedRuleWSS.on("connection", (ws) => {
    conflictedRuleConnection = ws;
    console.log("Conflicted Rule WebSocket connected.");

    // Handle messages coming from this WebSocket connection if needed
    ws.on("message", (raw) => {
      // You can process any incoming messages if required
      console.log("Received message on conflicted rule WS:", raw);
    });

    ws.on("close", () => {
      console.log("Conflicted Rule WebSocket disconnected.");
      conflictedRuleConnection = null;
    });

    ws.on("error", (err) => {
      console.error("Conflicted Rule WS error:", err);
    });
  });
};

/**
 * Function to send conflicted rule data to the frontend
 * @param {Object} conflictedRuleData - The conflicted rule to be sent to frontend
 */
function sendConflictedRuleToFrontend(conflictedRuleData) {
  if (conflictedRuleConnection && conflictedRuleConnection.readyState === WebSocket.OPEN) {
    conflictedRuleConnection.send(JSON.stringify({
      type: "rule conflict",
      data: conflictedRuleData,
    }));
  } else {
    console.error("No active WebSocket connection for conflicted rule.");
  }
}

module.exports.sendConflictedRuleToFrontend = sendConflictedRuleToFrontend;
