import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

// Start Server
app.listen(PORT, () => {
  console.log(`=================================================================`);
  console.log(`  🌾 SmartProcure REST API Server running on port ${PORT}`);
  console.log(`  🏛️  Ministry of Consumer Affairs, Food & Public Distribution`);
  console.log(`  🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=================================================================`);
});
