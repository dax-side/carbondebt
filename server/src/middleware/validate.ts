import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { ValidationError } from '../shared/errors/index.js';
import { ErrorMessages } from '../shared/messages/index.js';

export const CarbonRequestSchema = z.object({
  provider: z.enum(['aws', 'gcp', 'azure']),
  region: z.string().min(3),
  computeHours: z.coerce.number().min(1).max(100000),
  dbInstances: z.coerce.number().min(0).optional().default(0),
  storageGB: z.coerce.number().min(0).optional().default(0),
  lambdaInvocations: z.coerce.number().min(0).optional().default(0),
});

export type CarbonRequestInput = z.infer<typeof CarbonRequestSchema>;

export function validateBody(schema: z.AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      next(new ValidationError(ErrorMessages.COMMON.VALIDATION_FAILED, parsed.error.issues));
      return;
    }

    req.body = parsed.data;
    next();
  };
}
