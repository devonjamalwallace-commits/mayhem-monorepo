import { useState, useEffect, useCallback } from 'react';
import { useStrapiClient } from './useStrapiClient';
import type { Blog, QueryParams, StrapiListResponse } from '../types';

interface UseBlogsState {
  blogs: Blog[];
  loading: boolean;
  error: Error | null;
  meta: StrapiListResponse<Blog>['meta'] | null;
}

interface UseBlogsReturn extends UseBlogsState {
  refetch: () => Promise<void>;
}

export function useBlogs(params?: QueryParams): UseBlogsReturn {
  const client = useStrapiClient();
  const [state, setState] = useState<UseBlogsState>({
    blogs: [],
    loading: true,
    error: null,
    meta: null,
  });

  const fetchBlogs = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await client.getBlogs(params);
      setState({
        blogs: response.data,
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
    fetchBlogs();
  }, [fetchBlogs]);

  return {
    ...state,
    refetch: fetchBlogs,
  };
}

interface UseBlogState {
  blog: Blog | null;
  loading: boolean;
  error: Error | null;
}

interface UseBlogReturn extends UseBlogState {
  refetch: () => Promise<void>;
}

export function useBlog(slugOrId: string | number): UseBlogReturn {
  const client = useStrapiClient();
  const [state, setState] = useState<UseBlogState>({
    blog: null,
    loading: true,
    error: null,
  });

  const fetchBlog = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const blog = await client.getBlog(slugOrId);
      setState({
        blog,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        blog: null,
        loading: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      });
    }
  }, [client, slugOrId]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  return {
    ...state,
    refetch: fetchBlog,
  };
}
