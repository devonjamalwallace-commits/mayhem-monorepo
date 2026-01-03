import { useState, useEffect, useCallback } from 'react';
import { useStrapiClient } from './useStrapiClient';
import type { Site } from '../types';

interface UseSiteState {
  site: Site | null;
  stats: { blogs: number; products: number; pages: number } | null;
  loading: boolean;
  error: Error | null;
}

interface UseSiteReturn extends UseSiteState {
  refetch: () => Promise<void>;
}

export function useSite(withStats = false): UseSiteReturn {
  const client = useStrapiClient();
  const [state, setState] = useState<UseSiteState>({
    site: null,
    stats: null,
    loading: true,
    error: null,
  });

  const fetchSite = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      if (withStats) {
        const { site, stats } = await client.getSiteWithStats();
        setState({
          site,
          stats,
          loading: false,
          error: null,
        });
      } else {
        const site = await client.getSiteConfig();
        setState({
          site,
          stats: null,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      setState({
        site: null,
        stats: null,
        loading: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      });
    }
  }, [client, withStats]);

  useEffect(() => {
    fetchSite();
  }, [fetchSite]);

  return {
    ...state,
    refetch: fetchSite,
  };
}
