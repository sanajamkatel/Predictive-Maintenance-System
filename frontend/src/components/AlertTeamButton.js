import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Box,
  Chip,
  Typography,
  LinearProgress
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const AlertTeamButton = ({ engineId, engineName, prediction, sensorReadings }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [lastAlertTime, setLastAlertTime] = useState(null);

  const handleOpen = () => {
    // Auto-fill message with engine details
    const autoMessage = `ALERT: ${engineName} shows ${prediction.failure_predicted ? 'CRITICAL' : 'WARNING'} status.

Failure Probability: ${(prediction.probability * 100).toFixed(1)}%
Current Readings:
- Temperature: ${sensorReadings.temperature.toFixed(1)}°C
- Pressure: ${sensorReadings.pressure.toFixed(1)} PSI
- Vibration: ${sensorReadings.vibration.toFixed(1)} mm/s
- Oil Quality: ${sensorReadings.oil_quality.toFixed(1)}%

Recommendation: ${prediction.recommendation || 'Schedule immediate inspection'}

Please review and take necessary action.`;

    setMessage(autoMessage);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSendAlert = () => {
    setSending(true);
    
    // Simulate sending alert (in real app, this would call an API)
    setTimeout(() => {
      setSending(false);
      setAlertSent(true);
      setLastAlertTime(new Date());
      setSnackbarOpen(true);
      setOpen(false);
      
      // In a real implementation, you would:
      // 1. Send email via backend API
      // 2. Send SMS notification
      // 3. Post to Slack/Teams channel
      // 4. Create ticket in maintenance system
      // 5. Log alert in database
      
      console.log('Alert sent for engine:', engineId);
      console.log('Message:', message);
    }, 1500);
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return null;
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return timestamp.toLocaleDateString();
  };

  const getPriorityColor = () => {
    if (prediction.probability > 0.9) return 'error';
    if (prediction.probability > 0.7) return 'warning';
    return 'info';
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="contained"
            color={alertSent ? 'success' : getPriorityColor()}
            startIcon={alertSent ? <CheckCircleIcon /> : <NotificationsActiveIcon />}
            onClick={handleOpen}
            disabled={sending}
            sx={{
              background: alertSent
                ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                : prediction.failure_predicted
                  ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
                  : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              boxShadow: alertSent
                ? '0 4px 12px rgba(16, 185, 129, 0.3)'
                : '0 4px 12px rgba(244, 67, 54, 0.3)',
              '&:hover': {
                boxShadow: alertSent
                  ? '0 6px 16px rgba(16, 185, 129, 0.4)'
                  : '0 6px 16px rgba(244, 67, 54, 0.4)',
              },
              minWidth: 200,
              py: 1.5,
            }}
          >
            {sending ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinearProgress 
                  size={16} 
                  sx={{ 
                    width: 20, 
                    height: 2, 
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'white'
                    }
                  }} 
                />
                Sending...
              </Box>
            ) : alertSent ? (
              'Alert Sent'
            ) : (
              'Alert Maintenance Team'
            )}
          </Button>
        </motion.div>
        
        {lastAlertTime && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Last alerted: {getTimeAgo(lastAlertTime)}
              </Typography>
            </Box>
          </motion.div>
        )}
      </Box>

      {/* Alert Dialog */}
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
            <NotificationsActiveIcon color="error" />
            <Typography variant="h6" fontWeight="bold">
              Send Alert for {engineName}
            </Typography>
          </Box>
          <Box mt={1} display="flex" gap={1}>
            <Chip
              label={`Priority: ${prediction.probability > 0.9 ? 'CRITICAL' : prediction.probability > 0.7 ? 'HIGH' : 'MEDIUM'}`}
              color={getPriorityColor()}
              size="small"
            />
            <Chip
              label={`Failure Risk: ${(prediction.probability * 100).toFixed(0)}%`}
              color="error"
              size="small"
            />
          </Box>
        </DialogTitle>

        <DialogContent>
          <Alert severity={prediction.failure_predicted ? 'error' : 'warning'} sx={{ mb: 2 }}>
            This will notify the maintenance team via:
            <Box component="ul" sx={{ mt: 1, mb: 0 }}>
              <li>Email to maintenance@company.com</li>
              <li>SMS to on-call engineer</li>
              <li>Slack/Teams message</li>
              <li>Create maintenance ticket</li>
            </Box>
          </Alert>

          <TextField
            fullWidth
            multiline
            rows={10}
            label="Alert Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#ec407a',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ec407a',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#ec407a',
              },
            }}
          />

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            This message will be sent to the maintenance team immediately.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleSendAlert}
              variant="contained"
              startIcon={sending ? <EmailIcon /> : <SendIcon />}
              disabled={sending || !message.trim()}
              sx={{
                background: 'linear-gradient(135deg, #ec407a 0%, #c2185b 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #c2185b 0%, #ad1457 100%)',
                },
              }}
            >
              {sending ? 'Sending...' : 'Send Alert'}
            </Button>
          </motion.div>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Alert sent successfully! Maintenance team has been notified.
        </Alert>
      </Snackbar>
    </>
  );
};

export default AlertTeamButton;

