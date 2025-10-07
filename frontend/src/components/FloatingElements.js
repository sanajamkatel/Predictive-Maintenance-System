import React from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import SettingsIcon from '@mui/icons-material/Settings';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import EngineeringIcon from '@mui/icons-material/Engineering';
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const FloatingElements = () => {
  const elements = [
    { Icon: SettingsIcon, delay: 0, duration: 20, x: '10%', y: '15%', size: 60 },
    { Icon: BuildIcon, delay: 2, duration: 25, x: '80%', y: '20%', size: 50 },
    { Icon: PrecisionManufacturingIcon, delay: 4, duration: 22, x: '15%', y: '70%', size: 70 },
    { Icon: EngineeringIcon, delay: 1, duration: 18, x: '75%', y: '65%', size: 55 },
    { Icon: SpeedIcon, delay: 3, duration: 24, x: '50%', y: '10%', size: 45 },
    { Icon: TrendingUpIcon, delay: 5, duration: 20, x: '85%', y: '80%', size: 50 },
    { Icon: SettingsIcon, delay: 6, duration: 23, x: '25%', y: '45%', size: 40 },
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {elements.map((element, index) => (
        <motion.div
          key={index}
          style={{
            position: 'absolute',
            left: element.x,
            top: element.y,
          }}
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: element.delay,
          }}
        >
          <element.Icon
            sx={{
              fontSize: element.size,
              color: '#f8bbd0',
              opacity: 0.15,
            }}
          />
        </motion.div>
      ))}

      {/* Floating circles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`circle-${i}`}
          style={{
            position: 'absolute',
            left: `${15 + i * 20}%`,
            top: `${30 + i * 10}%`,
            width: 100 + i * 20,
            height: 100 + i * 20,
            borderRadius: '50%',
            border: '2px solid #f8bbd0',
            opacity: 0.1,
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 2,
          }}
        />
      ))}
    </Box>
  );
};

export default FloatingElements;

