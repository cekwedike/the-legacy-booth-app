import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography
        variant="h6"
        sx={{
          mt: 3,
          color: 'text.secondary',
          fontWeight: 500,
        }}
      >
        {message}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          mt: 1,
          color: 'text.secondary',
          textAlign: 'center',
          maxWidth: 300,
        }}
      >
        The Legacy Booth is preparing your experience...
      </Typography>
    </Box>
  );
};

export default LoadingScreen; 