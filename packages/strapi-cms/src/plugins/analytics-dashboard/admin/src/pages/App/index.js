import React from 'react';
import { Box, Typography } from '@strapi/design-system';

const App = () => {
  return (
    <Box padding={8}>
      <Typography variant="alpha">Analytics Dashboard</Typography>
      <Box paddingTop={4}>
        <Typography>
          Analytics and metrics for all your sites will appear here.
        </Typography>
      </Box>
    </Box>
  );
};

export default App;
