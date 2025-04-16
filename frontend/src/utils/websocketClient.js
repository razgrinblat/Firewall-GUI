// src/utils/websocketClient.js
import { useState, useEffect } from "react";

export const useWebSocket = (url) => {
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    setWs(socket);

    socket.onopen = () => {
      console.log("WebSocket Connected");
    };

    socket.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    socket.onerror = (error) => {
      console.log("WebSocket Error:", error);
    };

    return () => {
      socket.close();
    };
  }, [url]);

  const sendMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    } else {
      console.error("WebSocket is not open!");
    }
  };

  return { sendMessage };
};
