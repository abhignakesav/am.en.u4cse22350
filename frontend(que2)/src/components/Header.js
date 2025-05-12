import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  TableChart as TableChartIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Stock Analysis
          </Typography>
          
          {/* Mobile menu */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              color="inherit"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem 
                component={Link} 
                to="/" 
                onClick={handleMenuClose}
              >
                Stock Chart
              </MenuItem>
              <MenuItem 
                component={Link} 
                to="/correlation" 
                onClick={handleMenuClose}
              >
                Correlation Heatmap
              </MenuItem>
            </Menu>
          </Box>
          
          {/* Mobile title */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Stock Analysis
          </Typography>
          
          {/* Desktop navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              component={Link}
              to="/"
              sx={{ my: 2, color: 'white', display: 'flex', alignItems: 'center' }}
              startIcon={<TrendingUpIcon />}
            >
              Stock Chart
            </Button>
            <Button
              component={Link}
              to="/correlation"
              sx={{ my: 2, color: 'white', display: 'flex', alignItems: 'center' }}
              startIcon={<TableChartIcon />}
            >
              Correlation Heatmap
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 