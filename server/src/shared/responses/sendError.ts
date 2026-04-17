import type { Response } from 'express';

interface ErrorPayload {
  error: string;
  details?: unknown;
}

export const sendError = (res: Response, statusCode: number, payload: ErrorPayload): void => {
  res.status(statusCode).json({
    success: false,
    error: payload.error,
    ...(payload.details !== undefined ? { details: payload.details } : {}),
  });
};
