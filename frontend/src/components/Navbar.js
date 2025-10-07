import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Chip, Button, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import BuildIcon from '@mui/icons-material/Build';
import LogoutIcon from '@mui/icons-material/Logout';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="fixed" sx={{ 
      zIndex: (theme) => theme.zIndex.drawer + 1,
      background: 'linear-gradient(135deg, #ec407a 0%, #c2185b 100%)',
      boxShadow: '0 4px 20px rgba(236, 64, 122, 0.3)'
    }}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <BuildIcon sx={{ mr: 2, fontSize: 32 }} />
        </motion.div>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Predictive Maintenance System
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user && (
            <>
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  fontSize: '0.875rem'
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                {user.name}
              </Typography>
              <Chip 
                label={user.role.toUpperCase()} 
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 'bold'
                }} 
              />
            </>
          )}
          <Chip 
            label="AI-Powered" 
            size="small" 
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 'bold'
            }} 
          />
          <Chip 
            label="Live" 
            size="small" 
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.3)',
              color: 'white',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.7 }
              }
            }}
          />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
              variant="outlined"
              size="small"
            >
              Logout
            </Button>
          </motion.div>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

