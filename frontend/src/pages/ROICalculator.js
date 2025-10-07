import React, { useState } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, TextField, Button, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateROI } from '../services/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

const resultVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15
    }
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

function ROICalculator() {
  const [params, setParams] = useState({
    fleet_size: 100,
    failures_per_year: 20,
    cost_per_failure: 50000,
    detection_rate: 95,
    maintenance_cost: 100000,
    initial_investment: 250000
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field) => (event) => {
    setParams({
      ...params,
      [field]: parseFloat(event.target.value) || 0
    });
  };

  const handleCalculate = async () => {
    try {
      setLoading(true);
      const data = await calculateROI(params);
      setResults(data);
    } catch (err) {
      console.error('Failed to calculate ROI:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box>
        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
            <AttachMoneyIcon sx={{ fontSize: 40, color: '#ec407a' }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#c2185b' }}>
              ROI Calculator
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={3}>
          {/* Input Parameters */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Card elevation={3} sx={{ borderRadius: 3, border: '2px solid #f8bbd0' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <ShowChartIcon sx={{ color: '#ec407a' }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Input Parameters
                    </Typography>
                  </Box>
              
              <TextField
                fullWidth
                label="Fleet Size (# of engines)"
                type="number"
                value={params.fleet_size}
                onChange={handleInputChange('fleet_size')}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Expected Failures per Year"
                type="number"
                value={params.failures_per_year}
                onChange={handleInputChange('failures_per_year')}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Cost per Failure ($)"
                type="number"
                value={params.cost_per_failure}
                onChange={handleInputChange('cost_per_failure')}
                sx={{ mb: 2 }}
                helperText="Includes downtime, repairs, lost revenue"
              />
              
              <TextField
                fullWidth
                label="Detection Rate (%)"
                type="number"
                value={params.detection_rate}
                onChange={handleInputChange('detection_rate')}
                sx={{ mb: 2 }}
                inputProps={{ min: 0, max: 100 }}
              />
              
              <TextField
                fullWidth
                label="Annual Maintenance Cost ($)"
                type="number"
                value={params.maintenance_cost}
                onChange={handleInputChange('maintenance_cost')}
                sx={{ mb: 2 }}
                helperText="Software, sensors, personnel"
              />
              
              <TextField
                fullWidth
                label="Initial Investment ($)"
                type="number"
                value={params.initial_investment}
                onChange={handleInputChange('initial_investment')}
                sx={{ mb: 3 }}
                helperText="Setup, hardware, training"
              />
              
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<CalculateIcon />}
                      onClick={handleCalculate}
                      disabled={loading}
                      sx={{
                        background: 'linear-gradient(135deg, #ec407a 0%, #c2185b 100%)',
                        boxShadow: '0 4px 15px rgba(236, 64, 122, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #f48fb1 0%, #ec407a 100%)',
                          boxShadow: '0 6px 20px rgba(236, 64, 122, 0.4)',
                        }
                      }}
                    >
                      Calculate ROI
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Results */}
          <Grid item xs={12} md={6}>
            <AnimatePresence mode="wait">
              {results ? (
                <motion.div
                  key="results"
                  variants={resultVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Card elevation={3} sx={{ borderRadius: 3, border: '2px solid #f8bbd0' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <TrendingUpIcon sx={{ color: '#ec407a' }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          Results
                        </Typography>
                      </Box>

                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                          <Typography variant="h5">
                            Annual Net Savings: ${results.results.net_savings.toLocaleString()}
                          </Typography>
                        </Alert>
                      </motion.div>

                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6}>
                          <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            <Box sx={{ 
                              p: 2, 
                              bgcolor: '#fce4ec', 
                              borderRadius: 2, 
                              textAlign: 'center',
                              border: '2px solid #f48fb1'
                            }}>
                              <Typography variant="h4" sx={{ color: '#ec407a', fontWeight: 'bold' }}>
                                {results.results.roi_percentage}%
                              </Typography>
                              <Typography variant="subtitle2">ROI</Typography>
                            </Box>
                          </motion.div>
                        </Grid>
                        <Grid item xs={6}>
                          <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            <Box sx={{ 
                              p: 2, 
                              bgcolor: '#f8bbd0', 
                              borderRadius: 2, 
                              textAlign: 'center',
                              border: '2px solid #ec407a'
                            }}>
                              <Typography variant="h4" sx={{ color: '#c2185b', fontWeight: 'bold' }}>
                                {results.results.payback_period_months || 'N/A'}
                              </Typography>
                              <Typography variant="subtitle2">Payback (months)</Typography>
                            </Box>
                          </motion.div>
                        </Grid>
                      </Grid>

                <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell><strong>Failures Prevented</strong></TableCell>
                        <TableCell align="right">{results.results.prevented_failures}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Failure Costs Avoided</strong></TableCell>
                        <TableCell align="right">${results.results.failure_costs_avoided.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Maintenance Cost</strong></TableCell>
                        <TableCell align="right">-${results.results.maintenance_cost.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                        <TableCell><strong>Net Savings (Annual)</strong></TableCell>
                        <TableCell align="right"><strong>${results.results.net_savings.toLocaleString()}</strong></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Investment Parameters:
                </Typography>
                <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="body2">
                    Fleet Size: {results.input_parameters.fleet_size} engines
                  </Typography>
                  <Typography variant="body2">
                    Expected Failures: {results.input_parameters.failures_per_year}/year
                  </Typography>
                  <Typography variant="body2">
                    Detection Rate: {results.input_parameters.detection_rate}%
                  </Typography>
                  <Typography variant="body2">
                    Cost per Failure: ${results.input_parameters.cost_per_failure.toLocaleString()}
                  </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                variants={itemVariants}
              >
                <Card elevation={3} sx={{ height: '100%', borderRadius: 3, border: '2px solid #f8bbd0' }}>
                  <CardContent>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center', 
                      justifyContent: 'center',
                      height: '100%',
                      minHeight: 400
                    }}>
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
                        <CalculateIcon sx={{ fontSize: 80, color: '#ec407a', mb: 2 }} />
                      </motion.div>
                      <Typography variant="h6" sx={{ color: '#c2185b' }} align="center">
                        Enter parameters and click Calculate ROI to see results
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </Grid>

          {/* 5-Year Projection */}
          {results && (
            <Grid item xs={12}>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <Card elevation={3} sx={{ borderRadius: 3, border: '2px solid #f8bbd0' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                      <ShowChartIcon sx={{ color: '#ec407a' }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        5-Year Financial Projection
                      </Typography>
                    </Box>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={results.projections}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Cumulative Savings ($)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Line type="monotone" dataKey="savings" stroke="#4caf50" strokeWidth={3} name="Cumulative Savings" />
                  </LineChart>
                </ResponsiveContainer>

                    <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                      <Typography variant="body2">
                        <strong>5-Year Impact:</strong> Cumulative savings of $
                        {results.projections[4]?.savings.toLocaleString()} with ROI of {results.projections[4]?.roi.toFixed(0)}%
                      </Typography>
                    </Alert>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          )}
        </Grid>
      </Box>
    </motion.div>
  );
}

export default ROICalculator;

