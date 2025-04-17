import React, { useState, useEffect } from "react";
import { 
  Button, 
  TextField, 
  Grid, 
  Typography, 
  FormControlLabel, 
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  CircularProgress,
  Box,
  Divider,
  Card,
  CardContent 
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import SecurityIcon from "@mui/icons-material/Security";

const RuleForm = ({ onSave, loading, initialRule = null, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "DNS Block",
    action: "block",
    protocol: "tcp",
    src_ip: "*.*.*.*",
    src_port: "*",
    dst_ip: "8.8.8.8",
    dst_port: "53",
    is_active: false
  });

  const [errors, setErrors] = useState({
    name: "",
    src_ip: "",
    src_port: "",
    dst_ip: "",
    dst_port: ""
  });

  // Update form data when initialRule changes
  useEffect(() => {
    if (initialRule) {
      setFormData({
        name: initialRule.name || "",
        action: initialRule.action || "block",
        protocol: initialRule.protocol || "tcp",
        src_ip: initialRule.src_ip || "*.*.*.*",
        src_port: initialRule.src_port || "*",
        dst_ip: initialRule.dst_ip || "",
        dst_port: initialRule.dst_port || "",
        is_active: Boolean(initialRule.is_active)
      });
    } else {
      // Reset form to default values when there's no initialRule
      setFormData({
        name: "DNS Block",
        action: "block",
        protocol: "tcp",
        src_ip: "*.*.*.*",
        src_port: "*",
        dst_ip: "8.8.8.8",
        dst_port: "53",
        is_active: false
      });
    }
    // Reset errors when initialRule changes
    setErrors({
      name: "",
      src_ip: "",
      src_port: "",
      dst_ip: "",
      dst_port: ""
    });
  }, [initialRule]);

  const isValidIp = (ip) => {
    // Allow wildcard pattern (*.*.*.*)
    if (ip === "*.*.*.*") return true;
    
    const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
  };

  const isValidPort = (port) => {
    // Allow wildcard "*" for "any port"
    if (port === "*") return true;
    
    const regex = /^[0-9]{1,5}$/;
    return regex.test(port) && parseInt(port) >= 1 && parseInt(port) <= 65535;
  };

  const validateForm = () => {
    const newErrors = {
      name: !formData.name.trim() ? "Rule name is required" : "",
      src_ip: !isValidIp(formData.src_ip) ? "Invalid IP address format" : "",
      src_port: !isValidPort(formData.src_port) ? "Port must be between 1-65535 or *" : "",
      dst_ip: !isValidIp(formData.dst_ip) ? "Invalid IP address format" : "",
      dst_port: !isValidPort(formData.dst_port) ? "Port must be between 1-65535 or *" : ""
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field if any
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Send the rule to the parent component
      onSave({
        ...formData,
        dst_port: formData.dst_port === "*" ? formData.dst_port : parseInt(formData.dst_port),
        src_port: formData.src_port === "*" ? formData.src_port : parseInt(formData.src_port)
      });
    }
  };

  const isEdit = Boolean(initialRule);

  return (
    <Card sx={{ p: 2, mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <SecurityIcon color="primary" sx={{ fontSize: 30, mr: 1 }} />
          <Typography variant="h6">
            {isEdit ? "Edit Firewall Rule" : "Create New Firewall Rule"}
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          {/* Rule Name */}
          <Grid item xs={12}>
            <TextField
              label="Rule Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              error={Boolean(errors.name)}
              helperText={errors.name}
              variant="outlined"
            />
          </Grid>
          
          {/* Action */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="action-label">Action</InputLabel>
              <Select
                labelId="action-label"
                id="action"
                name="action"
                value={formData.action}
                label="Action"
                onChange={handleChange}
              >
                <MenuItem value="block">Block</MenuItem>
                <MenuItem value="accept">Accept</MenuItem>
              </Select>
              <FormHelperText>Select action to take when rule matches</FormHelperText>
            </FormControl>
          </Grid>
          
          {/* Protocol */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="protocol-label">Protocol</InputLabel>
              <Select
                labelId="protocol-label"
                id="protocol"
                name="protocol"
                value={formData.protocol}
                label="Protocol"
                onChange={handleChange}
              >
                <MenuItem value="tcp">TCP</MenuItem>
                <MenuItem value="udp">UDP</MenuItem>
              </Select>
              <FormHelperText>Network protocol to match</FormHelperText>
            </FormControl>
          </Grid>
          
          {/* Source IP */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Source IP"
              name="src_ip"
              value={formData.src_ip}
              onChange={handleChange}
              fullWidth
              required
              error={Boolean(errors.src_ip)}
              helperText={errors.src_ip || "IP address (e.g., 192.168.1.1 or *.*.*.*)"}
              variant="outlined"
            />
          </Grid>
          
          {/* Source Port */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Source Port"
              name="src_port"
              value={formData.src_port}
              onChange={handleChange}
              fullWidth
              required
              error={Boolean(errors.src_port)}
              helperText={errors.src_port || "Port number (1-65535 or * for any)"}
              variant="outlined"
            />
          </Grid>
          
          {/* Destination IP */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Destination IP"
              name="dst_ip"
              value={formData.dst_ip}
              onChange={handleChange}
              fullWidth
              required
              error={Boolean(errors.dst_ip)}
              helperText={errors.dst_ip || "IP address (e.g., 8.8.8.8 or *.*.*.*)"}
              variant="outlined"
            />
          </Grid>
          
          {/* Destination Port */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Destination Port"
              name="dst_port"
              value={formData.dst_port}
              onChange={handleChange}
              fullWidth
              required
              error={Boolean(errors.dst_port)}
              helperText={errors.dst_port || "Port number (1-65535 or * for any)"}
              variant="outlined"
            />
          </Grid>
          
          {/* Active Status */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch 
                  checked={formData.is_active} 
                  onChange={handleChange}
                  name="is_active"
                  color="primary"
                />
              }
              label={formData.is_active ? "Rule Active" : "Rule Inactive"}
            />
            <FormHelperText>
              {formData.is_active 
                ? "This rule is currently being enforced" 
                : "This rule is saved but not enforced"}
            </FormHelperText>
          </Grid>

          {/* Rule Preview */}
          <Grid item xs={12}>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Rule Preview:
              </Typography>
              <Typography variant="body2">
                <strong>{formData.name}</strong>: {formData.action.toUpperCase()} {formData.protocol.toUpperCase()} traffic 
                from {formData.src_ip}:{formData.src_port} to {formData.dst_ip}:{formData.dst_port}
                {formData.is_active ? " (Active)" : " (Inactive)"}
              </Typography>
            </Box>
          </Grid>
          
          {/* Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={onCancel}
                startIcon={<CancelIcon />}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              >
                {isEdit ? "Update Rule" : "Save Rule"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default RuleForm;