import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProtectedRoute = ({ children, requiredRole = 'viewer' }) => {
  const { user, loading, hasPermission } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 50%, #ec407a 100%)',
        }}
      >
        <CircularProgress 
          sx={{ 
            color: '#ec407a',
            mb: 2 
          }} 
        />
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#c2185b',
            fontWeight: 'bold'
          }}
        >
          Loading...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasPermission(requiredRole)) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          p: 3,
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#c2185b',
            fontWeight: 'bold',
            mb: 2
          }}
        >
          Access Denied
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#ad1457',
            textAlign: 'center'
          }}
        >
          You don't have permission to access this page.
          <br />
          Required role: {requiredRole}
          <br />
          Your role: {user.role}
        </Typography>
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute;
