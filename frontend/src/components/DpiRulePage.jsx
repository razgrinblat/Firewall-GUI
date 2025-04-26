// DpiRulePage.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Box,
  Tabs,
  Tab,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

import HttpDpiRuleForm  from "./HttpDpiRuleForm";
import HttpDpiRulesList from "./HttpDpiRulesList";
import FtpDpiRuleForm   from "./FtpDpiRuleForm";
import FtpDpiRulesList  from "./FtpDpiRulesList";

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function DpiRulePage() {
  const [loading, setLoading]      = useState(false);
  const [protocolTab, setProtocol] = useState(0);              // 0 = HTTP, 1 = FTP
  const [viewTab, setViewTab]      = useState({ http: 1, ftp: 1 });
  const [httpRule, setHttpRule]    = useState(null);
  const [ftpRule, setFtpRule]      = useState(null);
  const [notif, setNotif]          = useState({ open: false, message: "", severity: "success" });

  // empty templates for delete via POST
  const emptyHttp = {
    http_rules: {
      hosts: [], url_path_words: [], content_types: [],
      http_methods: [], user_agents: [], payload_words: [],
      max_content_length: 0
    }
  };
  const emptyFtp = {
    ftp_rules: {
      download_key_words: [],
    upload_key_words: [],
    download_file_names: [],
    upload_file_names: []
    }
  };

  useEffect(() => {
    fetchHttpRule();
    fetchFtpRule();
  }, []);

  // ── Fetch ────────────────────────────────────────────────────────────────────
  const fetchHttpRule = async () => {
    setLoading(true);
    try {
      // Fixed URL format
      const res = await fetch("http://localhost:8080/api/http_rules");
      const data = await res.json();
      console.log("Fetched HTTP rule:", data); // Debug log
      if (data && data.http_rules) {
        setHttpRule(data.http_rules);
      }
    } catch (error) {
      console.error("HTTP rule fetch error:", error);
      notify("Failed to load HTTP rule", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchFtpRule = async () => {
    setLoading(true);
    try {
      // Fixed URL format
      const res = await fetch("http://localhost:8080/api/ftp_rules");
      const data = await res.json();
      console.log("Fetched FTP rule:", data); // Debug log
      if (data && data.ftp_rules) {
        setFtpRule(data.ftp_rules);
      }
    } catch (error) {
      console.error("FTP rule fetch error:", error);
      notify("Failed to load FTP rule", "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Save via POST ───────────────────────────────────────────────────────────
  const handleSaveHttpRule = async payload => {
    setLoading(true);
    try {
      // Ensure correct payload structure
      const formattedPayload = payload.http_rules ? payload : { http_rules: payload };
      console.log("Saving HTTP rule:", formattedPayload); // Debug log
      
      const res = await fetch("http://localhost:8080/api/http_rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedPayload),
      });
      
      const data = await res.json();
      console.log("HTTP rule save response:", data); // Debug log
      
      if (data && data.http_rules) {
        setHttpRule(data.http_rules);
        notify("HTTP rule saved");
        setViewTab(v => ({ ...v, http: 1 }));
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("HTTP rule save error:", error);
      notify("Failed to save HTTP rule", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFtpRule = async payload => {
    setLoading(true);
    try {
      // Ensure correct payload structure
      const formattedPayload = payload.ftp_rules ? payload : { ftp_rules: payload };
      console.log("Saving FTP rule:", formattedPayload); // Debug log
      
      const res = await fetch("http://localhost:8080/api/ftp_rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedPayload),
      });
      
      const data = await res.json();
      console.log("FTP rule save response:", data); // Debug log
      
      if (data && data.ftp_rules) {
        setFtpRule(data.ftp_rules);
        notify("FTP rule saved");
        setViewTab(v => ({ ...v, ftp: 1 }));
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("FTP rule save error:", error);
      notify("Failed to save FTP rule", "error");
    } finally {
      setLoading(false);
    }
  };

  // ── "Delete" via POST empty template ─────────────────────────────────────────
  const handleDeleteHttpRule = async () => {
    setLoading(true);
    try {
      console.log("Clearing HTTP rule"); // Debug log
      const res = await fetch("http://localhost:8080/api/http_rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emptyHttp),
      });
      
      const data = await res.json();
      console.log("HTTP rule clear response:", data); // Debug log
      
      if (data && data.http_rules) {
        setHttpRule(data.http_rules);
        notify("HTTP rule cleared");
        setViewTab(v => ({ ...v, http: 0 }));
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("HTTP rule clear error:", error);
      notify("Failed to clear HTTP rule", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFtpRule = async () => {
    setLoading(true);
    try {
      console.log("Clearing FTP rule"); // Debug log
      // Fixed URL
      const res = await fetch("http://localhost:8080/api/ftp_rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emptyFtp),
      });
      
      const data = await res.json();
      console.log("FTP rule clear response:", data); // Debug log
      
      if (data && data.ftp_rules) {
        setFtpRule(data.ftp_rules);
        notify("FTP rule cleared");
        setViewTab(v => ({ ...v, ftp: 0 }));
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("FTP rule clear error:", error);
      notify("Failed to clear FTP rule", "error");
    } finally {
      setLoading(false);
    }
  };

  const notify = (message, severity = "success") => {
    setNotif({ open: true, message, severity });
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ mt: 4, overflow: "hidden" }}>
        {/* Protocol selector */}
        <Box sx={{ bgcolor: "primary.main", color: "white" }}>
          <Tabs
            value={protocolTab}
            onChange={(_, v) => setProtocol(v)}
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab label="HTTP DPI" />
            <Tab label="FTP DPI" />
          </Tabs>
        </Box>

        {/* HTTP Section */}
        <TabPanel value={protocolTab} index={0}>
          <Tabs
            value={viewTab.http}
            onChange={(_, v) => setViewTab(t => ({ ...t, http: v }))}
          >
            <Tab label={httpRule ? "Edit HTTP Rule" : "Create HTTP Rule"} />
            <Tab label="View HTTP Rule" />
          </Tabs>

          <TabPanel value={viewTab.http} index={0}>
            <HttpDpiRuleForm
              onSave={handleSaveHttpRule}
              loading={loading}
              initialRule={httpRule}
            />
          </TabPanel>

          <TabPanel value={viewTab.http} index={1}>
            <HttpDpiRulesList rule={httpRule} />
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setViewTab(t => ({ ...t, http: 0 }))}
                disabled={!httpRule}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteHttpRule}
                disabled={!httpRule}
              >
                Clear
              </Button>
            </Box>
          </TabPanel>
        </TabPanel>

        {/* FTP Section */}
        <TabPanel value={protocolTab} index={1}>
          <Tabs
            value={viewTab.ftp}
            onChange={(_, v) => setViewTab(t => ({ ...t, ftp: v }))}
          >
            <Tab label={ftpRule ? "Edit FTP Rule" : "Create FTP Rule"} />
            <Tab label="View FTP Rule" />
          </Tabs>

          <TabPanel value={viewTab.ftp} index={0}>
            <FtpDpiRuleForm
              onSave={handleSaveFtpRule}
              loading={loading}
              initialRule={ftpRule}
            />
          </TabPanel>

          <TabPanel value={viewTab.ftp} index={1}>
            <FtpDpiRulesList rule={ftpRule} />
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setViewTab(t => ({ ...t, ftp: 0 }))}
                disabled={!ftpRule}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteFtpRule}
                disabled={!ftpRule}
              >
                Clear
              </Button>
            </Box>
          </TabPanel>
        </TabPanel>
      </Paper>

      <Snackbar
        open={notif.open}
        autoHideDuration={4000}
        onClose={() => setNotif(n => ({ ...n, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={notif.severity}>{notif.message}</Alert>
      </Snackbar>
    </Container>
  );
}