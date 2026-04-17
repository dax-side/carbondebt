import { AppError } from './AppError';

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', details?: unknown) {
    super(message, 422, true, details);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
