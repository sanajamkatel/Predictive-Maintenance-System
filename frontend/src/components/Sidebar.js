import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Toolbar, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DatasetIcon from '@mui/icons-material/Dataset';
import { motion } from 'framer-motion';

const drawerWidth = 240;

function Sidebar({ open }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Engine Monitor', icon: <MonitorHeartIcon />, path: '/monitor' },
    { text: 'Fleet Overview', icon: <DirectionsBoatIcon />, path: '/fleet' },
    { text: 'ROI Calculator', icon: <AttachMoneyIcon />, path: '/roi' },
    { text: 'Sources', icon: <DatasetIcon />, path: '/sources' },
  ];

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #fce4ec 0%, #f8bbd0 100%)',
          borderRight: '2px solid #f48fb1',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ mt: 2 }}>
        <List>
          {menuItems.map((item, index) => (
            <motion.div
              key={item.text}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  selected={location.pathname.startsWith(item.path)}
                  onClick={() => navigate(item.path)}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    '&.Mui-selected': {
                      bgcolor: '#ec407a',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#c2185b',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      },
                    },
                    '&:hover': {
                      bgcolor: '#f8bbd0',
                      transform: 'translateX(5px)',
                      transition: 'all 0.3s ease',
                    },
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: location.pathname.startsWith(item.path) ? 'white' : '#c2185b' 
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: location.pathname.startsWith(item.path) ? 'bold' : 'normal'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </motion.div>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;

