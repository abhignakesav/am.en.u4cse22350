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
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Chip,
  useTheme
} from '@mui/material';
import { 
  Refresh as RefreshIcon, 
  ShowChart as ShowChartIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

import StockChart from '../components/StockChart';
import { fetchStockData, fetchAvailableStocks } from '../services/api';

const timeOptions = [
  { value: 10, label: '10 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 50, label: '50 minutes' },
  { value: 60, label: '1 hour' },
  { value: 120, label: '2 hours' },
  { value: 240, label: '4 hours' },
  { value: 480, label: '8 hours' },
];

const StockPage = () => {
  const theme = useTheme();
  const [selectedStock, setSelectedStock] = useState('');
  const [timeWindow, setTimeWindow] = useState(30);
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableStocks, setAvailableStocks] = useState([]);
  const [averagePrice, setAveragePrice] = useState(null);
  
  useEffect(() => {
    const loadStocks = async () => {
      try {
        const stocks = await fetchAvailableStocks();
        setAvailableStocks(stocks);
        
        if (stocks.length > 0 && !selectedStock) {
          setSelectedStock(stocks[0].symbol);
        }
      } catch (error) {
        setError('Unable to load stock list');
      }
    };
    
    loadStocks();
  }, []);
  
  useEffect(() => {
    if (selectedStock) {
      loadStockData();
    }
  }, [selectedStock, timeWindow]);
  
  const loadStockData = async () => {
    if (!selectedStock) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchStockData(selectedStock, timeWindow, 'average');
      
      if (data) {
        setStockData(data.priceHistory || []);
        setAveragePrice(data.averageStockPrice || null);
      } else {
        setStockData([]);
        setAveragePrice(null);
      }
    } catch (error) {
      setError('Failed to load stock data');
      setStockData([]);
      setAveragePrice(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStockChange = (event) => {
    setSelectedStock(event.target.value);
  };
  
  const handleTimeWindowChange = (event) => {
    setTimeWindow(event.target.value);
  };
  
  const handleRefresh = () => {
    loadStockData();
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="h1" sx={{ 
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.primary.dark
      }}>
        <ShowChartIcon sx={{ mr: 1 }} />
        Stock Price Dashboard
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="stock-select-label">Select Stock</InputLabel>
              <Select
                labelId="stock-select-label"
                id="stock-select"
                value={selectedStock}
                label="Select Stock"
                onChange={handleStockChange}
              >
                {availableStocks.map((stock) => (
                  <MenuItem key={stock.symbol} value={stock.symbol}>
                    {stock.symbol} - {stock.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
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
          
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              fullWidth
              sx={{ height: '56px' }}
            >
              Refresh Data
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 0, borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
            <Box sx={{ bgcolor: theme.palette.primary.main, p: 2 }}>
              <Typography variant="h6" color="white" sx={{ display: 'flex', alignItems: 'center' }}>
                <TimelineIcon sx={{ mr: 1 }} />
                {selectedStock ? `${selectedStock} Price Chart` : 'Stock Price Chart'}
                {selectedStock && 
                  <Chip 
                    label={timeWindow + ' min'} 
                    size="small" 
                    sx={{ ml: 2, color: 'white', bgcolor: theme.palette.primary.dark }} 
                  />
                }
              </Typography>
            </Box>
            <Divider />
            <StockChart 
              data={stockData || []} 
              loading={loading} 
              error={error}
              averagePrice={averagePrice}
            />
          </Paper>
        </Grid>
        
        {stockData && stockData.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                  {selectedStock} Statistics
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Average Price:</strong> ${averagePrice ? averagePrice.toFixed(2) : 'N/A'}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Latest Price:</strong> ${stockData[0]?.price ? stockData[0].price.toFixed(2) : 'N/A'}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Data Points:</strong> {stockData.length}
                </Typography>
                <Typography variant="body1">
                  <strong>Time Range:</strong> {timeWindow} minutes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default StockPage; 