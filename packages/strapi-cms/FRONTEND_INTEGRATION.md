# Frontend Integration Guide

Connect your 5 frontend sites to Strapi CMS using GraphQL or REST API.

## GraphQL Endpoint

**URL**: `https://strapi-cms-production-9494.up.railway.app/graphql`

---

## Setup Instructions

### 1. Install GraphQL Client

```bash
# For Next.js/React sites
npm install @apollo/client graphql

# Or use urql (lighter alternative)
npm install urql graphql
```

### 2. Configure Apollo Client

```typescript
// lib/apollo-client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_URL,
});

const authLink = setContext((_, { headers }) => {
  const token = process.env.STRAPI_API_TOKEN;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

### 3. Environment Variables

Create `.env.local` in each frontend:

```bash
# Common for all sites
NEXT_PUBLIC_STRAPI_URL=https://strapi-cms-production-9494.up.railway.app
NEXT_PUBLIC_STRAPI_GRAPHQL_URL=https://strapi-cms-production-9494.up.railway.app/graphql
STRAPI_API_TOKEN=your_api_token_here

# Site-specific
NEXT_PUBLIC_SITE_UID=mayhemworld  # or shotbymayhem, goddesses-of-atl, nexus-ai, house-of-karlevon
NEXT_PUBLIC_SITE_ID=1              # or 2, 3, 4, 5
```

---

## GraphQL Queries

### Fetch Articles (Blog Posts)

```graphql
query GetArticles($siteId: ID!) {
  articles(filters: { site: { id: { eq: $siteId } } }) {
    data {
      id
      attributes {
        title
        slug
        excerpt
        content
        category
        tags
        author
        published
        publishedAt
        createdAt
      }
    }
  }
}
```

**Usage in Next.js:**

```typescript
// pages/blog.tsx
import { useQuery, gql } from '@apollo/client';

const GET_ARTICLES = gql`
  query GetArticles($siteId: ID!) {
    articles(filters: { site: { id: { eq: $siteId } } }) {
      data {
        id
        attributes {
          title
          slug
          excerpt
          publishedAt
        }
      }
    }
  }
`;

export default function BlogPage() {
  const siteId = process.env.NEXT_PUBLIC_SITE_ID!;
  const { data, loading, error } = useQuery(GET_ARTICLES, {
    variables: { siteId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data.articles.data.map(article => (
        <article key={article.id}>
          <h2>{article.attributes.title}</h2>
          <p>{article.attributes.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

### Fetch Products

```graphql
query GetProducts($siteId: ID!) {
  products(filters: { site: { id: { eq: $siteId } }, status: { eq: "active" } }) {
    data {
      id
      attributes {
        name
        slug
        description
        short_description
        price
        compare_at_price
        currency
        product_type
        sku
        status
        featured
        inventory_quantity
        features
      }
    }
  }
}
```

### Fetch Single Article by Slug

```graphql
query GetArticleBySlug($slug: String!, $siteId: ID!) {
  articles(filters: { slug: { eq: $slug }, site: { id: { eq: $siteId } } }) {
    data {
      id
      attributes {
        title
        content
        excerpt
        category
        tags
        author
        publishedAt
        seo {
          metaTitle
          metaDescription
          keywords
        }
      }
    }
  }
}
```

### Fetch Goddesses (for Goddesses of ATL)

```graphql
query GetGoddesses($siteId: ID!) {
  goddesses(filters: { site: { id: { eq: $siteId } } }) {
    data {
      id
      attributes {
        name
        title
        bio
        instagram
        tiktok
        twitter
        rank
        status
      }
    }
  }
}
```

### Fetch Testimonials

```graphql
query GetTestimonials($siteId: ID!) {
  testimonials(filters: { site: { id: { eq: $siteId } }, status: { eq: "published" } }) {
    data {
      id
      attributes {
        client_name
        company
        rating
        content
        service_type
        publishedAt
      }
    }
  }
}
```

---

## REST API Alternative

If you prefer REST over GraphQL:

```typescript
// lib/strapi.ts
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID;

export async function getArticles() {
  const response = await fetch(
    `${STRAPI_URL}/api/articles?filters[site][id][$eq]=${SITE_ID}&populate=*`
  );
  return response.json();
}

export async function getArticleBySlug(slug: string) {
  const response = await fetch(
    `${STRAPI_URL}/api/articles?filters[slug][$eq]=${slug}&filters[site][id][$eq]=${SITE_ID}&populate=*`
  );
  const data = await response.json();
  return data.data[0];
}

export async function getProducts() {
  const response = await fetch(
    `${STRAPI_URL}/api/products?filters[site][id][$eq]=${SITE_ID}&filters[status][$eq]=active&populate=*`
  );
  return response.json();
}
```

---

## Media/Images from Cloudinary

All uploaded images are automatically served from Cloudinary CDN:

```typescript
// Image URLs from Strapi will be:
// https://res.cloudinary.com/dgtfnhtr8/image/upload/...

// Use in Next.js Image component:
import Image from 'next/image';

<Image
  src={article.attributes.featured_image?.data?.attributes?.url}
  alt={article.attributes.title}
  width={800}
  height={600}
  loader={({ src }) => src} // Cloudinary handles optimization
/>
```

---

## Site-Specific Setup

### Mayhemworld.io (Site ID: 1)
- Fetch: Articles, Products, Testimonials
- Store products with inventory
- Nightlife event content

### ShotByMayhem.com (Site ID: 2)
- Fetch: Articles (portfolio/blog), Services, Testimonials
- Photography showcase
- Booking information

### Goddesses of ATL (Site ID: 3)
- Fetch: Goddesses, Events, Testimonials
- Member profiles
- Community content

### Nexus AI (Site ID: 4)
- Fetch: Products (subscription plans), Articles (docs/blog)
- SaaS features
- Pricing tiers

### House of KarléVon (Site ID: 5)
- Fetch: Products, Collections
- E-commerce catalog
- Luxury streetwear

---

## Next Steps

1. **Create API Token**: Go to Strapi Admin → Settings → API Tokens → Create
2. **Add to .env files**: Update each frontend with token
3. **Test queries**: Use GraphQL playground at `/graphql`
4. **Implement in pages**: Replace hardcoded data with Strapi queries
5. **Deploy**: Push changes to Vercel

---

## Testing GraphQL Queries

Visit the GraphQL Playground:
**https://strapi-cms-production-9494.up.railway.app/graphql**

Add header:
```json
{
  "Authorization": "Bearer YOUR_API_TOKEN"
}
```

Test your queries before implementing!
