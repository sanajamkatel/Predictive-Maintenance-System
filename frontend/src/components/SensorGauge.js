import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';

function SensorGauge({ title, value, unit, min, max, warning, danger, icon }) {
  const percentage = ((value - min) / (max - min)) * 100;
  
  const getColor = () => {
    if (value >= danger) return 'error';
    if (value >= warning) return 'warning';
    return 'success';
  };

  const color = getColor();

  return (
    <Card elevation={3}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" color={`${color}.main`} sx={{ mb: 1 }}>
          {value.toFixed(1)}
          <Typography component="span" variant="h6" color="text.secondary">
            {' '}{unit}
          </Typography>
        </Typography>
        <LinearProgress
          variant="determinate"
          value={Math.min(percentage, 100)}
          color={color}
          sx={{ height: 10, borderRadius: 5 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {min}{unit}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {max}{unit}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default SensorGauge;

