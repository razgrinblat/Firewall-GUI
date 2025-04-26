//HttpDpiRulesList.jsx
import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip
} from "@mui/material";
import HttpIcon from "@mui/icons-material/Http";

const HttpDpiRulesList = ({ rule }) => {
  if (!rule) {
    return (
      <Paper sx={{ p:2, textAlign:"center" }}>
        <Typography variant="body1" color="text.secondary">
          No HTTP DPI rule configured.
        </Typography>
      </Paper>
    );
  }

  const sections = [
    ["HTTP Methods",       rule.http_methods],
    ["Host Domains",       rule.hosts],
    ["URL Path Keywords",  rule.url_path_words],
    ["Content Types",      rule.content_types],
    ["User Agents",        rule.user_agents],
    ["Payload Keywords",   rule.payload_words]
  ];

  return (
    <Paper sx={{ p:2 }}>
      <Box sx={{ display:'flex', alignItems:'center', mb:2 }}>
        <HttpIcon color="primary" sx={{ mr:1 }} />
        <Typography variant="h6">HTTP DPI Rule</Typography>
      </Box>

      <Grid container spacing={2}>
        {sections.map(([label, items]) => (
          items?.length > 0 && (
            <Grid item xs={12} key={label}>
              <Typography variant="subtitle2" gutterBottom>
                {label}:
              </Typography>
              <Box sx={{ display:"flex", flexWrap:"wrap", gap:1 }}>
                {items.map((v,i)=>(
                  <Chip key={i} label={v} size="small" variant="outlined" />
                ))}
              </Box>
            </Grid>
          )
        ))}

        {rule.max_content_length > 0 && (
          <Grid item xs={12}>
            <Typography variant="subtitle2">
              Max Content Length: {rule.max_content_length} bytes
            </Typography>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default HttpDpiRulesList;
