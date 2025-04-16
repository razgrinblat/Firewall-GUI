import React from "react";
import { useClients } from "../hooks/useClients"; 
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";

export default function ClientsPage() {
  const clients = useClients(); 

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Connected Clients
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>IP Address</strong></TableCell>
            <TableCell><strong>TCP Sessions</strong></TableCell>
            <TableCell><strong>UDP Sessions</strong></TableCell>
            <TableCell><strong>Avg Packet Size (B)</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((client, index) => (
            <TableRow key={index}>
              <TableCell>{client.ip}</TableCell>
              <TableCell>{client.tcp}</TableCell>
              <TableCell>{client.udp}</TableCell>
              <TableCell>{client.avgPacketSize}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
