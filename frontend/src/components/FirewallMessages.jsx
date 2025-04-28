import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFirewallMessages } from "../contexts/FirewallMessageContext";

const FirewallMessages = () => {
  const { infoMessages, blockMessages, isConnected, clearInfoMessages, clearBlockMessages } = useFirewallMessages();
  const [tab, setTab] = useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
        <Tabs value={tab} onChange={handleChange} aria-label="firewall message tabs">
          <Tab label={`Blocked Packets (${blockMessages.length})`} />
          <Tab label={`Info Messages (${infoMessages.length})`} />
        </Tabs>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="caption" color={isConnected ? "success.main" : "error.main"} sx={{ mr: 2 }}>
          {isConnected ? "WebSocket Connected" : "WebSocket Disconnected"}
        </Typography>
        <IconButton 
          size="small" 
          onClick={tab === 0 ? clearBlockMessages : clearInfoMessages}
          sx={{ mr: 1 }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
      
      <CardContent sx={{ maxHeight: 200, overflowY: 'auto', p: 0 }}>
        <TabPanel value={tab} index={0}>
          {blockMessages.length === 0 ? (
            <Typography variant="body2" sx={{ p: 2, textAlign: 'center' }}>
              No blocked packets to display
            </Typography>
          ) : (
            <List dense disablePadding>
              {blockMessages.map((message) => (
                <React.Fragment key={message.id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="body2" component="div" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                          {message.content}
                        </Typography>
                      }
                      secondary={message.timestamp}
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
        </TabPanel>
        
        <TabPanel value={tab} index={1}>
          {infoMessages.length === 0 ? (
            <Typography variant="body2" sx={{ p: 2, textAlign: 'center' }}>
              No information messages to display
            </Typography>
          ) : (
            <List dense disablePadding>
              {infoMessages.map((message) => (
                <React.Fragment key={message.id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="body2" component="div" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                          {message.content}
                        </Typography>
                      }
                      secondary={message.timestamp}
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
        </TabPanel>
      </CardContent>
    </Card>
  );
};

// TabPanel component to support tab switching
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`firewall-message-tabpanel-${index}`}
      aria-labelledby={`firewall-message-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default FirewallMessages;