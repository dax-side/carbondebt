import type { Response } from 'express';
import type { ResponseMessage, SuccessEnvelope } from './types';

/**
 * Send a standardized success response.
 */
export const sendSuccess = (
  res: Response,
  responseMessage: ResponseMessage,
  data?: unknown
): void => {
  const payload: SuccessEnvelope = {
    success: true,
    message: responseMessage.message,
    data,
  };

  res.status(responseMessage.statusCode).json(payload);
};
