import { AppError } from './AppError';

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request', details?: unknown) {
    super(message, 400, true, details);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
