import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

// Pages
import Dashboard from './pages/Dashboard';
import EngineMonitor from './pages/EngineMonitor';
import FleetOverview from './pages/FleetOverview';
import ROICalculator from './pages/ROICalculator';
import Sources from './pages/Sources';
import Login from './pages/Login';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import FloatingElements from './components/FloatingElements';
import ProtectedRoute from './components/ProtectedRoute';

// Context
import { AuthProvider } from './contexts/AuthContext';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ec407a',
      light: '#f48fb1',
      dark: '#c2185b',
    },
    secondary: {
      main: '#f06292',
    },
    success: {
      main: '#66bb6a',
    },
    warning: {
      main: '#ffa726',
    },
    error: {
      main: '#ef5350',
    },
    background: {
      default: '#fce4ec',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <FloatingElements />
      <Box sx={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <Navbar toggleSidebar={toggleSidebar} />
        <Sidebar open={sidebarOpen} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            ml: sidebarOpen ? '240px' : 0,
            transition: 'all 0.3s',
            pt: 10,
            pb: 8, // Increased bottom padding to account for footer
            pl: 1,
            pr: 30,
          }}
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requiredRole="viewer">
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/monitor/:engineId?" 
              element={
                <ProtectedRoute requiredRole="operator">
                  <EngineMonitor />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/fleet" 
              element={
                <ProtectedRoute requiredRole="viewer">
                  <FleetOverview />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/roi" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <ROICalculator />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/sources" 
              element={
                <ProtectedRoute requiredRole="viewer">
                  <Sources />
                </ProtectedRoute>
              } 
            />
          </Routes>
          
          {/* Footer - Only show on authenticated pages */}
          {location.pathname !== '/login' && (
            <Box
              sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                py: 2,
                px: 4,
                bgcolor: '#fce4ec',
                borderTop: '1px solid rgba(236, 64, 122, 0.2)',
                zIndex: 1000,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {/* Left - Copyright */}
              <Typography
                variant="caption"
                sx={{
                  color: '#c2185b',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }}
              >
                © 2025 SanaCodes. All rights reserved.
              </Typography>

              {/* Center - Social Media Icons */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box
                  component="a"
                  href="https://github.com/sanajamkatel/Predictive-Maintenance-System"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textDecoration: 'none' }}
                >
                  <GitHubIcon 
                    sx={{ 
                      fontSize: 20, 
                      color: '#c2185b',
                      cursor: 'pointer',
                      '&:hover': { color: '#ec407a' }
                    }} 
                  />
                </Box>
                <Box
                  component="a"
                  href="https://www.linkedin.com/in/sadhanajamkatel"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textDecoration: 'none' }}
                >
                  <LinkedInIcon 
                    sx={{ 
                      fontSize: 20, 
                      color: '#c2185b',
                      cursor: 'pointer',
                      '&:hover': { color: '#ec407a' }
                    }} 
                  />
                </Box>
              </Box>

              {/* Right - Made with love */}
              <Typography
                variant="caption"
                sx={{
                  color: '#c2185b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }}
              >
                Made with <FavoriteIcon sx={{ fontSize: 12, color: '#ec407a' }} /> by SanaCodes
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

