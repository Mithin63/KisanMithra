import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import apiRouter from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'SmartProcure Backend REST API Service',
    ministry: 'Ministry of Consumer Affairs, Food & Public Distribution',
    timestamp: new Date().toISOString()
  });
});

// Register API Routes
app.use('/api', apiRouter);

// Serve frontend static assets in production
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

// Fallback for React Router (Single Page Application routing)
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`=================================================================`);
  console.log(`  🌾 SmartProcure REST API Server running on port ${PORT}`);
  console.log(`  🏛️  Ministry of Consumer Affairs, Food & Public Distribution`);
  console.log(`  🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=================================================================`);
});
