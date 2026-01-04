import React from 'react';
import { Box, Typography } from '@strapi/design-system';

const MarketingHub = () => {
  return (
    <Box padding={8}>
      <Typography variant="alpha">Marketing Hub</Typography>
      <Box paddingTop={4}>
        <Typography>
          Email campaigns, SMS, and social media management will appear here.
        </Typography>
      </Box>
    </Box>
  );
};

export default MarketingHub;
