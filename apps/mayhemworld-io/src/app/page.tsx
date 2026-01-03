import { createStrapiClient } from 'strapi-sdk';

async function getSiteData() {
  const client = createStrapiClient({
    baseURL: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
    siteUID: 'mayhemworld-io',
  });

  try {
    const site = await client.getSiteConfig();
    return site;
  } catch (error) {
    console.error('Failed to fetch site data:', error);
    return null;
  }
}

export default async function Home() {
  const site = await getSiteData();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">
          {site?.name || 'Mayhemworld.io'}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {site?.description || 'General Hub & Personal Brand'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="/blogs"
            className="p-6 border rounded-lg hover:border-blue-500 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Blog</h2>
            <p className="text-gray-600">Read the latest articles</p>
          </a>

          <a
            href="/products"
            className="p-6 border rounded-lg hover:border-blue-500 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Products</h2>
            <p className="text-gray-600">Browse available products</p>
          </a>
        </div>
      </div>
    </main>
  );
}
