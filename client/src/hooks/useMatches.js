import { useState, useEffect, useCallback } from 'react';
import { matchService } from '../services/api';

export const useMatches = (params = {}) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await matchService.getAll(params);
      setMatches(data.matches);
      setPagination({ total: data.total, page: data.page, pages: data.pages });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetchMatches(); }, [fetchMatches]);

  return { matches, loading, error, pagination, refetch: fetchMatches };
};
