import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Typography, Box, Paper, useTheme } from "@mui/material";

const COLORS = [
  "#0088FE", // Blue
  "#00C49F", // Green
  "#FFBB28", // Yellow
  "#FF8042", // Orange
  "#A83232", // Dark Red
  "#6A5ACD", // Slate Blue
  "#FF69B4", // Hot Pink
  "#FF7F50", // Coral
  "#2E8B57", // Sea Green
  "#DAA520", // Goldenrod
  "#BDB76B", // Dark Khaki
  "#9932CC", // Dark Orchid
];

// Custom tooltip for the pie chart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ p: 1, boxShadow: 2 }}>
        <Typography variant="body2" color="textPrimary">
          <strong>{payload[0].name}</strong>
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Count: {payload[0].value}
        </Typography>
      </Paper>
    );
  }
  return null;
};

function StatsPieChart({ data }) {
  const theme = useTheme();
  
  // Split data into TCP/UDP and other protocols
  const transportData = data.filter(item => 
    item.name.toLowerCase() === "tcp" || item.name.toLowerCase() === "udp"
  );
  
  const otherProtocolsData = data.filter(item => 
    item.name.toLowerCase() !== "tcp" && item.name.toLowerCase() !== "udp"
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
      {/* Transport Protocols Chart (TCP/UDP) */}
      <Paper 
        elevation={2} 
        sx={{ 
          flex: 1, 
          p: 2, 
          borderRadius: 2,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.5)' : 'rgba(255, 255, 255, 0.9)',
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4
          }
        }}
      >
        <Typography variant="h6" align="center" gutterBottom color="primary">
          Transport Protocols
        </Typography>
        
        {transportData.length === 0 ? (
          <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              No TCP/UDP data available
            </Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={transportData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40} // Creates a donut chart
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {transportData.map((entry, index) => (
                  <Cell 
                    key={`cell-transport-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke={theme.palette.background.paper}
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Paper>

      {/* Other Protocols Chart */}
      <Paper 
        elevation={2} 
        sx={{ 
          flex: 1, 
          p: 2, 
          borderRadius: 2,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.5)' : 'rgba(255, 255, 255, 0.9)',
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4
          }
        }}
      >
        <Typography variant="h6" align="center" gutterBottom color="primary">
          Application Protocols
        </Typography>
        
        {otherProtocolsData.length === 0 ? (
          <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              No application protocol data available
            </Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={otherProtocolsData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40} // Creates a donut chart
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {otherProtocolsData.map((entry, index) => (
                  <Cell 
                    key={`cell-other-${index}`} 
                    fill={COLORS[(index + 2) % COLORS.length]} // Offset color to differentiate from transport
                    stroke={theme.palette.background.paper}
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Paper>
    </Box>
  );
}

export default StatsPieChart;