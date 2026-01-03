'use strict';

/**
 * Notion Integration Service
 * Sync content between Strapi and Notion for documentation and collaboration
 */

const { Client } = require('@notionhq/client');

let notionClient = null;

function getClient() {
  if (!notionClient) {
    const apiKey = process.env.NOTION_API_KEY;

    if (!apiKey) {
      throw new Error('NOTION_API_KEY environment variable is required');
    }

    notionClient = new Client({ auth: apiKey });
  }
  return notionClient;
}

module.exports = {
  /**
   * Search across all Notion pages
   */
  async search(query, options = {}) {
    const notion = getClient();

    const response = await notion.search({
      query,
      filter: options.filter,
      sort: options.sort || {
        direction: 'descending',
        timestamp: 'last_edited_time',
      },
      page_size: options.pageSize || 10,
    });

    return response.results;
  },

  /**
   * Get a database
   */
  async getDatabase(databaseId) {
    const notion = getClient();
    return notion.databases.retrieve({ database_id: databaseId });
  },

  /**
   * Query a database
   */
  async queryDatabase(databaseId, options = {}) {
    const notion = getClient();

    const response = await notion.databases.query({
      database_id: databaseId,
      filter: options.filter,
      sorts: options.sorts,
      page_size: options.pageSize || 100,
      start_cursor: options.startCursor,
    });

    return {
      results: response.results,
      hasMore: response.has_more,
      nextCursor: response.next_cursor,
    };
  },

  /**
   * Get a page with content
   */
  async getPage(pageId) {
    const notion = getClient();
    const page = await notion.pages.retrieve({ page_id: pageId });
    return page;
  },

  /**
   * Get page content blocks
   */
  async getPageBlocks(pageId) {
    const notion = getClient();

    const blocks = [];
    let cursor;

    do {
      const response = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
        page_size: 100,
      });

      blocks.push(...response.results);
      cursor = response.has_more ? response.next_cursor : null;
    } while (cursor);

    return blocks;
  },

  /**
   * Create a page in a database
   */
  async createPage(databaseId, properties, content = []) {
    const notion = getClient();

    const page = await notion.pages.create({
      parent: { database_id: databaseId },
      properties,
      children: content,
    });

    return page;
  },

  /**
   * Update a page
   */
  async updatePage(pageId, properties) {
    const notion = getClient();

    return notion.pages.update({
      page_id: pageId,
      properties,
    });
  },

  /**
   * Append blocks to a page
   */
  async appendBlocks(pageId, blocks) {
    const notion = getClient();

    return notion.blocks.children.append({
      block_id: pageId,
      children: blocks,
    });
  },

  // ============================================
  // Strapi-Specific Sync Methods
  // ============================================

  /**
   * Sync Strapi blog to Notion
   */
  async syncBlogToNotion(blog, databaseId) {
    const notion = getClient();

    // Check if page already exists (by Strapi ID in a property)
    const existing = await this.queryDatabase(databaseId, {
      filter: {
        property: 'Strapi ID',
        number: { equals: blog.id },
      },
    });

    const properties = {
      Name: { title: [{ text: { content: blog.title } }] },
      'Strapi ID': { number: blog.id },
      Slug: { rich_text: [{ text: { content: blog.slug } }] },
      Status: { select: { name: blog.publishedAt ? 'Published' : 'Draft' } },
      'Published At': blog.publishedAt
        ? { date: { start: blog.publishedAt } }
        : { date: null },
      Excerpt: blog.excerpt
        ? { rich_text: [{ text: { content: blog.excerpt.substring(0, 2000) } }] }
        : { rich_text: [] },
    };

    if (existing.results.length > 0) {
      // Update existing page
      return this.updatePage(existing.results[0].id, properties);
    }

    // Create new page with content
    const contentBlocks = this.htmlToNotionBlocks(blog.content);
    return this.createPage(databaseId, properties, contentBlocks);
  },

  /**
   * Import Notion page as Strapi blog
   */
  async importNotionPageAsBlog(pageId, siteId) {
    const page = await this.getPage(pageId);
    const blocks = await this.getPageBlocks(pageId);

    // Extract title
    const titleProperty = Object.values(page.properties).find(
      (p) => p.type === 'title'
    );
    const title = titleProperty?.title?.[0]?.plain_text || 'Untitled';

    // Convert blocks to HTML
    const content = this.notionBlocksToHtml(blocks);

    // Create blog in Strapi
    return strapi.db.query('api::blog.blog').create({
      data: {
        title,
        content,
        site: siteId,
        notion_page_id: pageId,
        status: 'draft',
      },
    });
  },

  /**
   * Convert HTML to Notion blocks (basic)
   */
  htmlToNotionBlocks(html) {
    if (!html) return [];

    // Simple HTML to Notion blocks conversion
    const blocks = [];
    const paragraphs = html
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '###HEADING1###$1###ENDHEADING###')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '###HEADING2###$1###ENDHEADING###')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '###HEADING3###$1###ENDHEADING###')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n')
      .replace(/<[^>]+>/g, '')
      .split('\n')
      .filter((p) => p.trim());

    for (const para of paragraphs) {
      if (para.includes('###HEADING1###')) {
        const text = para.replace(/###HEADING1###|###ENDHEADING###/g, '');
        blocks.push({
          type: 'heading_1',
          heading_1: { rich_text: [{ type: 'text', text: { content: text } }] },
        });
      } else if (para.includes('###HEADING2###')) {
        const text = para.replace(/###HEADING2###|###ENDHEADING###/g, '');
        blocks.push({
          type: 'heading_2',
          heading_2: { rich_text: [{ type: 'text', text: { content: text } }] },
        });
      } else if (para.includes('###HEADING3###')) {
        const text = para.replace(/###HEADING3###|###ENDHEADING###/g, '');
        blocks.push({
          type: 'heading_3',
          heading_3: { rich_text: [{ type: 'text', text: { content: text } }] },
        });
      } else if (para.trim()) {
        blocks.push({
          type: 'paragraph',
          paragraph: { rich_text: [{ type: 'text', text: { content: para.trim() } }] },
        });
      }
    }

    return blocks;
  },

  /**
   * Convert Notion blocks to HTML (basic)
   */
  notionBlocksToHtml(blocks) {
    let html = '';

    for (const block of blocks) {
      const richTextToHtml = (richText) =>
        richText?.map((t) => t.plain_text).join('') || '';

      switch (block.type) {
        case 'paragraph':
          html += `<p>${richTextToHtml(block.paragraph?.rich_text)}</p>`;
          break;
        case 'heading_1':
          html += `<h1>${richTextToHtml(block.heading_1?.rich_text)}</h1>`;
          break;
        case 'heading_2':
          html += `<h2>${richTextToHtml(block.heading_2?.rich_text)}</h2>`;
          break;
        case 'heading_3':
          html += `<h3>${richTextToHtml(block.heading_3?.rich_text)}</h3>`;
          break;
        case 'bulleted_list_item':
          html += `<li>${richTextToHtml(block.bulleted_list_item?.rich_text)}</li>`;
          break;
        case 'numbered_list_item':
          html += `<li>${richTextToHtml(block.numbered_list_item?.rich_text)}</li>`;
          break;
        case 'code':
          html += `<pre><code>${richTextToHtml(block.code?.rich_text)}</code></pre>`;
          break;
        case 'quote':
          html += `<blockquote>${richTextToHtml(block.quote?.rich_text)}</blockquote>`;
          break;
        case 'divider':
          html += '<hr />';
          break;
        default:
          // Skip unsupported block types
          break;
      }
    }

    return html;
  },
};
