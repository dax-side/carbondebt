import 'dotenv/config';

import { existsSync } from 'node:fs';
import path from 'node:path';

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
const serverRootDir = path.resolve(__dirname, '..');
const repoRootDir = path.resolve(serverRootDir, '..');
const clientDistDir = path.resolve(repoRootDir, 'client/dist');
const hasClientBuild = existsSync(clientDistDir);

app.use(
  cors({
    origin: clientOrigin === '*' ? true : clientOrigin,
  })
);
app.use(express.json());
app.use(requestLogger);

app.use('/api', healthRouter);
app.use('/api', carbonRouter);

app.use('/api', (_req, _res, next) => {
  next(new NotFoundError(ErrorMessages.COMMON.NOT_FOUND));
});

if (hasClientBuild) {
  app.use(express.static(clientDistDir));

  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDistDir, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    sendSuccess(res, SuccessMessages.GENERIC.RETRIEVED, {
      name: 'carbondebt api',
      status: 'ready',
    });
  });

  app.use((_req, _res, next) => {
    next(new NotFoundError(ErrorMessages.COMMON.NOT_FOUND));
  });
}

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`carbondebt server listening on ${port}`);
});
