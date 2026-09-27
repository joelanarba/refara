import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// Base Custom Application Error
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Subclasses for explicit HTTP Status Codes
export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request') {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden action') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409);
  }
}

// Async Wrapper to catch errors without try/catch blocks in controllers
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Structural Type Guard for Prisma errors if class checking encounters module variance
function isPrismaKnownError(
  err: unknown
): err is { code: string; meta?: { target?: string[] } } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    typeof (err as Record<string, unknown>).code === 'string' &&
    (err as Record<string, unknown>).name === 'PrismaClientKnownRequestError'
  );
}

// Global Express Error Middleware
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // 1. Custom Operational Application Errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        status: err.statusCode,
      },
    });
    return;
  }

  // 2. Prisma Known Database Request Errors
  const isPrismaError =
    err instanceof PrismaClientKnownRequestError || isPrismaKnownError(err);

  if (isPrismaError) {
    const prismaErr = err as { code: string; meta?: { target?: string[] } };

    // Unique Constraint Violation (e.g., duplicate email or referralCode)
    if (prismaErr.code === 'P2002') {
      const target = Array.isArray(prismaErr.meta?.target)
        ? prismaErr.meta!.target.join(', ')
        : 'field';

      res.status(409).json({
        error: {
          message: `A record with this ${target} already exists.`,
          status: 409,
        },
      });
      return;
    }

    // Foreign Key Constraint Failure
    if (prismaErr.code === 'P2003') {
      res.status(400).json({
        error: {
          message: 'Invalid relational reference ID provided.',
          status: 400,
        },
      });
      return;
    }

    // Record Not Found during update/delete
    if (prismaErr.code === 'P2025') {
      res.status(404).json({
        error: {
          message: 'Requested record was not found in the database.',
          status: 404,
        },
      });
      return;
    }
  }

  // 3. Fallback for Critical Unexpected Server Errors
  console.error('CRITICAL UNHANDLED ERROR:', err);

  res.status(500).json({
    error: {
      message:
        process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : err.message || 'Internal server error',
      status: 500,
    },
  });
};