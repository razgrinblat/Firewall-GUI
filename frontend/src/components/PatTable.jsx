import React, { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import InfoIcon from "@mui/icons-material/Info";
import { useTheme } from "@mui/material/styles";
import { usePatTable } from "../hooks/usePatTable";

const PatTableComponent = () => {
  const { patData, loading, error, refresh } = usePatTable();
  const [infoDialog, setInfoDialog] = useState({ open: false });
  const theme = useTheme();

  return (
    <Box sx={{ mt: 3 }}>
      <Paper elevation={1} sx={{ borderRadius: 0, overflow: 'hidden' }}>
        <Box
          sx={{
            p: 2,
            backgroundColor: '#1976d2',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h5" component="h2">
            Port Address Translation (PAT) Table
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip
              label={`${patData.length} Active Connections`}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#fff',
                mr: 1
              }}
            />
            <Tooltip title="What is PAT?">
              <IconButton onClick={() => setInfoDialog({ open: true })} size="small" sx={{ color: '#fff' }}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh data">
              <IconButton onClick={refresh} size="small" sx={{ color: '#fff', ml: 1 }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {loading && patData.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: '#f5f5f5' }}>Client IP</TableCell>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: '#f5f5f5' }}>Client Port</TableCell>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: '#f5f5f5' }}>Firewall Port</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patData.length > 0 ? (
                  patData.map((row, index) => (
                    <TableRow key={index} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.02)' } }}>
                      <TableCell>{row.client_ip}</TableCell>
                      <TableCell>{row.client_port}</TableCell>
                      <TableCell>{row.firewall_port}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                      <Typography color="textSecondary">No active PAT connections</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Info Dialog */}
      <Dialog open={infoDialog.open} onClose={() => setInfoDialog({ open: false })}>
        <DialogTitle sx={{ backgroundColor: '#1976d2', color: '#fff' }}>
          Port Address Translation (PAT) Information
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography paragraph sx={{ mt: 2 }}>
              <strong>What is PAT?</strong> Port Address Translation (PAT) allows many devices to share a single IP by assigning unique ports.
            </Typography>
            <Typography paragraph>
              <strong>How it works:</strong> Connections are tracked by Client IP, Client Port, and a translated Firewall Port.
            </Typography>
            <Typography>
              <strong>Table Columns:</strong>
              <ul>
                <li><strong>Client IP:</strong> Private address of the device</li>
                <li><strong>Client Port:</strong> Source port on the private side</li>
                <li><strong>Firewall Port:</strong> Mapped port on the public side</li>
              </ul>
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInfoDialog({ open: false })} variant="contained" color="primary" autoFocus>
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatTableComponent;
