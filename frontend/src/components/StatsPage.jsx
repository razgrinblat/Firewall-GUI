import React, { useState } from "react";
import { 
  Typography, 
  Paper, 
  Grid,
  Box,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Chip,
  useTheme
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import { usePacketStats } from "../hooks/usePacketStats";
import { useFirewallMessages } from "../contexts/FirewallMessageContext";
import StatsPieChart from "./statsPieChart";

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
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function StatsPage() {
  const theme = useTheme();
  const packetStats = usePacketStats();
  const { infoMessages, blockMessages, isConnected, clearInfoMessages, clearBlockMessages } = useFirewallMessages();
  const [tab, setTab] = useState(0);

  // Transform stats object into array for Recharts
  const chartData = packetStats
    ? Object.entries(packetStats).map(([name, value]) => ({ name, value }))
    : [];

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 3,
      animation: 'fadeIn 0.5s ease-in-out',
      '@keyframes fadeIn': {
        '0%': {
          opacity: 0,
          transform: 'translateY(10px)'
        },
        '100%': {
          opacity: 1,
          transform: 'translateY(0)'
        }
      }
    }}>
      {/* Header section */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="h4" gutterBottom color="primary" fontWeight="500">
          Firewall Statistics
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Real-time overview of network traffic and firewall activity
        </Typography>
      </Box>
      
      {/* Packet Stats Charts Section */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(30, 30, 30, 0.7)' 
            : 'rgba(255, 255, 255, 0.8)',
        }}
      >
        <Typography variant="h5" gutterBottom color="primary">
          Protocol Distribution
        </Typography>
        
        {!packetStats ? (
          <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography>Loading statistics...</Typography>
          </Box>
        ) : (
          <StatsPieChart data={chartData} />
        )}
      </Paper>
      
      {/* Firewall Messages Section */}
      <Paper 
        elevation={2} 
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(30, 30, 30, 0.7)' 
            : 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: 'divider', 
          display: 'flex', 
          alignItems: 'center',
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(0, 0, 0, 0.2)' 
            : 'rgba(25, 118, 210, 0.05)'
        }}>
          <Typography variant="h5" component="div" color="primary" sx={{ flexGrow: 1 }}>
            Firewall Activity Log
          </Typography>
          <Chip 
            icon={isConnected ? <WifiIcon /> : <WifiOffIcon />}
            label={isConnected ? "Connected" : "Disconnected"}
            size="small"
            color={isConnected ? "success" : "error"}
            sx={{ mr: 1 }}
          />
        </Box>
        
        <Tabs 
          value={tab} 
          onChange={handleChange} 
          aria-label="firewall message tabs"
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            backgroundColor: theme.palette.action.hover
          }}
        >
          <Tab 
            label={`Blocked Packets (${blockMessages.length})`} 
            sx={{ 
              fontWeight: tab === 0 ? 'bold' : 'normal',
              color: tab === 0 ? theme.palette.primary.main : 'inherit'
            }}
          />
          <Tab 
            label={`Info Messages (${infoMessages.length})`} 
            sx={{ 
              fontWeight: tab === 1 ? 'bold' : 'normal',
              color: tab === 1 ? theme.palette.primary.main : 'inherit'
            }}
          />
          <Box sx={{ flexGrow: 1 }} />
          <IconButton 
            size="small" 
            onClick={tab === 0 ? clearBlockMessages : clearInfoMessages}
            sx={{ mr: 1 }}
            title="Clear messages"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tabs>
        
        <Box sx={{ height: 300, overflow: 'auto' }}>
          <TabPanel value={tab} index={0}>
            {blockMessages.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
                <Typography variant="body2" color="textSecondary">
                  No blocked packets to display
                </Typography>
              </Box>
            ) : (
              <List dense disablePadding>
                {blockMessages.map((message) => (
                  <React.Fragment key={message.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box>
                            <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                              {message.timestamp}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              component="div" 
                              sx={{ 
                                fontFamily: 'monospace', 
                                whiteSpace: 'pre-wrap',
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
                                padding: 1,
                                borderRadius: 1,
                                mt: 0.5,
                                borderLeft: `3px solid ${theme.palette.error.main}`
                              }}
                            >
                              {message.content}
                            </Typography>
                          </Box>
                        }
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
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
                <Typography variant="body2" color="textSecondary">
                  No information messages to display
                </Typography>
              </Box>
            ) : (
              <List dense disablePadding>
                {infoMessages.map((message) => (
                  <React.Fragment key={message.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box>
                            <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                              {message.timestamp}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              component="div" 
                              sx={{ 
                                fontFamily: 'monospace', 
                                whiteSpace: 'pre-wrap',
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
                                padding: 1,
                                borderRadius: 1,
                                mt: 0.5,
                                borderLeft: `3px solid ${theme.palette.info.main}`
                              }}
                            >
                              {message.content}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            )}
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
}