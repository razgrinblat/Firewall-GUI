// hooks/useConnections.js
import { useState, useEffect } from "react";
import { fetchConnections } from "../api/ClientsApi";

export function useConnections() {
  const [connections, setConnections] = useState({ tcp: [], udp: [] });

  useEffect(() => {
    const updateConnections = async () => {
      const res = await fetchConnections();
      setConnections(res);
    };

    updateConnections();
    const interval = setInterval(updateConnections, 1500);
    return () => clearInterval(interval);
  }, []);

  return {
    tcp: connections.tcp || [],
    udp: connections.udp || [],
  };
}
