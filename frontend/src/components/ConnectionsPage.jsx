import React, { useState } from "react";
import { useConnections } from "../hooks/useConnections";
import { Typography, Paper, Button, Box } from "@mui/material";
import HalfGauge from "./HalfGauge";

export default function ConnectionsPage() {
  const { tcp, udp } = useConnections();
  const [activeProtocol, setActiveProtocol] = useState("tcp");

  const tcpCount = tcp.length;
  const udpCount = udp.length;
  const total = tcpCount + udpCount;

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Active Sessions
      </Typography>

      {/* Gauges row: TCP vs. UDP */}
      <Box sx={{ display: "flex", justifyContent: "space-around", mb: 2 }}>
        <HalfGauge label="TCP Sessions" value={tcpCount} max={total} />
        <HalfGauge label="UDP Sessions" value={udpCount} max={total} />
      </Box>

      {/* Buttons to toggle between TCP and UDP lists */}
      <Box sx={{ mb: 2 }}>
        <Button
          variant={activeProtocol === "tcp" ? "contained" : "outlined"}
          onClick={() => setActiveProtocol("tcp")}
          sx={{ mr: 1 }}
        >
          Show TCP
        </Button>
        <Button
          variant={activeProtocol === "udp" ? "contained" : "outlined"}
          onClick={() => setActiveProtocol("udp")}
        >
          Show UDP
        </Button>
      </Box>

      {/* Conditionally render the session list */}
      {activeProtocol === "tcp" ? (
        <TcpSessionList sessions={tcp} />
      ) : (
        <UdpSessionList sessions={udp} />
      )}
    </Paper>
  );
}

function TcpSessionList({ sessions }) 
{
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        TCP Sessions ({sessions.length})
      </Typography>
      <ul>
        {sessions.map((s, i) => (
          <li key={i}>
            <strong>Src IP:</strong> {s.src_ip}, <strong>Dst IP:</strong>{" "}
            {s.dst_ip}, <strong>Src Port:</strong> {s.src_port},{" "}
            <strong>Dst Port:</strong> {s.dst_port}, <strong>State:</strong>{" "}
            {s.state}, <strong>Recv:</strong> {s.recv_packets} pkts,{" "}
            <strong>Sent:</strong> {s.sent_packets} pkts,{" "}
            <strong>Avg Size:</strong> {Number.parseFloat(s.avg_packet_size).toFixed(2)} B
          </li>
        ))}
      </ul>
    </Box>
  );
}

function UdpSessionList({ sessions })
{
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        UDP Sessions ({sessions.length})
      </Typography>
      <ul>
        {sessions.map((s, i) => (
          <li key={i}>
            <strong>Src IP:</strong> {s.src_ip}, <strong>Dst IP:</strong>{" "}
            {s.dst_ip}, <strong>Src Port:</strong> {s.src_port},{" "}
            <strong>Dst Port:</strong> {s.dst_port},{" "}
            <strong>Recv:</strong> {s.recv_packets} pkts,{" "}
            <strong>Sent:</strong> {s.sent_packets} pkts,{" "}
            <strong>Avg Size:</strong> {Number.parseFloat(s.avg_packet_size).toFixed(2)} B
          </li>
        ))}
      </ul>
    </Box>
  );
}
