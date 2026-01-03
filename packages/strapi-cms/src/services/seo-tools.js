/**
 * SEO Tools Service
 * Auto-generate sitemaps, meta tags, structured data, social preview cards
 */

const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');

module.exports = {
  /**
   * Generate sitemap for a site
   */
  async generateSitemap(site_id) {
    const site = await strapi.db.query('api::site.site').findOne({
      where: { id: site_id },
    });

    if (!site) {
      throw new Error('Site not found');
    }

    const links = [];
    const baseUrl = site.domain.startsWith('http') ? site.domain : `https://${site.domain}`;

    // Homepage
    links.push({
      url: '/',
      changefreq: 'daily',
      priority: 1.0,
    });

    // Articles/Blog
    const articles = await strapi.db.query('api::article.article').findMany({
      where: { site: site_id, published: true },
      orderBy: { publishedAt: 'desc' },
    });

    articles.forEach(article => {
      links.push({
        url: `/blog/${article.slug}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: article.updatedAt,
      });
    });

    // Case Studies
    const caseStudies = await strapi.db.query('api::case-study.case-study').findMany({
      where: { site: site_id },
    });

    caseStudies.forEach(study => {
      links.push({
        url: `/case-studies/${study.slug}`,
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: study.updatedAt,
      });
    });

    // Goddesses (for goddesses-of-atl)
    if (site.site_uid === 'goddesses-of-atl') {
      const goddesses = await strapi.db.query('api::goddess.goddess').findMany({
        where: { site: site_id },
      });

      goddesses.forEach(goddess => {
        links.push({
          url: `/goddesses/${goddess.slug}`,
          changefreq: 'weekly',
          priority: 0.9,
          lastmod: goddess.updatedAt,
        });
      });
    }

    // Generate XML sitemap
    const stream = new SitemapStream({ hostname: baseUrl });
    const xml = await streamToPromise(Readable.from(links).pipe(stream)).then(data => data.toString());

    return {
      sitemap: xml,
      urls: links.length,
      baseUrl,
    };
  },

  /**
   * Generate meta tags for content
   */
  async generateMetaTags({ contentType, content, site }) {
    const baseUrl = site.domain.startsWith('http') ? site.domain : `https://${site.domain}`;

    let meta = {
      title: content.title || content.name,
      description: content.excerpt || content.description || content.bio?.substring(0, 160),
      keywords: content.keywords?.join(', ') || content.tags?.join(', ') || '',
      canonical: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      ogUrl: '',
      twitterCard: 'summary_large_image',
      twitterTitle: '',
      twitterDescription: '',
      twitterImage: '',
    };

    // Set URLs based on content type
    switch (contentType) {
      case 'article':
        meta.canonical = `${baseUrl}/blog/${content.slug}`;
        meta.ogImage = content.coverImage;
        break;
      case 'case-study':
        meta.canonical = `${baseUrl}/case-studies/${content.slug}`;
        meta.ogImage = content.beforeImage || content.afterImage;
        break;
      case 'goddess':
        meta.canonical = `${baseUrl}/goddesses/${content.slug}`;
        meta.ogImage = content.image;
        break;
      case 'service':
        meta.canonical = `${baseUrl}/services`;
        break;
    }

    meta.ogTitle = meta.title;
    meta.ogDescription = meta.description;
    meta.ogUrl = meta.canonical;
    meta.twitterTitle = meta.title;
    meta.twitterDescription = meta.description;
    meta.twitterImage = meta.ogImage;

    return meta;
  },

  /**
   * Generate structured data (Schema.org JSON-LD)
   */
  async generateStructuredData({ contentType, content, site }) {
    const baseUrl = site.domain.startsWith('http') ? site.domain : `https://${site.domain}`;

    let schema = {
      '@context': 'https://schema.org',
    };

    switch (contentType) {
      case 'article':
        schema['@type'] = 'BlogPosting';
        schema.headline = content.title;
        schema.description = content.excerpt;
        schema.image = content.coverImage;
        schema.datePublished = content.publishedAt;
        schema.dateModified = content.updatedAt;
        schema.author = {
          '@type': 'Person',
          name: content.author || site.name,
        };
        schema.publisher = {
          '@type': 'Organization',
          name: site.name,
          logo: {
            '@type': 'ImageObject',
            url: site.logo,
          },
        };
        schema.mainEntityOfPage = {
          '@type': 'WebPage',
          '@id': `${baseUrl}/blog/${content.slug}`,
        };
        break;

      case 'case-study':
        schema['@type'] = 'Article';
        schema.headline = `${content.clientName} - ${content.projectType}`;
        schema.description = content.challenge;
        schema.image = content.beforeImage || content.afterImage;
        schema.datePublished = content.createdAt;
        schema.author = {
          '@type': 'Organization',
          name: site.name,
        };
        break;

      case 'goddess':
        schema['@type'] = 'Person';
        schema.name = content.name;
        schema.jobTitle = content.title;
        schema.description = content.bio;
        schema.image = content.image;
        schema.height = content.height;
        schema.address = {
          '@type': 'PostalAddress',
          addressLocality: content.location,
        };
        if (content.instagram) {
          schema.sameAs = [`https://instagram.com/${content.instagram.replace('@', '')}`];
        }
        break;

      case 'service':
        schema['@type'] = 'Service';
        schema.name = content.name;
        schema.description = content.description;
        schema.provider = {
          '@type': 'Organization',
          name: site.name,
        };
        schema.offers = {
          '@type': 'Offer',
          price: content.price,
          priceCurrency: content.currency || 'USD',
        };
        break;

      case 'organization':
        schema['@type'] = 'Organization';
        schema.name = site.name;
        schema.url = baseUrl;
        schema.logo = site.logo;
        schema.description = site.description;
        schema.contactPoint = {
          '@type': 'ContactPoint',
          contactType: 'Customer Service',
          email: site.contact_email,
        };
        break;
    }

    return schema;
  },

  /**
   * Generate social preview cards (Open Graph + Twitter)
   */
  async generateSocialPreview({ contentType, content, site }) {
    const metaTags = await this.generateMetaTags({ contentType, content, site });

    return {
      openGraph: {
        'og:title': metaTags.ogTitle,
        'og:description': metaTags.ogDescription,
        'og:image': metaTags.ogImage,
        'og:url': metaTags.ogUrl,
        'og:type': contentType === 'article' ? 'article' : 'website',
        'og:site_name': site.name,
      },
      twitter: {
        'twitter:card': metaTags.twitterCard,
        'twitter:title': metaTags.twitterTitle,
        'twitter:description': metaTags.twitterDescription,
        'twitter:image': metaTags.twitterImage,
      },
    };
  },

  /**
   * Auto-generate SEO for content on create/update
   */
  async autoGenerateSEO({ contentType, contentId }) {
    const content = await strapi.documents(`api::${contentType}.${contentType}`).findOne({
      documentId: contentId,
      populate: ['site'],
    });

    if (!content || !content.site) {
      return null;
    }

    const metaTags = await this.generateMetaTags({
      contentType,
      content,
      site: content.site,
    });

    const structuredData = await this.generateStructuredData({
      contentType,
      content,
      site: content.site,
    });

    const socialPreview = await this.generateSocialPreview({
      contentType,
      content,
      site: content.site,
    });

    // Store SEO data
    const seoData = {
      ...metaTags,
      structuredData,
      socialPreview,
    };

    // Update content with SEO data
    await strapi.documents(`api::${contentType}.${contentType}`).update({
      documentId: contentId,
      data: {
        seo: seoData,
      },
    });

    return seoData;
  },

  /**
   * Validate SEO quality
   */
  validateSEO(metaTags) {
    const issues = [];
    const warnings = [];

    // Title validation
    if (!metaTags.title) {
      issues.push('Missing title tag');
    } else if (metaTags.title.length < 30) {
      warnings.push('Title is too short (< 30 characters)');
    } else if (metaTags.title.length > 60) {
      warnings.push('Title is too long (> 60 characters)');
    }

    // Description validation
    if (!metaTags.description) {
      issues.push('Missing meta description');
    } else if (metaTags.description.length < 120) {
      warnings.push('Description is too short (< 120 characters)');
    } else if (metaTags.description.length > 160) {
      warnings.push('Description is too long (> 160 characters)');
    }

    // Image validation
    if (!metaTags.ogImage) {
      warnings.push('Missing Open Graph image');
    }

    return {
      valid: issues.length === 0,
      issues,
      warnings,
      score: Math.max(0, 100 - (issues.length * 25) - (warnings.length * 10)),
    };
  },

  /**
   * Generate robots.txt
   */
  async generateRobotsTxt(site_id) {
    const site = await strapi.db.query('api::site.site').findOne({
      where: { id: site_id },
    });

    const baseUrl = site.domain.startsWith('http') ? site.domain : `https://${site.domain}`;

    const robotsTxt = `# Robots.txt for ${site.name}
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /uploads/

Sitemap: ${baseUrl}/sitemap.xml
`;

    return robotsTxt;
  },
};
