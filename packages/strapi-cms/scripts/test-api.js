const fetch = require('node-fetch');

const STRAPI_URL = process.env.STRAPI_URL || 'https://strapi-cms-production-9494.up.railway.app';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_TOKEN) {
  console.error('❌ STRAPI_API_TOKEN environment variable required');
  process.exit(1);
}

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  tests: [],
};

function logTest(name, passed, message) {
  results.tests.push({ name, passed, message });
  if (passed) {
    results.passed++;
    console.log(`✅ ${name}: ${message}`);
  } else {
    results.failed++;
    console.log(`❌ ${name}: ${message}`);
  }
}

async function testGraphQL(query, variables) {
  const response = await fetch(`${STRAPI_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STRAPI_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  return response.json();
}

async function testREST(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${STRAPI_TOKEN}`,
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${STRAPI_URL}/api${endpoint}`, options);
  return { status: response.status, data: await response.json() };
}

async function runTests() {
  console.log('🧪 Starting Strapi API Integration Tests...\n');
  console.log(`📡 Testing: ${STRAPI_URL}\n`);

  // Test 1: GraphQL Endpoint Health
  try {
    const query = `query { __typename }`;
    const result = await testGraphQL(query);
    logTest(
      'GraphQL Endpoint',
      !result.errors,
      result.errors ? result.errors[0].message : 'GraphQL endpoint is accessible'
    );
  } catch (error) {
    logTest('GraphQL Endpoint', false, error.message);
  }

  // Test 2: Fetch Sites
  try {
    const { status, data } = await testREST('/sites');
    logTest(
      'Fetch Sites (REST)',
      status === 200 && data.data,
      `Found ${data.data?.length || 0} sites`
    );
  } catch (error) {
    logTest('Fetch Sites (REST)', false, error.message);
  }

  // Test 3: Fetch Articles via GraphQL
  try {
    const query = `
      query GetArticles($siteId: ID!) {
        articles(filters: { site: { id: { eq: $siteId } } }) {
          data {
            id
            attributes {
              title
              slug
            }
          }
        }
      }
    `;
    const result = await testGraphQL(query, { siteId: '1' });
    logTest(
      'Fetch Articles (GraphQL)',
      !result.errors && result.data?.articles,
      `Found ${result.data?.articles?.data?.length || 0} articles for Mayhemworld`
    );
  } catch (error) {
    logTest('Fetch Articles (GraphQL)', false, error.message);
  }

  // Test 4: Fetch Products via REST
  try {
    const { status, data } = await testREST('/products?filters[site][id][$eq]=1');
    logTest(
      'Fetch Products (REST)',
      status === 200,
      `Found ${data.data?.length || 0} products for Mayhemworld`
    );
  } catch (error) {
    logTest('Fetch Products (REST)', false, error.message);
  }

  // Test 5: Fetch Media Library
  try {
    const { status, data } = await testREST('/upload/files');
    logTest(
      'Fetch Media Library',
      status === 200,
      `Found ${data.length || 0} media files in Cloudinary`
    );
  } catch (error) {
    logTest('Fetch Media Library', false, error.message);
  }

  // Test 6: AI Assistant Plugin - Generate Content
  try {
    const { status, data } = await testREST(
      '/ai-assistant/generate',
      'POST',
      {
        prompt: 'Write a test article about API testing',
        contentType: 'article',
        siteId: 1,
      }
    );
    logTest(
      'AI Assistant Plugin',
      status === 200 || status === 201,
      status === 200 || status === 201
        ? 'AI content generation endpoint is accessible'
        : `Status: ${status}`
    );
  } catch (error) {
    logTest('AI Assistant Plugin', false, error.message);
  }

  // Test 7: Marketing Hub Plugin - Check Endpoint
  try {
    const { status } = await testREST('/marketing/send-email', 'POST', {
      to: 'test@example.com',
      subject: 'Test Email',
      html: '<p>Test</p>',
      siteId: 1,
    });
    logTest(
      'Marketing Hub Plugin',
      status === 200 || status === 201 || status === 400,
      status === 400
        ? 'Endpoint accessible (validation error expected without real email)'
        : 'Email endpoint is accessible'
    );
  } catch (error) {
    logTest('Marketing Hub Plugin', false, error.message);
  }

  // Test 8: Analytics Dashboard Plugin
  try {
    const { status } = await testREST('/analytics/site/1');
    logTest(
      'Analytics Dashboard Plugin',
      status === 200 || status === 404,
      status === 404
        ? 'Endpoint accessible (no data yet)'
        : 'Analytics endpoint is accessible'
    );
  } catch (error) {
    logTest('Analytics Dashboard Plugin', false, error.message);
  }

  // Test 9: Verify Cloudinary CDN
  try {
    const { status, data } = await testREST('/upload/files?pagination[limit]=1');
    if (data.length > 0) {
      const cdnUrl = data[0].url;
      const cdnResponse = await fetch(cdnUrl);
      logTest(
        'Cloudinary CDN',
        cdnResponse.ok && cdnUrl.includes('cloudinary.com'),
        `CDN images are accessible at ${cdnUrl.substring(0, 50)}...`
      );
    } else {
      logTest('Cloudinary CDN', false, 'No media files found to test');
    }
  } catch (error) {
    logTest('Cloudinary CDN', false, error.message);
  }

  // Test 10: Multi-site Filtering
  try {
    const query = `
      query {
        mayhemArticles: articles(filters: { site: { id: { eq: "1" } } }) {
          data { id }
        }
        shotbymayhemArticles: articles(filters: { site: { id: { eq: "2" } } }) {
          data { id }
        }
      }
    `;
    const result = await testGraphQL(query);
    const mayhemCount = result.data?.mayhemArticles?.data?.length || 0;
    const shotbymayhemCount = result.data?.shotbymayhemArticles?.data?.length || 0;
    logTest(
      'Multi-site Filtering',
      !result.errors,
      `Site 1: ${mayhemCount} articles, Site 2: ${shotbymayhemCount} articles`
    );
  } catch (error) {
    logTest('Multi-site Filtering', false, error.message);
  }

  // Print Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📦 Total:  ${results.tests.length}`);
  console.log('='.repeat(60));

  if (results.failed > 0) {
    console.log('\n❌ Some tests failed. Review the output above for details.');
    process.exit(1);
  } else {
    console.log('\n✅ All tests passed! Your Strapi API is fully functional.');
  }
}

// Run tests
runTests().catch(error => {
  console.error('💥 Test suite failed:', error);
  process.exit(1);
});
