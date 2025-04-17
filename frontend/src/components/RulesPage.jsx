import React, { useState } from "react";
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  Alert,
  Snackbar
} from "@mui/material";
import RuleForm from "./RuleForm";
import RulesList from "./RulesList";

// TabPanel component for the tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`rules-tabpanel-${index}`}
      aria-labelledby={`rules-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Updated to accept rulesList and setRulesList as props
const RulesPage = ({ rulesList, setRulesList }) => {
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedRule, setSelectedRule] = useState(null);
  const [selectedRuleIndex, setSelectedRuleIndex] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 0) {
      setSelectedRule(null); // Clear selected rule when switching to "Create New Rule"
      setSelectedRuleIndex(null);
    }
  };

  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  // Check if rule is a duplicate (by name or identical configuration)
  const isDuplicateRule = (rule, editIndex = null) => {
    return rulesList.some((existingRule, index) => {
      // Skip comparing with itself if editing
      if (editIndex !== null && index === editIndex) {
        return false;
      }
      
      // Check for duplicate name
      if (existingRule.name === rule.name) {
        showNotification(`A rule with the name "${rule.name}" already exists`, "error");
        return true;
      }
      
      // Check for duplicate configuration (same src_ip, src_port, dst_ip, dst_port, protocol and action)
      if (
        existingRule.src_ip === rule.src_ip &&
        existingRule.src_port === rule.src_port &&
        existingRule.dst_ip === rule.dst_ip &&
        existingRule.dst_port === rule.dst_port &&
        existingRule.protocol === rule.protocol &&
        existingRule.action === rule.action
      ) {
        showNotification("A rule with identical configuration already exists", "error");
        return true;
      }
      
      return false;
    });
  };

  const handleSaveRule = async (rule) => {
    // Ensure source IP and port are present in the rule
    if (!rule.src_ip) rule.src_ip = "*.*.*.*";
    if (!rule.src_port) rule.src_port = "*";
    
    // Check for duplicates when creating a new rule
    if (!selectedRule && isDuplicateRule(rule)) {
      return;
    }
    
    // Check for duplicates when editing a rule
    if (selectedRule && isDuplicateRule(rule, selectedRuleIndex)) {
      return;
    }
    
    setLoading(true);

    try {
      let updatedRules;
      
      if (selectedRule) {
        // Update existing rule
        updatedRules = [...rulesList];
        updatedRules[selectedRuleIndex] = { ...rule };
        setRulesList(updatedRules);
        showNotification("Rule updated successfully");
      } else {
        // Add new rule
        updatedRules = [...rulesList, { ...rule }];
        setRulesList(updatedRules);
        showNotification("Rule created successfully");
      }
      
      // Send the complete updated rules list to the server
      await sendRulesToServer(updatedRules);
      
      // Switch to the list view
      setTabValue(1);
      setSelectedRule(null);
      setSelectedRuleIndex(null);
    } catch (error) {
      console.error("Error:", error);
      showNotification(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Send the complete rules list to the server
  const sendRulesToServer = async (rules) => {
    const rulesPayload = { rules: rules };
    
    const response = await fetch("http://localhost:8080/api/rules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rulesPayload),
    });

    if (!response.ok) {
      throw new Error("Failed to send rules");
    }

    return await response.json();
  };

  const handleEditRule = (rule, index) => {
    setSelectedRule(rule);
    setSelectedRuleIndex(index);
    setTabValue(0); // Switch to the form tab
  };

  const handleDeleteRule = async (ruleIndex) => {
    const updatedRules = rulesList.filter((_, index) => index !== ruleIndex);
    
    try {
      // Send the updated rules list to the server
      await sendRulesToServer(updatedRules);
      
      // Update the state in App component
      setRulesList(updatedRules);
      showNotification("Rule deleted successfully");
      
      // If the deleted rule was selected, clear the selection
      if (selectedRuleIndex === ruleIndex) {
        setSelectedRule(null);
        setSelectedRuleIndex(null);
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification("Failed to delete rule", "error");
    }
  };

  const handleReorderRules = async (newOrderedRules) => {
    try {
      // Update the state in App component
      setRulesList(newOrderedRules);
      
      // Send the reordered rules to the server
      await sendRulesToServer(newOrderedRules);
      showNotification("Rule order updated successfully");
    } catch (error) {
      console.error("Error:", error);
      showNotification("Failed to update rule order", "error");
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ mt: 3, mb: 3, overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h5" sx={{ p: 2 }}>
            Firewall Rules Management
          </Typography>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="firewall rules tabs"
            indicatorColor="secondary"
            textColor="inherit"
          >
            <Tab label={selectedRule ? "Edit Rule" : "Create New Rule"} />
            <Tab label="Rules List" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <RuleForm 
            onSave={handleSaveRule} 
            loading={loading} 
            initialRule={selectedRule}
            onCancel={() => {
              setSelectedRule(null);
              setSelectedRuleIndex(null);
              setTabValue(1); // Switch back to list view
            }}
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <RulesList 
            rules={rulesList}
            onEdit={(rule, index) => handleEditRule(rule, index)}
            onDelete={handleDeleteRule}
            onReorder={handleReorderRules}
          />
        </TabPanel>
      </Paper>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RulesPage;