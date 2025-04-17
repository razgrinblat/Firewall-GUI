import React, { useMemo, useState, useEffect } from "react";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Box
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import StatsPage from "./components/statsPage";
import ConnectionsPage from "./components/ConnectionsPage";
import ClientsPage from "./components/ClientsPage";
import RulesPage from "./components/RulesPage";
import PatTableComponent from "./components/PatTable";
import ConflictedRuleComponent from "./components/ConflictedRule";

function App() {
  const [mode, setMode] = useState("light");
  const [page, setPage] = useState("stats"); // "stats", "connections", "clients", "rules", or "pat"
  
  // Manage rulesList state in App component
  const [rulesList, setRulesList] = useState([]); 
  const [rulesLoaded, setRulesLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch rules when the app loads
  useEffect(() => {
    const fetchRules = async () => {
      // Only attempt to fetch if we haven't loaded rules yet
      if (!rulesLoaded) {
        setLoading(true);
        try {
          const response = await fetch("http://localhost:8080/api/rules");
          if (!response.ok) {
            throw new Error(`Failed to fetch rules: ${response.status}`);
          }
          const data = await response.json();
          // Assuming the API returns { rules: [...] }
          if (data && data.rules) {
            setRulesList(data.rules);
          }
          setRulesLoaded(true);
        } catch (err) {
          console.error("Error fetching rules:", err);
          // Set an error but don't block the app from rendering
          setError("Could not load existing firewall rules. You can still create new rules.");
          // Mark as loaded anyway so we don't keep retrying and showing errors
          setRulesLoaded(true);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRules();
  }, [rulesLoaded]); // Only re-run if rulesLoaded changes

  // Also try to fetch rules when user navigates to the rules page
  useEffect(() => {
    if (page === "rules" && !rulesLoaded && !loading) {
      const fetchRules = async () => {
        setLoading(true);
        try {
          const response = await fetch("http://localhost:8080/api/rules");
          if (!response.ok) {
            throw new Error(`Failed to fetch rules: ${response.status}`);
          }
          const data = await response.json();
          if (data && data.rules) {
            setRulesList(data.rules);
          }
          setRulesLoaded(true);
        } catch (err) {
          console.error("Error fetching rules when navigating to rules page:", err);
          setError("Could not load existing firewall rules. You can still create new rules.");
          setRulesLoaded(true);
        } finally {
          setLoading(false);
        }
      };

      fetchRules();
    }
  }, [page, rulesLoaded, loading]);

  const handleCloseError = () => {
    setError(null);
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const renderPage = () => {
    if (page === "rules" && loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      );
    }
    
    if (page === "stats") return <StatsPage />;
    if (page === "connections") return <ConnectionsPage />;
    if (page === "clients") return <ClientsPage />;
    if (page === "pat") return <PatTableComponent />;
    if (page === "rules") 
      return <RulesPage 
               rulesList={rulesList} 
               setRulesList={setRulesList} 
               onRulesInitialized={() => setRulesLoaded(true)} 
             />;
    return <div>Page not found</div>;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Firewall Dashboard
          </Typography>

          <Button color="inherit" onClick={() => setPage("stats")}>
            Stats
          </Button>
          <Button color="inherit" onClick={() => setPage("connections")}>
            Connections
          </Button>
          <Button color="inherit" onClick={() => setPage("clients")}>
            Clients
          </Button>
          <Button color="inherit" onClick={() => setPage("pat")}>
            PAT Table
          </Button>
          <Button color="inherit" onClick={() => setPage("rules")}>
            Manage Rules
          </Button>

          <IconButton sx={{ ml: 1 }} color="inherit" onClick={toggleTheme}>
            {mode === "light" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <div style={{ padding: 16 }}>{renderPage()}</div>

      {/* Error notification */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="warning" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <ConflictedRuleComponent />
    </ThemeProvider>
  );
}

export default App;