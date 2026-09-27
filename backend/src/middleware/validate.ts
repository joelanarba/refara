import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';

export const validateBody = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.errors
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        return res.status(400).json({
          error: { message: `Validation Error: ${message}`, status: 400 },
        });
      }
      return res.status(400).json({ error: { message: 'Invalid payload structure', status: 400 } });
    }
  };
};
