'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export function useApi(path, options = {}) {
  const { immediate = true, params } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const buildPath = useCallback(() => {
    if (!params) return path;
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))
    ).toString();
    return qs ? `${path}?${qs}` : path;
  }, [path, params]);

  const fetchData = useCallback(async () => {
    if (!path) return;
    setLoading(true);
    setError(null);
    const { data: result, error: err } = await api.get(buildPath());
    if (err) {
      setError(err);
    } else {
      setData(result);
    }
    setLoading(false);
  }, [buildPath, path]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);

  return { data, loading, error, refetch: fetchData };
}

export default useApi;
