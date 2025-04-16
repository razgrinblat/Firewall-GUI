import { useState, useEffect } from "react";
import { 
  Snackbar, 
  Alert, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography,
  Box,
  Paper,
  Slide
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

function ConflictedRuleComponent() {
  const [conflictedRule, setConflictedRule] = useState(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("connecting");

  useEffect(() => {
    let ws = null;
    let reconnectTimeout = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 10;
    
    const connectWebSocket = () => {
      // Close any existing connection
      if (ws) {
        ws.close();
      }
      
      // Create new WebSocket connection
      ws = new WebSocket("ws://localhost:3000/conflicted-rule");
      
      ws.onopen = () => {
        console.log("Connected to conflicted rule WebSocket");
        setConnectionStatus("connected");
        reconnectAttempts = 0; // Reset reconnect attempts counter
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log("Received rule conflict message:", message);

          if (message.type === "rule conflict") {
            setConflictedRule(message.data);
            setNotificationOpen(true);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onclose = (event) => {
        setConnectionStatus("disconnected");
        
        // Only attempt to reconnect if not intentionally closed
        if (!event.wasClean && reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(1.5, reconnectAttempts), 10000);
          reconnectAttempts++;
          
          console.log(`WebSocket disconnected. Attempting to reconnect in ${delay/1000}s... (${reconnectAttempts}/${maxReconnectAttempts})`);
          
          reconnectTimeout = setTimeout(() => {
            connectWebSocket();
          }, delay);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    // Initial connection
    connectWebSocket();

    // Cleanup on component unmount
    return () => {
      if (ws) {
        ws.close(1000, "Component unmounting");
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, []);

  const handleNotificationClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotificationOpen(false);
  };

  const handleViewDetails = () => {
    setNotificationOpen(false);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };

  const renderRuleConflictDetails = () => {
    if (!conflictedRule) return null;
    
    return (
      <Box>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          Rule Conflict Details:
        </Typography>
        <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.paper', mb: 2 }}>
          <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: '300px' }}>
            {JSON.stringify(conflictedRule, null, 2)}
          </pre>
        </Paper>
      </Box>
    );
  };

  return (
    <>
      {/* Notification popup */}
      <Snackbar
        open={notificationOpen}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Slide}
      >
        <Alert 
          severity="warning" 
          icon={<WarningIcon />}
          sx={{ width: '100%' }}
          action={
            <Button color="inherit" size="small" onClick={handleViewDetails}>
              View Details
            </Button>
          }
        >
          Firewall rule conflict detected! This might affect your network security.
        </Alert>
      </Snackbar>
      
      {/* Details dialog */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningIcon color="warning" sx={{ mr: 1 }} />
          Firewall Rule Conflict
        </DialogTitle>
        <DialogContent dividers>
          {renderRuleConflictDetails()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ConflictedRuleComponent;