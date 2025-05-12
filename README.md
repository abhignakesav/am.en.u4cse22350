# Stock Price Aggregator

A full-stack application for retrieving, analyzing, and visualizing stock price data with correlation analysis.

## Features

- **Real-time Stock Data**: Fetch current and historical stock prices
- **Correlation Analysis**: Calculate and visualize correlations between different stocks
- **Interactive Charts**: Visualize stock price movements over time
- **Heatmap Visualization**: View correlation patterns across multiple stocks
- **Responsive Design**: Optimized for both desktop and mobile devices

## Architecture

### Backend
- Node.js with Express for REST API endpoints
- Authentication with stock exchange service
- Data caching to reduce API calls
- Automatic fallback to synthetic data generation

### Frontend
- React with Material UI components
- Interactive visualizations using Recharts
- API service for backend communication
- Fallback mechanisms for offline operation

## Setup Instructions

### Prerequisites
- Node.js v14 or higher
- npm v6 or higher

### Installation

1. Clone the repository:
```
git clone <repository-url>
cd stock-price-aggregator
```

2. Install dependencies for both backend and frontend:
```
npm run install-all
```

### Configuration

1. Backend Environment Variables:
- Create a `.env` file in the `backend(que1)` directory:
```
PORT=3001
EMAIL=your-email@example.com
NAME=Your Name
ROLL_NO=your-roll-no
ACCESS_CODE=your-access-code
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret
```

## Running the Application

### Development Mode

1. Start both the backend and frontend:
```
npm start
```

2. Or run them separately:
```
npm run start-backend
npm run start-frontend
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## API Endpoints

### Stock Data
- `GET /stocks/:ticker` - Get stock data for a specific ticker
  - Query params: 
    - `minutes`: Time window (optional)
    - `aggregation`: Data aggregation method (optional)

### Stock Correlation
- `GET /stockcorrelation` - Calculate correlation between two stocks
  - Query params:
    - `minutes`: Time window (required)
    - `ticker`: Two stock tickers (required)

### Health Check
- `GET /health` - API health status

## Application Structure

```
stock-price-aggregator/
├── backend(que1)/          # Backend application
│   ├── index.js            # Main server file
│   ├── package.json        # Backend dependencies
├── frontend(que2)/         # Frontend application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── services/       # API services
│   │   ├── App.js          # Main application component
├── package.json            # Root package for running both apps
``` 