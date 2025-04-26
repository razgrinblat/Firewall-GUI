//HttpDpiRuleForm.jsx
import React, { useState, useEffect } from "react";
import { 
  Button, 
  TextField, 
  Grid, 
  Typography, 
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
  Divider,
  Card,
  CardContent,
  Chip
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import HttpIcon from "@mui/icons-material/Http";
import AddIcon from "@mui/icons-material/Add";

const HttpDpiRuleForm = ({ onSave, loading, initialRule }) => {
  const [formData, setFormData] = useState({
    hosts: [],
    url_path_words: [],
    content_types: [],
    http_methods: [],
    user_agents: [],
    payload_words: [],
    max_content_length: 0
  });
  const [newEntry, setNewEntry] = useState({
    host: "",
    url_path_word: "",
    content_type: "",
    user_agent: "",
    payload_word: ""
  });
  const [errors, setErrors] = useState({ max_content_length: "" });

  useEffect(() => {
    if (initialRule) {
      setFormData({
        ...initialRule
      });
    }
  }, [initialRule]);

  const httpMethodOptions = ["GET","POST","PUT","DELETE","PATCH","HEAD","OPTIONS"];

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === "max_content_length") {
      const num = parseInt(value, 10);
      setFormData(f => ({ ...f, max_content_length: isNaN(num)? 0: num }));
    } else {
      setFormData(f => ({ ...f, [name]: value }));
    }
    if (errors[name]) setErrors(e => ({ ...e, [name]: "" }));
  };

  const handleNewChange = e => {
    const { name, value } = e.target;
    setNewEntry(n => ({ ...n, [name]: value }));
  };

  const addItem = (field, key) => {
    const value = newEntry[key]?.trim();
    if (!value || formData[field].includes(value)) return;
    setFormData(f => ({ ...f, [field]: [...f[field], value] }));
    setNewEntry(n => ({ ...n, [key]: "" }));
  };

  const removeItem = (field, idx) => {
    setFormData(f => ({ ...f, [field]: f[field].filter((_,i)=>i!==idx) }));
  };

  const validate = () => {
    const errs = {};
    if (isNaN(formData.max_content_length)) {
      errs.max_content_length = "Must be a number";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({ http_rules: formData });
  };

  // fields you can add/remove:
  const arrays = [
    ["hosts","host","Host Domains","example.com"],
    ["url_path_words","url_path_word","URL Path Keywords","login"],
    ["content_types","content_type","Content Types","application/json"],
    ["user_agents","user_agent","User Agents","curl/7.68.0"],
    ["payload_words","payload_word","Payload Keywords","virus"]
  ];

  return (
    <Card sx={{ p:2, mb:2 }}>
      <CardContent>
        <Box sx={{ display:'flex', alignItems:'center', mb:2 }}>
          <HttpIcon color="primary" sx={{ mr:1 }} />
          <Typography variant="h6">HTTP DPI Rule</Typography>
        </Box>
        <Divider sx={{ mb:2 }} />

        <Grid container spacing={2}>
          {/* HTTP methods */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>HTTP Methods</InputLabel>
              <Select
                multiple
                name="http_methods"
                value={formData.http_methods}
                onChange={handleChange}
                renderValue={sel => (
                  <Box sx={{ display:'flex', flexWrap:'wrap', gap:0.5 }}>
                    {sel.map(m=> <Chip key={m} label={m} size="small"/>)}
                  </Box>
                )}
              >
                {httpMethodOptions.map(m=>(
                  <MenuItem key={m} value={m}>{m}</MenuItem>
                ))}
              </Select>
              <FormHelperText>Select HTTP methods to match</FormHelperText>
            </FormControl>
          </Grid>

          {/* max content length */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Max Content Length (bytes)"
              name="max_content_length"
              type="number"
              value={formData.max_content_length}
              onChange={handleChange}
              error={!!errors.max_content_length}
              helperText={errors.max_content_length || "0 = no limit"}
            />
          </Grid>

          {/* dynamic arrays */}
          {arrays.map(([field,key,label,ph])=>(
            <Grid item xs={12} key={field}>
              <Typography>{label}</Typography>
              <Box sx={{ display:'flex', mb:1, gap:1 }}>
                <TextField
                  name={key}
                  placeholder={ph}
                  size="small"
                  value={newEntry[key]}
                  onChange={handleNewChange}
                  fullWidth
                />
                <Button
                  variant="contained"
                  onClick={()=>addItem(field,key)}
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display:'flex', flexWrap:'wrap', gap:1 }}>
                {formData[field].map((v,i)=>(
                  <Chip
                    key={i}
                    label={v}
                    onDelete={()=>removeItem(field,i)}
                    variant="outlined"
                  />
                ))}
              </Box>
              <Divider sx={{ mt:1 }}/>
            </Grid>
          ))}

          {/* save */}
          <Grid item xs={12}>
            <Box sx={{ textAlign:'right' }}>
              <Button
                variant="contained"
                startIcon={ loading 
                  ? <CircularProgress size={20}/> 
                  : <SaveIcon/>
                }
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

export default HttpDpiRuleForm;
