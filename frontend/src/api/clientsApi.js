// api/clientsApi.js
import axios from "axios";

const BASE_URL = "http://localhost:8080";

export async function fetchClients() {
  try {
    const res = await axios.get(`${BASE_URL}/api/clients`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch clients:", err);
    return [];
  }
}

export async function fetchConnections() {
  try {
    const res = await axios.get(`${BASE_URL}/api/sessions`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch live sessions:", err);
    return { tcp: [], udp: [] };
  }
}