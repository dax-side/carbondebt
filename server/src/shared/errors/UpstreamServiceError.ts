import { AppError } from './AppError';

export class UpstreamServiceError extends AppError {
  constructor(message: string = 'Upstream service error', details?: unknown, statusCode = 502) {
    super(message, statusCode, true, details);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
