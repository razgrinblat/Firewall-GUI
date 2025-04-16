// hooks/useClients.js
import { useState, useEffect } from "react";
import { fetchClients } from "../api/ClientsApi";

export function useClients() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const updateClients = async () => {
      const res = await fetchClients();
      setClients(res);
    };

    updateClients();
    const interval = setInterval(updateClients, 1000);
    return () => clearInterval(interval);
  }, []);

  return clients;
}
