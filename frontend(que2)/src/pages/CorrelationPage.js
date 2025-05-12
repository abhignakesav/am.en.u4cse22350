import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Button,
  Box,
  Alert,
  CircularProgress,
  Divider,
  useTheme,
  Chip
} from '@mui/material';
import { 
  Refresh as RefreshIcon, 
  TableChart as TableChartIcon,
  Insights as InsightsIcon 
} from '@mui/icons-material';

import CorrelationHeatmap from '../components/CorrelationHeatmap';
import { fetchCorrelationData, fetchAvailableStocks } from '../services/api';

const timeOptions = [
  { value: 10, label: '10 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 50, label: '50 minutes' },
  { value: 60, label: '1 hour' },
  { value: 120, label: '2 hours' },
  { value: 240, label: '4 hours' },
  { value: 480, label: '8 hours' },
];

const CorrelationPage = () => {
  const theme = useTheme();
  const [timeWindow, setTimeWindow] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableStocks, setAvailableStocks] = useState([]);
  const [correlationData, setCorrelationData] = useState({});
  
  useEffect(() => {
    const loadStocks = async () => {
      try {
        const stocks = await fetchAvailableStocks();
        setAvailableStocks(stocks);
      } catch (error) {
        setError('Unable to load stock list');
      }
    };
    
    loadStocks();
  }, []);
  
  useEffect(() => {
    if (availableStocks.length > 0) {
      loadAllCorrelations();
    }
  }, [availableStocks, timeWindow]);
  
  const loadAllCorrelations = async () => {
    if (availableStocks.length < 2) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const batchSize = 3;
      const processedData = {};
      const stockSymbols = availableStocks.map(stock => stock.symbol);
      
      stockSymbols.forEach(symbol => {
        processedData[symbol] = {
          avg: 0,
          stdDev: 0
        };
      });
      
      for (let i = 0; i < stockSymbols.length; i++) {
        for (let j = i + 1; j < stockSymbols.length; j++) {
          const stock1 = stockSymbols[i];
          const stock2 = stockSymbols[j];
          
          try {
            const correlationResponse = await fetchCorrelationData(timeWindow, [stock1, stock2]);
            
            const correlation = correlationResponse.correlation;
            
            if (!processedData[stock1]) {
              processedData[stock1] = {};
            }
            processedData[stock1][stock2] = correlation;
            
            if (!processedData[stock2]) {
              processedData[stock2] = {};
            }
            processedData[stock2][stock1] = correlation;
            
            processedData[stock1].avg = correlationResponse.stocks[stock1].averagePrice;
            processedData[stock2].avg = correlationResponse.stocks[stock2].averagePrice;
            
            if (correlationResponse.stocks[stock1].priceHistory.length > 0) {
              const prices1 = correlationResponse.stocks[stock1].priceHistory.map(item => item.price);
              processedData[stock1].stdDev = calculateStandardDeviation(prices1);
            }
            
            if (correlationResponse.stocks[stock2].priceHistory.length > 0) {
              const prices2 = correlationResponse.stocks[stock2].priceHistory.map(item => item.price);
              processedData[stock2].stdDev = calculateStandardDeviation(prices2);
            }
          } catch (error) {
            // Continue processing other pairs
          }
        }
      }
      
      setCorrelationData(processedData);
    } catch (error) {
      setError('Failed to load correlation data');
    } finally {
      setLoading(false);
    }
  };
  
  const calculateStandardDeviation = (values) => {
    const n = values.length;
    if (n <= 1) return 0;
    
    const mean = values.reduce((sum, value) => sum + value, 0) / n;
    const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / (n - 1);
    return Math.sqrt(variance);
  };
  
  const handleTimeWindowChange = (event) => {
    setTimeWindow(event.target.value);
  };
  
  const handleRefresh = () => {
    loadAllCorrelations();
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="h1" sx={{ 
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.primary.dark
      }}>
        <TableChartIcon sx={{ mr: 1 }} />
        Stock Correlation Analysis
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="time-window-label">Time Window</InputLabel>
              <Select
                labelId="time-window-label"
                id="time-window"
                value={timeWindow}
                label="Time Window"
                onChange={handleTimeWindowChange}
              >
                {timeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              fullWidth
              sx={{ height: '56px' }}
            >
              Refresh Correlation Data
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 0, borderRadius: 3, overflow: 'hidden', boxShadow: 3, mb: 3 }}>
        <Box sx={{ bgcolor: theme.palette.primary.main, p: 2 }}>
          <Typography variant="h6" color="white" sx={{ display: 'flex', alignItems: 'center' }}>
            <InsightsIcon sx={{ mr: 1 }} />
            Stock Correlation Heatmap
            <Chip 
              label={timeWindow + ' min'} 
              size="small" 
              sx={{ ml: 2, color: 'white', bgcolor: theme.palette.primary.dark }} 
            />
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
              <CircularProgress />
            </Box>
          ) : (
            <CorrelationHeatmap 
              data={correlationData} 
              stocks={availableStocks.map(stock => stock.symbol)}
            />
          )}
        </Box>
      </Paper>
      
      <Typography variant="body2" sx={{ mt: 2, color: theme.palette.text.secondary, textAlign: 'center' }}>
        Correlation values range from -1 (perfect negative correlation) to 1 (perfect positive correlation)
      </Typography>
    </Container>
  );
};

export default CorrelationPage; 