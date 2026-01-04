# Plugin API Documentation

Your custom plugins are accessible via REST API endpoints. Here's how to use them:

## Base URL
- **Production**: `https://strapi-cms-production-9494.up.railway.app`
- **Local**: `http://localhost:1337`

## Authentication
All API requests require an API token:
```bash
Authorization: Bearer YOUR_API_TOKEN
```

---

## 🤖 AI Assistant Plugin

### Generate Content
**POST** `/api/ai-assistant/generate`

```json
{
  "prompt": "Write a blog post about home studio setup",
  "contentType": "article",
  "siteId": 2
}
```

**Response:**
```json
{
  "content": "Generated content...",
  "title": "Suggested title",
  "seoTags": {...}
}
```

### Generate SEO Tags
**POST** `/api/ai-assistant/seo`

```json
{
  "content": "Your content here",
  "siteId": 2
}
```

---

## 📧 Marketing Hub Plugin

### Send Email Campaign
**POST** `/api/marketing/send-email`

```json
{
  "to": "customer@example.com",
  "subject": "New Products Available",
  "html": "<h1>Check out our latest...</h1>",
  "siteId": 1
}
```

### Send SMS
**POST** `/api/marketing/send-sms`

```json
{
  "to": "+1234567890",
  "body": "Your appointment is confirmed!",
  "siteId": 3
}
```

### Post to Social Media
**POST** `/api/marketing/post-social`

```json
{
  "content": "Check out our new collection!",
  "platforms": ["instagram", "twitter"],
  "siteId": 1
}
```

---

## 📊 Analytics Dashboard Plugin

### Get Site Analytics
**GET** `/api/analytics/site/:siteId`

**Response:**
```json
{
  "pageViews": 1234,
  "uniqueVisitors": 567,
  "topPages": [...],
  "traffic Sources": {...}
}
```

### Get Real-time Stats
**GET** `/api/analytics/realtime/:siteId`

---

## Example: Frontend Integration

### Next.js Example

```typescript
// lib/strapi.ts
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function generateWithAI(prompt: string, siteId: number) {
  const response = await fetch(`${STRAPI_URL}/api/ai-assistant/generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STRAPI_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, siteId }),
  });

  return response.json();
}

export async function sendEmail(data: EmailData) {
  const response = await fetch(`${STRAPI_URL}/api/marketing/send-email`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STRAPI_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response.json();
}
```

### React Hook Example

```typescript
// hooks/useAI.ts
import { useState } from 'react';

export function useAI() {
  const [loading, setLoading] = useState(false);

  const generate = async (prompt: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      return await response.json();
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading };
}
```

---

## Testing with cURL

```bash
# Generate AI content
curl -X POST https://strapi-cms-production-9494.up.railway.app/api/ai-assistant/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Write about photography", "siteId": 2}'

# Send email
curl -X POST https://strapi-cms-production-9494.up.railway.app/api/marketing/send-email \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"to": "test@example.com", "subject": "Test", "html": "<p>Hello</p>", "siteId": 1}'
```

---

## Site IDs Reference

- **1**: Mayhemworld
- **2**: ShotByMayhem
- **3**: Goddesses of ATL
- **4**: Nexus AI
- **5**: House of KarléVon
