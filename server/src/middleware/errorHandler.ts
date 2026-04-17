import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../shared/errors/index.js';
import { ErrorMessages } from '../shared/messages/index.js';
import { logger } from '../shared/logger.js';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const requestContext = {
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
  };

  if (err instanceof AppError) {
    const logPayload = {
      ...requestContext,
      statusCode: err.statusCode,
      error: err.message,
      details: err.details,
    };

    if (err.statusCode >= 500) {
      logger.error('Operational server error', logPayload);
    } else {
      logger.warn('Operational request error', logPayload);
    }

    res.status(err.statusCode).json(err.toJSON());
    return;
  }

  if (err instanceof Error) {
    logger.error('Unhandled exception', {
      ...requestContext,
      error: err.message,
      stack: err.stack,
    });
  } else {
    logger.error('Unknown thrown value', {
      ...requestContext,
      value: String(err),
    });
  }

  res.status(500).json({
    success: false,
    error: ErrorMessages.COMMON.INTERNAL_SERVER_ERROR,
  });
}
