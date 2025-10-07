import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  LinearProgress,
  Alert,
  Chip,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import AssessmentIcon from '@mui/icons-material/Assessment';

const ExportReportButton = ({ engineId, engineName, prediction, sensorReadings, history }) => {
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCompleted(false);
  };

  const generateReport = () => {
    setGenerating(true);
    
    // Simulate PDF generation (in real app, this would call backend API)
    setTimeout(() => {
      setGenerating(false);
      setCompleted(true);
      
      // In a real implementation, this would:
      // 1. Call backend API to generate PDF
      // 2. Include current status, trends, recommendations
      // 3. Add cost justification
      // 4. Return download link
      
      console.log('Generating maintenance report for:', engineId);
    }, 3000);
  };

  const downloadReport = () => {
    // Simulate download (in real app, this would trigger actual download)
    console.log('Downloading report for:', engineId);
    setOpen(false);
    setCompleted(false);
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="outlined"
          startIcon={<PictureAsPdfIcon />}
          onClick={handleOpen}
          sx={{
            borderColor: '#ec407a',
            color: '#ec407a',
            '&:hover': {
              borderColor: '#c2185b',
              backgroundColor: '#fce4ec',
            },
            minWidth: 200,
          }}
        >
          Generate Maintenance Report
        </Button>
      </motion.div>

      {/* Report Generation Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #fce4ec 0%, #ffffff 100%)',
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <AssessmentIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Maintenance Report for {engineName}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          {!generating && !completed && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                This report will include:
                <Box component="ul" sx={{ mt: 1, mb: 0 }}>
                  <li> Current engine status and sensor readings</li>
                  <li> 7-day historical trends with threshold analysis</li>
                  <li> ML model prediction and confidence levels</li>
                  <li> Maintenance recommendations and priority</li>
                  <li> Cost justification and ROI analysis</li>
                  <li> Action items and next steps</li>
                </Box>
              </Alert>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card elevation={2} sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Current Status
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Status:</Typography>
                          <Chip 
                            label={prediction.failure_predicted ? 'AT RISK' : 'HEALTHY'} 
                            color={prediction.failure_predicted ? 'error' : 'success'}
                            size="small"
                          />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Confidence:</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {((prediction.confidence || prediction.probability) * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Temperature:</Typography>
                          <Typography variant="body2">{sensorReadings.temperature.toFixed(1)}°C</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Vibration:</Typography>
                          <Typography variant="body2">{sensorReadings.vibration.toFixed(1)} mm/s</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card elevation={2} sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Report Contents
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body2">Executive Summary</Typography>
                        <Typography variant="body2">Sensor Data Analysis</Typography>
                        <Typography variant="body2">Trend Analysis (7 days)</Typography>
                        <Typography variant="body2">ML Prediction Details</Typography>
                        <Typography variant="body2">Maintenance Recommendations</Typography>
                        <Typography variant="body2">Cost-Benefit Analysis</Typography>
                        <Typography variant="body2">Action Plan & Timeline</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {generating && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <PictureAsPdfIcon sx={{ fontSize: 60, color: '#ec407a', mb: 2 }} />
              </motion.div>
              <Typography variant="h6" gutterBottom>
                Generating Report...
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Creating comprehensive maintenance report with charts and analysis
              </Typography>
              <LinearProgress 
                sx={{ 
                  height: 6, 
                  borderRadius: 3,
                  backgroundColor: '#f8bbd0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#ec407a',
                    borderRadius: 3,
                  }
                }} 
              />
            </Box>
          )}

          {completed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <PictureAsPdfIcon sx={{ fontSize: 60, color: '#10B981', mb: 2 }} />
                </motion.div>
                <Typography variant="h6" gutterBottom sx={{ color: '#10B981' }}>
                   Report Generated Successfully!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Your maintenance report is ready for download
                </Typography>
                <Alert severity="success" sx={{ textAlign: 'left' }}>
                  <Typography variant="body2">
                    <strong>Report includes:</strong><br/>
                    12-page comprehensive analysis<br/>
                    High-resolution charts and graphs<br/>
                    Executive summary for management<br/>
                    Technical details for maintenance team<br/>
                    Cost justification and ROI calculations
                  </Typography>
                </Alert>
              </Box>
            </motion.div>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} color="inherit">
            {completed ? 'Close' : 'Cancel'}
          </Button>
          {!generating && !completed && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={generateReport}
                variant="contained"
                startIcon={<PictureAsPdfIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #ec407a 0%, #c2185b 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #c2185b 0%, #ad1457 100%)',
                  },
                }}
              >
                Generate Report
              </Button>
            </motion.div>
          )}
          {completed && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={downloadReport}
                variant="contained"
                startIcon={<DownloadIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  },
                }}
              >
                Download PDF
              </Button>
            </motion.div>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExportReportButton;
