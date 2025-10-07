import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Security as SecurityIcon,
  Engineering as EngineeringIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.username, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 50%, #ec407a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ width: '100%', maxWidth: 400 }}
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <EngineeringIcon 
                sx={{ 
                  fontSize: 80, 
                  color: '#c2185b',
                  mb: 2
                }} 
              />
            </motion.div>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 'bold',
                color: '#c2185b',
                mb: 1
              }}
            >
              Predictive Maintenance
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#ad1457',
                opacity: 0.8
              }}
            >
              Fleet Management System
            </Typography>
          </Box>
        </motion.div>

        {/* Login Card */}
        <motion.div variants={cardVariants}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 20px 40px rgba(236, 64, 122, 0.2)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <SecurityIcon 
                  sx={{ 
                    fontSize: 40, 
                    color: '#ec407a',
                    mb: 1
                  }} 
                />
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#c2185b'
                  }}
                >
                  Sign In
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#ad1457',
                    opacity: 0.7
                  }}
                >
                  Access your dashboard
                </Typography>
              </Box>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 2,
                      borderRadius: 2,
                      backgroundColor: '#ffebee',
                      border: '1px solid #ffcdd2'
                    }}
                  >
                    {error}
                  </Alert>
                </motion.div>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  name="username"
                  label="Username"
                  value={formData.username}
                  onChange={handleChange}
                  margin="normal"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#f48fb1',
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

                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  margin="normal"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#f48fb1',
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

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #ec407a 0%, #c2185b 100%)',
                      boxShadow: '0 8px 20px rgba(236, 64, 122, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #c2185b 0%, #ad1457 100%)',
                        boxShadow: '0 12px 25px rgba(236, 64, 122, 0.4)',
                      },
                      '&:disabled': {
                        background: '#f8bbd0',
                      },
                    }}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </motion.div>
              </Box>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" sx={{ color: '#ad1457', opacity: 0.6 }}>
                  Demo Credentials
                </Typography>
              </Divider>

              <Box sx={{ fontSize: '0.875rem', color: '#ad1457', opacity: 0.8 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Admin:</strong> sadhana / password123
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Operator:</strong> operator / operator123
                </Typography>
                <Typography variant="body2">
                  <strong>Viewer:</strong> viewer / viewer123
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default Login;
