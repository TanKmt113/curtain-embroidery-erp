import express, { Express } from 'express';
import cors from 'cors';
import 'express-async-errors';

import { config } from './config';
import { logger } from './config/logger';
import { connectDatabase } from '../infrastructure/database';
import { createApiRouter } from '../presentation/routes';
import { errorHandler, requestLogger } from '../presentation/middlewares';
import { makeAuthController, makeTokenService, makeCustomerController } from './factories';

async function createApp(): Promise<Express> {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  // Create controllers
  const authController = makeAuthController();
  const customerController = makeCustomerController();
  const tokenService = makeTokenService();

  // Routes
  const apiRouter = createApiRouter(authController, customerController, tokenService);
  app.use('/api/v1', apiRouter);

  // Root endpoint
  app.get('/', (_req, res) => {
    res.json({
      name: config.app.name,
      version: '1.0.0',
      status: 'running',
    });
  });

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}

async function main(): Promise<void> {
  try {
    logger.info('Starting application...');

    // Connect to database
    await connectDatabase();

    // Create and start server
    const app = await createApp();

    app.listen(config.app.port, () => {
      logger.info(`Server is running on port ${config.app.port}`);
      logger.info(`Environment: ${config.app.env}`);
      logger.info(`API URL: http://localhost:${config.app.port}/api/v1`);
    });
  } catch (error) {
    logger.fatal({ error }, 'Failed to start application');
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error({ reason, promise }, 'Unhandled Rejection');
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.fatal({ error }, 'Uncaught Exception');
  process.exit(1);
});

main();
