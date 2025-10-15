import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import { createError, errorHandler } from './middleware/error-handler';
import { apiLimiter } from './middleware/rate-limit';
import authRoutes from './routes/auth';
import billingRoutes from './routes/billing';
import creditsRoutes from './routes/credits';
import galleryRoutes from './routes/gallery';
import generateRoutes from './routes/generate';
import uploadRoutes from './routes/upload';
import webhookRoutes from './routes/webhook';
import supabaseAdmin from './supabase/client';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
// IMPORTANT: Stripe webhook needs raw body
app.use(
  '/api/webhooks/stripe',
  express.raw({ type: 'application/json' })
);
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8080',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiLimiter);


// Routes
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Dreamy API is running',
    timestamp: new Date().toISOString(),
  });
});
app.use('/api/auth', authRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/credits', creditsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/billing', billingRoutes);

app.get('/api/public-images', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from('public-images')
      .list('', {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      throw createError(`Failed to fetch public images: ${error.message}`, 500);
    }

    // For public bucket, construct direct public URLs
    const objectsWithUrls = (data || []).map((object) => {
      const publicUrl = supabaseAdmin.storage
        .from('public-images')
        .getPublicUrl(object.name);

      return {
        ...object,
        publicUrl: publicUrl.data.publicUrl
      };
    });

    res.json({
      success: true,
      objects: objectsWithUrls,
      total: objectsWithUrls.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

app.use(errorHandler);

export default app;
