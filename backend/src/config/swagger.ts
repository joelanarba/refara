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
        url: 'http://localhost:5000/api',
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
        Role: {
          type: 'string',
          enum: ['REFERRING_WORKER', 'RECEIVING_WORKER', 'ADMIN'],
        },
        Urgency: {
          type: 'string',
          enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        },
        ReferralStatus: {
          type: 'string',
          enum: [
            'SUBMITTED',
            'ACKNOWLEDGED',
            'ACCEPTED',
            'REJECTED',
            'PATIENT_ARRIVED',
            'COMPLETED',
            'CANCELLED',
          ],
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/routes/**/*.ts'], // Scans JSDoc comments inside routes
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  console.log('📄 Swagger docs available at http://localhost:5000/docs');
};