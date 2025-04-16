// controllers/connectionsController.js
const { updateClientSessions } = require("../store/clientsStore");

// Store for connections data
let currentConnections = {
  tcp: [],
  udp: []
};

function updateConnections(data) {
  // Make sure we have valid data
  if (!data) {
    console.error("No data provided to updateConnections");
    return;
  }

  // Store the current connections data
  if (Array.isArray(data.tcp)) currentConnections.tcp = data.tcp;
  if (Array.isArray(data.udp)) currentConnections.udp = data.udp;

  try {
    // Update the clients sessions counter
    updateClientSessions(data);
  } catch (err) {
    console.error("Error updating client sessions:", err);
  }
}

function getConnections() {
  return currentConnections;
}

module.exports = { 
  updateConnections,
  getConnections
};