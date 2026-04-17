import { AppError } from './AppError';

export class ConflictError extends AppError {
  constructor(message: string = 'Conflict', details?: unknown) {
    super(message, 409, true, details);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
