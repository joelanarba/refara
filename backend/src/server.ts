import app from './app';
import { config } from './config';
import { prisma } from './config/db';

const start = async () => {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('Database connected successfully via Prisma');

    const server = app.listen(config.port, () => {
      console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
      console.log(`Health check available at: http://localhost:${config.port}/api/v1/health`);
    });

    // Graceful Shutdown Logic
    const shutdown = async (signal: string) => {
      console.log(`Received ${signal}. Initiating graceful shutdown...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('Database connections closed. Server process exited cleanly.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// Handle uncaught exceptions outside Express middleware contexts
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection at Promise:', reason);
  process.exit(1);
});

start();
