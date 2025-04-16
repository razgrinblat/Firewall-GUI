// store/clientsStore.js
const clientsMap = new Map();

function updateClientSessions(data) {
  const sessions = [...(data.tcp || []), ...(data.udp || [])];

  for (const session of sessions) {
    const ip = session.src_ip;
    // Make sure we have the protocol field
    const protocol = session.protocol || (
      Array.isArray(data.tcp) && data.tcp.includes(session) ? "TCP" : "UDP"
    );
    
    const packetSize = parseFloat(session.avg_packet_size) || 0;
    const totalSessionPackets = (parseInt(session.sent_packets) || 0) + (parseInt(session.recv_packets) || 0);

    if (!clientsMap.has(ip)) {
      clientsMap.set(ip, { 
        ip, 
        tcp: 0, 
        udp: 0, 
        totalPackets: 0,
        totalSize: 0,
        avgPacketSize: 0
      });
    }

    const client = clientsMap.get(ip);
    
    // Update protocol counters - important to make sure we're incrementing correctly
    if (protocol === "TCP") {
      client.tcp += 1; // Count the connection, not increment by 1
    } else if (protocol === "UDP") {
      client.udp += 1; // Count the connection, not increment by 1
    }
    
    // Update packet size calculations
    if (totalSessionPackets > 0 && packetSize > 0) {
      client.totalPackets += totalSessionPackets;
      client.totalSize += totalSessionPackets * packetSize;
      
      // Recalculate average packet size
      client.avgPacketSize = parseFloat((client.totalSize / client.totalPackets).toFixed(2));
    }
    
    console.log(`Updated client ${ip}: TCP=${client.tcp}, UDP=${client.udp}, AvgSize=${client.avgPacketSize}`);
  }
}

function getAllClients() {
  return Array.from(clientsMap.values());
}

module.exports = {
  updateClientSessions,
  getAllClients,
};