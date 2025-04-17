import axios from "axios";

const PAT_API_URL = "http://localhost:8080/api/pat-table";

export async function fetchPatTable() {
  try {
    const response = await axios.get(PAT_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching PAT table:", error);
    return [];
  }
}
