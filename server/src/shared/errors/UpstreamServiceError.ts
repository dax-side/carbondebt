import { AppError } from './AppError';

export class UpstreamServiceError extends AppError {
  constructor(message: string = 'Upstream service error', details?: unknown) {
    super(message, 502, true, details);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
