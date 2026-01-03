'use strict';

/**
 * Google Gemini AI Integration Service
 * Provides AI capabilities for content generation, SEO, and automation
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
let model = null;

function getModel() {
  if (!model) {
    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp';

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }

    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: modelName });
  }
  return model;
}

module.exports = {
  /**
   * Generate text from a prompt
   */
  async generateText(prompt, options = {}) {
    const ai = getModel();

    const generationConfig = {
      temperature: options.temperature ?? 0.7,
      topP: options.topP ?? 0.95,
      topK: options.topK ?? 64,
      maxOutputTokens: options.maxTokens ?? 2048,
    };

    const result = await ai.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    });

    return result.response.text();
  },

  /**
   * Generate SEO metadata for content
   */
  async generateSEO({ title, content, contentType = 'blog', siteContext = '' }) {
    const prompt = `You are an SEO expert. Generate optimized SEO metadata for the following ${contentType}.

Title: ${title}
Content: ${content.substring(0, 2000)}
${siteContext ? `Site Context: ${siteContext}` : ''}

Provide the response in JSON format with these fields:
- meta_title (max 60 chars, include primary keyword)
- meta_description (max 155 chars, compelling and keyword-rich)
- meta_keywords (comma-separated, 5-8 relevant keywords)
- og_title (optimized for social sharing)
- og_description (engaging for social media)

Respond ONLY with valid JSON, no additional text.`;

    const text = await this.generateText(prompt, { temperature: 0.3 });

    try {
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No JSON found in response');
    } catch (error) {
      strapi.log.error('Failed to parse Gemini SEO response:', error);
      return null;
    }
  },

  /**
   * Generate blog post excerpt
   */
  async generateExcerpt(content, maxLength = 200) {
    const prompt = `Create a compelling excerpt for this blog post in exactly one paragraph, under ${maxLength} characters. Make it engaging and capture the main point.

Content:
${content.substring(0, 3000)}

Respond with ONLY the excerpt text, nothing else.`;

    const excerpt = await this.generateText(prompt, { temperature: 0.5 });
    return excerpt.trim().substring(0, maxLength);
  },

  /**
   * Generate product description from basic info
   */
  async generateProductDescription({ name, category, features = [], targetAudience = '' }) {
    const prompt = `Write a compelling product description for an e-commerce listing.

Product Name: ${name}
Category: ${category}
Features: ${features.join(', ')}
${targetAudience ? `Target Audience: ${targetAudience}` : ''}

Requirements:
- Start with a hook that grabs attention
- Highlight key benefits, not just features
- Use persuasive language
- Keep it under 300 words
- Include a call to action

Respond with ONLY the product description text.`;

    return this.generateText(prompt, { temperature: 0.7 });
  },

  /**
   * Generate content suggestions/ideas
   */
  async generateContentIdeas({ topic, contentType, count = 5, siteContext = '' }) {
    const prompt = `Generate ${count} creative ${contentType} ideas about "${topic}".

${siteContext ? `Context about the site/brand: ${siteContext}` : ''}

For each idea provide:
- A catchy title
- A brief one-line description
- 3 suggested keywords

Format as JSON array with objects containing: title, description, keywords
Respond ONLY with valid JSON.`;

    const text = await this.generateText(prompt, { temperature: 0.8 });

    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No JSON array found in response');
    } catch (error) {
      strapi.log.error('Failed to parse Gemini content ideas response:', error);
      return [];
    }
  },

  /**
   * Improve/rewrite existing content
   */
  async improveContent(content, style = 'professional') {
    const styleGuide = {
      professional: 'formal, clear, and authoritative',
      casual: 'friendly, conversational, and approachable',
      creative: 'imaginative, engaging, and unique',
      technical: 'precise, detailed, and informative',
    };

    const prompt = `Rewrite the following content to be more ${styleGuide[style] || styleGuide.professional}.

Original content:
${content}

Requirements:
- Maintain the core message and key points
- Improve clarity and flow
- Fix any grammar or spelling issues
- Make it more engaging

Respond with ONLY the improved content.`;

    return this.generateText(prompt, { temperature: 0.6 });
  },

  /**
   * Generate alt text for images
   */
  async generateImageAltText(imageDescription, context = '') {
    const prompt = `Generate SEO-friendly alt text for an image.

Image appears to show: ${imageDescription}
${context ? `Context: ${context}` : ''}

Requirements:
- Be descriptive but concise (max 125 characters)
- Include relevant keywords naturally
- Don't start with "Image of" or "Picture of"

Respond with ONLY the alt text.`;

    const altText = await this.generateText(prompt, { temperature: 0.3 });
    return altText.trim().substring(0, 125);
  },

  /**
   * Analyze content sentiment and suggest improvements
   */
  async analyzeContent(content) {
    const prompt = `Analyze the following content and provide feedback.

Content:
${content.substring(0, 3000)}

Provide analysis in JSON format with:
- sentiment: (positive/neutral/negative)
- readability_score: (1-10)
- tone: (array of detected tones like "professional", "friendly", etc.)
- suggestions: (array of improvement suggestions)
- keywords: (extracted main keywords/topics)

Respond ONLY with valid JSON.`;

    const text = await this.generateText(prompt, { temperature: 0.3 });

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No JSON found in response');
    } catch (error) {
      strapi.log.error('Failed to parse Gemini analysis response:', error);
      return null;
    }
  },

  /**
   * Translate content
   */
  async translateContent(content, targetLanguage) {
    const prompt = `Translate the following content to ${targetLanguage}.
Maintain the original meaning, tone, and formatting.

Content:
${content}

Respond with ONLY the translated text.`;

    return this.generateText(prompt, { temperature: 0.3 });
  },
};
