import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import { errorHandler } from './middleware/error-handler';
import { apiLimiter } from './middleware/rate-limit';
import authRoutes from './routes/auth';
import creditsRoutes from './routes/credits';
import galleryRoutes from './routes/gallery';
import generateRoutes from './routes/generate';
import webhookRoutes from './routes/webhook';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:9000',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiLimiter);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Dreamy API is running',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/credits', creditsRoutes);
app.use('/api/webhooks', webhookRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

app.use(errorHandler);

export default app;
