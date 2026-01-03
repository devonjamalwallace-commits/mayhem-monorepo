import { useState, useEffect, useCallback } from 'react';
import { useStrapiClient } from './useStrapiClient';
import type { Page, QueryParams, StrapiListResponse } from '../types';

interface UsePagesState {
  pages: Page[];
  loading: boolean;
  error: Error | null;
  meta: StrapiListResponse<Page>['meta'] | null;
}

interface UsePagesReturn extends UsePagesState {
  refetch: () => Promise<void>;
}

interface UsePagesOptions {
  navigation?: boolean;
  params?: QueryParams;
}

export function usePages(options: UsePagesOptions = {}): UsePagesReturn {
  const { navigation = false, params } = options;
  const client = useStrapiClient();
  const [state, setState] = useState<UsePagesState>({
    pages: [],
    loading: true,
    error: null,
    meta: null,
  });

  const fetchPages = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      if (navigation) {
        const pages = await client.getNavigationPages();
        setState({
          pages,
          loading: false,
          error: null,
          meta: null,
        });
      } else {
        const response = await client.getPages(params);
        setState({
          pages: response.data,
          loading: false,
          error: null,
          meta: response.meta,
        });
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      }));
    }
  }, [client, navigation, JSON.stringify(params)]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  return {
    ...state,
    refetch: fetchPages,
  };
}

interface UsePageState {
  page: Page | null;
  loading: boolean;
  error: Error | null;
}

interface UsePageReturn extends UsePageState {
  refetch: () => Promise<void>;
}

export function usePage(slugOrId: string | number): UsePageReturn {
  const client = useStrapiClient();
  const [state, setState] = useState<UsePageState>({
    page: null,
    loading: true,
    error: null,
  });

  const fetchPage = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const page = await client.getPage(slugOrId);
      setState({
        page,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        page: null,
        loading: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      });
    }
  }, [client, slugOrId]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  return {
    ...state,
    refetch: fetchPage,
  };
}
