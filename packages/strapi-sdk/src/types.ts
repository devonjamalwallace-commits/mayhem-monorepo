// ============================================
// Strapi SDK Types
// ============================================

export interface StrapiConfig {
  baseURL: string;
  siteUID: string;
  token?: string;
  timeout?: number;
  retries?: number;
  cache?: boolean;
  cacheTTL?: number;
}

export interface StrapiError {
  status: number;
  name: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface StrapiMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface StrapiResponse<T> {
  data: T;
  meta?: StrapiMeta;
  error?: StrapiError;
}

export interface StrapiListResponse<T> {
  data: T[];
  meta: StrapiMeta;
}

// ============================================
// Content Type Interfaces
// ============================================

export interface SEO {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: Media;
  twitter_card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  canonical_url?: string;
  robots?: string;
  structured_data?: Record<string, unknown>;
}

export interface Media {
  id: number;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: MediaFormat;
    small?: MediaFormat;
    medium?: MediaFormat;
    large?: MediaFormat;
  };
}

export interface MediaFormat {
  url: string;
  width: number;
  height: number;
}

export interface SocialLink {
  platform: string;
  url: string;
  label?: string;
  display_order: number;
}

export interface Analytics {
  google_analytics_id?: string;
  google_tag_manager_id?: string;
  facebook_pixel_id?: string;
  tiktok_pixel_id?: string;
}

export interface Site {
  id: number;
  name: string;
  site_uid: string;
  domain: string;
  description?: string;
  logo?: Media;
  favicon?: Media;
  primary_color: string;
  secondary_color: string;
  seo?: SEO;
  analytics?: Analytics;
  social_links?: SocialLink[];
  status: 'active' | 'maintenance' | 'inactive';
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: Media;
  parent?: Category;
  children?: Category[];
  display_order: number;
  featured: boolean;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface ProductVariant {
  name: string;
  sku?: string;
  price_adjustment: number;
  inventory_quantity: number;
  stripe_price_id?: string;
  options?: Record<string, string>;
  image?: Media;
  is_default: boolean;
  available: boolean;
}

export interface ProductShipping {
  requires_shipping: boolean;
  weight?: number;
  weight_unit: 'lb' | 'oz' | 'kg' | 'g';
  length?: number;
  width?: number;
  height?: number;
  dimension_unit: 'in' | 'cm';
  flat_rate?: number;
  free_shipping: boolean;
  shipping_class: 'standard' | 'expedited' | 'overnight' | 'freight';
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  price: number;
  compare_at_price?: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
  product_type: 'physical' | 'digital' | 'service' | 'subscription';
  stripe_product_id?: string;
  stripe_price_id?: string;
  sku?: string;
  inventory_quantity: number;
  track_inventory: boolean;
  allow_backorder: boolean;
  images?: Media[];
  digital_file?: Media;
  categories?: Category[];
  tags?: Tag[];
  seo?: SEO;
  variants?: ProductVariant[];
  shipping?: ProductShipping;
  featured: boolean;
  status: 'draft' | 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Author {
  id: number;
  username: string;
  email: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: Media;
  gallery?: Media[];
  author?: Author;
  categories?: Category[];
  tags?: Tag[];
  seo?: SEO;
  read_time?: number;
  featured: boolean;
  published_at_override?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  page_type: 'standard' | 'landing' | 'contact' | 'about' | 'faq' | 'legal';
  content?: string;
  blocks?: unknown[];
  featured_image?: Media;
  seo?: SEO;
  template: string;
  show_in_navigation: boolean;
  navigation_order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// ============================================
// Query Parameters
// ============================================

export interface QueryParams {
  filters?: Record<string, unknown>;
  sort?: string | string[];
  pagination?: {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
  };
  populate?: string | string[] | Record<string, unknown>;
  fields?: string[];
}
