// FtpDpiRuleForm.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Chip,
  Divider,
  CircularProgress
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import FolderIcon from "@mui/icons-material/Folder";
import AddIcon from "@mui/icons-material/Add";

const FtpDpiRuleForm = ({ onSave, loading, initialRule }) => {
  const [formData, setFormData] = useState({
    download_key_words: [],
    upload_key_words: [],
    download_file_names: [],
    upload_file_names: []
  });
  const [newEntry, setNewEntry] = useState({
    download_key_word: "",
    upload_key_word: "",
    download_file_name: "",
    upload_file_name: ""
  });

  useEffect(() => {
    if (initialRule) {
      setFormData({ ...initialRule });
    }
  }, [initialRule]);

  const commonInputs = [
    ["download_key_words", "download_key_word", "Download Keywords", "virus"],
    ["upload_key_words",   "upload_key_word",   "Upload Keywords",   "password"],
    ["download_file_names","download_file_name","Download File Names",".exe"],
    ["upload_file_names",  "upload_file_name",  "Upload File Names",  ".zip"]
  ];

  const handleNewChange = e => {
    const { name, value } = e.target;
    setNewEntry(n => ({ ...n, [name]: value }));
  };

  const addItem = (field, key) => {
    const value = newEntry[key].trim();
    if (!value) return;
    setFormData(f => ({
      ...f,
      [field]: f[field].includes(value) ? f[field] : [...f[field], value]
    }));
    setNewEntry(n => ({ ...n, [key]: "" }));
  };

  const removeItem = (field, idx) => {
    setFormData(f => ({
      ...f,
      [field]: f[field].filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = () => {
    onSave({ ftp_rules: formData });
  };

  return (
    <Card sx={{ p: 2, mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FolderIcon color="secondary" sx={{ mr: 1 }} />
          <Typography variant="h6">FTP DPI Rule</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {commonInputs.map(([field, key, label, ph]) => (
            <Grid item xs={12} key={field}>
              <Typography>{label}</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  name={key}
                  value={newEntry[key]}
                  onChange={handleNewChange}
                  placeholder={ph}
                  size="small"
                  fullWidth
                />
                <Button
                  variant="contained"
                  onClick={() => addItem(field, key)}
                  startIcon={<AddIcon />}
                />
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData[field].map((v, i) => (
                  <Chip
                    key={i}
                    label={v}
                    onDelete={() => removeItem(field, i)}
                    variant="outlined"
                  />
                ))}
              </Box>
              <Divider sx={{ mt: 1 }} />
            </Grid>
          ))}

          <Grid item xs={12}>
            <Box sx={{ textAlign: 'right' }}>
              <Button
                variant="contained"
                startIcon={ loading ? <CircularProgress size={20}/> : <SaveIcon/> }
                onClick={handleSubmit}
                disabled={loading}
              >
                Save Rule
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FtpDpiRuleForm;
