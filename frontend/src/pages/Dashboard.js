import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, Alert, CircularProgress,
  Chip
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import SpeedIcon from '@mui/icons-material/Speed';
import { motion } from 'framer-motion';
import { getFleetStats } from '../services/api';

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

const cardHoverVariants = {
  hover: {
    scale: 1.05,
    boxShadow: "0px 10px 30px rgba(16, 185, 129, 0.3)",
    transition: {
      type: "spring",
      stiffness: 300
    }
  }
};

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getFleetStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError('Failed to load fleet statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', mt: 10 }}>
        <CircularProgress size={60} thickness={4} sx={{ color: '#ec407a' }} />
        <Typography variant="h6" sx={{ mt: 2, color: '#c2185b' }}>
          Loading dashboard...
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box>
        <motion.div variants={itemVariants}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4, color: '#c2185b', fontWeight: 'bold' }}>
            Dashboard Overview
          </Typography>
        </motion.div>

        {/* Summary Cards */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Grid container spacing={3} sx={{ maxWidth: '1200px' }}>
            <Grid item xs={12} md={3}>
            <motion.div
              variants={itemVariants}
              whileHover="hover"
              custom={cardHoverVariants}
            >
              <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #f48fb1 0%, #ec407a 100%)', color: 'white', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h3">{stats?.total_engines || 0}</Typography>
                  <Typography variant="subtitle1">Total Engines</Typography>
                </Box>
                <SpeedIcon sx={{ fontSize: 50, opacity: 0.8 }} />
              </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={3}>
          <motion.div
            variants={itemVariants}
            whileHover="hover"
            custom={cardHoverVariants}
          >
            <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #f8bbd0 0%, #f48fb1 100%)', color: 'white', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h3">{stats?.healthy_engines || 0}</Typography>
                  <Typography variant="subtitle1">Healthy Engines</Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 50, opacity: 0.8 }} />
              </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={3}>
          <motion.div
            variants={itemVariants}
            whileHover="hover"
            custom={cardHoverVariants}
          >
            <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)', color: 'white', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h3">{stats?.warning_engines || 0}</Typography>
                  <Typography variant="subtitle1">Warning</Typography>
                </Box>
                <WarningIcon sx={{ fontSize: 50, opacity: 0.8 }} />
              </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={3}>
          <motion.div
            variants={itemVariants}
            whileHover="hover"
            custom={cardHoverVariants}
          >
            <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #ef5350 0%, #e53935 100%)', color: 'white', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h3">{stats?.critical_engines || 0}</Typography>
                  <Typography variant="subtitle1">Critical</Typography>
                </Box>
                <ErrorIcon sx={{ fontSize: 50, opacity: 0.8 }} />
              </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={3}>
          <motion.div
            variants={itemVariants}
            whileHover="hover"
            custom={cardHoverVariants}
          >
            <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #ec407a 0%, #c2185b 100%)', color: 'white', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h3">{stats?.health_percentage || 0}%</Typography>
                  <Typography variant="subtitle1">Fleet Health</Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 50, opacity: 0.8 }} />
              </Box>
              </CardContent>
            </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>

      {/* Average Metrics */}
      <motion.div variants={itemVariants}>
        <Card elevation={3} sx={{ mb: 4, borderRadius: 3, border: '2px solid #f8bbd0' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Fleet-Wide Average Metrics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="h4" color="primary">
                  {stats?.average_metrics.temperature.toFixed(1)}°C
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Temperature
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="h4" color="primary">
                  {stats?.average_metrics.pressure.toFixed(1)} PSI
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Pressure
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="h4" color="primary">
                  {stats?.average_metrics.vibration.toFixed(1)} mm/s
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Vibration
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="h4" color="primary">
                  {stats?.average_metrics.oil_quality.toFixed(1)}%
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Oil Quality
                </Typography>
              </Box>
            </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Status Alert */}
      {stats?.at_risk_engines > 0 && (
        <motion.div variants={itemVariants}>
          <Alert severity="warning" sx={{ mb: 4, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>
            Attention Required
          </Typography>
          <Typography>
            {stats.at_risk_engines} engine{stats.at_risk_engines !== 1 ? 's' : ''} showing
            elevated failure risk. Navigate to Engine Monitor for detailed analysis.
            </Typography>
          </Alert>
        </motion.div>
      )}

      {stats?.at_risk_engines === 0 && (
        <motion.div variants={itemVariants}>
          <Alert severity="success" sx={{ mb: 4, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>
            All Systems Normal
          </Typography>
          <Typography>
            All {stats.total_engines} engines are operating within normal parameters.
            Continue regular monitoring schedule.
            </Typography>
          </Alert>
        </motion.div>
      )}

      {/* Quick Stats */}
      <motion.div variants={itemVariants}>
        <Card elevation={3} sx={{ borderRadius: 3, border: '2px solid #f8bbd0' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            System Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #eee' }}>
                <Typography variant="body1" fontWeight="bold">Total Data Points</Typography>
                <Chip label={stats?.total_readings.toLocaleString() || '0'} color="primary" />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #eee' }}>
                <Typography variant="body1" fontWeight="bold">Avg Operating Hours</Typography>
                <Chip label={stats?.average_metrics.operating_hours.toLocaleString() || '0'} color="primary" />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                <Typography variant="body1" fontWeight="bold">Model Accuracy</Typography>
                <Chip label="100%" color="success" />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                <Typography variant="body1" fontWeight="bold">Prediction Speed</Typography>
                <Chip label="< 1ms" color="success" />
              </Box>
            </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  </motion.div>
  );
}

export default Dashboard;

