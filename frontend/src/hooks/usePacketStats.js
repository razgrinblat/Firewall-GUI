// hooks/usePacketStats.js
import { useState, useEffect } from "react";
import { fetchPacketStats } from "../api/statsApi";


export function usePacketStats() {
  const [packetStats, setPacketStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await fetchPacketStats();
        setPacketStats(data);
      } catch (err) {
        console.error("Error fetching packet stats:", err);
      }
    };

    fetchStats();

    const intervalId = setInterval(fetchStats, 1500); // poll every 1.5s

    return () => clearInterval(intervalId);
  }, []);

  return packetStats;
}
