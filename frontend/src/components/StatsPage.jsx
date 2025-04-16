// src/components/StatsPage.jsx
import React from "react";
import { Typography, Paper } from "@mui/material";
import { usePacketStats } from "../hooks/usePacketStats";
import StatsPieChart from "./statsPieChart";

export default function StatsPage() {
  const packetStats = usePacketStats();

  // Transform stats object into array for Recharts
  const chartData = packetStats
    ? Object.entries(packetStats).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h5" gutterBottom>
        Packet Stats
      </Typography>
      {!packetStats ? (
        <Typography>Loading stats...</Typography>
      ) : (
        <StatsPieChart data={chartData} />
      )}
    </Paper>
  );
}
