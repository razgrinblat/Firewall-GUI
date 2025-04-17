let activePorts = [];

function handleActivePortsMessage(data) {
  if (!Array.isArray(data)) {
    console.warn("Expected array of port mappings, got:", data);
    return;
  }

  activePorts = data.map(entry => ({
    client_ip: entry.client_ip,
    client_port: entry.client_port,
    firewall_port: entry.firewall_port
  }));
  
  console.log("Updated PAT table:", activePorts);
}

function getActivePorts() {
  return activePorts;
}

module.exports = {
  handleActivePortsMessage,
  getActivePorts
};