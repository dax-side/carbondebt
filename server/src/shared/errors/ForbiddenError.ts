import { AppError } from './AppError.js';

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden', details?: unknown) {
    super(message, 403, true, details);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
