import { AppError } from './AppError';

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', details?: unknown) {
    super(message, 404, true, details);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
