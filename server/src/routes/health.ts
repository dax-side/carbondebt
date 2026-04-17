import { Router } from 'express';

import { SuccessMessages } from '../shared/messages/index.js';
import { sendSuccess } from '../shared/responses/index.js';

const healthRouter = Router();

healthRouter.get('/health', (_req, res) => {
  sendSuccess(res, SuccessMessages.HEALTH.OK, {
    status: 'ok',
    uptime: Number(process.uptime().toFixed(0)),
    timestamp: new Date().toISOString(),
  });
});

export default healthRouter;
