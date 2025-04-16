const WebSocket = require("ws");
const { updateStats } = require("../controllers/statsController");
const { updateConnections } = require("../controllers/connectionsController");

let firewallConnection = null;

/**
 * Sets up the WebSocket server for firewall connections.
 */
module.exports = function setupFirewallWebSocket(server) {
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

    ws.on("message", (raw) => {
      try {
        const data = JSON.parse(raw);

        // Handle packet stats (stats page update)
        if (data.type === "packet stats") {
          delete data.type;
          updateStats(data); // update stats using the controller
        }

        // Handle connections update (connections page update)
        else if (data.type === "connections update") {
          delete data.type;
          console.log(data);
          updateConnections(data); // update TCP/UDP connections list
        }

        // Handle firewall rule updates
        else if (data.rules)
        {
          handleFirewallRules(data.rules); // forward rules to the firewall logic
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
};

/**
 * Handle incoming firewall rules and send them to the firewall logic
 */
function handleFirewallRules(rules)
{
  // Forward the rules to the C++ firewall application
  if (firewallConnection)
  {
    console.log("Received firewall rules:", rules);
    firewallConnection.send(JSON.stringify({ type: "update rules", rules }));
  }
}
