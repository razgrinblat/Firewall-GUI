import { useState, useEffect, useRef } from "react";

const useFirewallMessages = () => {
  const [infoMessages, setInfoMessages] = useState([]);
  const [blockMessages, setBlockMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    // Create WebSocket connection
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
            }, ...prev].slice(0, 100)); // Keep only last 100 messages
          } 
          else if (message.type === "firewall block") {
            setBlockMessages((prev) => [{
              id: Date.now(),
              timestamp: new Date().toLocaleTimeString(),
              content: message.data
            }, ...prev].slice(0, 100)); // Keep only last 100 messages
          }
        } catch (err) {
          console.error("Error parsing firewall message:", err);
        }
      };

      ws.onclose = () => {
        console.log("Disconnected from firewall messages WebSocket");
        setIsConnected(false);
        // Try to reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        ws.close();
      };
    };

    connectWebSocket();

    // Cleanup WebSocket on component unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const clearInfoMessages = () => setInfoMessages([]);
  const clearBlockMessages = () => setBlockMessages([]);

  return { 
    infoMessages, 
    blockMessages, 
    isConnected,
    clearInfoMessages,
    clearBlockMessages 
  };
};

export default useFirewallMessages;