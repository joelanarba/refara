import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler, NotFoundError } from './middleware/errorHandler';
import { setupSwagger } from './config/swagger';
// Route imports
import authRoutes from './routes/authRoutes';
import referralRoutes from './routes/referralRoutes';

const app = express();

// Security and Parser Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));

// Mount Swagger Documentation UI
setupSwagger(app);

// Global Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: { message: 'Too many requests, please try again later.', status: 429 } },
});
app.use('/api', apiLimiter);

// Health Check Route
app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});


// Primary API Endpoints
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/referrals', referralRoutes);

// Catch Unmatched 404 Routes
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('The requested endpoint does not exist on this server.'));
});

// Global Error Handler Middleware (MUST be registered after all routes)
app.use(errorHandler);

export default app;