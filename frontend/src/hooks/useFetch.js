// frontend/src/hooks/useFetch.js
import { useEffect, useState } from "react";
import API from "../api/api";

export default function useFetch(endpoint, active = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(active);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!active) return;

    setLoading(true);
    API.get(endpoint)
      .then((res) => setData(res.data.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [endpoint, active]);

  return { data, loading, error };
}
