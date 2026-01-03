import React, { useState } from 'react';
import { Box, Typography, Button, Textarea, Select, Option, Grid, GridItem } from '@strapi/design-system';
import { Sparkle, Magic } from '@strapi/icons';
import { request } from '@strapi/helper-plugin';

const AIAssistant = () => {
  const [prompt, setPrompt] = useState('');
  const [contentType, setContentType] = useState('article');
  const [site, setSite] = useState('mayhemworld');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const contentTypes = [
    { value: 'article', label: 'Blog Article' },
    { value: 'case-study', label: 'Case Study' },
    { value: 'service', label: 'Service Description' },
    { value: 'seo', label: 'SEO Meta Tags' },
    { value: 'social', label: 'Social Media Post' },
  ];

  const sites = [
    { value: 'mayhemworld', label: 'Mayhemworld' },
    { value: 'shotbymayhem', label: 'ShotByMayhem' },
    { value: 'goddesses-of-atl', label: 'Goddesses of ATL' },
    { value: 'nexus-ai', label: 'Nexus AI' },
  ];

  const generateContent = async () => {
    setLoading(true);
    try {
      const response = await request('/integration/gemini-generate', {
        method: 'POST',
        body: {
          prompt: `Create ${contentType} content for ${site}: ${prompt}`,
          options: { temperature: 0.7 }
        },
      });
      setResult(response.text);
    } catch (error) {
      console.error('AI generation error:', error);
      setResult('Error generating content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateSEO = async () => {
    setLoading(true);
    try {
      const response = await request('/integration/gemini-seo', {
        method: 'POST',
        body: {
          title: prompt,
          content: 'Auto-generated content',
          contentType,
          siteContext: site,
        },
      });
      setResult(JSON.stringify(response.seo, null, 2));
    } catch (error) {
      console.error('SEO generation error:', error);
      setResult('Error generating SEO. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box padding={8}>
      <Box marginBottom={4}>
        <Typography variant="alpha">AI Assistant</Typography>
        <Typography variant="omega" textColor="neutral600">
          Generate content, SEO tags, and more using AI
        </Typography>
      </Box>

      <Grid gap={4}>
        <GridItem col={6}>
          <Select
            label="Site"
            value={site}
            onChange={setSite}
          >
            {sites.map(s => (
              <Option key={s.value} value={s.value}>{s.label}</Option>
            ))}
          </Select>
        </GridItem>

        <GridItem col={6}>
          <Select
            label="Content Type"
            value={contentType}
            onChange={setContentType}
          >
            {contentTypes.map(ct => (
              <Option key={ct.value} value={ct.value}>{ct.label}</Option>
            ))}
          </Select>
        </GridItem>

        <GridItem col={12}>
          <Textarea
            label="What do you want to create?"
            placeholder="E.g., Write a blog article about Atlanta nightlife photography tips..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
          />
        </GridItem>

        <GridItem col={12}>
          <Box>
            <Button
              onClick={generateContent}
              startIcon={<Sparkle />}
              loading={loading}
              disabled={!prompt}
              marginRight={2}
            >
              Generate Content
            </Button>
            <Button
              onClick={generateSEO}
              startIcon={<Magic />}
              loading={loading}
              disabled={!prompt}
              variant="secondary"
            >
              Generate SEO
            </Button>
          </Box>
        </GridItem>

        {result && (
          <GridItem col={12}>
            <Box
              padding={4}
              background="neutral100"
              borderRadius="4px"
              marginTop={4}
            >
              <Typography variant="delta" marginBottom={2}>Generated Result:</Typography>
              <Typography variant="omega" style={{ whiteSpace: 'pre-wrap' }}>
                {result}
              </Typography>
            </Box>
          </GridItem>
        )}
      </Grid>
    </Box>
  );
};

export default AIAssistant;
