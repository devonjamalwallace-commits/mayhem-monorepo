import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import type {
  StrapiConfig,
  StrapiResponse,
  StrapiListResponse,
  StrapiError,
  Site,
  Product,
  Blog,
  Page,
  Category,
  Tag,
  QueryParams,
} from './types';

// ============================================
// Cache Implementation
// ============================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class SimpleCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private ttl: number;

  constructor(ttlMs: number = 60000) {
    this.ttl = ttlMs;
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

// ============================================
// Error Classes
// ============================================

export class StrapiClientError extends Error {
  public status: number;
  public details?: Record<string, unknown>;

  constructor(message: string, status: number, details?: Record<string, unknown>) {
    super(message);
    this.name = 'StrapiClientError';
    this.status = status;
    this.details = details;
  }
}

// ============================================
// Main Client
// ============================================

export class StrapiClient {
  private client: AxiosInstance;
  private siteUID: string;
  private cache: SimpleCache | null;
  private maxRetries: number;

  constructor(config: StrapiConfig) {
    this.siteUID = config.siteUID;
    this.maxRetries = config.retries ?? 3;
    this.cache = config.cache !== false ? new SimpleCache(config.cacheTTL ?? 60000) : null;

    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout ?? 30000,
      headers: {
        'Content-Type': 'application/json',
        'X-Site-ID': config.siteUID,
        ...(config.token && { Authorization: `Bearer ${config.token}` }),
      },
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<{ error: StrapiError }>) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: number };

        // Retry logic for network errors or 5xx errors
        if (
          originalRequest &&
          (originalRequest._retry ?? 0) < this.maxRetries &&
          (error.code === 'ECONNRESET' ||
            error.code === 'ETIMEDOUT' ||
            (error.response?.status && error.response.status >= 500))
        ) {
          originalRequest._retry = (originalRequest._retry ?? 0) + 1;
          const delay = Math.pow(2, originalRequest._retry) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
          return this.client.request(originalRequest);
        }

        // Transform error
        const strapiError = error.response?.data?.error;
        throw new StrapiClientError(
          strapiError?.message || error.message || 'Unknown error',
          error.response?.status || 500,
          strapiError?.details
        );
      }
    );
  }

  // ============================================
  // Helper Methods
  // ============================================

  private buildQueryString(params?: QueryParams): string {
    if (!params) return '';

    const queryParts: string[] = [];

    if (params.filters) {
      queryParts.push(`filters=${encodeURIComponent(JSON.stringify(params.filters))}`);
    }

    if (params.sort) {
      const sortValue = Array.isArray(params.sort) ? params.sort.join(',') : params.sort;
      queryParts.push(`sort=${encodeURIComponent(sortValue)}`);
    }

    if (params.pagination) {
      Object.entries(params.pagination).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParts.push(`pagination[${key}]=${value}`);
        }
      });
    }

    if (params.populate) {
      if (typeof params.populate === 'string') {
        queryParts.push(`populate=${params.populate}`);
      } else if (Array.isArray(params.populate)) {
        queryParts.push(`populate=${params.populate.join(',')}`);
      } else {
        queryParts.push(`populate=${encodeURIComponent(JSON.stringify(params.populate))}`);
      }
    }

    if (params.fields) {
      queryParts.push(`fields=${params.fields.join(',')}`);
    }

    return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  }

  private getCacheKey(endpoint: string, params?: QueryParams): string {
    return `${this.siteUID}:${endpoint}:${JSON.stringify(params || {})}`;
  }

  private async get<T>(endpoint: string, params?: QueryParams, useCache = true): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, params);

    if (useCache && this.cache) {
      const cached = this.cache.get<T>(cacheKey);
      if (cached) return cached;
    }

    const url = `${endpoint}${this.buildQueryString(params)}`;
    const response = await this.client.get<T>(url);

    if (useCache && this.cache) {
      this.cache.set(cacheKey, response.data);
    }

    return response.data;
  }

  private async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await this.client.post<T>(endpoint, { data });
    this.cache?.clear(); // Invalidate cache on mutations
    return response.data;
  }

  private async put<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await this.client.put<T>(endpoint, { data });
    this.cache?.clear();
    return response.data;
  }

  private async delete<T>(endpoint: string): Promise<T> {
    const response = await this.client.delete<T>(endpoint);
    this.cache?.clear();
    return response.data;
  }

  // ============================================
  // Site Methods
  // ============================================

  async getSiteConfig(): Promise<Site> {
    const response = await this.get<StrapiResponse<Site>>('/api/sites/current');
    return response.data;
  }

  async getSiteWithStats(): Promise<{ site: Site; stats: { blogs: number; products: number; pages: number } }> {
    const response = await this.get<{ data: Site; stats: { blogs: number; products: number; pages: number } }>(
      '/api/sites/stats'
    );
    return { site: response.data, stats: response.stats };
  }

  // ============================================
  // Product Methods
  // ============================================

  async getProducts(params?: QueryParams): Promise<StrapiListResponse<Product>> {
    return this.get<StrapiListResponse<Product>>('/api/products', {
      populate: ['images', 'categories', 'tags', 'seo'],
      ...params,
    });
  }

  async getProduct(slugOrId: string | number): Promise<Product | null> {
    try {
      if (typeof slugOrId === 'number') {
        const response = await this.get<StrapiResponse<Product>>(`/api/products/${slugOrId}`, {
          populate: ['images', 'categories', 'tags', 'variants', 'shipping', 'seo'],
        });
        return response.data;
      }

      const response = await this.get<StrapiListResponse<Product>>('/api/products', {
        filters: { slug: { $eq: slugOrId } },
        populate: ['images', 'categories', 'tags', 'variants', 'shipping', 'seo'],
      });
      return response.data[0] || null;
    } catch (error) {
      if (error instanceof StrapiClientError && error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const response = await this.get<StrapiListResponse<Product>>('/api/products/featured');
    return response.data;
  }

  async getProductsByCategory(categorySlug: string, params?: QueryParams): Promise<StrapiListResponse<Product>> {
    return this.get<StrapiListResponse<Product>>('/api/products', {
      filters: { categories: { slug: { $eq: categorySlug } } },
      populate: ['images', 'categories'],
      ...params,
    });
  }

  // ============================================
  // Blog Methods
  // ============================================

  async getBlogs(params?: QueryParams): Promise<StrapiListResponse<Blog>> {
    return this.get<StrapiListResponse<Blog>>('/api/blogs', {
      populate: ['featured_image', 'author', 'categories', 'tags'],
      sort: ['publishedAt:desc'],
      ...params,
    });
  }

  async getBlog(slugOrId: string | number): Promise<Blog | null> {
    try {
      if (typeof slugOrId === 'number') {
        const response = await this.get<StrapiResponse<Blog>>(`/api/blogs/${slugOrId}`, {
          populate: ['featured_image', 'gallery', 'author', 'categories', 'tags', 'seo'],
        });
        return response.data;
      }

      const response = await this.get<StrapiListResponse<Blog>>('/api/blogs', {
        filters: { slug: { $eq: slugOrId } },
        populate: ['featured_image', 'gallery', 'author', 'categories', 'tags', 'seo'],
      });
      return response.data[0] || null;
    } catch (error) {
      if (error instanceof StrapiClientError && error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async getFeaturedBlogs(limit = 5): Promise<Blog[]> {
    const response = await this.get<StrapiListResponse<Blog>>(`/api/blogs/featured?limit=${limit}`);
    return response.data;
  }

  async getBlogsByCategory(categorySlug: string): Promise<{ blogs: Blog[]; category: Category }> {
    return this.get<{ data: Blog[]; category: Category }>(`/api/blogs/category/${categorySlug}`).then((res) => ({
      blogs: res.data,
      category: res.category,
    }));
  }

  async getRelatedBlogs(blogId: number, limit = 3): Promise<Blog[]> {
    const response = await this.get<StrapiListResponse<Blog>>(`/api/blogs/${blogId}/related?limit=${limit}`);
    return response.data;
  }

  // ============================================
  // Page Methods
  // ============================================

  async getPages(params?: QueryParams): Promise<StrapiListResponse<Page>> {
    return this.get<StrapiListResponse<Page>>('/api/pages', {
      populate: ['featured_image', 'seo'],
      ...params,
    });
  }

  async getPage(slugOrId: string | number): Promise<Page | null> {
    try {
      if (typeof slugOrId === 'number') {
        const response = await this.get<StrapiResponse<Page>>(`/api/pages/${slugOrId}`, {
          populate: ['blocks', 'featured_image', 'seo'],
        });
        return response.data;
      }

      const response = await this.get<StrapiResponse<Page>>(`/api/pages/slug/${slugOrId}`);
      return response.data;
    } catch (error) {
      if (error instanceof StrapiClientError && error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async getNavigationPages(): Promise<Page[]> {
    const response = await this.get<StrapiListResponse<Page>>('/api/pages/navigation');
    return response.data;
  }

  // ============================================
  // Category Methods
  // ============================================

  async getCategories(params?: QueryParams): Promise<StrapiListResponse<Category>> {
    return this.get<StrapiListResponse<Category>>('/api/categories', {
      populate: ['image'],
      ...params,
    });
  }

  async getCategoryTree(): Promise<Category[]> {
    const response = await this.get<StrapiListResponse<Category>>('/api/categories/tree');
    return response.data;
  }

  async getCategory(slugOrId: string | number): Promise<Category | null> {
    try {
      if (typeof slugOrId === 'number') {
        const response = await this.get<StrapiResponse<Category>>(`/api/categories/${slugOrId}`, {
          populate: ['image', 'children'],
        });
        return response.data;
      }

      const response = await this.get<StrapiListResponse<Category>>('/api/categories', {
        filters: { slug: { $eq: slugOrId } },
        populate: ['image', 'children'],
      });
      return response.data[0] || null;
    } catch (error) {
      if (error instanceof StrapiClientError && error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  // ============================================
  // Tag Methods
  // ============================================

  async getTags(params?: QueryParams): Promise<StrapiListResponse<Tag>> {
    return this.get<StrapiListResponse<Tag>>('/api/tags', params);
  }

  // ============================================
  // Cache Control
  // ============================================

  clearCache(): void {
    this.cache?.clear();
  }

  invalidateCache(pattern?: string): void {
    if (!this.cache) return;

    if (!pattern) {
      this.cache.clear();
    }
    // Future: implement pattern-based cache invalidation
  }
}

// ============================================
// Factory Function
// ============================================

export function createStrapiClient(config: StrapiConfig): StrapiClient {
  return new StrapiClient(config);
}
