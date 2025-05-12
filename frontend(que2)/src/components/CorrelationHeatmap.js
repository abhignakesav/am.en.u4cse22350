import React, { useState } from 'react';
import { Box, Paper, Typography, CircularProgress, Tooltip, Grid } from '@mui/material';

const CorrelationHeatmap = ({ data, stocks }) => {
  const [hoveredCell, setHoveredCell] = useState(null);
  
  // Color scale for correlation values
  const getCorrelationColor = (value) => {
    if (value === null || value === undefined) return '#f5f5f5'; // Light grey for no data
    
    // Calculate color based on correlation value
    if (value >= 0.8) return '#1a237e'; // Strong positive - dark blue
    if (value >= 0.5) return '#303f9f'; // Moderate positive - medium blue
    if (value >= 0.2) return '#7986cb'; // Weak positive - light blue
    if (value > -0.2) return '#e0e0e0'; // Neutral - light grey
    if (value > -0.5) return '#ef9a9a'; // Weak negative - light red
    if (value > -0.8) return '#e57373'; // Moderate negative - medium red
    return '#c62828'; // Strong negative - dark red
  };
  
  // Text color based on background color
  const getTextColor = (backgroundColor) => {
    // Dark backgrounds should have light text
    if (['#1a237e', '#303f9f', '#c62828'].includes(backgroundColor)) {
      return '#ffffff';
    }
    return '#000000'; // Default to black text
  };
  
  if (!data || Object.keys(data).length === 0 || !stocks || stocks.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>No correlation data available</Typography>
      </Box>
    );
  }
  
  return (
    <Box p={2}>
      {/* Legend */}
      <Box mb={4} mt={2}>
        <Typography variant="subtitle2" gutterBottom>
          Correlation Strength:
        </Typography>
        <Grid container spacing={1} alignItems="center">
          {[
            { value: "Strong Negative (-1.0 to -0.8)", color: '#c62828' },
            { value: "Moderate Negative (-0.8 to -0.5)", color: '#e57373' },
            { value: "Weak Negative (-0.5 to -0.2)", color: '#ef9a9a' },
            { value: "Neutral (-0.2 to 0.2)", color: '#e0e0e0' },
            { value: "Weak Positive (0.2 to 0.5)", color: '#7986cb' },
            { value: "Moderate Positive (0.5 to 0.8)", color: '#303f9f' },
            { value: "Strong Positive (0.8 to 1.0)", color: '#1a237e' }
          ].map((item, index) => (
            <Grid item key={index}>
              <Box display="flex" alignItems="center">
                <Box 
                  width={24} 
                  height={24} 
                  bgcolor={item.color} 
                  mr={1} 
                  display="inline-block"
                />
                <Typography variant="caption">{item.value}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* Heatmap Grid */}
      <Box display="flex" flexDirection="column">
        {/* Header row with ticker labels */}
        <Box display="flex" ml={10}>
          {stocks.map((ticker, index) => (
            <Box 
              key={index} 
              width={80} 
              height={40} 
              display="flex" 
              alignItems="center"
              justifyContent="center"
              fontWeight="bold"
            >
              <Typography variant="body2">{ticker}</Typography>
            </Box>
          ))}
        </Box>
        
        {/* Heatmap rows */}
        {stocks.map((ticker1, rowIndex) => (
          <Box key={rowIndex} display="flex" alignItems="center">
            {/* Row label */}
            <Box 
              width={80} 
              height={80} 
              display="flex" 
              alignItems="center"
              justifyContent="center"
              fontWeight="bold"
            >
              <Typography variant="body2">{ticker1}</Typography>
            </Box>
            
            {/* Correlation cells */}
            {stocks.map((ticker2, colIndex) => {
              // For the diagonal, show 1.0 (perfect correlation)
              const value = ticker1 === ticker2 ? 1.0 : (
                data[ticker1]?.[ticker2] || null
              );
              
              const backgroundColor = getCorrelationColor(value);
              const textColor = getTextColor(backgroundColor);
              
              return (
                <Tooltip
                  key={colIndex}
                  title={
                    <Box>
                      <Typography variant="body2">
                        {ticker1} to {ticker2} Correlation: {value !== null ? value.toFixed(4) : 'N/A'}
                      </Typography>
                      {data[ticker1]?.avg && (
                        <Typography variant="body2">
                          {ticker1} Avg Price: ${data[ticker1].avg.toFixed(2)}
                        </Typography>
                      )}
                      {data[ticker2]?.avg && (
                        <Typography variant="body2">
                          {ticker2} Avg Price: ${data[ticker2].avg.toFixed(2)}
                        </Typography>
                      )}
                      {data[ticker1]?.stdDev && (
                        <Typography variant="body2">
                          {ticker1} StdDev: ${data[ticker1].stdDev.toFixed(2)}
                        </Typography>
                      )}
                      {data[ticker2]?.stdDev && (
                        <Typography variant="body2">
                          {ticker2} StdDev: ${data[ticker2].stdDev.toFixed(2)}
                        </Typography>
                      )}
                    </Box>
                  }
                >
                  <Box
                    width={80}
                    height={80}
                    bgcolor={backgroundColor}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    border="1px solid #e0e0e0"
                    onMouseEnter={() => setHoveredCell({ ticker1, ticker2, value })}
                    onMouseLeave={() => setHoveredCell(null)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        opacity: 0.8,
                      },
                    }}
                  >
                    <Typography variant="body2" color={textColor}>
                      {value !== null ? value.toFixed(2) : 'N/A'}
                    </Typography>
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        ))}
      </Box>
      
      {/* Display info for hovered cell */}
      {hoveredCell && (
        <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
          <Typography variant="subtitle2">
            Correlation: {hoveredCell.ticker1} to {hoveredCell.ticker2}
          </Typography>
          <Typography variant="body1">
            Value: {hoveredCell.value !== null ? hoveredCell.value.toFixed(4) : 'N/A'}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default CorrelationHeatmap; 