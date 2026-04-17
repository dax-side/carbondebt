import morgan from 'morgan';

import { logger } from '../shared/logger.js';

const stream = {
  write: (message: string): void => {
    logger.log('http', message.trim());
  },
};

export const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms', {
  stream,
});
