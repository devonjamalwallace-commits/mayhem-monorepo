import { useState, useEffect, useCallback } from 'react';
import { useStrapiClient } from './useStrapiClient';
import type { Category, QueryParams, StrapiListResponse } from '../types';

interface UseCategoriesState {
  categories: Category[];
  loading: boolean;
  error: Error | null;
  meta: StrapiListResponse<Category>['meta'] | null;
}

interface UseCategoriesReturn extends UseCategoriesState {
  refetch: () => Promise<void>;
}

interface UseCategoriesOptions {
  tree?: boolean;
  params?: QueryParams;
}

export function useCategories(options: UseCategoriesOptions = {}): UseCategoriesReturn {
  const { tree = false, params } = options;
  const client = useStrapiClient();
  const [state, setState] = useState<UseCategoriesState>({
    categories: [],
    loading: true,
    error: null,
    meta: null,
  });

  const fetchCategories = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      if (tree) {
        const categories = await client.getCategoryTree();
        setState({
          categories,
          loading: false,
          error: null,
          meta: null,
        });
      } else {
        const response = await client.getCategories(params);
        setState({
          categories: response.data,
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
  }, [client, tree, JSON.stringify(params)]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    ...state,
    refetch: fetchCategories,
  };
}
