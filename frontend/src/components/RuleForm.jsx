// src/components/RuleForm.jsx
import React, { useState } from "react";
import {
  Button,
  TextField,
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Paper,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress
} from "@mui/material";
import { useWebSocket } from "../utils/websocketClient"; // Import WebSocket hook
import DeleteIcon from '@mui/icons-material/Delete';

const RuleForm = ({ rulesList, setRulesList }) => {
  const [action, setAction] = useState("block");
  const [protocol, setProtocol] = useState("tcp");
  const [dstIp, setDstIp] = useState("*.*.*.*");
  const [dstPort, setDstPort] = useState("23");
  const [isActive, setIsActive] = useState(false);
  const [ruleName, setRuleName] = useState(""); // Rule name (for UI only)
  const [loading, setLoading] = useState(false); // Loading state for submit
  const [error, setError] = useState(""); // Error message for validation

  const ws = useWebSocket("ws://localhost:8080/firewall"); // Change URL as needed

  // Validation for IP address using regex
  const isValidIp = (ip) => {
    const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
  };

  // Validation for port number (1 - 65535)
  const isValidPort = (port) => {
    const regex = /^[0-9]{1,5}$/;
    return regex.test(port) && port >= 1 && port <= 65535;
  };

  const handleSubmit = () => {
    // Validate that the rule name is provided
    if (!ruleName.trim()) {
      setError("Rule name is required.");
      return;
    }

    if (!isValidIp(dstIp)) {
      alert("Invalid IP address");
      return;
    }
    if (!isValidPort(dstPort)) {
      alert("Invalid port number");
      return;
    }

    // Clear previous error if all validations pass
    setError("");

    // Create the new rule object
    const newRule = {
      name: ruleName, // Name is now mandatory
      action,
      protocol,
      dst_ip: dstIp,
      dst_port: dstPort,
      is_active: isActive,
    };

    // Add the new rule to the local state
    setRulesList([...rulesList, newRule]);

    // Create the JSON to send to the backend (with the "rules" key)
    const rulesJson = { rules: [newRule] };
    setLoading(true); // Set loading state to true while waiting for response
    ws.sendMessage(JSON.stringify(rulesJson));

    // Reset form fields
    setRuleName(""); // Clear rule name
    setDstIp(""); // Clear IP
    setDstPort(""); // Clear port
    setIsActive(false); // Reset active checkbox
  };

  // Handle deleting a rule from the list
  const handleDeleteRule = (index) => {
    const newRulesList = rulesList.filter((_, idx) => idx !== index);
    setRulesList(newRulesList);
  };

  return (
    <Box component="div" sx={{ padding: 3 }}>
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Create New Rule
        </Typography>

        {/* Show error message if rule name is not provided */}
        {error && (
          <Typography color="error" variant="body2" align="center" gutterBottom>
            {error}
          </Typography>
        )}

        <Grid container spacing={2} direction="row" alignItems="center" justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Rule Name"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Protocol</InputLabel>
              <Select
                value={protocol}
                onChange={(e) => setProtocol(e.target.value)}
                label="Protocol"
              >
                <MenuItem value="tcp">TCP</MenuItem>
                <MenuItem value="udp">UDP</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Destination IP"
              value={dstIp}
              onChange={(e) => setDstIp(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Destination Port"
              value={dstPort}
              onChange={(e) => setDstPort(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isActive}
                  onChange={() => setIsActive(!isActive)}
                />
              }
              label="Active"
            />
          </Grid>

          <Grid item xs={12} textAlign="center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Save Rule"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Divider for section */}
      <Divider sx={{ margin: "20px 0" }} />

      <Typography variant="h6" gutterBottom>
        All Rules
      </Typography>
      {rulesList.length === 0 ? (
        <Typography>No rules added yet</Typography>
      ) : (
        <List>
          {rulesList.map((rule, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleDeleteRule(index)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={rule.name || "Unnamed Rule"}
                secondary={`${rule.protocol} - ${rule.dst_ip}:${rule.dst_port} (${rule.action})`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default RuleForm;
