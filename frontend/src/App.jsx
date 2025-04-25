import React, { useMemo, useState, useEffect } from "react";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import BarChartIcon from "@mui/icons-material/BarChart";
import NetworkCheckIcon from "@mui/icons-material/NetworkCheck";
import DevicesIcon from "@mui/icons-material/Devices";
import SecurityIcon from "@mui/icons-material/Security";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

import StatsPage from "./components/statsPage";
import ConnectionsPage from "./components/ConnectionsPage";
import ClientsPage from "./components/ClientsPage";
import RulesPage from "./components/RulesPage";
import PatTableComponent from "./components/PatTable";

const drawerWidth = 240;

function App() {
  const [mode, setMode] = useState("dark");
  const [page, setPage] = useState("stats");
  const [rulesList, setRulesList] = useState([]);
  const [rulesLoaded, setRulesLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch rules when app loads (and on navigating to “rules” if not yet loaded)
  useEffect(() => {
    const fetchRules = async () => {
      if (!rulesLoaded) {
        setLoading(true);
        try {
          const res = await fetch("http://localhost:8080/api/rules");
          if (!res.ok) throw new Error(`Failed to fetch rules: ${res.status}`);
          const data = await res.json();
          if (data.rules) setRulesList(data.rules);
          setRulesLoaded(true);
        } catch (err) {
          console.error(err);
          setError(
            "Could not load existing firewall rules. You can still create new rules."
          );
          setRulesLoaded(true);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchRules();
  }, [rulesLoaded]);

  useEffect(() => {
    if (page === "rules" && !rulesLoaded && !loading) {
      setLoading(true);
      fetch("http://localhost:8080/api/rules")
        .then((res) => {
          if (!res.ok) throw new Error(`Failed to fetch rules: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (data.rules) setRulesList(data.rules);
          setRulesLoaded(true);
        })
        .catch((err) => {
          console.error(err);
          setError(
            "Could not load existing firewall rules. You can still create new rules."
          );
          setRulesLoaded(true);
        })
        .finally(() => setLoading(false));
    }
  }, [page, rulesLoaded, loading]);

  const handleCloseError = () => setError(null);

  const toggleTheme = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));

  const handlePageChange = (newPage) => setPage(newPage);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#1976d2" },
        },
      }),
    [mode]
  );

  const renderPage = () => {
    if (page === "rules" && loading) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }
    switch (page) {
      case "stats":
        return <StatsPage />;
      case "connections":
        return <ConnectionsPage />;
      case "clients":
        return <ClientsPage />;
      case "pat":
        return <PatTableComponent />;
      case "rules":
        return (
          <RulesPage
            rulesList={rulesList}
            setRulesList={setRulesList}
            onRulesInitialized={() => setRulesLoaded(true)}
          />
        );
      default:
        return <div>Page not found</div>;
    }
  };

  const navigationItems = [
    { id: "stats", text: "Statistics", icon: <BarChartIcon /> },
    { id: "connections", text: "Connections", icon: <NetworkCheckIcon /> },
    { id: "clients", text: "Clients", icon: <DevicesIcon /> },
    { id: "pat", text: "PAT Table", icon: <SwapHorizIcon /> },
    { id: "rules", text: "Manage Rules", icon: <SecurityIcon /> },
  ];

  const drawer = (
    <>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Firewall Dashboard
        </Typography>
      </Toolbar>
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={page === item.id}
              onClick={() => handlePageChange(item.id)}
              sx={{
                "&.Mui-selected": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(25, 118, 210, 0.2)"
                      : "rgba(25, 118, 210, 0.1)",
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(25, 118, 210, 0.3)"
                        : "rgba(25, 118, 210, 0.2)",
                  },
                },
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color:
                    page === item.id ? theme.palette.primary.main : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: page === item.id ? "bold" : "normal",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
          sx={{ zIndex: (t) => t.zIndex.drawer + 1, boxShadow: 2 }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              SecurePipe
            </Typography>
            <IconButton color="inherit" onClick={toggleTheme}>
              {mode === "light" ? (
                <Brightness4Icon />
              ) : (
                <Brightness7Icon />
              )}
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Permanent drawer only */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              boxShadow: 2,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.background.default
                  : "#ffffff",
            },
          }}
        >
          <Toolbar />
          {drawer}
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            marginTop: "64px",
          }}
        >
          {renderPage()}
        </Box>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
