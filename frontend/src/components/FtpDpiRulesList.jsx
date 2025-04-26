// FtpDpiRulesList.jsx
import React from "react";
import { Paper, Box, Typography, Grid, Chip } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";

const FtpDpiRulesList = ({ rule }) => {
  if (!rule) {
    return (
      <Paper sx={{ p:2, textAlign: 'center' }}>
        <Typography color="text.secondary">No FTP DPI rule configured.</Typography>
      </Paper>
    );
  }

  const sections = [
    ["Download Keywords", rule.download_key_words],
    ["Upload Keywords",   rule.upload_key_words],
    ["Download File Names",rule.download_file_names],
    ["Upload File Names",  rule.upload_file_names]
  ];

  return (
    <Paper sx={{ p:2 }}>
      <Box sx={{ display:'flex', alignItems:'center', mb:2 }}>
        <FolderIcon color="secondary" sx={{ mr:1 }} />
        <Typography variant="h6">FTP DPI Rule</Typography>
      </Box>
      <Grid container spacing={2}>
        {sections.map(([label, items]) =>
          items?.length > 0 && (
            <Grid item xs={12} key={label}>
              <Typography variant="subtitle2" gutterBottom>{label}:</Typography>
              <Box sx={{ display:'flex', flexWrap:'wrap', gap:1 }}>
                {items.map((v,i)=>(
                  <Chip key={i} label={v} size="small" variant="outlined" />
                ))}
              </Box>
            </Grid>
          )
        )}
      </Grid>
    </Paper>
  );
};

export default FtpDpiRulesList;