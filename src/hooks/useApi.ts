import { useState, useCallback } from "react";
import axios from "axios";

interface UseApiResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  execute: (callback: () => Promise<T>) => Promise<void>;
}

export function useApi<T>(): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async (callback: () => Promise<T>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await callback();
      setData(result);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || err.message;
        const errorDetails = err.response?.data?.details || "Aucune information supplémentaire";
        setError(`${errorMessage} (Détails: ${errorDetails})`);
      } else {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, error, loading, execute };
}