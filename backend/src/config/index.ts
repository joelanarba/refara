import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'default-dev-secret',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  db: {
    url: process.env.DATABASE_URL,
  },
} as const;
