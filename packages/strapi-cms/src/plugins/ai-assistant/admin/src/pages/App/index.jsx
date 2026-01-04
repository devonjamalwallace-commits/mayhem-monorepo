import React from 'react';
import { Box, Typography } from '@strapi/design-system';

const AIAssistant = () => {
  return (
    <Box padding={8}>
      <Typography variant="alpha">AI Assistant</Typography>
      <Box paddingTop={4}>
        <Typography>
          AI-powered content generation and automation will appear here.
        </Typography>
      </Box>
    </Box>
  );
};

export default AIAssistant;
