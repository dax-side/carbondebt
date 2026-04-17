import { AppError } from './AppError.js';

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error', details?: unknown) {
    super(message, 500, false, details);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
