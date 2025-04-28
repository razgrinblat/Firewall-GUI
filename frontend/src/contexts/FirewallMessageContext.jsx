// src/contexts/FirewallMessageContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from "react";

const FirewallMessageContext = createContext();

export function FirewallMessageProvider({ children }) {
  const [infoMessages, setInfoMessages] = useState([]);
  const [blockMessages, setBlockMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket("ws://localhost:3000/firewall_messages");
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("Connected to firewall messages WebSocket");
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === "firewall info") {
            setInfoMessages((prev) => [{
              id: Date.now(),
              timestamp: new Date().toLocaleTimeString(),
              content: message.data
            }, ...prev].slice(0, 100));
          } 
          else if (message.type === "firewall block") {
            setBlockMessages((prev) => [{
              id: Date.now(),
              timestamp: new Date().toLocaleTimeString(),
              content: message.data
            }, ...prev].slice(0, 100));
          }
        } catch (err) {
          console.error("Error parsing firewall message:", err);
        }
      };

      ws.onclose = () => {
        console.log("Disconnected from firewall messages WebSocket");
        setIsConnected(false);
        setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        ws.close();
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const clearInfoMessages = () => setInfoMessages([]);
  const clearBlockMessages = () => setBlockMessages([]);

  return (
    <FirewallMessageContext.Provider 
      value={{ 
        infoMessages, 
        blockMessages, 
        isConnected, 
        clearInfoMessages, 
        clearBlockMessages 
      }}
    >
      {children}
    </FirewallMessageContext.Provider>
  );
}

export function useFirewallMessages() {
  return useContext(FirewallMessageContext);
}