import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, Alert, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip
} from '@mui/material';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getEngines, getFleetStats } from '../services/api';

const COLORS = ['#10B981', '#EF4444', '#F59E0B']; // Green, Red, Orange

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

function FleetOverview() {
  const [engines, setEngines] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [engineData, statsData] = await Promise.all([
        getEngines(),
        getFleetStats()
      ]);
      
      setEngines(engineData.engines || []);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError('Failed to load fleet data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 10 }}>
        <CircularProgress size={60} thickness={4} sx={{ color: '#ec407a', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#c2185b' }}>
          Loading fleet data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  // Empty state when no engines are at risk
  if (stats && stats.at_risk_engines === 0) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <motion.div
            variants={itemVariants}
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
          >
            <CelebrationIcon sx={{ fontSize: 80, color: '#10B981', mb: 2 }} />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#10B981', mb: 2 }}>
              All Systems Normal!
            </Typography>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
              All {stats.total_engines} engines operating within acceptable parameters.
              No maintenance alerts or critical issues detected.
            </Typography>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card elevation={3} sx={{ 
              maxWidth: 400, 
              mx: 'auto', 
              borderRadius: 3, 
              border: '2px solid #10B981',
              bgcolor: '#f0fdf4'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: '#10B981', fontWeight: 'bold', mb: 2 }}>
                  Fleet Health Summary
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Healthy Engines:</Typography>
                  <Chip label={`${stats.healthy_engines}`} color="success" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">At Risk Engines:</Typography>
                  <Chip label={`${stats.at_risk_engines}`} color="success" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Health Percentage:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#10B981' }}>
                    {stats.health_percentage}%
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Last check: {new Date().toLocaleTimeString()}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </motion.div>
    );
  }

  const pieData = [
    { name: 'Healthy', value: stats?.healthy_engines || 0 },
    { name: 'At Risk', value: stats?.at_risk_engines || 0 },
  ];

  const barData = [
    { name: 'Temp', value: stats?.average_metrics.temperature || 0, target: 75 },
    { name: 'Pressure', value: stats?.average_metrics.pressure || 0, target: 40 },
    { name: 'Vibration', value: stats?.average_metrics.vibration || 0, target: 2 },
    { name: 'Oil Quality', value: stats?.average_metrics.oil_quality || 0, target: 90 },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box>
        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
            <DirectionsBoatIcon sx={{ fontSize: 40, color: '#ec407a' }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#c2185b' }}>
              Fleet Overview
            </Typography>
          </Box>
        </motion.div>

        {/* Status Distribution */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Grid container spacing={3} sx={{ maxWidth: '1000px' }}>
            <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Card elevation={3} sx={{ borderRadius: 3, border: '2px solid #f8bbd0' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Fleet Health Distribution
                  </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.div variants={itemVariants}>
            <Card elevation={3} sx={{ borderRadius: 3, border: '2px solid #f8bbd0' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Average Sensor Readings
                </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#ec407a" name="Current" />
                  <Bar dataKey="target" fill="#66bb6a" name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>

      {/* Engine List */}
      <motion.div variants={itemVariants}>
        <Card elevation={3} sx={{ borderRadius: 3, border: '2px solid #f8bbd0' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
              All Engines
            </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell><strong>Engine</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell align="right"><strong>Temperature</strong></TableCell>
                  <TableCell align="right"><strong>Pressure</strong></TableCell>
                  <TableCell align="right"><strong>Vibration</strong></TableCell>
                  <TableCell align="right"><strong>Oil Quality</strong></TableCell>
                  <TableCell align="right"><strong>Operating Hours</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {engines.map((engine) => (
                  <TableRow
                    key={engine.id}
                    sx={{
                      '&:hover': { bgcolor: '#f9f9f9' },
                      bgcolor: engine.status === 'at_risk' ? '#ffebee' : 'inherit'
                    }}
                  >
                    <TableCell>{engine.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={engine.status === 'at_risk' ? 'At Risk' : 'Normal'}
                        color={engine.status === 'at_risk' ? 'error' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">{engine.temperature.toFixed(1)}°C</TableCell>
                    <TableCell align="right">{engine.pressure.toFixed(1)} PSI</TableCell>
                    <TableCell align="right">{engine.vibration.toFixed(1)} mm/s</TableCell>
                    <TableCell align="right">{engine.oil_quality.toFixed(1)}%</TableCell>
                    <TableCell align="right">{engine.operating_hours.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  </motion.div>
  );
}

export default FleetOverview;

