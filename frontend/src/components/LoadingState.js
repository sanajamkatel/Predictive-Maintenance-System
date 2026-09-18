import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

function LoadingState({ message = 'Loading...' }) {
  const [showColdStartNotice, setShowColdStartNotice] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowColdStartNotice(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', mt: 10 }}>
      <CircularProgress size={60} thickness={4} sx={{ color: '#ec407a' }} />
      <Typography variant="h6" sx={{ mt: 2, color: '#c2185b' }}>
        {message}
      </Typography>
      {showColdStartNotice && (
        <Typography
          variant="body2"
          sx={{ mt: 1.5, color: '#c2185b', opacity: 0.8, maxWidth: 420, textAlign: 'center' }}
        >
          Our server is waking up from inactivity (free-tier hosting) — this can take up to a minute on the first request. Thanks for your patience!
        </Typography>
      )}
    </Box>
  );
}

export default LoadingState;
