'use strict';

/**
 * Blog lifecycle hooks
 * Auto-calculates read_time based on content
 */

// Average reading speed in words per minute
const WORDS_PER_MINUTE = 200;

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function calculateReadTime(content) {
  if (!content) return 1;

  const plainText = stripHtml(content);
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordCount / WORDS_PER_MINUTE);

  // Minimum 1 minute, maximum 60 minutes
  return Math.max(1, Math.min(60, readTime));
}

function generateExcerpt(content, maxLength = 200) {
  if (!content) return '';

  const plainText = stripHtml(content);
  if (plainText.length <= maxLength) return plainText;

  // Cut at word boundary
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
}

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Auto-calculate read_time if not set
    if (data.content && !data.read_time) {
      data.read_time = calculateReadTime(data.content);
    }

    // Auto-generate excerpt if not set
    if (data.content && !data.excerpt) {
      data.excerpt = generateExcerpt(data.content);
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    // Recalculate read_time if content changes
    if (data.content) {
      data.read_time = calculateReadTime(data.content);
    }

    // Update excerpt if content changes and excerpt is auto-generated
    if (data.content && !data.excerpt) {
      data.excerpt = generateExcerpt(data.content);
    }
  },
};
