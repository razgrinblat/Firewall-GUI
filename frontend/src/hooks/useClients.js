// hooks/useClients.js
import { useState, useEffect } from "react";
import { fetchClients } from "../api/clientsApi";

export function useClients() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const updateClients = async () => {
      const res = await fetchClients();
      setClients(res);
    };

    updateClients();
    const interval = setInterval(updateClients, 1500);
    return () => clearInterval(interval);
  }, []);

  return clients;
}
