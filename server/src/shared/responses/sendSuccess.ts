import type { Response } from 'express';

interface ResponseMessage {
  statusCode: number;
  message: string;
}

/**
 * Send a standardized success response.
 */
export const sendSuccess = (
  res: Response,
  responseMessage: ResponseMessage,
  data?: unknown
): void => {
  res.status(responseMessage.statusCode).json({
    success: true,
    message: responseMessage.message,
    data,
  });
};
