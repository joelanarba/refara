import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Maternal Health Referral System API',
      version: '1.0.0',
      description: 'API documentation for managing facility transfers, user authentication, and maternal health referrals.',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>',
        },
      },
      schemas: {
        UserRole: {
          type: 'string',
          enum: ['WORKER', 'ADMIN'],
        },
        ReferralUrgency: {
          type: 'string',
          enum: ['ROUTINE', 'URGENT', 'EMERGENCY'],
        },
        ReferralStatus: {
          type: 'string',
          enum: [
            'SUBMITTED',
            'ACKNOWLEDGED',
            'ACCEPTED',
            'REJECTED',
            'CANCELLED',
            'ARRIVED',
            'COMPLETED',
          ],
        },
      },
    },
  },
  apis: ['./src/modules/**/*.routes.ts'], // Scans JSDoc comments inside route modules
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  console.log('✅ Swagger docs available at http://localhost:3000/docs');
};
