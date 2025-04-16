//api/statsApi.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/stats";

export async function fetchPacketStats() {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching packet stats:", error);
    return null;
  }
}