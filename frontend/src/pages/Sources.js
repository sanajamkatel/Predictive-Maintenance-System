import React from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Chip, Link, Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import DatasetIcon from '@mui/icons-material/Dataset';
import SchoolIcon from '@mui/icons-material/School';
import ArticleIcon from '@mui/icons-material/Article';
import PublicIcon from '@mui/icons-material/Public';

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

function Sources() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box>
        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <DatasetIcon sx={{ fontSize: 40, color: '#ec407a' }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#c2185b' }}>
              Data Sources & Acknowledgments
            </Typography>
          </Box>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            This predictive maintenance system is built using real-world aerospace data and research.
            I acknowledge and credit the following sources for their invaluable contributions.
          </Typography>
        </motion.div>

        <Grid container spacing={3}>
          {/* NASA C-MAPSS Dataset */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Card elevation={3} sx={{ borderRadius: 3, border: '2px solid #f8bbd0', height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <DatasetIcon sx={{ color: '#ec407a' }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#c2185b' }}>
                      NASA C-MAPSS Dataset
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Commercial Modular Aero-Propulsion System Simulation
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    The NASA C-MAPSS (Commercial Modular Aero-Propulsion System Simulation) 
                    dataset contains run-to-failure data from turbofan engines. This dataset 
                    is widely used in the aerospace industry for predictive maintenance research.
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip label="FD001 Subset" color="primary" size="small" sx={{ mr: 1 }} />
                    <Chip label="100 Engines" color="secondary" size="small" sx={{ mr: 1 }} />
                    <Chip label="Run-to-Failure" color="info" size="small" />
                  </Box>
                  
                  <Link 
                    href="https://www.kaggle.com/datasets/behrad3d/nasa-cmaps" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    sx={{ 
                      color: '#ec407a', 
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    View on Kaggle →
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Research Papers */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Card elevation={3} sx={{ borderRadius: 3, border: '2px solid #f8bbd0', height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <ArticleIcon sx={{ color: '#ec407a' }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#c2185b' }}>
                      Research Papers
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    This system is based on research from the following academic papers:
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      "Damage Propagation Modeling for Aircraft Engine Run-to-Failure Simulation"
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Saxena, A., Goebel, K., Simon, D., & Eklund, N. (2008)
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      "Prognostics and Health Management of Electronics"
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      IEEE Transactions on Components and Packaging Technologies
                    </Typography>
                  </Box>
                  
                  <Link 
                    href="https://www.nasa.gov/content/prognostics-center-of-excellence-data-set-repository" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    sx={{ 
                      color: '#ec407a', 
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    NASA Research Repository →
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* NASA Research Center */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Card elevation={3} sx={{ borderRadius: 3, border: '2px solid #f8bbd0', height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <SchoolIcon sx={{ color: '#ec407a' }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#c2185b' }}>
                      NASA Research Center
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Prognostics Center of Excellence (PCoE) at NASA Ames Research Center
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    The PCoE is dedicated to advancing the state of the art in prognostics 
                    and health management for aerospace systems. Their research has been 
                    instrumental in developing predictive maintenance technologies.
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip label="NASA Ames" color="primary" size="small" sx={{ mr: 1 }} />
                    <Chip label="Aerospace Research" color="secondary" size="small" />
                  </Box>
                  
                  <Link 
                    href="https://www.nasa.gov/ames" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    sx={{ 
                      color: '#ec407a', 
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Visit NASA Ames →
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Kaggle Platform */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Card elevation={3} sx={{ borderRadius: 3, border: '2px solid #f8bbd0', height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <PublicIcon sx={{ color: '#ec407a' }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#c2185b' }}>
                      Kaggle Platform
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Data Science and Machine Learning Community
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Kaggle provides access to the NASA C-MAPSS dataset and serves as a 
                    platform for data scientists and researchers to collaborate on 
                    predictive maintenance challenges.
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip label="Open Data" color="primary" size="small" sx={{ mr: 1 }} />
                    <Chip label="ML Community" color="secondary" size="small" />
                  </Box>
                  
                  <Link 
                    href="https://www.kaggle.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    sx={{ 
                      color: '#ec407a', 
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Explore Kaggle →
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        <motion.div variants={itemVariants}>
          <Divider sx={{ my: 4 }} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card elevation={2} sx={{ borderRadius: 3, border: '1px solid #f8bbd0', bgcolor: '#fef7f7' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#c2185b', mb: 2 }}>
                Citation & Usage
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                If you use this system or the underlying data in your research, please cite:
              </Typography>
              <Box sx={{ 
                p: 2, 
                bgcolor: 'white', 
                borderRadius: 2, 
                border: '1px solid #f8bbd0',
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              }}>
                Saxena, A., Goebel, K., Simon, D., & Eklund, N. (2008). "Damage Propagation 
                Modeling for Aircraft Engine Run-to-Failure Simulation." In Proceedings of 
                the 1st International Conference on Prognostics and Health Management (PHM08).
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </motion.div>
  );
}

export default Sources;
