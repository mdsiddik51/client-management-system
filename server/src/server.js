import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { toNodeHandler } from 'better-auth/node';
import { getAuth } from './lib/betterAuth.js';
import { config } from './config/index.js';
import { connectDB } from './config/db.js';
import { setupRoutes } from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

const app = express();

// Security & logging
app.use(helmet());
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(cookieParser());

// Rate limiting on /api/
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX) : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', apiLimiter);

// Better Auth MUST be mounted BEFORE express.json() / express.urlencoded()
// to prevent the body-parser from consuming the incoming request stream
app.all('/api/auth/*', (req, res) => {
  const auth = getAuth();
  if (!auth) {
    return res.status(503).json({
      success: false,
      message: 'Auth service unavailable – MongoDB is not connected yet.',
    });
  }
  return toNodeHandler(auth)(req, res);
});

// Body parsers (for custom REST application routes)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes (includes all feature routes)
setupRoutes(app);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const start = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

start();

export default app;
