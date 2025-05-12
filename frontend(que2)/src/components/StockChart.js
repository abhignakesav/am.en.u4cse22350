import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { 
  Paper, 
  Typography, 
  Box, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  CircularProgress
} from '@mui/material';

const StockChart = ({ data, loading, error, averagePrice }) => {
  const [tooltipInfo, setTooltipInfo] = useState(null);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>No data available</Typography>
      </Box>
    );
  }

  // Format data for the chart
  const chartData = data.map(item => ({
    time: new Date(item.lastUpdatedAt).toLocaleTimeString(),
    price: item.price,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="subtitle2">Time: {label}</Typography>
          <Typography variant="body2" color="primary">
            Price: ${payload[0].value.toFixed(2)}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box p={2}>
      <Box mb={2}>
        {tooltipInfo ? (
          <Box>
            <Typography variant="h6">
              Price: ${tooltipInfo.price.toFixed(2)}
            </Typography>
            <Typography variant="body2">
              Time: {tooltipInfo.time}
            </Typography>
          </Box>
        ) : (
          <Typography variant="h6">
            Average Price: ${averagePrice ? averagePrice.toFixed(2) : 'N/A'}
          </Typography>
        )}
      </Box>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 30,
          }}
          onMouseMove={(e) => {
            if (e && e.activePayload && e.activePayload.length) {
              const payload = e.activePayload[0].payload;
              setTooltipInfo({
                time: payload.time,
                price: payload.price,
              });
            }
          }}
          onMouseLeave={() => setTooltipInfo(null)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            label={{ 
              value: 'Time', 
              position: 'insideBottomRight', 
              offset: -10 
            }}
          />
          <YAxis 
            domain={['auto', 'auto']}
            label={{ 
              value: 'Price ($)', 
              angle: -90, 
              position: 'insideLeft' 
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#8884d8" 
            strokeWidth={2} 
            activeDot={{ r: 8 }} 
            dot={{ r: 4 }}
          />
          {averagePrice && (
            <ReferenceLine 
              y={averagePrice} 
              stroke="red" 
              strokeDasharray="3 3" 
              label={{ 
                value: `Avg: $${averagePrice.toFixed(2)}`, 
                position: 'left',
                fill: 'red'
              }} 
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default StockChart; 