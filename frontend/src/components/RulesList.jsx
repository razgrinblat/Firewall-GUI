// RuleList
import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import InfoIcon from "@mui/icons-material/Info";

// Rule Item component 
const RuleItem = ({ rule, index, onEdit, confirmDelete }) => {
  const getActionColor = (action) => {
    switch (action.toLowerCase()) {
      case 'block':
        return 'error';
      case 'accept':
        return 'success';
      default:
        return 'default';
    }
  };

  const getProtocolColor = (protocol) => {
    switch (protocol.toLowerCase()) {
      case 'tcp':
        return 'primary';
      case 'udp':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Grid item xs={12}>
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          borderLeft: '5px solid', 
          borderLeftColor: rule.is_active ? 'success.main' : 'text.disabled',
          transition: 'all 0.3s',
          '&:hover': {
            boxShadow: 3,
            transform: 'translateY(-2px)'
          },
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" component="div">
                  {rule.name}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, mt: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip 
                  label={rule.action.toUpperCase()} 
                  color={getActionColor(rule.action)}
                  size="small"
                  icon={rule.action === 'block' ? <BlockIcon /> : <CheckCircleIcon />}
                />
                <Chip 
                  label={rule.protocol.toUpperCase()} 
                  color={getProtocolColor(rule.protocol)}
                  size="small"
                />
                <Tooltip title="Source">
                  <Chip 
                    label={`From: ${rule.src_ip}:${rule.src_port}`} 
                    variant="outlined"
                    size="small"
                  />
                </Tooltip>
                <Tooltip title="Destination">
                  <Chip 
                    label={`To: ${rule.dst_ip}:${rule.dst_port}`} 
                    variant="outlined"
                    size="small"
                  />
                </Tooltip>
                <Chip 
                  label={rule.is_active ? "Active" : "Inactive"} 
                  color={rule.is_active ? "success" : "default"}
                  variant="outlined"
                  size="small"
                  icon={rule.is_active ? <ToggleOnIcon /> : <ToggleOffIcon />}
                />
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Edit Rule">
              <IconButton 
                color="primary" 
                onClick={() => onEdit(rule, index)}
                size="small"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Rule">
              <IconButton 
                color="error" 
                onClick={() => confirmDelete(rule, index)}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};

const RulesList = ({ rules, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    ruleIndex: null,
    ruleName: ""
  });
  const [infoDialog, setInfoDialog] = useState({
    open: false
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const confirmDelete = (rule, index) => {
    setDeleteConfirmation({
      open: true,
      ruleIndex: index,
      ruleName: rule.name
    });
  };

  const handleDeleteConfirm = () => {
    onDelete(deleteConfirmation.ruleIndex);
    setDeleteConfirmation({
      open: false,
      ruleIndex: null,
      ruleName: ""
    });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({
      open: false,
      ruleIndex: null,
      ruleName: ""
    });
  };

  const showInfoDialog = () => {
    setInfoDialog({ open: true });
  };

  const closeInfoDialog = () => {
    setInfoDialog({ open: false });
  };

  const filteredRules = rules.filter(rule => 
    rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.dst_ip.includes(searchTerm) ||
    rule.dst_port.toString().includes(searchTerm) ||
    rule.src_ip.includes(searchTerm) ||
    rule.src_port.toString().includes(searchTerm) ||
    rule.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          label="Search Rules"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: '50%' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Rule Information">
            <IconButton 
              color="info" 
              onClick={showInfoDialog}
              size="small"
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => onEdit(null)}
          >
            New Rule
          </Button>
        </Box>
      </Box>

      {/* Rule Tree Information */}
      <Box sx={{ mb: 3, p: 2, bgcolor: 'info.light', color: 'info.contrastText', borderRadius: 1 }}>
        <Typography variant="body2">
          <strong>Note:</strong> Rules are processed using a rule tree structure that automatically resolves conflicts.
        </Typography>
      </Box>

      {filteredRules.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No rules found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {rules.length > 0 
              ? "Try adjusting your search criteria" 
              : "Create your first firewall rule to get started"}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filteredRules.map((rule, index) => (
            <RuleItem 
              key={`rule-${index}`}
              rule={rule}
              index={index}
              onEdit={onEdit}
              confirmDelete={confirmDelete}
            />
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmation.open}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Rule
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the rule "{deleteConfirmation.ruleName}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Info Dialog - Updated for rule tree explanation */}
      <Dialog
        open={infoDialog.open}
        onClose={closeInfoDialog}
        aria-labelledby="info-dialog-title"
      >
        <DialogTitle id="info-dialog-title">
          Rule Tree Information
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography paragraph>
              <strong>Rule Tree Structure:</strong> This firewall uses a rule tree structure to process rules, which automatically resolves potential conflicts between rules.
            </Typography>
            <Typography paragraph>
              <strong>Rule Processing:</strong> The system intelligently evaluates rules in the tree, ensuring that all applicable rules are considered before making a decision.
            </Typography>
            <Typography>
              <strong>Notes:</strong>
              <ul>
                <li>No need to worry about rule ordering or conflicts</li>
                <li>Rules with similar conditions are grouped automatically</li>
                <li>The system guarantees consistent behavior regardless of rule order</li>
              </ul>
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeInfoDialog} color="primary" autoFocus>
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RulesList;