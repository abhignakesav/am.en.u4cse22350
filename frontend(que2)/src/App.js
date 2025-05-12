import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';

import Header from './components/Header';
import StockPage from './pages/StockPage';
import CorrelationPage from './pages/CorrelationPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 2,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: 'background.default',
              pb: 4,
            }}
          >
            <Routes>
              <Route path="/" element={<StockPage />} />
              <Route path="/correlation" element={<CorrelationPage />} />
            </Routes>
          </Box>
          <Box
            component="footer"
            sx={{
              py: 3,
              px: 2,
              mt: 'auto',
              backgroundColor: theme.palette.grey[200],
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              Stock Price Aggregation Frontend © {new Date().getFullYear()}
            </Box>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
