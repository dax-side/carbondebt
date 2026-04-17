import type { Response } from 'express';
import type { ErrorEnvelope, ErrorPayload } from './types';

export const sendError = (res: Response, statusCode: number, payload: ErrorPayload): void => {
  const body: ErrorEnvelope = {
    success: false,
    error: payload.error,
    ...(payload.details !== undefined ? { details: payload.details } : {}),
  };

  res.status(statusCode).json(body);
};
