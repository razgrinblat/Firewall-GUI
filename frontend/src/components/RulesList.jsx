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
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import InfoIcon from "@mui/icons-material/Info";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// SortableItem component
const SortableRuleItem = ({ rule, index, onEdit, confirmDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: `rule-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
    <Grid item xs={12} ref={setNodeRef} style={style}>
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
            <Box
              {...attributes}
              {...listeners}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mr: 1, 
                cursor: 'grab',
                color: 'text.secondary'
              }}
            >
              <DragIndicatorIcon />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" component="div">
                  {rule.name}
                </Typography>
                <Chip 
                  label={`Priority: ${index + 1}`} 
                  size="small" 
                  sx={{ ml: 1 }} 
                  color="default"
                  variant="outlined"
                />
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
                <ArrowForwardIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
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

const RulesList = ({ rules, onEdit, onDelete, onReorder }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    ruleIndex: null,
    ruleName: ""
  });
  const [infoDialog, setInfoDialog] = useState({
    open: false
  });

  // Set up sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.split('-')[1]);
      const newIndex = parseInt(over.id.split('-')[1]);
      
      const newRules = arrayMove(rules, oldIndex, newIndex);
      onReorder(newRules);
    }
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
          <Tooltip title="Rule Order Information">
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

      {/* Rule Order Information */}
      <Box sx={{ mb: 3, p: 2, bgcolor: 'info.light', color: 'info.contrastText', borderRadius: 1 }}>
        <Typography variant="body2">
          <strong>Note:</strong> Rule order matters! Rules are processed from top to bottom. Drag and drop rules to change their priority.
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
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredRules.map((_, index) => `rule-${index}`)}
            strategy={verticalListSortingStrategy}
          >
            <Grid container spacing={2}>
              {filteredRules.map((rule, index) => (
                <SortableRuleItem 
                  key={`rule-${index}`}
                  rule={rule}
                  index={index}
                  onEdit={onEdit}
                  confirmDelete={confirmDelete}
                />
              ))}
            </Grid>
          </SortableContext>
        </DndContext>
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

      {/* Info Dialog */}
      <Dialog
        open={infoDialog.open}
        onClose={closeInfoDialog}
        aria-labelledby="info-dialog-title"
      >
        <DialogTitle id="info-dialog-title">
          Rule Priority Information
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography paragraph>
              <strong>Rule Order is Critical:</strong> Firewall rules are processed from top to bottom. When traffic matches a rule, the rule's action is applied and no further rules are checked.
            </Typography>
            <Typography paragraph>
              <strong>How to Change Priority:</strong> Drag and drop rules in the list to change their order. Higher rules (at the top) have higher priority.
            </Typography>
            <Typography>
              <strong>Best Practices:</strong>
              <ul>
                <li>Place more specific rules before general rules</li>
                <li>Critical blocking rules should be near the top</li>
                <li>General "accept" rules should be lower in the order</li>
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