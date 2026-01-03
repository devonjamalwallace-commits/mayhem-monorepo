import { useState, useEffect, useCallback } from 'react';
import { useStrapiClient } from './useStrapiClient';
import type { Product, QueryParams, StrapiListResponse } from '../types';

interface UseProductsState {
  products: Product[];
  loading: boolean;
  error: Error | null;
  meta: StrapiListResponse<Product>['meta'] | null;
}

interface UseProductsReturn extends UseProductsState {
  refetch: () => Promise<void>;
}

export function useProducts(params?: QueryParams): UseProductsReturn {
  const client = useStrapiClient();
  const [state, setState] = useState<UseProductsState>({
    products: [],
    loading: true,
    error: null,
    meta: null,
  });

  const fetchProducts = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await client.getProducts(params);
      setState({
        products: response.data,
        loading: false,
        error: null,
        meta: response.meta,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      }));
    }
  }, [client, JSON.stringify(params)]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    ...state,
    refetch: fetchProducts,
  };
}

interface UseProductState {
  product: Product | null;
  loading: boolean;
  error: Error | null;
}

interface UseProductReturn extends UseProductState {
  refetch: () => Promise<void>;
}

export function useProduct(slugOrId: string | number): UseProductReturn {
  const client = useStrapiClient();
  const [state, setState] = useState<UseProductState>({
    product: null,
    loading: true,
    error: null,
  });

  const fetchProduct = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const product = await client.getProduct(slugOrId);
      setState({
        product,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        product: null,
        loading: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      });
    }
  }, [client, slugOrId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    ...state,
    refetch: fetchProduct,
  };
}
