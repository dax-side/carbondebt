import 'dotenv/config';

import cors from 'cors';
import express from 'express';

import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import carbonRouter from './routes/carbon.route';
import healthRouter from './routes/health.route';
import { NotFoundError } from './shared/errors/index';
import { ErrorMessages, SuccessMessages } from './shared/messages/index';
import { logger } from './shared/logger';
import { sendSuccess } from './shared/responses/index';

const app = express();
const port = Number(process.env.PORT ?? 3001);
const clientOrigin = process.env.CLIENT_ORIGIN;

app.use(
  cors({
    origin: clientOrigin === '*' ? true : clientOrigin,
  })
);
app.use(express.json());
app.use(requestLogger);

app.use('/api', healthRouter);
app.use('/api', carbonRouter);

app.get('/', (_req, res) => {
  sendSuccess(res, SuccessMessages.GENERIC.RETRIEVED, {
    name: 'carbondebt api',
    status: 'ready',
  });
});

app.use((_req, _res, next) => {
  next(new NotFoundError(ErrorMessages.COMMON.NOT_FOUND));
});

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`carbondebt server listening on ${port}`);
});
