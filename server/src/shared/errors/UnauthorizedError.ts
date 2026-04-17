import { AppError } from './AppError';

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access', details?: unknown) {
    super(message, 401, true, details);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
