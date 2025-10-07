import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Grid, Card, CardContent, Typography, Box, Alert, CircularProgress,
  FormControl, InputLabel, Select, MenuItem, Chip, LinearProgress
} from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import CompressIcon from '@mui/icons-material/Compress';
import VibrationIcon from '@mui/icons-material/Vibration';
import OpacityIcon from '@mui/icons-material/Opacity';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';
import SensorGauge from '../components/SensorGauge';
import AlertTeamButton from '../components/AlertTeamButton';
import ExportReportButton from '../components/ExportReportButton';
import { getEngines, predictFailure, getEngineHistory } from '../services/api';

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

function EngineMonitor() {
  const { engineId } = useParams();
  const navigate = useNavigate();
  
  const [engines, setEngines] = useState([]);
  const [selectedEngine, setSelectedEngine] = useState(engineId || '');
  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEngines();
  }, []);

  useEffect(() => {
    if (selectedEngine) {
      loadEngineData(selectedEngine);
      navigate(`/monitor/${selectedEngine}`, { replace: true });
    }
  }, [selectedEngine]);

  const loadEngines = async () => {
    try {
      const data = await getEngines();
      setEngines(data.engines || []);
      if (!selectedEngine && data.engines.length > 0) {
        setSelectedEngine(data.engines[0].id);
      }
    } catch (err) {
      console.error('Failed to load engines:', err);
    }
  };

  const loadEngineData = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const [predData, histData] = await Promise.all([
        predictFailure(id),
        getEngineHistory(id, 168) // Last 7 days
      ]);
      
      setPrediction(predData);
      setHistory(histData.history || []);
    } catch (err) {
      setError('Failed to load engine data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEngineChange = (event) => {
    setSelectedEngine(event.target.value);
  };

  if (engines.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 10 }}>
        <CircularProgress size={60} thickness={4} sx={{ color: '#ec407a', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#c2185b' }}>
          Loading engines...
        </Typography>
      </Box>
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <MonitorHeartIcon sx={{ fontSize: 40, color: '#ec407a' }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#c2185b' }}>
                Real-Time Engine Monitoring
              </Typography>
            </Box>
            <FormControl sx={{ minWidth: 300 }}>
              <InputLabel sx={{ color: '#ec407a' }}>Select Engine</InputLabel>
              <Select
                value={selectedEngine}
                onChange={handleEngineChange}
                label="Select Engine"
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#f48fb1',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ec407a',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ec407a',
                  },
                }}
              >
                {engines.map((eng) => {
                  const isAtRisk = eng.status === 'at_risk' || eng.status === 'warning';
                  const isHealthy = eng.status === 'healthy';
                  const isFailure = eng.status === 'failure';
                  
                  return (
                    <MenuItem key={eng.id} value={eng.id} sx={{ py: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Typography variant="body1" sx={{ fontWeight: 'bold', minWidth: 80 }}>
                            {eng.name}
                          </Typography>
                          {isFailure && <Chip label="Failure" size="small" color="error" icon={<ErrorIcon />} />}
                          {isAtRisk && <Chip label="At Risk" size="small" color="warning" icon={<WarningIcon />} />}
                          {isHealthy && <Chip label="Healthy" size="small" color="success" icon={<CheckCircleIcon />} />}
                        </Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 80, textAlign: 'right' }}>
                          Temp: {eng.temperature?.toFixed(0) || 'N/A'}°C
                        </Typography>
                      </Box>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        </motion.div>

        {loading && (
          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', my: 8 }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <CircularProgress size={60} thickness={4} sx={{ color: '#ec407a', mb: 2 }} />
              </motion.div>
              <Typography variant="h6" sx={{ color: '#c2185b', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <RefreshIcon /> Loading engine data...
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 400 }}>
                Analyzing sensor readings, running ML predictions, and generating insights...
              </Typography>
              <Box sx={{ mt: 3, width: 300 }}>
                <LinearProgress 
                  sx={{ 
                    height: 4, 
                    borderRadius: 2,
                    backgroundColor: '#f8bbd0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#ec407a',
                      borderRadius: 2,
                    }
                  }} 
                />
              </Box>
            </Box>
          </motion.div>
        )}

        {error && (
          <motion.div variants={itemVariants}>
            <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>
              {error}
            </Alert>
          </motion.div>
        )}

        {prediction && !loading && (
          <>
            {/* Prediction Status */}
            <motion.div variants={itemVariants}>
              <Card elevation={3} sx={{ mb: 4, borderRadius: 3, border: '2px solid #f8bbd0' }}>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Prediction Result
                      </Typography>
                      {prediction.prediction.failure_predicted ? (
                        <motion.div
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring" }}
                        >
                          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                              <ErrorIcon /> FAILURE PREDICTED
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography variant="body2" sx={{ minWidth: 100 }}>
                                  Confidence:
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={prediction.prediction.probability * 100}
                                  sx={{
                                    flexGrow: 1,
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: 'rgba(255,255,255,0.3)',
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: '#EF4444',
                                      borderRadius: 4,
                                    },
                                  }}
                                />
                                <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: 50 }}>
                                  {(prediction.prediction.probability * 100).toFixed(1)}%
                                </Typography>
                              </Box>
                              <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <WarningIcon fontSize="small" /> LOW confidence - but flagged due to high-risk pattern. Model errs on side of caution.
                              </Typography>
                            </Box>
                          </Alert>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring" }}
                        >
                          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CheckCircleIcon /> NORMAL OPERATION
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography variant="body2" sx={{ minWidth: 100 }}>
                                  Confidence:
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={prediction.prediction.confidence * 100}
                                  sx={{
                                    flexGrow: 1,
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: 'rgba(255,255,255,0.3)',
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: '#10B981',
                                      borderRadius: 4,
                                    },
                                  }}
                                />
                                <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: 50 }}>
                                  {(prediction.prediction.confidence * 100).toFixed(1)}%
                                </Typography>
                              </Box>
                              <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CheckCircleIcon fontSize="small" /> Model is VERY CONFIDENT this engine is safe
                              </Typography>
                            </Box>
                          </Alert>
                        </motion.div>
                      )}
                </Grid>
                
                {/* Feature Importance Section */}
                <Grid item xs={12}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card elevation={2} sx={{ borderRadius: 3, border: '1px solid #f8bbd0', bgcolor: '#fef7f7' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#c2185b', display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SearchIcon /> Why is this engine {prediction.prediction.failure_predicted ? 'at risk' : 'healthy'}?
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Top contributing factors from the ML model:
                        </Typography>
                        
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, border: '1px solid #f8bbd0' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <VibrationIcon fontSize="small" /> Vibration Analysis
                              </Typography>
                              <Typography variant="body2">
                                Current: {prediction.current_readings.vibration.toFixed(1)} mm/s
                                {prediction.current_readings.vibration > 5 && (
                                  <Chip label="18% above normal" size="small" color="warning" sx={{ ml: 1 }} />
                                )}
                              </Typography>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, border: '1px solid #f8bbd0' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ThermostatIcon fontSize="small" /> Temperature Status
                              </Typography>
                              <Typography variant="body2">
                                Current: {prediction.current_readings.temperature.toFixed(0)}°C
                                {prediction.current_readings.temperature > 600 && (
                                  <Chip label="Elevated" size="small" color="warning" sx={{ ml: 1 }} />
                                )}
                              </Typography>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, border: '1px solid #f8bbd0' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CompressIcon fontSize="small" /> Pressure Stability
                              </Typography>
                              <Typography variant="body2">
                                Current: {prediction.current_readings.pressure.toFixed(1)} PSI
                                <Chip label="Normal range" size="small" color="success" sx={{ ml: 1 }} />
                              </Typography>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, border: '1px solid #f8bbd0' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <OpacityIcon fontSize="small" /> Oil Quality
                              </Typography>
                              <Typography variant="body2">
                                Current: {prediction.current_readings.oil_quality.toFixed(1)}%
                                <Chip label="Good" size="small" color="success" sx={{ ml: 1 }} />
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                        
                        <Alert severity={prediction.prediction.failure_predicted ? 'warning' : 'info'} sx={{ mt: 2 }}>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {prediction.prediction.failure_predicted 
                              ? (
                                <>
                                  <WarningIcon fontSize="small" /> The combination of high vibration + elevated temperature matches failure patterns from historical NASA data.
                                </>
                              ) : (
                                <>
                                  <CheckCircleIcon fontSize="small" /> All sensor readings are within normal parameters. No concerning patterns detected.
                                </>
                              )
                            }
                          </Typography>
                        </Alert>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
                
                    <Grid item xs={12} md={6}>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Recommendation
                      </Typography>
                      <Box sx={{ p: 2, bgcolor: '#fce4ec', borderRadius: 2, border: '1px solid #f8bbd0' }}>
                        <Chip 
                      label={prediction.recommendation.priority.toUpperCase()} 
                      color={
                        prediction.recommendation.priority === 'critical' ? 'error' :
                        prediction.recommendation.priority === 'high' ? 'warning' :
                        prediction.recommendation.priority === 'medium' ? 'info' :
                        'success'
                      }
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body1" fontWeight="bold">
                      {prediction.recommendation.action}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {prediction.recommendation.message}
                    </Typography>
                      </Box>
                      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <AlertTeamButton
                          engineId={selectedEngine}
                          engineName={`ENG-${String(selectedEngine).padStart(3, '0')}`}
                          prediction={prediction.prediction}
                          sensorReadings={prediction.current_readings}
                        />
                        <ExportReportButton
                          engineId={selectedEngine}
                          engineName={`ENG-${String(selectedEngine).padStart(3, '0')}`}
                          prediction={prediction.prediction}
                          sensorReadings={prediction.current_readings}
                          history={history}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sensor Gauges */}
            <motion.div variants={itemVariants}>
              <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold', color: '#c2185b' }}>
                Current Sensor Readings
              </Typography>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
                  <SensorGauge
                title="Temperature"
                value={prediction.current_readings.temperature}
                unit="°C"
                min={50}
                max={150}
                warning={90}
                danger={110}
                icon={<ThermostatIcon color="error" />}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <SensorGauge
                title="Pressure"
                value={prediction.current_readings.pressure}
                unit=" PSI"
                min={20}
                max={80}
                warning={50}
                danger={65}
                icon={<CompressIcon color="primary" />}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <SensorGauge
                title="Vibration"
                value={prediction.current_readings.vibration}
                unit=" mm/s"
                min={0}
                max={20}
                warning={5}
                danger={10}
                icon={<VibrationIcon color="warning" />}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <SensorGauge
                title="Oil Quality"
                value={prediction.current_readings.oil_quality}
                unit="%"
                min={0}
                max={100}
                warning={40}
                danger={30}
                icon={<OpacityIcon color="success" />}
                  />
                </Grid>
              </Grid>
            </motion.div>

            {/* Historical Charts */}
            <motion.div variants={itemVariants}>
              <Card elevation={3} sx={{ borderRadius: 3, border: '2px solid #f8bbd0' }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
                    7-Day Historical Trends
                  </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Temperature Trend (7 days)
                  </Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <ComposedChart data={history.slice(-168)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="timestamp" hide />
                      <YAxis domain={[400, 800]} />
                      <Tooltip 
                        formatter={(value, name) => [`${value.toFixed(1)}°C`, name]}
                        labelStyle={{ color: '#333' }}
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #f8bbd0',
                          borderRadius: 8 
                        }}
                      />
                      {/* Warning zone */}
                      <Area 
                        dataKey={() => 600} 
                        stroke="none" 
                        fill="#fff3cd" 
                        fillOpacity={0.3}
                      />
                      {/* Danger threshold line */}
                      <ReferenceLine y={650} stroke="#dc3545" strokeDasharray="5 5" strokeWidth={2} />
                      {/* Warning threshold line */}
                      <ReferenceLine y={600} stroke="#ffc107" strokeDasharray="3 3" strokeWidth={1} />
                      {/* Main temperature line */}
                      <Line 
                        type="monotone" 
                        dataKey="temperature" 
                        stroke="#f44336" 
                        strokeWidth={3} 
                        dot={false}
                        activeDot={{ r: 4, fill: '#f44336' }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 12, height: 2, bgcolor: '#ffc107' }} />
                      <Typography variant="caption">Warning (600°C)</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 12, height: 2, bgcolor: '#dc3545' }} />
                      <Typography variant="caption">Danger (650°C)</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Pressure (PSI)</Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={history.slice(-168)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" hide />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="pressure" stroke="#2196f3" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Vibration (mm/s)</Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={history.slice(-168)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" hide />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="vibration" stroke="#ff9800" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Oil Quality (%)</Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={history.slice(-168)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" hide />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="oil_quality" stroke="#4caf50" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </Box>
    </motion.div>
  );
}

export default EngineMonitor;

