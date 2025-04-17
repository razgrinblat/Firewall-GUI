import { useState, useEffect } from "react";
import { fetchPatTable } from "../api/patApi";

export function usePatTable(pollInterval = 2000)
{
  const [patData, setPatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPatData = async () => {
    setLoading(true);
    try {
      const data = await fetchPatTable();
      setPatData(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError("Could not load PAT table data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatData();
    const interval = setInterval(loadPatData, pollInterval);
    return () => clearInterval(interval);
  }, []);

  return { patData, loading, error, refresh: loadPatData };
}