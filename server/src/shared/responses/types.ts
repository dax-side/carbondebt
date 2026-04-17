export interface ResponseMessage {
  statusCode: number;
  message: string;
}

export interface SuccessEnvelope<T = unknown> {
  success: true;
  message: string;
  data: T;
}

export interface ErrorPayload {
  error: string;
  details?: unknown;
}

export interface ErrorEnvelope {
  success: false;
  error: string;
  details?: unknown;
}
