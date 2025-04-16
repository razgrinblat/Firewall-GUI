// src/App.jsx
import React, { useMemo, useState } from "react";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import StatsPage from "./components/statsPage";
import ConnectionsPage from "./components/ConnectionsPage";
import ClientsPage from "./components/ClientsPage";
import RuleForm from "./components/RuleForm"; // Import RuleForm

function App() {
  const [mode, setMode] = useState("light");
  const [page, setPage] = useState("stats"); // "stats", "connections", "clients", or "rules"
  const [rulesList, setRulesList] = useState([]); // Store rules in the state

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
    if (page === "stats") return <StatsPage />;
    if (page === "connections") return <ConnectionsPage />;
    if (page === "clients") return <ClientsPage />;
    if (page === "rules") return <RuleForm rulesList={rulesList} setRulesList={setRulesList} />; // Add RuleForm
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

          <Button color="inherit" onClick={() => setPage("stats")}>Stats</Button>
          <Button color="inherit" onClick={() => setPage("connections")}>Connections</Button>
          <Button color="inherit" onClick={() => setPage("clients")}>Clients</Button>
          <Button color="inherit" onClick={() => setPage("rules")}>Manage Rules</Button> {/* Add new page for rules */}

          <IconButton sx={{ ml: 1 }} color="inherit" onClick={toggleTheme}>
            {mode === "light" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <div style={{ padding: 16 }}>{renderPage()}</div>
    </ThemeProvider>
  );
}

export default App;
